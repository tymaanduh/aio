"use strict";

const fs = require("fs/promises");
const { build_user_data_export_path, create_repository_result } = require("./repository_shared.js");
const { REPOSITORY_DOMAIN_KEYS, get_repository_api } = require("./repository_registry.js");
const normalize_service = require("../services/normalize_service.js");

const diagnosticsExportRules = Object.freeze({
  FILE_PREFIX: "diagnostics-export",
  FILE_EXTENSION: "json"
});

const DIAGNOSTICS_REPOSITORY_API = get_repository_api(REPOSITORY_DOMAIN_KEYS.DIAGNOSTICS);

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
  const file_path = build_user_data_export_path(diagnosticsExportRules.FILE_PREFIX, diagnosticsExportRules.FILE_EXTENSION);
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
