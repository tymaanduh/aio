"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { create_ipc_route_data } = require("../main/ipc/ipc_route_data.js");
const { IPC_CHANNELS } = require("../main/ipc/ipc_channels.js");

test("create_ipc_route_data exposes raw storage route handlers", async () => {
  const calls = [];
  const repository_state = {
    load_state: () => ({ ok: true }),
    save_state: (payload) => ({ saved: payload })
  };
  const normalize_service = {
    compact_state: (payload) => ({ compacted: payload })
  };
  const language_bridge_service = {
    index_dictionary_entries: async () => ({ ok: true })
  };
  const repository_raw_storage = {
    write_raw_file: async (payload) => {
      calls.push(["write", payload]);
      return { op: "write", payload };
    },
    read_raw_file: async (payload) => {
      calls.push(["read", payload]);
      return { op: "read", payload };
    },
    list_raw_files: async (payload) => {
      calls.push(["list", payload]);
      return { op: "list", payload };
    },
    delete_raw_path: async (payload) => {
      calls.push(["delete", payload]);
      return { op: "delete", payload };
    },
    ensure_raw_directory: async (payload) => {
      calls.push(["mkdir", payload]);
      return { op: "mkdir", payload };
    }
  };

  const specs = create_ipc_route_data({
    repository_state,
    normalize_service,
    language_bridge_service,
    repository_raw_storage
  });

  const write_spec = specs.find((spec) => spec.channel === IPC_CHANNELS.STORAGE_WRITE_FILE);
  const read_spec = specs.find((spec) => spec.channel === IPC_CHANNELS.STORAGE_READ_FILE);
  const list_spec = specs.find((spec) => spec.channel === IPC_CHANNELS.STORAGE_LIST_FILES);
  const delete_spec = specs.find((spec) => spec.channel === IPC_CHANNELS.STORAGE_DELETE_PATH);
  const mkdir_spec = specs.find((spec) => spec.channel === IPC_CHANNELS.STORAGE_ENSURE_DIRECTORY);

  assert.ok(write_spec);
  assert.ok(read_spec);
  assert.ok(list_spec);
  assert.ok(delete_spec);
  assert.ok(mkdir_spec);
  assert.equal(write_spec.requires_auth, true);
  assert.equal(read_spec.requires_auth, true);
  assert.equal(list_spec.requires_auth, true);
  assert.equal(delete_spec.requires_auth, true);
  assert.equal(mkdir_spec.requires_auth, true);

  const payload = { relativePath: "samples/hello.txt", content: "hello" };
  assert.deepEqual(await write_spec.handler(payload), { op: "write", payload });
  assert.deepEqual(await read_spec.handler(payload), { op: "read", payload });
  assert.deepEqual(await list_spec.handler({ recursive: false }), {
    op: "list",
    payload: { recursive: false }
  });
  assert.deepEqual(await delete_spec.handler({ relativePath: "samples/hello.txt" }), {
    op: "delete",
    payload: { relativePath: "samples/hello.txt" }
  });
  assert.deepEqual(await mkdir_spec.handler({ relativePath: "samples" }), {
    op: "mkdir",
    payload: { relativePath: "samples" }
  });

  assert.deepEqual(calls, [
    ["write", payload],
    ["read", payload],
    ["list", { recursive: false }],
    ["delete", { relativePath: "samples/hello.txt" }],
    ["mkdir", { relativePath: "samples" }]
  ]);
});

test("create_ipc_route_data wraps storage errors with code passthrough", async () => {
  const repository_state = {
    load_state: () => ({ ok: true }),
    save_state: (payload) => ({ saved: payload })
  };
  const normalize_service = {
    compact_state: (payload) => ({ compacted: payload })
  };
  const language_bridge_service = {
    index_dictionary_entries: async () => ({ ok: true })
  };
  const repository_raw_storage = {
    write_raw_file: async () => {
      const error = new Error("relative path missing");
      error.code = "RAW_STORAGE_PATH_REQUIRED";
      throw error;
    },
    read_raw_file: async () => ({ ok: true }),
    list_raw_files: async () => ({ ok: true }),
    delete_raw_path: async () => ({ ok: true }),
    ensure_raw_directory: async () => ({ ok: true })
  };

  const specs = create_ipc_route_data({
    repository_state,
    normalize_service,
    language_bridge_service,
    repository_raw_storage
  });
  const write_spec = specs.find((spec) => spec.channel === IPC_CHANNELS.STORAGE_WRITE_FILE);
  assert.ok(write_spec);

  await assert.rejects(write_spec.handler({}), (error) => {
    return (
      error &&
      error.code === "RAW_STORAGE_PATH_REQUIRED" &&
      typeof error.message === "string" &&
      error.message.includes("RAW_STORAGE_PATH_REQUIRED")
    );
  });
});
