#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs/promises");
const os = require("os");
const { create_ipc_route_data } = require("../main/ipc/ipc_route_data.js");
const { IPC_CHANNELS } = require("../main/ipc/ipc_channels.js");
const repository_state = require("../main/data/repository_state.js");
const normalize_service = require("../main/services/normalize_service.js");
const language_bridge_service = require("../main/services/language_bridge_service.js");
const REPOSITORY_MANIFEST_MODULE_PATH = require.resolve("../main/data/repository_manifest.js");
const RAW_STORAGE_MODULE_PATH = require.resolve("../main/data/repository_raw_storage.js");

const DEFAULT_RELATIVE_DIR = "harness/raw-storage";

function parse_args(argv) {
  const args = {
    relativeDir: DEFAULT_RELATIVE_DIR,
    keepFiles: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--relative-dir") {
      args.relativeDir = String(argv[index + 1] || "").trim() || DEFAULT_RELATIVE_DIR;
      index += 1;
      continue;
    }
    if (token === "--keep-files") {
      args.keepFiles = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      print_help_and_exit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function print_help_and_exit(code) {
  process.stdout.write(
    [
      "raw-storage-harness",
      "",
      "Usage:",
      "  node scripts/raw-storage-harness.js [options]",
      "",
      "Options:",
      "  --relative-dir <path>  Relative directory inside raw storage root",
      "  --keep-files           Keep created files (skip cleanup delete)",
      "  --help                 Show help"
    ].join("\n") + "\n"
  );
  process.exit(code);
}

function build_route_map() {
  const repository_raw_storage = load_raw_storage_for_node_harness();
  const routes = create_ipc_route_data({
    repository_state,
    normalize_service,
    language_bridge_service,
    repository_raw_storage
  });
  return routes.reduce((acc, spec) => {
    acc[spec.channel] = spec.handler;
    return acc;
  }, {});
}

function load_raw_storage_for_node_harness() {
  const tmp_root = path.join(os.tmpdir(), "dictionary-raw-storage-harness");
  const data_v1_root = path.join(tmp_root, "user-data", "data", "v1");
  const manifest_stub = {
    ensure_data_dirs: async () => {
      await fs.mkdir(data_v1_root, { recursive: true });
      return { data_v1_root };
    },
    get_data_paths: () => ({ data_v1_root })
  };

  const original_manifest_cache = require.cache[REPOSITORY_MANIFEST_MODULE_PATH];
  require.cache[REPOSITORY_MANIFEST_MODULE_PATH] = {
    id: REPOSITORY_MANIFEST_MODULE_PATH,
    filename: REPOSITORY_MANIFEST_MODULE_PATH,
    loaded: true,
    exports: manifest_stub
  };

  delete require.cache[RAW_STORAGE_MODULE_PATH];
  const repository_raw_storage = require("../main/data/repository_raw_storage.js");
  delete require.cache[RAW_STORAGE_MODULE_PATH];

  if (original_manifest_cache) {
    require.cache[REPOSITORY_MANIFEST_MODULE_PATH] = original_manifest_cache;
  } else {
    delete require.cache[REPOSITORY_MANIFEST_MODULE_PATH];
  }

  return repository_raw_storage;
}

async function main() {
  const args = parse_args(process.argv.slice(2));
  const routes = build_route_map();
  const ensure_dir = routes[IPC_CHANNELS.STORAGE_ENSURE_DIRECTORY];
  const write_file = routes[IPC_CHANNELS.STORAGE_WRITE_FILE];
  const read_file = routes[IPC_CHANNELS.STORAGE_READ_FILE];
  const list_files = routes[IPC_CHANNELS.STORAGE_LIST_FILES];
  const delete_path = routes[IPC_CHANNELS.STORAGE_DELETE_PATH];

  const note_path = path.posix.join(args.relativeDir, "sample.txt");
  const json_path = path.posix.join(args.relativeDir, "sample.json");

  const operations = [];
  operations.push(await ensure_dir({ relativePath: args.relativeDir }));
  operations.push(await write_file({ relativePath: note_path, content: "harness-line-1\n" }));
  operations.push(await write_file({ relativePath: note_path, content_text: "harness-line-2\n", append: true }));
  operations.push(await write_file({ relativePath: json_path, content_json: { mode: "harness", ok: true } }));

  const read_text_result = await read_file({ relativePath: note_path, encoding: "utf8" });
  const list_result = await list_files({ relativeDir: args.relativeDir, recursive: true });

  let cleanup_result = null;
  if (!args.keepFiles) {
    cleanup_result = await delete_path({ relativePath: args.relativeDir, recursive: true });
  }

  const summary = {
    ok: true,
    relative_dir: args.relativeDir,
    operations,
    read_text_preview: String(read_text_result.contentText || "").slice(0, 200),
    list_count: Array.isArray(list_result.files) ? list_result.files.length : 0,
    cleanup: cleanup_result
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`raw-storage-harness failed: ${error.message}\n`);
  process.exit(1);
});
