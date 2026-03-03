"use strict";

const fs = require("fs/promises");
const path = require("path");
const {
  FILE_KEYS,
  LEGACY_FILE_NAME_MAP,
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
const normalize_service = require("../services/normalize_service.js");
const { createDefaultUiPreferences, normalizeUiPreferences } = require("../../app/modules/ui-preferences-utils.js");

const DATA_MIGRATE_SOURCE = Object.freeze({
  LEGACY_ROOT_JSON: "legacy_root_json"
});

const DATA_MIGRATE_DEFAULT_VERSION = "v1";

async function read_legacy_state(paths) {
  const legacy = paths.legacy_file_paths;
  const app_state_raw = await read_json_file(legacy[FILE_KEYS.APP_STATE], normalize_service.create_default_state);
  const auth_state_raw = await read_json_file(legacy[FILE_KEYS.AUTH_STATE], normalize_service.create_default_auth_state);
  const diagnostics_raw = await read_json_file(
    legacy[FILE_KEYS.DIAGNOSTICS_STATE],
    normalize_service.create_default_diagnostics_state
  );
  const universe_raw = await read_json_file(
    legacy[FILE_KEYS.UNIVERSE_CACHE],
    normalize_service.create_default_universe_cache_state
  );
  const ui_preferences_raw = await read_json_file(legacy[FILE_KEYS.UI_PREFERENCES], createDefaultUiPreferences);

  return {
    [FILE_KEYS.APP_STATE]: normalize_service.normalize_state(app_state_raw),
    [FILE_KEYS.AUTH_STATE]: normalize_service.normalize_auth_state(auth_state_raw),
    [FILE_KEYS.DIAGNOSTICS_STATE]: normalize_service.normalize_diagnostics_state(diagnostics_raw),
    [FILE_KEYS.UNIVERSE_CACHE]: normalize_service.normalize_universe_cache_state(universe_raw),
    [FILE_KEYS.UI_PREFERENCES]: normalizeUiPreferences(ui_preferences_raw)
  };
}

async function backup_legacy_files(paths) {
  const stamp = create_export_stamp();
  await fs.mkdir(paths.legacy_backup_root, { recursive: true });

  await Promise.all(
    Object.keys(LEGACY_FILE_NAME_MAP).map(async (file_key) => {
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

  for (const file_key of Object.keys(migrated)) {
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
    storage_version: DATA_MIGRATE_DEFAULT_VERSION
  });
}

module.exports = {
  run_data_migrate_v0_to_v1
};
