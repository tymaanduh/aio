"use strict";

const fs = require("fs/promises");
const path = require("path");
const {
  FILE_KEY_LIST,
  FILE_NAME_MAP,
  get_data_paths,
  file_exists,
  read_json_file,
  write_json_atomic,
  sync_manifest_file
} = require("./repository_manifest.js");
const STORAGE_PROVIDER_CONTRACT = require("../../data/input/shared/core/storage_provider_contract.json");
const { createStorageProvider } = require("../../brain/core/storage_provider_runtime.js");

const STORAGE_BACKEND_ENV_KEY = "AIO_STORAGE_BACKEND";
const LEGACY_BACKEND_ID = "legacy_json";
const PROVIDER_CACHE = {
  entry: null
};

function normalizeBackendId(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function shouldMirrorLegacyFiles(backendId) {
  return backendId !== "memory" && backendId !== LEGACY_BACKEND_ID;
}

function resolveSelectedBackend() {
  const envBackend = normalizeBackendId(process.env[STORAGE_BACKEND_ENV_KEY]);
  if (envBackend) {
    return envBackend;
  }
  return normalizeBackendId(STORAGE_PROVIDER_CONTRACT.default_backend || "raw_file") || "raw_file";
}

function shouldUseNeutralCoreStorage() {
  return resolveSelectedBackend() !== LEGACY_BACKEND_ID;
}

function buildProviderPaths(paths, backendId) {
  const rawFileProvider = STORAGE_PROVIDER_CONTRACT.providers?.raw_file || {};
  const sqliteProvider = STORAGE_PROVIDER_CONTRACT.providers?.sqlite || {};
  return {
    envelope_file_path: path.join(
      paths.data_v1_root,
      String(rawFileProvider.envelope_file_name || "aio_core_storage.raw.json")
    ),
    journal_file_path: path.join(
      paths.data_v1_root,
      String(rawFileProvider.journal_file_name || "aio_core_storage.journal.ndjson")
    ),
    database_file_path: path.join(
      paths.data_v1_root,
      String(sqliteProvider.database_file_name || "aio_core_storage.sqlite")
    ),
    backend_id: backendId
  };
}

function resolveProviderStoragePath(cacheEntry) {
  return cacheEntry?.backend_id === "sqlite"
    ? cacheEntry?.provider_paths?.database_file_path
    : cacheEntry?.provider_paths?.envelope_file_path;
}

async function createProviderCacheEntry() {
  const backendId = resolveSelectedBackend();
  const paths = get_data_paths();
  const providerPaths = buildProviderPaths(paths, backendId);
  const provider = createStorageProvider({
    contract: STORAGE_PROVIDER_CONTRACT,
    backendId,
    envelopeFilePath: providerPaths.envelope_file_path,
    journalFilePath: providerPaths.journal_file_path,
    databaseFilePath: providerPaths.database_file_path
  });
  return {
    backend_id: backendId,
    mirror_legacy_files: shouldMirrorLegacyFiles(backendId),
    paths,
    provider_paths: providerPaths,
    provider,
    seeded: false
  };
}

async function getProviderCacheEntry() {
  const backendId = resolveSelectedBackend();
  if (PROVIDER_CACHE.entry && PROVIDER_CACHE.entry.backend_id === backendId) {
    return PROVIDER_CACHE.entry;
  }
  PROVIDER_CACHE.entry = await createProviderCacheEntry();
  return PROVIDER_CACHE.entry;
}

async function seedProviderFromLegacyFiles(cacheEntry) {
  if (!cacheEntry || cacheEntry.seeded || !cacheEntry.provider) {
    return;
  }

  const envelope = await cacheEntry.provider.export_raw_envelope();
  for (const fileKey of FILE_KEY_LIST) {
    if (envelope.domains && envelope.domains[fileKey]) {
      continue;
    }
    const legacyFilePath = cacheEntry.paths.file_paths[fileKey];
    // Keep migration from legacy files deterministic and first-pass only.
    // eslint-disable-next-line no-await-in-loop
    if (!(await file_exists(legacyFilePath))) {
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const payload = await read_json_file(legacyFilePath, {});
    // eslint-disable-next-line no-await-in-loop
    await cacheEntry.provider.save_domain(fileKey, payload, {
      action: "seed_from_legacy",
      metadata: {
        legacy_file_name: FILE_NAME_MAP[fileKey] || ""
      }
    });
  }
  cacheEntry.seeded = true;
}

async function mirrorDomainToLegacyFile(cacheEntry, fileKey, payload, metadata = {}) {
  if (!cacheEntry || !cacheEntry.mirror_legacy_files) {
    return;
  }
  const legacyFilePath = cacheEntry.paths.file_paths[fileKey];
  await write_json_atomic(legacyFilePath, payload);
  const providerPath = resolveProviderStoragePath(cacheEntry);
  await sync_manifest_file(fileKey, {
    storage_backend: cacheEntry.backend_id,
    storage_contract_id: STORAGE_PROVIDER_CONTRACT.contract_id,
    storage_provider_path: path.relative(cacheEntry.paths.data_v1_root, providerPath).replace(/\\/g, "/"),
    neutral_core_revision_id: String(metadata.revision_id || "")
  });
}

async function removeLegacyMirrorFile(cacheEntry, fileKey, metadata = {}) {
  if (!cacheEntry || !cacheEntry.mirror_legacy_files) {
    return;
  }
  const legacyFilePath = cacheEntry.paths.file_paths[fileKey];
  try {
    await fs.unlink(legacyFilePath);
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }
  const providerPath = resolveProviderStoragePath(cacheEntry);
  await sync_manifest_file(fileKey, {
    storage_backend: cacheEntry.backend_id,
    storage_contract_id: STORAGE_PROVIDER_CONTRACT.contract_id,
    storage_provider_path: path.relative(cacheEntry.paths.data_v1_root, providerPath).replace(/\\/g, "/"),
    neutral_core_revision_id: String(metadata.revision_id || ""),
    legacy_mirror_deleted: true
  });
}

async function syncLegacyMirrorFromEnvelope(cacheEntry, envelope) {
  const domains = envelope?.domains && typeof envelope.domains === "object" ? envelope.domains : {};
  for (const fileKey of FILE_KEY_LIST) {
    if (domains[fileKey]) {
      // eslint-disable-next-line no-await-in-loop
      await mirrorDomainToLegacyFile(cacheEntry, fileKey, domains[fileKey].data, domains[fileKey]);
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    await removeLegacyMirrorFile(cacheEntry, fileKey, envelope?.revision || {});
  }
}

async function ensureStorageDomain(spec) {
  const cacheEntry = await getProviderCacheEntry();
  await seedProviderFromLegacyFiles(cacheEntry);
  const fileKey = String(spec.file_key || "").trim();
  const defaultFactory = typeof spec.create_default_state === "function" ? spec.create_default_state : () => ({});
  const normalizedRecord = await cacheEntry.provider.ensure_domain(fileKey, () => spec.normalize_state(defaultFactory()), {
    storage_domain: fileKey
  });
  await mirrorDomainToLegacyFile(cacheEntry, fileKey, normalizedRecord.data, normalizedRecord);
  return cacheEntry.paths.file_paths[fileKey];
}

async function loadStorageDomain(spec) {
  const cacheEntry = await getProviderCacheEntry();
  await ensureStorageDomain(spec);
  const payload = await cacheEntry.provider.load_domain(
    String(spec.file_key || ""),
    () => spec.normalize_state(spec.create_default_state())
  );
  return spec.normalize_state(payload);
}

async function saveStorageDomain(spec, payload) {
  const cacheEntry = await getProviderCacheEntry();
  const normalized = spec.normalize_state(payload);
  if (spec.touch_field) {
    normalized[spec.touch_field] = new Date().toISOString();
  }
  const record = await cacheEntry.provider.save_domain(String(spec.file_key || ""), normalized, {
    action: "save_domain",
    metadata: {
      touch_field: String(spec.touch_field || "")
    }
  });
  await mirrorDomainToLegacyFile(cacheEntry, String(spec.file_key || ""), record.data, record);
  return record.data;
}

async function listStorageJournalEntries(filter = {}) {
  const cacheEntry = await getProviderCacheEntry();
  await seedProviderFromLegacyFiles(cacheEntry);
  return cacheEntry.provider.list_journal_entries(filter);
}

async function exportStorageRawEnvelope() {
  const cacheEntry = await getProviderCacheEntry();
  await seedProviderFromLegacyFiles(cacheEntry);
  return cacheEntry.provider.export_raw_envelope();
}

async function importStorageRawEnvelope(payload, metadata = {}) {
  const cacheEntry = await getProviderCacheEntry();
  const envelope = await cacheEntry.provider.import_raw_envelope(payload, metadata);
  await syncLegacyMirrorFromEnvelope(cacheEntry, envelope);
  cacheEntry.seeded = true;
  return envelope;
}

async function rollbackStorageDomain(domainKey, revisionId, metadata = {}) {
  const cacheEntry = await getProviderCacheEntry();
  await seedProviderFromLegacyFiles(cacheEntry);
  const value = await cacheEntry.provider.rollback_domain(domainKey, revisionId, metadata);
  const envelope = await cacheEntry.provider.export_raw_envelope();
  await syncLegacyMirrorFromEnvelope(cacheEntry, envelope);
  return value;
}

async function validateStorageRawEnvelope(payload) {
  const cacheEntry = await getProviderCacheEntry();
  return cacheEntry.provider.validate_raw_envelope(payload);
}

function describeActiveStorageBackend() {
  const backendId = resolveSelectedBackend();
  const paths = get_data_paths();
  const providerPaths = buildProviderPaths(paths, backendId);
  return {
    backend_id: backendId,
    using_neutral_core_storage: backendId !== LEGACY_BACKEND_ID,
    mirror_legacy_files: shouldMirrorLegacyFiles(backendId),
    envelope_file_path: providerPaths.envelope_file_path,
    journal_file_path: providerPaths.journal_file_path,
    database_file_path: providerPaths.database_file_path
  };
}

module.exports = {
  LEGACY_BACKEND_ID,
  describeActiveStorageBackend,
  ensureStorageDomain,
  exportStorageRawEnvelope,
  importStorageRawEnvelope,
  listStorageJournalEntries,
  loadStorageDomain,
  rollbackStorageDomain,
  resolveSelectedBackend,
  saveStorageDomain,
  shouldUseNeutralCoreStorage,
  validateStorageRawEnvelope
};
