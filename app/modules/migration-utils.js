"use strict";

function trimText(value, maxLength = 1000) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function normalizeLabel(label) {
  return trimText(label, 60);
}

function normalizeLabelList(labelsSource) {
  if (Array.isArray(labelsSource)) {
    return labelsSource
      .map(normalizeLabel)
      .filter(Boolean)
      .filter((label, index, list) => list.indexOf(label) === index);
  }
  if (typeof labelsSource === "string") {
    return labelsSource
      .split(",")
      .map(normalizeLabel)
      .filter(Boolean)
      .filter((label, index, list) => list.indexOf(label) === index);
  }
  return [];
}

function normalizeLegacyEntry(entry) {
  const source = entry && typeof entry === "object" ? entry : {};
  const word = trimText(source.word || source.term || source.title, 120);
  const definition = trimText(source.definition || source.description || source.meaning, 30000);
  if (!word && !definition) {
    return null;
  }

  const archivedAt =
    trimText(source.archivedAt, 80) ||
    (source.archived === true || source.deleted === true ? new Date().toISOString() : null);

  return {
    id: trimText(source.id, 120),
    word,
    definition,
    labels: normalizeLabelList(source.labels || source.tags || source.categories),
    favorite: Boolean(source.favorite || source.starred),
    archivedAt,
    mode: trimText(source.mode, 20) || "definition",
    language: trimText(source.language, 80),
    usageCount: Math.max(0, Math.floor(Number(source.usageCount) || 0)),
    createdAt: trimText(source.createdAt, 80) || new Date().toISOString(),
    updatedAt: trimText(source.updatedAt, 80) || new Date().toISOString()
  };
}

function migrateStateToV4(rawState) {
  const source = rawState && typeof rawState === "object" ? rawState : {};
  const legacyVersion = Number(source.version) || 0;

  const migratedEntries = (Array.isArray(source.entries) ? source.entries : [])
    .map((entry) => normalizeLegacyEntry(entry))
    .filter(Boolean);

  const labelsFromState = normalizeLabelList(source.labels);
  const labelsFromEntries = migratedEntries.flatMap((entry) => entry.labels);
  const labels = [...new Set([...labelsFromState, ...labelsFromEntries])].sort((a, b) => a.localeCompare(b));

  const sentenceGraph =
    source.sentenceGraph && typeof source.sentenceGraph === "object" ? source.sentenceGraph : { nodes: [], links: [] };
  const history = Array.isArray(source.history) ? source.history : [];

  const migrated = {
    version: 4,
    labels,
    entries: migratedEntries,
    sentenceGraph,
    history,
    graphLockEnabled: Boolean(source.graphLockEnabled),
    localAssistEnabled: source.localAssistEnabled !== false,
    diagnostics:
      source.diagnostics && typeof source.diagnostics === "object"
        ? source.diagnostics
        : { version: 1, errors: [], perf: [] },
    lastSavedAt: trimText(source.lastSavedAt, 80) || null
  };

  if (legacyVersion >= 4) {
    return migrated;
  }

  return migrated;
}

module.exports = {
  migrateStateToV4
};
