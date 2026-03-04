"use strict";

const crypto = require("crypto");
const { migrateStateToV4 } = require("../brain/modules/migration-utils.js");
const {
  NORMALIZE_RUNTIME,
  NORMALIZE_LIMITS,
  NORMALIZE_RANGES,
  NORMALIZE_PATTERNS,
  now_iso,
  to_source_object,
  cleanText,
  normalize_unique_labels,
  normalizeWordIdentityKey,
  normalizeGraphCoordinate,
  normalizeEntryMode,
  normalizeEntryUsageCount,
  toTimestampMs
} = require("./normalize_core.js");
const { NORMALIZE_STATE_DEFAULTS } = require("./normalize_specs.js");
const { createDefaultState, createDefaultSentenceGraph } = require("./normalize_defaults.js");
const { normalizeDiagnosticsState } = require("./normalize_diagnostics_domain.js");

function mergeEntriesByWordIdentity(entries) {
  const mergedEntries = [];
  const byWordIdentity = new Map();
  const idAliases = new Map();

  (Array.isArray(entries) ? entries : []).forEach((entry) => {
    const item = to_source_object(entry, null);
    if (!item) {
      return;
    }
    const key = normalizeWordIdentityKey(item.word);
    if (!key) {
      mergedEntries.push({
        ...item,
        labels: Array.isArray(item.labels) ? [...item.labels] : []
      });
      return;
    }
    const existing = byWordIdentity.get(key);
    if (!existing) {
      const cloned = {
        ...item,
        labels: Array.isArray(item.labels) ? [...item.labels] : []
      };
      byWordIdentity.set(key, cloned);
      mergedEntries.push(cloned);
      return;
    }

    idAliases.set(item.id, existing.id);

    const existingUpdatedMs = toTimestampMs(existing.updatedAt);
    const incomingUpdatedMs = toTimestampMs(item.updatedAt);
    const existingCreatedMs = toTimestampMs(existing.createdAt);
    const incomingCreatedMs = toTimestampMs(item.createdAt);
    const existingArchivedMs = toTimestampMs(existing.archivedAt);
    const incomingArchivedMs = toTimestampMs(item.archivedAt);
    const existingDefinition = cleanText(existing.definition, NORMALIZE_LIMITS.DEFINITION);
    const incomingDefinition = cleanText(item.definition, NORMALIZE_LIMITS.DEFINITION);

    existing.definition =
      incomingDefinition.length > existingDefinition.length ? incomingDefinition : existingDefinition;
    existing.labels = [
      ...new Set([...(Array.isArray(existing.labels) ? existing.labels : []), ...(item.labels || [])])
    ];
    existing.favorite = Boolean(existing.favorite || item.favorite);
    existing.usageCount = normalizeEntryUsageCount(Number(existing.usageCount || 0) + Number(item.usageCount || 0));
    existing.archivedAt =
      !existing.archivedAt || !item.archivedAt
        ? null
        : incomingArchivedMs > existingArchivedMs
          ? item.archivedAt
          : existing.archivedAt;

    if (incomingUpdatedMs > existingUpdatedMs) {
      existing.word = cleanText(item.word, NORMALIZE_LIMITS.WORD_IDENTITY) || existing.word;
      existing.mode = normalizeEntryMode(item.mode || existing.mode);
      existing.language = cleanText(item.language, NORMALIZE_LIMITS.LANGUAGE) || existing.language;
      existing.updatedAt = cleanText(item.updatedAt, NORMALIZE_LIMITS.TIMESTAMP) || existing.updatedAt;
    } else if (!existing.language) {
      existing.language = cleanText(item.language, NORMALIZE_LIMITS.LANGUAGE);
    }

    if (incomingCreatedMs && (!existingCreatedMs || incomingCreatedMs < existingCreatedMs)) {
      existing.createdAt = cleanText(item.createdAt, NORMALIZE_LIMITS.TIMESTAMP) || existing.createdAt;
    }
  });

  return {
    entries: mergedEntries,
    idAliases
  };
}

function resolveEntryIdAlias(entryId, idAliases, validEntryIds) {
  let current = cleanText(entryId, NORMALIZE_LIMITS.WORD_IDENTITY);
  if (!current) {
    return "";
  }
  const seen = new Set();
  while (idAliases instanceof Map && idAliases.has(current) && !seen.has(current)) {
    seen.add(current);
    current = cleanText(idAliases.get(current), NORMALIZE_LIMITS.WORD_IDENTITY);
    if (!current) {
      return "";
    }
  }
  return validEntryIds instanceof Set && validEntryIds.has(current) ? current : "";
}

function remapSentenceGraphEntryIds(graph, idAliases, validEntryIds) {
  const source = to_source_object(graph, createDefaultSentenceGraph());
  return {
    nodes: Array.isArray(source.nodes)
      ? source.nodes.map((node) => ({
          ...node,
          entryId: resolveEntryIdAlias(node.entryId, idAliases, validEntryIds)
        }))
      : [],
    links: Array.isArray(source.links) ? source.links.map((link) => ({ ...link })) : []
  };
}

function normalizeSentenceGraph(rawGraph) {
  const source = to_source_object(rawGraph, createDefaultSentenceGraph());
  const nodes = [];
  const nodeIds = new Set();

  if (Array.isArray(source.nodes)) {
    source.nodes.forEach((node) => {
      const item = to_source_object(node);
      const word = cleanText(item.word, NORMALIZE_LIMITS.WORD_IDENTITY);
      if (!word) {
        return;
      }

      const id = cleanText(item.id, NORMALIZE_LIMITS.WORD_IDENTITY) || crypto.randomUUID();
      if (nodeIds.has(id)) {
        return;
      }
      nodeIds.add(id);

      nodes.push({
        id,
        entryId: cleanText(item.entryId, NORMALIZE_LIMITS.WORD_IDENTITY),
        word,
        locked: Boolean(item.locked),
        x: normalizeGraphCoordinate(item.x, NORMALIZE_RANGES.GRAPH_COORD.X_MIN, NORMALIZE_RANGES.GRAPH_COORD.X_MAX),
        y: normalizeGraphCoordinate(item.y, NORMALIZE_RANGES.GRAPH_COORD.Y_MIN, NORMALIZE_RANGES.GRAPH_COORD.Y_MAX)
      });
    });
  }

  const links = [];
  const linkKeys = new Set();
  if (Array.isArray(source.links)) {
    source.links.forEach((link) => {
      const item = to_source_object(link);
      const fromNodeId = cleanText(item.fromNodeId, NORMALIZE_LIMITS.WORD_IDENTITY);
      const toNodeId = cleanText(item.toNodeId, NORMALIZE_LIMITS.WORD_IDENTITY);
      if (!fromNodeId || !toNodeId || fromNodeId === toNodeId) {
        return;
      }
      if (!nodeIds.has(fromNodeId) || !nodeIds.has(toNodeId)) {
        return;
      }

      const key = `${fromNodeId}->${toNodeId}`;
      if (linkKeys.has(key)) {
        return;
      }
      linkKeys.add(key);

      links.push({
        id: cleanText(item.id, NORMALIZE_LIMITS.WORD_IDENTITY) || crypto.randomUUID(),
        fromNodeId,
        toNodeId
      });
    });
  }

  return { nodes, links };
}

function normalizeStateEntry(entry) {
  const source = to_source_object(entry);
  const word = cleanText(source.word, NORMALIZE_LIMITS.WORD_IDENTITY);
  const definition = cleanText(source.definition, NORMALIZE_LIMITS.DEFINITION);
  const entryLabels = normalize_unique_labels(source.labels);

  if (!word && !definition) {
    return null;
  }

  return {
    id: cleanText(source.id, NORMALIZE_LIMITS.WORD_IDENTITY) || crypto.randomUUID(),
    word,
    definition,
    labels: entryLabels,
    favorite: Boolean(source.favorite),
    archivedAt: cleanText(source.archivedAt, NORMALIZE_LIMITS.TIMESTAMP) || null,
    mode: normalizeEntryMode(source.mode),
    language: cleanText(source.language, NORMALIZE_LIMITS.LANGUAGE),
    usageCount: normalizeEntryUsageCount(source.usageCount),
    createdAt: cleanText(source.createdAt, NORMALIZE_LIMITS.TIMESTAMP) || now_iso(),
    updatedAt: cleanText(source.updatedAt, NORMALIZE_LIMITS.TIMESTAMP) || now_iso()
  };
}

function normalizeHistoryCheckpoint(checkpoint) {
  const source = to_source_object(checkpoint);
  const normalizedEntries = (Array.isArray(source.entries) ? source.entries : [])
    .map(normalizeStateEntry)
    .filter(Boolean);
  const mergedEntries = mergeEntriesByWordIdentity(normalizedEntries);
  const validEntryIds = new Set(mergedEntries.entries.map((entry) => entry.id));
  const sentenceGraph = remapSentenceGraphEntryIds(
    normalizeSentenceGraph(source.sentenceGraph),
    mergedEntries.idAliases,
    validEntryIds
  );
  return {
    id: cleanText(source.id, NORMALIZE_LIMITS.WORD_IDENTITY) || crypto.randomUUID(),
    reason: cleanText(source.reason, NORMALIZE_LIMITS.CHECKPOINT_REASON) || NORMALIZE_PATTERNS.DEFAULT_CHECKPOINT_REASON,
    createdAt: cleanText(source.createdAt, NORMALIZE_LIMITS.TIMESTAMP) || now_iso(),
    labels: normalize_unique_labels(source.labels),
    entries: mergedEntries.entries,
    sentenceGraph
  };
}

function normalizeState(rawState) {
  const fallback = createDefaultState();
  const migrated = migrateStateToV4(rawState);
  const state = to_source_object(migrated, fallback);

  const labels = normalize_unique_labels(Array.isArray(state.labels) ? state.labels : fallback.labels);

  const rawEntries = Array.isArray(state.entries)
    ? state.entries.map(normalizeStateEntry).filter(Boolean)
    : fallback.entries;
  const mergedEntries = mergeEntriesByWordIdentity(rawEntries);
  const entries = mergedEntries.entries;
  const entryIds = new Set(entries.map((entry) => entry.id));

  for (const entry of entries) {
    for (const label of entry.labels) {
      if (!labels.includes(label)) {
        labels.push(label);
      }
    }
  }

  if (labels.length === 0) {
    labels.push(...fallback.labels);
  }

  labels.sort((a, b) => a.localeCompare(b));
  const sentenceGraph = remapSentenceGraphEntryIds(
    normalizeSentenceGraph(state.sentenceGraph),
    mergedEntries.idAliases,
    entryIds
  );
  const history = Array.isArray(state.history)
    ? state.history.map(normalizeHistoryCheckpoint).slice(0, NORMALIZE_RUNTIME.HISTORY_MAX)
    : fallback.history;
  const diagnostics = normalizeDiagnosticsState(state.diagnostics);

  return {
    version: NORMALIZE_STATE_DEFAULTS.VERSION,
    labels,
    entries,
    sentenceGraph,
    history,
    graphLockEnabled: Boolean(state.graphLockEnabled),
    localAssistEnabled: state.localAssistEnabled !== false,
    diagnostics,
    lastSavedAt: cleanText(state.lastSavedAt, NORMALIZE_LIMITS.TIMESTAMP) || null
  };
}

function compactState(payload) {
  const normalized = normalizeState(payload);
  const existingLabels = new Set(normalized.labels);
  normalized.entries = normalized.entries.map((entry) => ({
    ...entry,
    labels: entry.labels.filter((label) => existingLabels.has(label))
  }));
  const entryIds = new Set(normalized.entries.map((entry) => entry.id));
  normalized.sentenceGraph.nodes = normalized.sentenceGraph.nodes.map((node) => ({
    ...node,
    entryId: entryIds.has(node.entryId) ? node.entryId : ""
  }));
  return normalized;
}

module.exports = {
  mergeEntriesByWordIdentity,
  resolveEntryIdAlias,
  remapSentenceGraphEntryIds,
  normalizeSentenceGraph,
  normalizeStateEntry,
  normalizeHistoryCheckpoint,
  normalizeState,
  compactState
};
