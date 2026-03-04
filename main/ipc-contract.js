"use strict";

const { IPC_CHANNELS } = require("./ipc/ipc_channels.js");
const { IPC_EVENTS } = require("./ipc/ipc_events.js");
const PRELOAD_API_CATALOG = require("../data/input/shared/ipc/preload_api_catalog.json");

function is_plain_object(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function resolve_channel_key(method_path, namespace_channel_key_map) {
  const source_path = String(method_path || "").trim();
  if (!source_path || !source_path.includes(".")) {
    return "";
  }
  const [namespace, method] = source_path.split(".");
  if (!namespace || !method) {
    return "";
  }
  const namespace_map = is_plain_object(namespace_channel_key_map) ? namespace_channel_key_map[namespace] : null;
  if (!is_plain_object(namespace_map)) {
    return "";
  }
  const channel_key = namespace_map[method];
  return typeof channel_key === "string" ? channel_key : "";
}

function build_preload_api_channels() {
  const namespace_channel_key_map = is_plain_object(PRELOAD_API_CATALOG)
    ? PRELOAD_API_CATALOG.namespace_channel_key_map
    : {};
  const flat_alias_method_paths = is_plain_object(PRELOAD_API_CATALOG)
    ? PRELOAD_API_CATALOG.flat_alias_method_paths
    : {};
  const channel_map = {};

  Object.entries(is_plain_object(flat_alias_method_paths) ? flat_alias_method_paths : {}).forEach(
    ([alias_name, method_path]) => {
      const channel_key = resolve_channel_key(method_path, namespace_channel_key_map);
      if (!channel_key) {
        return;
      }
      const channel_name = IPC_CHANNELS[channel_key];
      if (typeof channel_name !== "string" || !channel_name) {
        return;
      }
      channel_map[alias_name] = channel_name;
    }
  );

  return Object.freeze(channel_map);
}

const PRELOAD_API_CHANNELS = build_preload_api_channels();

module.exports = {
  IPC_CH: IPC_CHANNELS,
  IPC_EVT: IPC_EVENTS,
  PRELOAD_API_CH_MAP: PRELOAD_API_CHANNELS,
  PRELOAD_API_CHANNELS
};
