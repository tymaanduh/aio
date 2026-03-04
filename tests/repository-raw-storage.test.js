"use strict";

const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const REPOSITORY_MANIFEST_MODULE_PATH = require.resolve("../main/data/repository_manifest.js");
const RAW_STORAGE_MODULE_PATH = require.resolve("../main/data/repository_raw_storage.js");

function load_raw_storage_module_with_tmp_root(tmp_root) {
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
  const raw_storage = require("../main/data/repository_raw_storage.js");
  delete require.cache[RAW_STORAGE_MODULE_PATH];

  if (original_manifest_cache) {
    require.cache[REPOSITORY_MANIFEST_MODULE_PATH] = original_manifest_cache;
  } else {
    delete require.cache[REPOSITORY_MANIFEST_MODULE_PATH];
  }

  return raw_storage;
}

async function create_raw_storage_fixture() {
  const tmp_root = await fs.mkdtemp(path.join(os.tmpdir(), "dictionary-raw-storage-"));
  const raw_storage = load_raw_storage_module_with_tmp_root(tmp_root);
  return {
    tmp_root,
    raw_storage,
    cleanup: async () => {
      await fs.rm(tmp_root, { recursive: true, force: true });
    }
  };
}

async function assert_rejects_code(promise_or_factory, code) {
  await assert.rejects(async () => {
    if (typeof promise_or_factory === "function") {
      await promise_or_factory();
      return;
    }
    await promise_or_factory;
  }, (error) => {
    return Boolean(error && error.code === code);
  });
}

test("repository_raw_storage enforces path safety and content contracts", async () => {
  const fixture = await create_raw_storage_fixture();
  const { raw_storage } = fixture;
  const { RAW_STORAGE_ERROR_CODES, RAW_STORAGE_SPEC } = raw_storage;

  try {
    await assert_rejects_code(
      () => raw_storage.write_raw_file({ relativePath: "../escape.txt", content: "x" }),
      RAW_STORAGE_ERROR_CODES.PATH_DOT_SEGMENT
    );
    await assert_rejects_code(
      () => raw_storage.write_raw_file({ relativePath: "/absolute.txt", content: "x" }),
      RAW_STORAGE_ERROR_CODES.PATH_OUTSIDE_ROOT
    );
    await assert_rejects_code(
      () => raw_storage.write_raw_file({ relativePath: "bad\u0000name.txt", content: "x" }),
      RAW_STORAGE_ERROR_CODES.PATH_INVALID_CHAR
    );
    await assert_rejects_code(
      () => raw_storage.write_raw_file("not-object"),
      RAW_STORAGE_ERROR_CODES.INVALID_PAYLOAD
    );

    const over_limit_text = "x".repeat(RAW_STORAGE_SPEC.MAX_WRITE_BYTES + 1);
    await assert_rejects_code(
      () => raw_storage.write_raw_file({ relativePath: "size/too-large.txt", content: over_limit_text }),
      RAW_STORAGE_ERROR_CODES.CONTENT_TOO_LARGE
    );

    const ok_write = await raw_storage.write_raw_file({
      relativePath: "samples/note.txt",
      content: "line-one\n"
    });
    assert.equal(ok_write.ok, true);
    await raw_storage.write_raw_file({
      relativePath: "samples/note.txt",
      content_text: "line-two\n",
      append: true
    });

    const read_text = await raw_storage.read_raw_file({
      relativePath: "samples/note.txt",
      encoding: "utf8"
    });
    assert.match(read_text.contentText, /line-one/);
    assert.match(read_text.contentText, /line-two/);

    const read_base64 = await raw_storage.read_raw_file({
      relativePath: "samples/note.txt",
      asBase64: true
    });
    assert.equal(typeof read_base64.contentBase64, "string");
    assert.ok(read_base64.contentBase64.length > 0);

    await raw_storage.write_raw_file({
      relativePath: "samples/data.json",
      content_json: { hello: "world", values: [1, 2, 3] }
    });
    await raw_storage.write_raw_file({
      relativePath: "samples/table.csv",
      content: "id,name\n1,Alice\n2,Bob\n"
    });

    const list_limited = await raw_storage.list_raw_files({
      relativeDir: "samples",
      recursive: true,
      limit: 2
    });
    assert.equal(list_limited.files.length, 2);
    assert.equal(list_limited.truncated, true);

    const list_all = await raw_storage.list_raw_files({
      relativeDir: "samples",
      recursive: true,
      limit: 20
    });
    const names_first = list_all.files.map((item) => item.relativePath);
    const names_second = (await raw_storage.list_raw_files({
      relativeDir: "samples",
      recursive: true,
      limit: 20
    })).files.map((item) => item.relativePath);
    assert.deepEqual(names_first, names_second);

    await assert_rejects_code(
      () => raw_storage.delete_raw_path({ relativePath: "samples", recursive: false }),
      RAW_STORAGE_ERROR_CODES.DELETE_DIR_REQUIRES_RECURSIVE
    );
    const deleted_dir = await raw_storage.delete_raw_path({ relativePath: "samples", recursive: true });
    assert.equal(deleted_dir.deleted, true);
    assert.equal(deleted_dir.kind, "directory");

    await assert_rejects_code(
      () => raw_storage.delete_raw_path({ relativePath: "missing.txt", allowMissing: false }),
      RAW_STORAGE_ERROR_CODES.PATH_NOT_FOUND
    );
    const missing_ok = await raw_storage.delete_raw_path({ relativePath: "missing.txt", allowMissing: true });
    assert.equal(missing_ok.existed, false);
  } finally {
    await fixture.cleanup();
  }
});

test("repository_raw_storage rejects reads over max read size", async () => {
  const fixture = await create_raw_storage_fixture();
  const { raw_storage } = fixture;
  const { RAW_STORAGE_ERROR_CODES, RAW_STORAGE_SPEC } = raw_storage;

  try {
    const root = await raw_storage.ensure_raw_storage_root();
    const big_file_path = path.join(root, "oversize.bin");
    const large_buffer = Buffer.alloc(RAW_STORAGE_SPEC.MAX_READ_BYTES + 1, 1);
    await fs.writeFile(big_file_path, large_buffer);

    await assert_rejects_code(
      () => raw_storage.read_raw_file({ relativePath: "oversize.bin" }),
      RAW_STORAGE_ERROR_CODES.READ_TOO_LARGE
    );
  } finally {
    await fixture.cleanup();
  }
});
