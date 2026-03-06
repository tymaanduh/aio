"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildPreloadApiCatalog,
  validateElectronShellAdapter,
  validateElectronShellAdapterRouteCoverage
} = require("../main/shell/electron_shell_adapter.js");
const { resolve_ipc_route_specs } = require("../main/ipc/ipc_register.js");

function createStubDeps() {
  return {
    auth_service: {
      ensure_authenticated: () => {},
      get_auth_status: () => ({ ok: true }),
      create_account: () => ({ ok: true }),
      login: () => ({ ok: true }),
      logout: () => ({ ok: true }),
      lookup_definition: () => ({ ok: true })
    },
    repository_state: {
      load_state: () => ({ ok: true }),
      save_state: () => ({ ok: true }),
      compact_state: () => ({ ok: true })
    },
    repository_diagnostics: {
      load_diagnostics_state: () => ({ ok: true }),
      append_diagnostics: () => ({ ok: true }),
      export_diagnostics: () => ({ ok: true })
    },
    repository_universe: {
      load_universe_cache_state: () => ({ ok: true }),
      save_universe_cache_state: () => ({ ok: true }),
      export_universe_state: () => ({ ok: true })
    },
    repository_ui_preferences: {
      load_ui_preferences_state: () => ({ ok: true }),
      save_ui_preferences_state: () => ({ ok: true })
    },
    runtime_log_service: {
      get_runtime_log_status: () => ({ ok: true }),
      set_runtime_logs_enabled: () => ({ ok: true }),
      create_log_console_window: () => ({ ok: true }),
      is_runtime_logs_enabled: () => true,
      append_runtime_log: () => ({ ok: true }),
      get_runtime_log_buffer: () => []
    },
    gpu_service: {
      get_gpu_diagnostics: () => ({ ok: true })
    },
    platform_runtime_service: {
      get_platform_runtime_status: () => ({ ok: true }),
      get_storage_runtime_status: () => ({ ok: true }),
      export_storage_envelope: () => ({ ok: true }),
      import_storage_envelope: () => ({ ok: true }),
      list_storage_journal: () => ({ ok: true }),
      rollback_storage_domain: () => ({ ok: true }),
      validate_storage_raw_envelope: () => ({ ok: true })
    },
    language_bridge_service: {
      load_bridge_state: () => ({ ok: true }),
      capture_sources: () => ({ ok: true }),
      compile_machine_descriptors: () => ({ ok: true }),
      search_keyword: () => ({ ok: true }),
      search_triad: () => ({ ok: true }),
      search_glossary: () => ({ ok: true }),
      search_machine_descriptor: () => ({ ok: true }),
      link_entry_artifacts: () => ({ ok: true })
    }
  };
}

test("electron shell adapter validates contract, preload bindings, and views", () => {
  const validation = validateElectronShellAdapter();
  assert.equal(validation.status, "pass");
  assert.equal(validation.counts.commands > 20, true);
  assert.equal(validation.counts.views >= 10, true);
});

test("electron shell adapter builds preload bindings for shell ABI commands and events", () => {
  const catalog = buildPreloadApiCatalog();

  assert.equal(catalog.namespace_channel_key_map.window.minimize, "WINDOW_MINIMIZE");
  assert.equal(catalog.namespace_channel_key_map.window.is_maximized, "WINDOW_IS_MAXIMIZED");
  assert.equal(catalog.namespace_channel_key_map.platform.get_runtime_status, "PLATFORM_GET_RUNTIME_STATUS");
  assert.equal(catalog.namespace_channel_key_map.storage.export_raw_envelope, "STORAGE_EXPORT_RAW_ENVELOPE");
  assert.equal(catalog.namespace_channel_key_map.bridge.load_state, "BRIDGE_LOAD_STATE");
  assert.equal(catalog.arg_normalizer_key_map["runtime_log.set_enabled"], "boolean_first_arg");
  assert.equal(catalog.flat_alias_method_paths.minimizeWindow, "window.minimize");
  assert.equal(catalog.flat_alias_method_paths.getPlatformRuntimeStatus, "platform.get_runtime_status");
  assert.equal(catalog.flat_alias_method_paths.exportStorageRawEnvelope, "storage.export_raw_envelope");
  assert.equal(catalog.flat_alias_method_paths.onRuntimeLog, "on_runtime_log");
  assert.equal(catalog.event_listener_method_paths.on_runtime_log, "runtime_log.entry");
});

test("electron shell adapter route coverage matches registered IPC routes", () => {
  const routeSpecs = resolve_ipc_route_specs(createStubDeps());
  const coverage = validateElectronShellAdapterRouteCoverage(routeSpecs);

  assert.equal(coverage.status, "pass");
  assert.equal(coverage.missing_channels.length, 0);
});
