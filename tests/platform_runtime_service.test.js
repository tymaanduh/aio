"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { createPlatformRuntimeService } = require("../main/services/platform_runtime_service.js");

function createStubService() {
  const storageRuntime = {
    describeActiveStorageBackend: () => ({
      backend_id: "sqlite",
      using_neutral_core_storage: true,
      mirror_legacy_files: true
    }),
    exportStorageRawEnvelope: async () => ({
      contract_id: "aio_storage_provider_contract",
      domains: {
        app_state: {
          domain_key: "app_state",
          data: { entries: [{ id: "x1" }] }
        }
      }
    }),
    importStorageRawEnvelope: async (payload) => ({
      ...payload,
      metadata: {
        imported: true
      }
    }),
    listStorageJournalEntries: async () => [{ revision_id: "rev-1", domain_key: "app_state" }],
    rollbackStorageDomain: async () => ({ entries: [] }),
    validateStorageRawEnvelope: async () => ({
      ok: true,
      issues: [],
      normalized: {
        contract_id: "aio_storage_provider_contract"
      }
    })
  };

  return createPlatformRuntimeService({
    buildPlatformRuntimeStatus: () => ({
      manifest_ids: {
        runtime: "aio_runtime_implementation_manifest",
        storage: "aio_storage_backend_manifest",
        shell: "aio_shell_adapter_manifest"
      },
      runtime_selection_snapshot: [
        {
          subsystem_id: "math_core",
          selected_runtime: "javascript"
        }
      ],
      storage_runtime_selection: {
        subsystem_id: "storage_core",
        selected_runtime: "javascript"
      },
      shell_selection: {
        selected_shell: "electron"
      },
      storage_defaults: {
        default_backend: "raw_file",
        operations: ["export_raw_envelope", "rollback_domain"]
      },
      shell_defaults: {
        commands: ["platform.get_runtime_status", "storage.export_raw_envelope"]
      }
    }),
    storage_runtime: storageRuntime
  });
}

test("platform runtime service reports manifest-backed runtime and storage status", () => {
  const service = createStubService();
  const runtimeStatus = service.get_platform_runtime_status();
  const storageStatus = service.get_storage_runtime_status();

  assert.equal(runtimeStatus.ok, true);
  assert.equal(runtimeStatus.shell_selection.selected_shell, "electron");
  assert.equal(runtimeStatus.active_storage_backend.backend_id, "sqlite");
  assert.equal(storageStatus.storage_defaults.default_backend, "raw_file");
});

test("platform runtime service exposes storage admin operations", async () => {
  const service = createStubService();

  const exported = await service.export_storage_envelope();
  const imported = await service.import_storage_envelope({
    contract_id: "aio_storage_provider_contract",
    domains: {}
  });
  const journal = await service.list_storage_journal({});
  const rollback = await service.rollback_storage_domain({
    domain_key: "app_state",
    revision_id: "rev-1"
  });
  const validation = await service.validate_storage_raw_envelope({
    contract_id: "aio_storage_provider_contract"
  });

  assert.equal(exported.ok, true);
  assert.equal(exported.envelope.domains.app_state.data.entries[0].id, "x1");
  assert.equal(imported.envelope.metadata.imported, true);
  assert.equal(journal.count, 1);
  assert.equal(rollback.ok, true);
  assert.equal(validation.validation.ok, true);
});
