"use strict";

const fs = require("fs/promises");
const { build_user_data_export_path, create_repository_result } = require("./repository_shared.js");
const { REPOSITORY_DOMAIN_KEYS, get_repository_api } = require("./repository_registry.js");
const normalize_service = require("../services/normalize_service.js");

const UNIVERSE_EXPORT_LIMITS = Object.freeze({
  FORMAT_TEXT_MAX: 10,
  DATA_URL_MAX: 12000000
});

const UNIVERSE_EXPORT_FORMAT = Object.freeze({
  PNG: "png",
  JSON: "json"
});

const PATTERN_UNIVERSE_EXPORT_PNG = /^data:image\/png;base64,([A-Za-z0-9+/=\s]+)$/;

const UNIVERSE_EXPORT_SPEC = Object.freeze({
  FILE_PREFIX: "universe",
  PNG_FORMAT: UNIVERSE_EXPORT_FORMAT.PNG,
  JSON_EXTENSION: UNIVERSE_EXPORT_FORMAT.JSON,
  PNG_EXTENSION: UNIVERSE_EXPORT_FORMAT.PNG
});

const UNIVERSE_REPOSITORY_API = get_repository_api(REPOSITORY_DOMAIN_KEYS.UNIVERSE);

const ensure_universe_cache_file = UNIVERSE_REPOSITORY_API.ensure_state_file;
const load_universe_cache_state = UNIVERSE_REPOSITORY_API.load_state;
const save_universe_cache_state = UNIVERSE_REPOSITORY_API.save_state;

async function export_universe(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  const format = normalize_service.clean_text(source.format, UNIVERSE_EXPORT_LIMITS.FORMAT_TEXT_MAX).toLowerCase();

  if (format === UNIVERSE_EXPORT_SPEC.PNG_FORMAT) {
    const data_url = normalize_service.clean_text(source.dataUrl, UNIVERSE_EXPORT_LIMITS.DATA_URL_MAX);
    const match = data_url.match(PATTERN_UNIVERSE_EXPORT_PNG);
    if (!match) {
      throw new Error("Invalid PNG payload.");
    }
    const base64 = match[1].replace(/\s+/g, "");
    const file_path = build_user_data_export_path(UNIVERSE_EXPORT_SPEC.FILE_PREFIX, UNIVERSE_EXPORT_SPEC.PNG_EXTENSION);
    await fs.writeFile(file_path, Buffer.from(base64, "base64"));
    return create_repository_result({
      filePath: file_path
    });
  }

  const file_path = build_user_data_export_path(UNIVERSE_EXPORT_SPEC.FILE_PREFIX, UNIVERSE_EXPORT_SPEC.JSON_EXTENSION);
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
