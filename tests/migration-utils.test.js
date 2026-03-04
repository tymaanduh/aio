"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { migrateStateToV4 } = require("../brain/modules/migration-utils.js");

test("migration upgrades v1-like payload to v4", () => {
  const migrated = migrateStateToV4({
    version: 1,
    labels: ["Subject"],
    entries: [
      { term: "run", description: "to move quickly", tags: "verb, Jargon" },
      { word: "cache", definition: "stored data", favorite: true }
    ]
  });

  assert.equal(migrated.version, 4);
  assert.equal(migrated.entries.length, 2);
  assert.ok(migrated.labels.includes("verb"));
  assert.ok(migrated.labels.includes("Jargon"));
  assert.equal(migrated.entries[0].word, "run");
  assert.equal(migrated.entries[0].definition, "to move quickly");
});

test("migration maps archived/deleted legacy flags to archivedAt", () => {
  const migrated = migrateStateToV4({
    version: 2,
    entries: [
      { word: "old", definition: "legacy", deleted: true },
      { word: "hidden", definition: "legacy", archived: true }
    ]
  });

  assert.equal(migrated.version, 4);
  assert.equal(migrated.entries.length, 2);
  assert.ok(typeof migrated.entries[0].archivedAt === "string");
  assert.ok(typeof migrated.entries[1].archivedAt === "string");
});

test("migration keeps diagnostics defaults for v3 payloads missing diagnostics", () => {
  const migrated = migrateStateToV4({
    version: 3,
    labels: ["Topic"],
    entries: [{ word: "alpha", definition: "one" }]
  });

  assert.equal(migrated.version, 4);
  assert.deepEqual(migrated.diagnostics, { version: 1, errors: [], perf: [] });
  assert.equal(migrated.localAssistEnabled, true);
});
