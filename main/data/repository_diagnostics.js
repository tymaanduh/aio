"use strict";

const fs = require("fs/promises");
const { FILE_KEYS } = require("./repository_manifest.js");
const { build_user_data_export_path, create_repository_result, create_repository_state_api } = require("./repository_shared.js");
const normalize_service = require("../services/normalize_service.js");

const DIAGNOSTICS_EXPORT_SPEC = Object.freeze({
  FILE_PREFIX: "diagnostics-export",
  FILE_EXTENSION: "json"
});

const DIAGNOSTICS_REPOSITORY_SPEC = Object.freeze({
  file_key: FILE_KEYS.DIAGNOSTICS_STATE,
  create_default_state: normalize_service.create_default_diagnostics_state,
  normalize_state: normalize_service.normalize_diagnostics_state
});

const DIAGNOSTICS_REPOSITORY_API = create_repository_state_api(DIAGNOSTICS_REPOSITORY_SPEC);

const ensure_diagnostics_state_file = DIAGNOSTICS_REPOSITORY_API.ensure_state_file;
const load_diagnostics_state = DIAGNOSTICS_REPOSITORY_API.load_state;
const save_diagnostics_state = DIAGNOSTICS_REPOSITORY_API.save_state;

async function append_diagnostics(payload) {
  const incoming = normalize_service.normalize_diagnostics_state(payload);
  const current = await load_diagnostics_state();
  const next = normalize_service.normalize_diagnostics_state({
    version: 1,
    errors: [...current.errors, ...incoming.errors],
    perf: [...current.perf, ...incoming.perf]
  });
  await save_diagnostics_state(next);
  return create_repository_result({
    errors: next.errors.length,
    perf: next.perf.length
  });
}

async function export_diagnostics() {
  const diagnostics = await load_diagnostics_state();
  const file_path = build_user_data_export_path(DIAGNOSTICS_EXPORT_SPEC.FILE_PREFIX, DIAGNOSTICS_EXPORT_SPEC.FILE_EXTENSION);
  await fs.writeFile(file_path, JSON.stringify(diagnostics, null, 2), "utf8");
  return create_repository_result({
    filePath: file_path
  });
}

module.exports = {
  ensure_diagnostics_state_file,
  load_diagnostics_state,
  save_diagnostics_state,
  append_diagnostics,
  export_diagnostics
};
