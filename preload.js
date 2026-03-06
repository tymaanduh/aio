"use strict";

const { contextBridge, ipcRenderer } = require("electron");
const { IPC_CHANNELS } = require("./main/ipc/ipc_channels.js");
const {
  buildPreloadApiCatalog,
  resolveEventChannelById
} = require("./main/shell/electron_shell_adapter.js");

const PRELOAD_API_CATALOG = Object.freeze(buildPreloadApiCatalog());

const ARG_NORMALIZER_FACTORIES = Object.freeze({
  boolean_first_arg: (args) => [Boolean(args[0])]
});

function is_plain_object(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function resolve_channel_by_key(channel_key) {
  const key = String(channel_key || "");
  return IPC_CHANNELS[key];
}

function resolve_namespace_channels(namespace_channel_key_map) {
  const source = is_plain_object(namespace_channel_key_map) ? namespace_channel_key_map : {};
  return Object.fromEntries(
    Object.entries(source).map(([namespace_key, method_map]) => {
      const methods = is_plain_object(method_map) ? method_map : {};
      const channel_entries = Object.entries(methods).map(([method_key, channel_key]) => {
        return [method_key, resolve_channel_by_key(channel_key)];
      });
      return [namespace_key, Object.freeze(Object.fromEntries(channel_entries))];
    })
  );
}

function resolve_arg_normalizers(arg_normalizer_key_map) {
  const source = is_plain_object(arg_normalizer_key_map) ? arg_normalizer_key_map : {};
  return Object.fromEntries(
    Object.entries(source).map(([composite_key, normalizer_key]) => {
      const resolver = ARG_NORMALIZER_FACTORIES[String(normalizer_key || "")];
      return [composite_key, typeof resolver === "function" ? resolver : null];
    })
  );
}

function create_invoke_method(channel, normalizer) {
  return (...args) => {
    const normalized_args = typeof normalizer === "function" ? normalizer(args) : args;
    return ipcRenderer.invoke(channel, ...(Array.isArray(normalized_args) ? normalized_args : []));
  };
}

function build_namespace_api(namespace_channels, arg_normalizers) {
  const channel_map = is_plain_object(namespace_channels) ? namespace_channels : {};
  const normalizer_map = is_plain_object(arg_normalizers) ? arg_normalizers : {};

  return Object.fromEntries(
    Object.entries(channel_map).map(([namespace_key, method_map]) => {
      const methods = is_plain_object(method_map) ? method_map : {};
      const api_methods = Object.fromEntries(
        Object.entries(methods).map(([method_key, channel]) => {
          const composite_key = `${namespace_key}.${method_key}`;
          const normalizer = normalizer_map[composite_key];
          return [method_key, create_invoke_method(channel, normalizer)];
        })
      );
      return [namespace_key, api_methods];
    })
  );
}

function create_event_listener_method(event_id) {
  const event_channel = resolveEventChannelById(event_id);
  if (!event_channel) {
    return () => () => {};
  }
  return (callback) => {
    if (typeof callback !== "function") {
      return () => {};
    }
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on(event_channel, listener);
    return () => {
      ipcRenderer.removeListener(event_channel, listener);
    };
  };
}

function apply_event_listener_methods(api_root, event_listener_method_paths) {
  const source = is_plain_object(event_listener_method_paths) ? event_listener_method_paths : {};
  Object.entries(source).forEach(([listener_method_path, event_id]) => {
    api_root[listener_method_path] = create_event_listener_method(event_id);
  });
}

function create_runtime_log_listener(callback) {
  if (typeof callback !== "function") {
    return () => {};
  }
  return create_event_listener_method("runtime_log.entry")(callback);
}

function resolve_method_by_path(source, method_path) {
  const path_tokens = String(method_path || "")
    .split(".")
    .map((token) => token.trim())
    .filter(Boolean);

  return path_tokens.reduce((scope, token) => {
    if (!scope || typeof scope !== "object") {
      return undefined;
    }
    return scope[token];
  }, source);
}

function create_forward_method(api_root, method_path) {
  return (...args) => {
    const target = resolve_method_by_path(api_root, method_path);
    if (typeof target !== "function") {
      throw new Error(`preload alias target not found: ${method_path}`);
    }
    return target(...args);
  };
}

function apply_flat_alias_methods(api_root, alias_method_paths) {
  const source = is_plain_object(alias_method_paths) ? alias_method_paths : {};
  Object.entries(source).forEach(([alias_key, method_path]) => {
    api_root[alias_key] = create_forward_method(api_root, method_path);
  });
}

const API_NAMESPACE_CHANNELS = Object.freeze(resolve_namespace_channels(PRELOAD_API_CATALOG.namespace_channel_key_map));
const ARG_NORMALIZER_MAP = Object.freeze(resolve_arg_normalizers(PRELOAD_API_CATALOG.arg_normalizer_key_map));

const app_api = build_namespace_api(API_NAMESPACE_CHANNELS, ARG_NORMALIZER_MAP);
apply_event_listener_methods(app_api, PRELOAD_API_CATALOG.event_listener_method_paths);
if (typeof app_api.on_runtime_log !== "function") {
  app_api.on_runtime_log = create_runtime_log_listener;
}

// Flat compatibility shims for existing renderer logic during hard cutover.
apply_flat_alias_methods(app_api, PRELOAD_API_CATALOG.flat_alias_method_paths);

contextBridge.exposeInMainWorld("app_api", app_api);
