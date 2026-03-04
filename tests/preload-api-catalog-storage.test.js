"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const PRELOAD_API_CATALOG = require("../data/input/shared/ipc/preload_api_catalog.json");
const { IPC_CHANNELS } = require("../main/ipc/ipc_channels.js");

test("preload storage namespace maps to declared IPC channels", () => {
  const namespace_map =
    PRELOAD_API_CATALOG &&
    PRELOAD_API_CATALOG.namespace_channel_key_map &&
    PRELOAD_API_CATALOG.namespace_channel_key_map.storage
      ? PRELOAD_API_CATALOG.namespace_channel_key_map.storage
      : {};

  assert.deepEqual(namespace_map, {
    write_file: "STORAGE_WRITE_FILE",
    read_file: "STORAGE_READ_FILE",
    list_files: "STORAGE_LIST_FILES",
    delete_path: "STORAGE_DELETE_PATH",
    ensure_directory: "STORAGE_ENSURE_DIRECTORY"
  });

  Object.values(namespace_map).forEach((channel_key) => {
    assert.equal(typeof IPC_CHANNELS[channel_key], "string");
    assert.ok(IPC_CHANNELS[channel_key].startsWith("storage:"));
  });
});

test("preload storage flat aliases resolve to storage namespace methods", () => {
  const aliases =
    PRELOAD_API_CATALOG && PRELOAD_API_CATALOG.flat_alias_method_paths
      ? PRELOAD_API_CATALOG.flat_alias_method_paths
      : {};

  assert.equal(aliases.writeStorageFile, "storage.write_file");
  assert.equal(aliases.readStorageFile, "storage.read_file");
  assert.equal(aliases.listStorageFiles, "storage.list_files");
  assert.equal(aliases.deleteStoragePath, "storage.delete_path");
  assert.equal(aliases.ensureStorageDirectory, "storage.ensure_directory");
});
