"use strict";

const path = require("path");
const { app } = require("electron");
const {
  ensure_data_dirs,
  file_exists,
  read_json_file,
  write_json_atomic,
  sync_manifest_file
} = require("./repository_manifest.js");
const {
  ensureStorageDomain,
  loadStorageDomain,
  saveStorageDomain,
  shouldUseNeutralCoreStorage
} = require("./repository_storage_runtime.js");

const PATTERN_EXPORT_STAMP_SANITIZE = /[:.]/g;

const REPOSITORY_RESULT_STATUS = Object.freeze({
  OK: true
});

const REPOSITORY_TIME_FIELDS = Object.freeze({
  UPDATED_AT: "updatedAt",
  LAST_SAVED_AT: "lastSavedAt"
});

function now_iso() {
  return new Date().toISOString();
}

function create_export_stamp() {
  return now_iso().replace(PATTERN_EXPORT_STAMP_SANITIZE, "-");
}

function build_user_data_export_path(file_prefix, extension) {
  const user_data_root = app.getPath("userData");
  return path.join(user_data_root, `${file_prefix}-${create_export_stamp()}.${extension}`);
}

function create_repository_result(fields = {}) {
  return {
    ok: REPOSITORY_RESULT_STATUS.OK,
    ...fields
  };
}

async function ensure_repository_file(file_key, create_default_state) {
  if (shouldUseNeutralCoreStorage()) {
    return ensureStorageDomain({
      file_key,
      create_default_state,
      normalize_state: (payload) => payload
    });
  }
  const paths = await ensure_data_dirs();
  const file_path = paths.file_paths[file_key];
  if (!(await file_exists(file_path))) {
    await write_json_atomic(file_path, create_default_state());
    await sync_manifest_file(file_key);
  }
  return file_path;
}

async function load_repository_state(spec) {
  if (shouldUseNeutralCoreStorage()) {
    return loadStorageDomain(spec);
  }
  const file_path = await ensure_repository_file(spec.file_key, spec.create_default_state);
  const payload = await read_json_file(file_path, spec.create_default_state);
  return spec.normalize_state(payload);
}

async function save_repository_state(spec, payload) {
  if (shouldUseNeutralCoreStorage()) {
    return saveStorageDomain(spec, payload);
  }
  const file_path = await ensure_repository_file(spec.file_key, spec.create_default_state);
  const normalized = spec.normalize_state(payload);
  if (spec.touch_field) {
    normalized[spec.touch_field] = now_iso();
  }
  await write_json_atomic(file_path, normalized);
  await sync_manifest_file(spec.file_key);
  return normalized;
}

function create_repository_state_api(spec) {
  return Object.freeze({
    ensure_state_file: () => ensure_repository_file(spec.file_key, spec.create_default_state),
    load_state: () => load_repository_state(spec),
    save_state: (payload) => save_repository_state(spec, payload)
  });
}

module.exports = {
  REPOSITORY_RESULT_STATUS,
  REPOSITORY_TIME_FIELDS,
  now_iso,
  create_export_stamp,
  build_user_data_export_path,
  create_repository_result,
  ensure_repository_file,
  load_repository_state,
  save_repository_state,
  create_repository_state_api
};
