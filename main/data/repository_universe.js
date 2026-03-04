"use strict";

const fs = require("fs/promises");
const { build_user_data_export_path, create_repository_result } = require("./repository_shared.js");
const { REPOSITORY_DOMAIN_KEYS, get_repository_api } = require("./repository_registry.js");
const normalize_service = require("../services/normalize_service.js");

const universeExportLimits = Object.freeze({
  FORMAT_TEXT_MAX: 10,
  DATA_URL_MAX: 12000000
});

const universeExportFormat = Object.freeze({
  PNG: "png",
  JSON: "json"
});

const PATTERN_UNIVERSE_EXPORT_PNG = /^data:image\/png;base64,([A-Za-z0-9+/=\s]+)$/;

const universeExportRules = Object.freeze({
  FILE_PREFIX: "universe",
  PNG_FORMAT: universeExportFormat.PNG,
  JSON_EXTENSION: universeExportFormat.JSON,
  PNG_EXTENSION: universeExportFormat.PNG
});

const UNIVERSE_REPOSITORY_API = get_repository_api(REPOSITORY_DOMAIN_KEYS.UNIVERSE);

const ensure_universe_cache_file = UNIVERSE_REPOSITORY_API.ensure_state_file;
const load_universe_cache_state = UNIVERSE_REPOSITORY_API.load_state;
const save_universe_cache_state = UNIVERSE_REPOSITORY_API.save_state;

async function export_universe(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  const format = normalize_service.clean_text(source.format, universeExportLimits.FORMAT_TEXT_MAX).toLowerCase();

  if (format === universeExportRules.PNG_FORMAT) {
    const data_url = normalize_service.clean_text(source.dataUrl, universeExportLimits.DATA_URL_MAX);
    const match = data_url.match(PATTERN_UNIVERSE_EXPORT_PNG);
    if (!match) {
      throw new Error("Invalid PNG payload.");
    }
    const base64 = match[1].replace(/\s+/g, "");
    const file_path = build_user_data_export_path(universeExportRules.FILE_PREFIX, universeExportRules.PNG_EXTENSION);
    await fs.writeFile(file_path, Buffer.from(base64, "base64"));
    return create_repository_result({
      filePath: file_path
    });
  }

  const file_path = build_user_data_export_path(universeExportRules.FILE_PREFIX, universeExportRules.JSON_EXTENSION);
  const data = source.data && typeof source.data === "object" ? source.data : {};
  await fs.writeFile(file_path, JSON.stringify(data, null, 2), "utf8");
  return create_repository_result({
    filePath: file_path
  });
}

module.exports = {
  ensure_universe_cache_file,
  load_universe_cache_state,
  save_universe_cache_state,
  export_universe
};
