"use strict";

const fs = require("fs/promises");
const path = require("path");
const {
  FILE_KEY_LIST,
  ensure_data_dirs,
  file_exists,
  read_json_file,
  write_json_atomic,
  create_manifest,
  load_manifest,
  save_manifest,
  sync_manifest_file
} = require("./repository_manifest.js");
const { create_export_stamp, create_repository_result, now_iso } = require("./repository_shared.js");
const { REPOSITORY_SPEC_MAP } = require("./repository_specs.js");
const {
  DATA_MIGRATE_SOURCE,
  DATA_MIGRATE_STORAGE_VERSION,
  DATA_MIGRATE_DOMAIN_ORDER
} = require("./data_migrate_specs.js");

async function read_legacy_state(paths) {
  const legacy = paths.legacy_file_paths;
  const migrated = {};

  for (const domain_key of DATA_MIGRATE_DOMAIN_ORDER) {
    const repository_spec = REPOSITORY_SPEC_MAP[domain_key];
    if (!repository_spec) {
      continue;
    }
    const legacy_path = legacy[repository_spec.file_key];
    // Keep migration reads deterministic by domain order.
    // eslint-disable-next-line no-await-in-loop
    const legacy_state = await read_json_file(legacy_path, repository_spec.create_default_state);
    migrated[repository_spec.file_key] = repository_spec.normalize_state(legacy_state);
  }

  return migrated;
}

async function backup_legacy_files(paths) {
  const stamp = create_export_stamp();
  await fs.mkdir(paths.legacy_backup_root, { recursive: true });

  await Promise.all(
    FILE_KEY_LIST.map(async (file_key) => {
      const source = paths.legacy_file_paths[file_key];
      if (!(await file_exists(source))) {
        return;
      }
      const target_name = `${path.basename(source, ".json")}-${stamp}.json`;
      const target = path.join(paths.legacy_backup_root, target_name);
      try {
        await fs.rename(source, target);
      } catch {
        // Keep migration resilient; if backup fails we leave source in place.
      }
    })
  );
}

async function run_data_migrate_v0_to_v1() {
  const paths = await ensure_data_dirs();
  const migrated = await read_legacy_state(paths);

  for (const file_key of FILE_KEY_LIST) {
    if (!(file_key in migrated)) {
      continue;
    }
    const target = paths.file_paths[file_key];
    // Keep manifest updates ordered to avoid clobbering file metadata.
    // eslint-disable-next-line no-await-in-loop
    await write_json_atomic(target, migrated[file_key]);
    // eslint-disable-next-line no-await-in-loop
    await sync_manifest_file(file_key);
  }

  const manifest = (await load_manifest()) || create_manifest();
  manifest.migration = {
    source_format: DATA_MIGRATE_SOURCE.LEGACY_ROOT_JSON,
    migrated_at: now_iso(),
    legacy_files: paths.legacy_file_paths
  };
  manifest.updated_at = now_iso();
  await save_manifest(manifest);
  await backup_legacy_files(paths);

  return create_repository_result({
    storage_version: DATA_MIGRATE_STORAGE_VERSION
  });
}

module.exports = {
  run_data_migrate_v0_to_v1
};
