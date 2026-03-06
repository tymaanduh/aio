"use strict";

const { buildPlatformRuntimeStatus } = require("../../brain/core/platform_runtime.js");

function resolveStorageRuntime(inputDeps = {}) {
  if (inputDeps.storage_runtime && typeof inputDeps.storage_runtime === "object") {
    return inputDeps.storage_runtime;
  }
  return require("../data/repository_storage_runtime.js");
}

function createPlatformRuntimeService(inputDeps = {}) {
  const buildStatus = typeof inputDeps.buildPlatformRuntimeStatus === "function"
    ? inputDeps.buildPlatformRuntimeStatus
    : buildPlatformRuntimeStatus;

  function getStorageRuntimeStatus() {
    const storageRuntime = resolveStorageRuntime(inputDeps);
    const platformStatus = buildStatus();
    return {
      ok: true,
      storage_runtime_selection: platformStatus.storage_runtime_selection,
      storage_defaults: platformStatus.storage_defaults,
      active_storage_backend: storageRuntime.describeActiveStorageBackend()
    };
  }

  return Object.freeze({
    get_platform_runtime_status() {
      const storageRuntime = resolveStorageRuntime(inputDeps);
      return {
        ok: true,
        ...buildStatus(),
        active_storage_backend: storageRuntime.describeActiveStorageBackend()
      };
    },
    get_storage_runtime_status: getStorageRuntimeStatus,
    async export_storage_envelope() {
      const storageRuntime = resolveStorageRuntime(inputDeps);
      return {
        ok: true,
        active_storage_backend: storageRuntime.describeActiveStorageBackend(),
        envelope: await storageRuntime.exportStorageRawEnvelope()
      };
    },
    async import_storage_envelope(payload) {
      const storageRuntime = resolveStorageRuntime(inputDeps);
      return {
        ok: true,
        active_storage_backend: storageRuntime.describeActiveStorageBackend(),
        envelope: await storageRuntime.importStorageRawEnvelope(payload, {
          source_id: "platform_runtime_service.import_storage_envelope"
        })
      };
    },
    async list_storage_journal(filter = {}) {
      const storageRuntime = resolveStorageRuntime(inputDeps);
      const entries = await storageRuntime.listStorageJournalEntries(filter);
      return {
        ok: true,
        active_storage_backend: storageRuntime.describeActiveStorageBackend(),
        count: entries.length,
        entries
      };
    },
    async rollback_storage_domain(payload = {}) {
      const storageRuntime = resolveStorageRuntime(inputDeps);
      const domainKey = String(payload.domain_key || "");
      const revisionId = String(payload.revision_id || "");
      const value = await storageRuntime.rollbackStorageDomain(domainKey, revisionId, {
        source_id: "platform_runtime_service.rollback_storage_domain"
      });
      return {
        ok: value !== null,
        active_storage_backend: storageRuntime.describeActiveStorageBackend(),
        domain_key: domainKey,
        revision_id: revisionId,
        value
      };
    },
    async validate_storage_raw_envelope(payload) {
      const storageRuntime = resolveStorageRuntime(inputDeps);
      return {
        ok: true,
        active_storage_backend: storageRuntime.describeActiveStorageBackend(),
        validation: await storageRuntime.validateStorageRawEnvelope(payload)
      };
    }
  });
}

module.exports = {
  createPlatformRuntimeService
};
