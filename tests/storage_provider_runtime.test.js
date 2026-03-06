"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const STORAGE_PROVIDER_CONTRACT = require("../data/input/shared/core/storage_provider_contract.json");
const {
  createMemoryStorageProvider,
  createRawFileStorageProvider,
  createSqliteStorageProvider
} = require("../brain/core/storage_provider_runtime.js");

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

test("memory storage provider supports save, rollback, export, and import", async () => {
  const provider = createMemoryStorageProvider({
    contract: STORAGE_PROVIDER_CONTRACT
  });

  await provider.ensure_domain("app_state", () => ({ entries: [] }));
  await provider.save_domain("app_state", { entries: [{ id: "a1" }] });
  await provider.save_domain("app_state", { entries: [{ id: "a2" }] });

  const journal = await provider.list_journal_entries({ domain_key: "app_state" });
  assert.equal(journal.length >= 3, true);

  const latestSave = [...journal].reverse().find((row) => row.action === "save_domain");
  assert.ok(latestSave);
  const rollback = await provider.rollback_domain("app_state", latestSave.revision_id);
  assert.deepEqual(rollback, { entries: [{ id: "a1" }] });

  const exported = await provider.export_raw_envelope();
  assert.equal(exported.contract_id, STORAGE_PROVIDER_CONTRACT.contract_id);

  const imported = createMemoryStorageProvider({
    contract: STORAGE_PROVIDER_CONTRACT
  });
  await imported.import_raw_envelope(exported);
  const loaded = await imported.load_domain("app_state", () => ({ entries: [] }));
  assert.deepEqual(loaded, { entries: [{ id: "a1" }] });
});

test("raw file storage provider persists canonical raw envelope", async () => {
  const tempDir = makeTempDir("aio-raw-storage-");
  const provider = createRawFileStorageProvider({
    contract: STORAGE_PROVIDER_CONTRACT,
    envelopeFilePath: path.join(tempDir, "storage.raw.json"),
    journalFilePath: path.join(tempDir, "storage.journal.ndjson")
  });

  await provider.save_domain("ui_preferences", { theme: "enterprise" });
  const loaded = await provider.load_domain("ui_preferences", () => ({}));
  assert.deepEqual(loaded, { theme: "enterprise" });

  const rawText = fs.readFileSync(path.join(tempDir, "storage.raw.json"), "utf8");
  assert.equal(rawText.includes("\"ui_preferences\""), true);
  assert.equal(fs.existsSync(path.join(tempDir, "storage.journal.ndjson")), true);
});

test("sqlite storage provider persists and reloads state", async () => {
  const tempDir = makeTempDir("aio-sqlite-storage-");
  const databaseFilePath = path.join(tempDir, "storage.sqlite");
  const provider = createSqliteStorageProvider({
    contract: STORAGE_PROVIDER_CONTRACT,
    databaseFilePath
  });

  await provider.save_domain("language_bridge_state", { keywords: ["alpha"] });
  await provider.close();

  const reloadedProvider = createSqliteStorageProvider({
    contract: STORAGE_PROVIDER_CONTRACT,
    databaseFilePath
  });
  const loaded = await reloadedProvider.load_domain("language_bridge_state", () => ({}));
  assert.deepEqual(loaded, { keywords: ["alpha"] });
  await reloadedProvider.close();
});
