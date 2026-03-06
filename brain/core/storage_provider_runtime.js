"use strict";

const fs = require("fs");
const path = require("path");
const { ensureDirForFile, writeTextFileRobust } = require("../../scripts/lib/robust-file-write");

function nowIso() {
  return new Date().toISOString();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value === undefined ? null : value));
}

function readJsonIfExists(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function normalizeStorageContract(contract = {}) {
  const providers = isPlainObject(contract.providers) ? contract.providers : {};
  return {
    schema_version: Number(contract.schema_version || 1),
    contract_id: String(contract.contract_id || "aio_storage_provider_contract"),
    storage_version: String(contract.storage_version || "v1"),
    default_backend: String(contract.default_backend || "raw_file"),
    raw_format: isPlainObject(contract.raw_format) ? contract.raw_format : {},
    providers
  };
}

function buildRevision(sequence) {
  const revisionId = `rev-${sequence}-${Date.now()}`;
  return {
    sequence,
    revision_id: revisionId,
    committed_at: nowIso()
  };
}

function buildEmptyEnvelope(contract, fields = {}) {
  const normalizedContract = normalizeStorageContract(contract);
  return {
    schema_version: Number(normalizedContract.raw_format.schema_version || 1),
    contract_id: normalizedContract.contract_id,
    storage_version: normalizedContract.storage_version,
    revision: {
      sequence: 0,
      revision_id: "rev-0",
      committed_at: nowIso()
    },
    domains: {},
    journal: [],
    metadata: {
      backend_id: String(fields.backend_id || normalizedContract.default_backend || "raw_file"),
      created_at: nowIso(),
      updated_at: nowIso()
    }
  };
}

function validateRawEnvelope(payload, contract = {}) {
  const normalizedContract = normalizeStorageContract(contract);
  const issues = [];
  const input = isPlainObject(payload) ? cloneJson(payload) : buildEmptyEnvelope(normalizedContract);
  const envelope = buildEmptyEnvelope(normalizedContract, {
    backend_id: input?.metadata?.backend_id || normalizedContract.default_backend
  });

  envelope.schema_version = Number(input.schema_version || envelope.schema_version);
  envelope.contract_id = String(input.contract_id || envelope.contract_id);
  envelope.storage_version = String(input.storage_version || envelope.storage_version);

  const revision = isPlainObject(input.revision) ? input.revision : {};
  envelope.revision = {
    sequence: Number.isFinite(Number(revision.sequence)) ? Number(revision.sequence) : 0,
    revision_id: String(revision.revision_id || `rev-${Number(revision.sequence || 0)}`),
    committed_at: String(revision.committed_at || nowIso())
  };

  if (envelope.contract_id !== normalizedContract.contract_id) {
    issues.push({
      level: "warn",
      type: "contract_id_mismatch",
      detail: "raw envelope contract_id does not match storage contract",
      actual: envelope.contract_id,
      expected: normalizedContract.contract_id
    });
  }

  const domains = isPlainObject(input.domains) ? input.domains : {};
  Object.keys(domains)
    .sort((left, right) => left.localeCompare(right))
    .forEach((domainKey) => {
      const domain = isPlainObject(domains[domainKey]) ? domains[domainKey] : {};
      envelope.domains[domainKey] = {
        domain_key: String(domain.domain_key || domainKey),
        updated_at: String(domain.updated_at || nowIso()),
        revision_id: String(domain.revision_id || envelope.revision.revision_id),
        data: cloneJson(domain.data === undefined ? {} : domain.data)
      };
    });

  const journal = Array.isArray(input.journal) ? input.journal : [];
  envelope.journal = journal
    .map((entry, index) => {
      const row = isPlainObject(entry) ? entry : {};
      return {
        revision_id: String(row.revision_id || `rev-journal-${index}`),
        sequence: Number.isFinite(Number(row.sequence)) ? Number(row.sequence) : index + 1,
        domain_key: String(row.domain_key || ""),
        action: String(row.action || "unknown"),
        committed_at: String(row.committed_at || nowIso()),
        previous_data: cloneJson(row.previous_data === undefined ? null : row.previous_data),
        next_data: cloneJson(row.next_data === undefined ? null : row.next_data),
        metadata: cloneJson(isPlainObject(row.metadata) ? row.metadata : {})
      };
    })
    .sort((left, right) => Number(left.sequence || 0) - Number(right.sequence || 0));

  envelope.metadata = {
    ...(isPlainObject(input.metadata) ? cloneJson(input.metadata) : {}),
    backend_id: String(input?.metadata?.backend_id || envelope.metadata.backend_id),
    updated_at: nowIso()
  };

  return {
    ok: issues.filter((row) => row.level === "error").length === 0,
    issues,
    normalized: envelope
  };
}

function buildDomainRecord(domainKey, data, revision) {
  return {
    domain_key: String(domainKey || ""),
    updated_at: String(revision.committed_at || nowIso()),
    revision_id: String(revision.revision_id || ""),
    data: cloneJson(data === undefined ? {} : data)
  };
}

function createJournalEntry({ revision, domainKey, action, previousData, nextData, metadata = {} }) {
  return {
    revision_id: String(revision.revision_id || ""),
    sequence: Number(revision.sequence || 0),
    domain_key: String(domainKey || ""),
    action: String(action || "save_domain"),
    committed_at: String(revision.committed_at || nowIso()),
    previous_data: cloneJson(previousData === undefined ? null : previousData),
    next_data: cloneJson(nextData === undefined ? null : nextData),
    metadata: cloneJson(isPlainObject(metadata) ? metadata : {})
  };
}

function createMemoryStorageProvider(options = {}) {
  const contract = normalizeStorageContract(options.contract);
  const initialEnvelope = validateRawEnvelope(
    options.initialEnvelope || buildEmptyEnvelope(contract, { backend_id: options.backendId || "memory" }),
    contract
  ).normalized;
  const onMutation = typeof options.onMutation === "function" ? options.onMutation : null;
  let envelope = initialEnvelope;

  async function persist(newEntries = []) {
    envelope.metadata.updated_at = nowIso();
    if (onMutation) {
      await onMutation({
        envelope: cloneJson(envelope),
        new_entries: cloneJson(newEntries)
      });
    }
  }

  async function ensureDomain(domainKey, createDefaultState = () => ({}), metadata = {}) {
    const key = String(domainKey || "").trim();
    if (!key) {
      throw new Error("domainKey is required");
    }
    if (!envelope.domains[key]) {
      await saveDomain(key, typeof createDefaultState === "function" ? createDefaultState() : {}, {
        action: "ensure_domain",
        metadata
      });
    }
    return cloneJson(envelope.domains[key]);
  }

  async function loadDomain(domainKey, createDefaultState = () => ({}), metadata = {}) {
    const record = await ensureDomain(domainKey, createDefaultState, metadata);
    return cloneJson(record.data);
  }

  async function saveDomain(domainKey, data, optionsInput = {}) {
    const key = String(domainKey || "").trim();
    if (!key) {
      throw new Error("domainKey is required");
    }
    const previous = envelope.domains[key] ? cloneJson(envelope.domains[key].data) : null;
    const revision = buildRevision(Number(envelope.revision.sequence || 0) + 1);
    const domainRecord = buildDomainRecord(key, data, revision);
    envelope.domains[key] = domainRecord;
    envelope.revision = revision;
    const journalEntry = createJournalEntry({
      revision,
      domainKey: key,
      action: String(optionsInput.action || "save_domain"),
      previousData: previous,
      nextData: domainRecord.data,
      metadata: optionsInput.metadata || {}
    });
    envelope.journal.push(journalEntry);
    await persist([journalEntry]);
    return cloneJson(domainRecord);
  }

  async function listJournalEntries(filter = {}) {
    const domainKey = String(filter.domain_key || "").trim();
    const revisionId = String(filter.revision_id || "").trim();
    return cloneJson(
      envelope.journal.filter((entry) => {
        if (domainKey && entry.domain_key !== domainKey) {
          return false;
        }
        if (revisionId && entry.revision_id !== revisionId) {
          return false;
        }
        return true;
      })
    );
  }

  async function rollbackDomain(domainKey, revisionId, metadata = {}) {
    const key = String(domainKey || "").trim();
    const targetRevisionId = String(revisionId || "").trim();
    const target = [...envelope.journal]
      .reverse()
      .find((entry) => entry.domain_key === key && entry.revision_id === targetRevisionId);
    if (!target) {
      return null;
    }

    const previous = envelope.domains[key] ? cloneJson(envelope.domains[key].data) : null;
    const nextValue = cloneJson(target.previous_data);
    const revision = buildRevision(Number(envelope.revision.sequence || 0) + 1);

    if (nextValue === null) {
      delete envelope.domains[key];
    } else {
      envelope.domains[key] = buildDomainRecord(key, nextValue, revision);
    }
    envelope.revision = revision;

    const journalEntry = createJournalEntry({
      revision,
      domainKey: key,
      action: "rollback_domain",
      previousData: previous,
      nextData: nextValue,
      metadata: {
        ...cloneJson(metadata),
        rollback_target_revision_id: targetRevisionId
      }
    });
    envelope.journal.push(journalEntry);
    await persist([journalEntry]);
    return nextValue;
  }

  async function exportRawEnvelope() {
    return cloneJson(envelope);
  }

  async function importRawEnvelope(payload, metadata = {}) {
    const validation = validateRawEnvelope(payload, contract);
    envelope = validation.normalized;
    envelope.metadata = {
      ...envelope.metadata,
      imported_at: nowIso(),
      import_metadata: cloneJson(metadata)
    };
    await persist([]);
    return cloneJson(envelope);
  }

  async function validateEnvelope(payload) {
    return validateRawEnvelope(payload, contract);
  }

  async function close() {
    return undefined;
  }

  return Object.freeze({
    contract_id: contract.contract_id,
    backend_id: String(options.backendId || "memory"),
    ensure_domain: ensureDomain,
    load_domain: loadDomain,
    save_domain: saveDomain,
    list_journal_entries: listJournalEntries,
    rollback_domain: rollbackDomain,
    export_raw_envelope: exportRawEnvelope,
    import_raw_envelope: importRawEnvelope,
    validate_raw_envelope: validateEnvelope,
    close
  });
}

function appendNdjson(filePath, rows) {
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) {
    return;
  }
  ensureDirForFile(filePath);
  const body = `${list.map((row) => JSON.stringify(row)).join("\n")}\n`;
  fs.appendFileSync(filePath, body, "utf8");
}

function createRawFileStorageProvider(options = {}) {
  const contract = normalizeStorageContract(options.contract);
  const envelopeFilePath = path.resolve(String(options.envelopeFilePath || "aio_core_storage.raw.json"));
  const journalFilePath = path.resolve(
    String(options.journalFilePath || `${envelopeFilePath.replace(/\.json$/i, "")}.journal.ndjson`)
  );
  const initialEnvelope =
    validateRawEnvelope(
      readJsonIfExists(envelopeFilePath, buildEmptyEnvelope(contract, { backend_id: "raw_file" })),
      contract
    ).normalized;

  const baseProvider = createMemoryStorageProvider({
    contract,
    backendId: "raw_file",
    initialEnvelope,
    onMutation: async ({ envelope, new_entries }) => {
      writeTextFileRobust(envelopeFilePath, `${JSON.stringify(envelope, null, 2)}\n`, { atomic: true });
      appendNdjson(journalFilePath, new_entries);
    }
  });

  return Object.freeze({
    ...baseProvider,
    envelope_file_path: envelopeFilePath,
    journal_file_path: journalFilePath
  });
}

function loadSqliteModule() {
  // Lazy load so environments without node:sqlite can still parse the module.
  // eslint-disable-next-line global-require
  return require("node:sqlite");
}

function ensureSqliteSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS storage_meta (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS domain_state (
      domain_key TEXT PRIMARY KEY,
      updated_at TEXT NOT NULL,
      revision_id TEXT NOT NULL,
      data_json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS journal_entries (
      journal_id INTEGER PRIMARY KEY AUTOINCREMENT,
      revision_id TEXT NOT NULL,
      sequence INTEGER NOT NULL,
      domain_key TEXT NOT NULL,
      action TEXT NOT NULL,
      committed_at TEXT NOT NULL,
      previous_data_json TEXT,
      next_data_json TEXT,
      metadata_json TEXT NOT NULL
    );
  `);
}

function loadEnvelopeFromSqlite(db, contract) {
  ensureSqliteSchema(db);
  const empty = buildEmptyEnvelope(contract, { backend_id: "sqlite" });
  const metaRows = db.prepare("SELECT key, value_json FROM storage_meta").all();
  const meta = {};
  metaRows.forEach((row) => {
    try {
      meta[String(row.key || "")] = JSON.parse(String(row.value_json || "null"));
    } catch {
      meta[String(row.key || "")] = null;
    }
  });

  const domainRows = db
    .prepare("SELECT domain_key, updated_at, revision_id, data_json FROM domain_state ORDER BY domain_key ASC")
    .all();
  const journalRows = db
    .prepare(
      "SELECT revision_id, sequence, domain_key, action, committed_at, previous_data_json, next_data_json, metadata_json FROM journal_entries ORDER BY sequence ASC"
    )
    .all();

  const envelope = {
    ...empty,
    revision: isPlainObject(meta.revision) ? meta.revision : empty.revision,
    metadata: isPlainObject(meta.metadata) ? meta.metadata : empty.metadata,
    domains: {},
    journal: []
  };

  domainRows.forEach((row) => {
    envelope.domains[String(row.domain_key || "")] = {
      domain_key: String(row.domain_key || ""),
      updated_at: String(row.updated_at || nowIso()),
      revision_id: String(row.revision_id || ""),
      data: JSON.parse(String(row.data_json || "{}"))
    };
  });
  journalRows.forEach((row) => {
    envelope.journal.push({
      revision_id: String(row.revision_id || ""),
      sequence: Number(row.sequence || 0),
      domain_key: String(row.domain_key || ""),
      action: String(row.action || ""),
      committed_at: String(row.committed_at || nowIso()),
      previous_data: row.previous_data_json ? JSON.parse(String(row.previous_data_json)) : null,
      next_data: row.next_data_json ? JSON.parse(String(row.next_data_json)) : null,
      metadata: row.metadata_json ? JSON.parse(String(row.metadata_json)) : {}
    });
  });

  return validateRawEnvelope(envelope, contract).normalized;
}

function persistEnvelopeToSqlite(db, envelope) {
  ensureSqliteSchema(db);
  db.exec("BEGIN");
  try {
    db.exec("DELETE FROM storage_meta");
    db.exec("DELETE FROM domain_state");
    db.exec("DELETE FROM journal_entries");

    const insertMeta = db.prepare("INSERT INTO storage_meta (key, value_json) VALUES (?, ?)");
    insertMeta.run("revision", JSON.stringify(envelope.revision || {}));
    insertMeta.run("metadata", JSON.stringify(envelope.metadata || {}));

    const insertDomain = db.prepare(
      "INSERT INTO domain_state (domain_key, updated_at, revision_id, data_json) VALUES (?, ?, ?, ?)"
    );
    Object.keys(envelope.domains || {})
      .sort((left, right) => left.localeCompare(right))
      .forEach((domainKey) => {
        const row = envelope.domains[domainKey];
        insertDomain.run(
          String(row.domain_key || domainKey),
          String(row.updated_at || nowIso()),
          String(row.revision_id || ""),
          JSON.stringify(row.data === undefined ? {} : row.data)
        );
      });

    const insertJournal = db.prepare(
      "INSERT INTO journal_entries (revision_id, sequence, domain_key, action, committed_at, previous_data_json, next_data_json, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    (Array.isArray(envelope.journal) ? envelope.journal : []).forEach((row) => {
      insertJournal.run(
        String(row.revision_id || ""),
        Number(row.sequence || 0),
        String(row.domain_key || ""),
        String(row.action || ""),
        String(row.committed_at || nowIso()),
        row.previous_data === null ? null : JSON.stringify(row.previous_data),
        row.next_data === null ? null : JSON.stringify(row.next_data),
        JSON.stringify(isPlainObject(row.metadata) ? row.metadata : {})
      );
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function createSqliteStorageProvider(options = {}) {
  const contract = normalizeStorageContract(options.contract);
  const databaseFilePath = path.resolve(String(options.databaseFilePath || "aio_core_storage.sqlite"));
  ensureDirForFile(databaseFilePath);
  const { DatabaseSync } = loadSqliteModule();
  const db = new DatabaseSync(databaseFilePath);
  const initialEnvelope = loadEnvelopeFromSqlite(db, contract);

  const baseProvider = createMemoryStorageProvider({
    contract,
    backendId: "sqlite",
    initialEnvelope,
    onMutation: async ({ envelope }) => {
      persistEnvelopeToSqlite(db, envelope);
    }
  });

  async function close() {
    if (typeof db.close === "function") {
      db.close();
    }
  }

  return Object.freeze({
    ...baseProvider,
    database_file_path: databaseFilePath,
    close
  });
}

function createStorageProvider(options = {}) {
  const contract = normalizeStorageContract(options.contract);
  const backendId = String(options.backendId || contract.default_backend || "raw_file").trim().toLowerCase();
  if (backendId === "memory") {
    return createMemoryStorageProvider({
      contract,
      backendId
    });
  }
  if (backendId === "raw_file") {
    const provider = contract.providers.raw_file || {};
    return createRawFileStorageProvider({
      contract,
      backendId,
      envelopeFilePath: options.envelopeFilePath || provider.envelope_file_name || "aio_core_storage.raw.json",
      journalFilePath: options.journalFilePath || provider.journal_file_name || "aio_core_storage.journal.ndjson"
    });
  }
  if (backendId === "sqlite") {
    const provider = contract.providers.sqlite || {};
    return createSqliteStorageProvider({
      contract,
      backendId,
      databaseFilePath: options.databaseFilePath || provider.database_file_name || "aio_core_storage.sqlite"
    });
  }
  throw new Error(`unsupported storage backend: ${backendId}`);
}

module.exports = {
  buildEmptyEnvelope,
  createMemoryStorageProvider,
  createRawFileStorageProvider,
  createSqliteStorageProvider,
  createStorageProvider,
  normalizeStorageContract,
  validateRawEnvelope
};
