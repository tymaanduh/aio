"use strict";

const fs = require("fs");
const path = require("path");

const SHELL_ADAPTER_CONTRACT = require("../../data/input/shared/core/shell_adapter_contract.json");
const ELECTRON_SHELL_ADAPTER_CATALOG = require("../../data/input/shared/core/electron_shell_adapter_catalog.json");
const { IPC_CHANNELS } = require("../ipc/ipc_channels.js");
const { IPC_EVENTS } = require("../ipc/ipc_events.js");

const ROOT = path.resolve(__dirname, "..", "..");
const ELECTRON_ADAPTER_PATH = "main/shell/electron_shell_adapter.js";

function toPosix(value) {
  return String(value || "").replace(/\\/g, "/");
}

function readCatalogRows(key) {
  return Array.isArray(ELECTRON_SHELL_ADAPTER_CATALOG[key]) ? ELECTRON_SHELL_ADAPTER_CATALOG[key] : [];
}

function normalizeBindingId(value) {
  return String(value || "").trim();
}

function splitMethodPath(methodPath) {
  const tokens = String(methodPath || "")
    .split(".")
    .map((token) => token.trim())
    .filter(Boolean);
  if (tokens.length < 2) {
    return null;
  }
  return {
    namespace: tokens[0],
    method: tokens.slice(1).join(".")
  };
}

function buildPreloadApiCatalog() {
  const namespaceChannelKeyMap = {};
  const argNormalizerKeyMap = {};
  const flatAliasMethodPaths = {};
  const eventListenerMethodPaths = {};

  readCatalogRows("command_bindings").forEach((binding) => {
    const commandId = normalizeBindingId(binding.command_id);
    const channelKey = normalizeBindingId(binding.channel_key);
    const preloadMethodPath = normalizeBindingId(binding.preload_method_path);
    if (!commandId || !channelKey || !preloadMethodPath) {
      return;
    }
    const methodTokens = splitMethodPath(preloadMethodPath);
    if (!methodTokens) {
      return;
    }
    if (!namespaceChannelKeyMap[methodTokens.namespace]) {
      namespaceChannelKeyMap[methodTokens.namespace] = {};
    }
    namespaceChannelKeyMap[methodTokens.namespace][methodTokens.method] = channelKey;
    if (binding.arg_normalizer_key) {
      argNormalizerKeyMap[preloadMethodPath] = String(binding.arg_normalizer_key);
    }
    if (binding.flat_alias) {
      flatAliasMethodPaths[String(binding.flat_alias)] = preloadMethodPath;
    }
  });

  readCatalogRows("event_bindings").forEach((binding) => {
    const eventId = normalizeBindingId(binding.event_id);
    const listenerMethodPath = normalizeBindingId(binding.preload_listener_method_path);
    if (!eventId || !listenerMethodPath) {
      return;
    }
    eventListenerMethodPaths[listenerMethodPath] = eventId;
    if (binding.flat_alias) {
      flatAliasMethodPaths[String(binding.flat_alias)] = listenerMethodPath;
    }
  });

  return {
    namespace_channel_key_map: namespaceChannelKeyMap,
    arg_normalizer_key_map: argNormalizerKeyMap,
    flat_alias_method_paths: flatAliasMethodPaths,
    event_listener_method_paths: eventListenerMethodPaths
  };
}

function buildPreloadCompatibilityChannelMap() {
  const output = {};
  readCatalogRows("command_bindings").forEach((binding) => {
    const flatAlias = normalizeBindingId(binding.flat_alias);
    const channelKey = normalizeBindingId(binding.channel_key);
    const channel = IPC_CHANNELS[channelKey];
    if (!flatAlias || !channel) {
      return;
    }
    output[flatAlias] = channel;
  });
  return output;
}

function resolveCommandBindingsById() {
  return Object.fromEntries(
    readCatalogRows("command_bindings").map((binding) => [normalizeBindingId(binding.command_id), binding])
  );
}

function resolveEventBindingsById() {
  return Object.fromEntries(
    readCatalogRows("event_bindings").map((binding) => [normalizeBindingId(binding.event_id), binding])
  );
}

function resolveViewBindingsById() {
  return Object.fromEntries(
    readCatalogRows("view_bindings").map((binding) => [normalizeBindingId(binding.view_id), binding])
  );
}

function resolveCommandChannelById(commandId) {
  const binding = resolveCommandBindingsById()[normalizeBindingId(commandId)];
  if (!binding) {
    return "";
  }
  return String(IPC_CHANNELS[normalizeBindingId(binding.channel_key)] || "");
}

function resolveEventChannelById(eventId) {
  const binding = resolveEventBindingsById()[normalizeBindingId(eventId)];
  if (!binding) {
    return "";
  }
  return String(IPC_EVENTS[normalizeBindingId(binding.event_key)] || "");
}

function readViewMarkup(filePath) {
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function validateElectronShellAdapter() {
  const issues = [];
  const commandBindingsById = resolveCommandBindingsById();
  const eventBindingsById = resolveEventBindingsById();
  const viewBindingsById = resolveViewBindingsById();
  const shells = SHELL_ADAPTER_CONTRACT.shells && typeof SHELL_ADAPTER_CONTRACT.shells === "object"
    ? SHELL_ADAPTER_CONTRACT.shells
    : {};
  const electronShell = shells.electron && typeof shells.electron === "object" ? shells.electron : null;
  const contractCommands = Array.isArray(SHELL_ADAPTER_CONTRACT.commands) ? SHELL_ADAPTER_CONTRACT.commands : [];
  const contractEvents = Array.isArray(SHELL_ADAPTER_CONTRACT.events) ? SHELL_ADAPTER_CONTRACT.events : [];
  const contractViews = Array.isArray(SHELL_ADAPTER_CONTRACT.views) ? SHELL_ADAPTER_CONTRACT.views : [];

  if (!electronShell) {
    issues.push({
      level: "error",
      type: "missing_electron_shell_contract",
      detail: "shell adapter contract is missing electron shell definition"
    });
  } else if (toPosix(electronShell.adapter_path) !== ELECTRON_ADAPTER_PATH) {
    issues.push({
      level: "error",
      type: "electron_adapter_path_mismatch",
      detail: "electron shell adapter path does not match contract",
      expected: ELECTRON_ADAPTER_PATH,
      actual: toPosix(electronShell.adapter_path)
    });
  }

  contractCommands.forEach((commandId) => {
    const binding = commandBindingsById[commandId];
    if (!binding) {
      issues.push({
        level: "error",
        type: "missing_command_binding",
        detail: "shell command is missing electron binding",
        command_id: commandId
      });
      return;
    }
    const channel = IPC_CHANNELS[normalizeBindingId(binding.channel_key)];
    if (!channel) {
      issues.push({
        level: "error",
        type: "unknown_command_channel_key",
        detail: "electron shell command binding references unknown IPC channel key",
        command_id: commandId,
        channel_key: binding.channel_key
      });
    }
    if (!splitMethodPath(binding.preload_method_path)) {
      issues.push({
        level: "error",
        type: "invalid_preload_method_path",
        detail: "electron shell command binding preload method path must be namespace.method",
        command_id: commandId,
        preload_method_path: String(binding.preload_method_path || "")
      });
    }
  });

  Object.keys(commandBindingsById).forEach((commandId) => {
    if (!contractCommands.includes(commandId)) {
      issues.push({
        level: "error",
        type: "orphan_command_binding",
        detail: "electron shell adapter contains command binding not present in shell contract",
        command_id: commandId
      });
    }
  });

  contractEvents.forEach((eventId) => {
    const binding = eventBindingsById[eventId];
    if (!binding) {
      issues.push({
        level: "error",
        type: "missing_event_binding",
        detail: "shell event is missing electron binding",
        event_id: eventId
      });
      return;
    }
    const channel = IPC_EVENTS[normalizeBindingId(binding.event_key)];
    if (!channel) {
      issues.push({
        level: "error",
        type: "unknown_event_key",
        detail: "electron shell event binding references unknown IPC event key",
        event_id: eventId,
        event_key: binding.event_key
      });
    }
  });

  Object.keys(eventBindingsById).forEach((eventId) => {
    if (!contractEvents.includes(eventId)) {
      issues.push({
        level: "error",
        type: "orphan_event_binding",
        detail: "electron shell adapter contains event binding not present in shell contract",
        event_id: eventId
      });
    }
  });

  contractViews.forEach((viewId) => {
    const binding = viewBindingsById[viewId];
    if (!binding) {
      issues.push({
        level: "error",
        type: "missing_view_binding",
        detail: "shell view is missing electron binding",
        view_id: viewId
      });
      return;
    }
    if (binding.window_html) {
      const absolutePath = path.resolve(ROOT, String(binding.window_html || ""));
      if (!fs.existsSync(absolutePath)) {
        issues.push({
          level: "error",
          type: "missing_window_markup",
          detail: "electron window binding references missing markup file",
          view_id: viewId,
          window_html: toPosix(path.relative(ROOT, absolutePath))
        });
      }
      return;
    }
    const windowBinding = viewBindingsById[normalizeBindingId(binding.window_view_id)];
    if (!windowBinding || !windowBinding.window_html) {
      issues.push({
        level: "error",
        type: "missing_parent_window_binding",
        detail: "page/control binding references missing parent window binding",
        view_id: viewId,
        window_view_id: String(binding.window_view_id || "")
      });
      return;
    }
    const htmlPath = path.resolve(ROOT, String(windowBinding.window_html || ""));
    const markup = readViewMarkup(htmlPath);
    if (!markup.includes(`id="${String(binding.dom_id || "")}"`)) {
      issues.push({
        level: "error",
        type: "missing_view_dom_id",
        detail: "electron page/control binding dom id not found in window markup",
        view_id: viewId,
        dom_id: String(binding.dom_id || ""),
        window_html: toPosix(path.relative(ROOT, htmlPath))
      });
    }
  });

  Object.keys(viewBindingsById).forEach((viewId) => {
    if (!contractViews.includes(viewId)) {
      issues.push({
        level: "error",
        type: "orphan_view_binding",
        detail: "electron shell adapter contains view binding not present in shell contract",
        view_id: viewId
      });
    }
  });

  return {
    status: issues.some((issue) => issue.level === "error") ? "fail" : "pass",
    shell_id: "electron",
    counts: {
      commands: contractCommands.length,
      events: contractEvents.length,
      views: contractViews.length,
      errors: issues.filter((issue) => issue.level === "error").length,
      warnings: issues.filter((issue) => issue.level === "warn").length
    },
    issues
  };
}

function validateElectronShellAdapterRouteCoverage(routeSpecs = []) {
  const expectedChannels = readCatalogRows("command_bindings")
    .map((binding) => String(IPC_CHANNELS[normalizeBindingId(binding.channel_key)] || ""))
    .filter(Boolean);
  const actualChannels = new Set(
    (Array.isArray(routeSpecs) ? routeSpecs : [])
      .map((spec) => String(spec && spec.channel ? spec.channel : "").trim())
      .filter(Boolean)
  );
  const missingChannels = expectedChannels.filter((channel) => !actualChannels.has(channel));

  return {
    status: missingChannels.length === 0 ? "pass" : "fail",
    expected_channel_count: expectedChannels.length,
    actual_channel_count: actualChannels.size,
    missing_channels: missingChannels
  };
}

module.exports = {
  ELECTRON_ADAPTER_PATH,
  ELECTRON_SHELL_ADAPTER_CATALOG,
  buildPreloadApiCatalog,
  buildPreloadCompatibilityChannelMap,
  resolveCommandChannelById,
  resolveEventChannelById,
  validateElectronShellAdapter,
  validateElectronShellAdapterRouteCoverage
};
