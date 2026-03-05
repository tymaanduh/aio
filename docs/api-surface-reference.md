# API Surface Reference

Source of truth for preload namespace methods, flat aliases, IPC channel keys, and route ownership.

- Catalog: `data/input/shared/ipc/preload_api_catalog.json`
- Channels: `main/ipc/ipc_channels.js`
- IPC contract: `main/ipc-contract.js`

## window.app_api.auth

- Route owner: `main/ipc/ipc_route_auth.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `get_auth_status` | `AUTH_GET_STATUS` | `getAuthStatus` |
| `create_account` | `AUTH_CREATE_ACCOUNT` | `createAccount` |
| `login` | `AUTH_LOGIN` | `login` |
| `logout` | `AUTH_LOGOUT` | `logout` |

## window.app_api.data

- Route owner: `main/ipc/ipc_route_data.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `load` | `DICTIONARY_LOAD` | `load` |
| `save` | `DICTIONARY_SAVE` | `save` |
| `compact` | `DICTIONARY_COMPACT` | `compact` |
| `lookup_definition` | `DICTIONARY_LOOKUP_DEFINITION` | `lookupDefinition` |

## window.app_api.diagnostics

- Route owner: `main/ipc/ipc_route_diagnostics.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `load` | `DIAGNOSTICS_LOAD` | `loadDiagnostics` |
| `append` | `DIAGNOSTICS_APPEND` | `appendDiagnostics` |
| `export` | `DIAGNOSTICS_EXPORT` | `exportDiagnostics` |

## window.app_api.universe

- Route owner: `main/ipc/ipc_route_universe.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `load_cache` | `UNIVERSE_LOAD_CACHE` | `loadUniverseCache` |
| `save_cache` | `UNIVERSE_SAVE_CACHE` | `saveUniverseCache` |
| `export` | `UNIVERSE_EXPORT` | `exportUniverse` |

## window.app_api.storage

- Route owner: `main/ipc/ipc_route_data.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `write_file` | `STORAGE_WRITE_FILE` | `writeStorageFile` |
| `read_file` | `STORAGE_READ_FILE` | `readStorageFile` |
| `list_files` | `STORAGE_LIST_FILES` | `listStorageFiles` |
| `delete_path` | `STORAGE_DELETE_PATH` | `deleteStoragePath` |
| `ensure_directory` | `STORAGE_ENSURE_DIRECTORY` | `ensureStorageDirectory` |

## window.app_api.ui

- Route owner: `main/ipc/ipc_route_ui.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `load_preferences` | `UI_LOAD_PREFERENCES` | `loadUiPreferences` |
| `save_preferences` | `UI_SAVE_PREFERENCES` | `saveUiPreferences` |

## window.app_api.runtime_log

- Route owner: `main/ipc/ipc_route_runtime_log.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `status` | `RUNTIME_LOG_STATUS` | `getRuntimeLogStatus` |
| `set_enabled` | `RUNTIME_LOG_SET_ENABLED` | `setRuntimeLogEnabled` |
| `open_console` | `RUNTIME_LOG_OPEN_CONSOLE` | `openRuntimeLogConsole` |
| `append` | `RUNTIME_LOG_APPEND` | `appendRuntimeLog` |
| `load` | `RUNTIME_LOG_LOAD` | `loadRuntimeLogs` |

## window.app_api.gpu

- Route owner: `main/ipc/ipc_route_gpu.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `get_status` | `GPU_GET_STATUS` | `getGpuStatus` |

## window.app_api.bridge

- Route owner: `main/ipc/ipc_route_bridge.js`

| Method | Channel Key | Flat Aliases |
|---|---|---|
| `load_state` | `BRIDGE_LOAD_STATE` | `loadBridgeState` |
| `capture_sources` | `BRIDGE_CAPTURE_SOURCES` | `captureBridgeSources` |
| `compile_machine_descriptors` | `BRIDGE_COMPILE_MACHINE_DESCRIPTORS` | `compileBridgeMachineDescriptors` |
| `search_keyword` | `BRIDGE_SEARCH_KEYWORD` | `searchBridgeKeyword` |
| `search_triad` | `BRIDGE_SEARCH_TRIAD` | `searchBridgeTriad` |
| `search_glossary` | `BRIDGE_SEARCH_GLOSSARY` | `searchBridgeGlossary` |
| `search_machine_descriptor` | `BRIDGE_SEARCH_MACHINE_DESCRIPTOR` | `searchBridgeMachineDescriptor` |
| `link_entry_artifacts` | `BRIDGE_LINK_ENTRY_ARTIFACTS` | `linkBridgeEntryArtifacts` |

## Runtime Notes

- Storage namespace methods are internal-facing utilities rooted to `userData/data/v1/raw_storage` via `main/data/repository_raw_storage.js`.
- Bridge namespace is a local language-bridge index interface, routed through `main/ipc/ipc_route_bridge.js` and repository/service domains.
- `onRuntimeLog` is the event-style flat alias for runtime log stream subscription.
