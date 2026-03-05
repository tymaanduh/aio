"use strict";

const fs = require("fs/promises");
const path = require("path");
const { app } = require("electron");
const REPOSITORY_MANIFEST_CATALOG = require("../../data/input/shared/main/repository_manifest_catalog.json");

function is_plain_object(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

const STORAGE_SCHEMA_VERSION = Number(REPOSITORY_MANIFEST_CATALOG.storage_schema_version || 1);
const STORAGE_VERSION =
  typeof REPOSITORY_MANIFEST_CATALOG.storage_version === "string" && REPOSITORY_MANIFEST_CATALOG.storage_version
    ? REPOSITORY_MANIFEST_CATALOG.storage_version
    : "v1";

const FILE_KEYS = Object.freeze(
  is_plain_object(REPOSITORY_MANIFEST_CATALOG.file_keys)
    ? { ...REPOSITORY_MANIFEST_CATALOG.file_keys }
    : {
        APP_STATE: "app_state",
        AUTH_STATE: "auth_state",
        DIAGNOSTICS_STATE: "diagnostics_state",
        UNIVERSE_CACHE: "universe_cache",
        UI_PREFERENCES: "ui_preferences",
        LANGUAGE_BRIDGE_STATE: "language_bridge_state"
      }
);

const FILE_NAME_MAP = Object.freeze(
  is_plain_object(REPOSITORY_MANIFEST_CATALOG.file_name_map)
    ? { ...REPOSITORY_MANIFEST_CATALOG.file_name_map }
    : {
        [FILE_KEYS.APP_STATE]: "app_state.json",
        [FILE_KEYS.AUTH_STATE]: "auth_state.json",
        [FILE_KEYS.DIAGNOSTICS_STATE]: "diagnostics_state.json",
        [FILE_KEYS.UNIVERSE_CACHE]: "universe_cache.json",
        [FILE_KEYS.UI_PREFERENCES]: "ui_preferences.json",
        [FILE_KEYS.LANGUAGE_BRIDGE_STATE]: "language_bridge_state.json"
      }
);

const FILE_KEY_LIST = Object.freeze(Object.keys(FILE_NAME_MAP));

function get_data_paths() {
  const user_data_root = app.getPath("userData");
  const data_root = path.join(user_data_root, "data");
  const data_v1_root = path.join(data_root, STORAGE_VERSION);
  const manifest_path = path.join(data_v1_root, "manifest.json");

  const file_paths = FILE_KEY_LIST.reduce((acc, file_key) => {
    acc[file_key] = path.join(data_v1_root, FILE_NAME_MAP[file_key]);
    return acc;
  }, {});

  return {
    user_data_root,
    data_root,
    data_v1_root,
    manifest_path,
    file_paths
  };
}

async function ensure_data_dirs() {
  const paths = get_data_paths();
  await fs.mkdir(paths.data_root, { recursive: true });
  await fs.mkdir(paths.data_v1_root, { recursive: true });
  return paths;
}

async function file_exists(file_path) {
  try {
    await fs.access(file_path);
    return true;
  } catch {
    return false;
  }
}

async function read_json_file(file_path, fallback_factory) {
  try {
    const content = await fs.readFile(file_path, "utf8");
    return JSON.parse(content);
  } catch {
    return typeof fallback_factory === "function" ? fallback_factory() : fallback_factory;
  }
}

async function write_json_atomic(file_path, data) {
  const temporary_file = `${file_path}.tmp`;
  await fs.writeFile(temporary_file, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(temporary_file, file_path);
}

function create_manifest(source = {}) {
  const now = new Date().toISOString();
  return {
    schema_version: STORAGE_SCHEMA_VERSION,
    storage_version: STORAGE_VERSION,
    created_at: typeof source.created_at === "string" && source.created_at ? source.created_at : now,
    updated_at: now,
    files: source.files && typeof source.files === "object" ? source.files : {},
    migration: source.migration && typeof source.migration === "object" ? source.migration : null
  };
}

async function load_manifest() {
  const paths = await ensure_data_dirs();
  if (!(await file_exists(paths.manifest_path))) {
    return null;
  }
  const manifest = await read_json_file(paths.manifest_path, null);
  if (!manifest || typeof manifest !== "object") {
    return null;
  }
  return create_manifest(manifest);
}

async function save_manifest(manifest) {
  const paths = await ensure_data_dirs();
  const normalized = create_manifest(manifest);
  await write_json_atomic(paths.manifest_path, normalized);
  return normalized;
}

async function build_file_meta(file_path) {
  try {
    const stat = await fs.stat(file_path);
    return {
      file_name: path.basename(file_path),
      size_bytes: stat.size,
      updated_at: new Date(stat.mtimeMs).toISOString()
    };
  } catch {
    return {
      file_name: path.basename(file_path),
      size_bytes: 0,
      updated_at: new Date().toISOString()
    };
  }
}

async function sync_manifest_file(file_key, extra = {}) {
  const paths = await ensure_data_dirs();
  const file_path = paths.file_paths[file_key];
  const file_meta = await build_file_meta(file_path);
  const manifest = (await load_manifest()) || create_manifest();
  manifest.updated_at = new Date().toISOString();
  manifest.files[file_key] = {
    ...file_meta,
    ...extra
  };
  await save_manifest(manifest);
  return manifest;
}

module.exports = {
  STORAGE_SCHEMA_VERSION,
  STORAGE_VERSION,
  FILE_KEYS,
  FILE_KEY_LIST,
  FILE_NAME_MAP,
  get_data_paths,
  ensure_data_dirs,
  file_exists,
  read_json_file,
  write_json_atomic,
  create_manifest,
  load_manifest,
  save_manifest,
  sync_manifest_file
};
