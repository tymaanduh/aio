"use strict";

const IPC_CHANNEL_CATALOG = require("../../data/input/shared/ipc/ipc_channels_catalog.json");

function is_plain_object(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clean_token(value, max_length = 120) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max_length);
}

function build_ipc_channel(domain, action) {
  return `${domain}:${action}`;
}

function build_ipc_domain_names(raw_domains) {
  const source = is_plain_object(raw_domains) ? raw_domains : {};
  const output = {};
  Object.entries(source).forEach(([raw_domain_key, raw_domain_name]) => {
    const domain_key = clean_token(raw_domain_key, 80).toUpperCase();
    const domain_name = clean_token(raw_domain_name, 80).toLowerCase();
    if (!domain_key || !domain_name) {
      return;
    }
    output[domain_key] = domain_name;
  });
  return Object.freeze(output);
}

function build_ipc_channels(domain_names, raw_channel_specs) {
  const source = is_plain_object(raw_channel_specs) ? raw_channel_specs : {};
  const output = {};
  Object.entries(source).forEach(([raw_channel_key, raw_spec]) => {
    const channel_key = clean_token(raw_channel_key, 140).toUpperCase();
    const spec = is_plain_object(raw_spec) ? raw_spec : {};
    const domain_key = clean_token(spec.domain, 80).toUpperCase();
    const action = clean_token(spec.action, 120);
    const domain_name = domain_names[domain_key];
    if (!channel_key || !domain_name || !action) {
      return;
    }
    output[channel_key] = build_ipc_channel(domain_name, action);
  });
  return Object.freeze(output);
}

const IPC_DOMAIN_NAMES = build_ipc_domain_names(IPC_CHANNEL_CATALOG.domains);
const IPC_CHANNELS = build_ipc_channels(IPC_DOMAIN_NAMES, IPC_CHANNEL_CATALOG.channel_specs);

module.exports = {
  PATTERN_IPC_DOMAIN: IPC_DOMAIN_NAMES,
  IPC_DOMAIN_NAMES,
  build_ipc_channel,
  IPC_CHANNELS
};
