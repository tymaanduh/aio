"use strict";

const crypto = require("crypto");
const { migrateStateToV4 } = require("../app/modules/migration-utils.js");

const HISTORY_MAX = 40;
const DIAGNOSTICS_MAX_ERRORS = 400;
const DIAGNOSTICS_MAX_PERF = 1200;
const ENTRY_MODES = new Set(["definition", "slang", "code", "bytes"]);

function cleanText(value, maxLength = 10000) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function normalizeLabel(label) {
  return cleanText(label, 60);
}

function normalizeUsername(value) {
  return cleanText(value, 40);
}

function normalizePassword(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.slice(0, 120);
}

function normalizeEntryMode(value) {
  const mode = cleanText(value, 20).toLowerCase();
  if (!mode || !ENTRY_MODES.has(mode)) {
    return "definition";
  }
  return mode;
}

function normalizeEntryUsageCount(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return 0;
  }
  return Math.max(0, Math.min(1000000000, Math.floor(numberValue)));
}

function toTimestampMs(value) {
  const timestamp = Date.parse(cleanText(value, 80));
  if (!Number.isFinite(timestamp)) {
    return 0;
  }
  return timestamp;
}

function normalizeWordIdentityKey(value) {
  return cleanText(value, 120).toLowerCase();
}

function normalizeGraphCoordinate(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return min;
  }
  return Math.max(min, Math.min(max, numeric));
}

function normalizeUniverseBookmark(value, fallbackName = "View") {
  const source = value && typeof value === "object" ? value : {};
  const panX = Number(source.panX);
  const panY = Number(source.panY);
  const zoom = Number(source.zoom);
  return {
    id: cleanText(source.id, 120) || crypto.randomUUID(),
    name: cleanText(source.name, 60) || fallbackName,
    panX: Number.isFinite(panX) ? Math.max(-2, Math.min(2, panX)) : 0,
    panY: Number.isFinite(panY) ? Math.max(-2, Math.min(2, panY)) : 0,
    zoom: Number.isFinite(zoom) ? Math.max(0.2, Math.min(8, zoom)) : 1,
    createdAt: cleanText(source.createdAt, 80) || new Date().toISOString()
  };
}

function normalizeUniverseGraphNode(value, index) {
  const source = value && typeof value === "object" ? value : {};
  const x = Number(source.x);
  const y = Number(source.y);
  const degree = Number(source.degree);
  const componentSize = Number(source.componentSize);
  return {
    id: cleanText(source.id, 120) || `node-${index}`,
    entryId: cleanText(source.entryId, 120),
    word: cleanText(source.word, 120),
    labels: Array.isArray(source.labels)
      ? source.labels
          .map((label) => cleanText(label, 60))
          .filter(Boolean)
          .slice(0, 20)
      : [],
    partOfSpeech: cleanText(source.partOfSpeech, 40).toLowerCase(),
    mode: cleanText(source.mode, 20).toLowerCase() || "definition",
    degree: Number.isFinite(degree) ? Math.max(0, Math.min(100000, Math.floor(degree))) : 0,
    componentSize: Number.isFinite(componentSize) ? Math.max(1, Math.min(100000, Math.floor(componentSize))) : 1,
    componentId: cleanText(source.componentId, 40),
    x: Number.isFinite(x) ? Math.max(-4, Math.min(4, x)) : 0.5,
    y: Number.isFinite(y) ? Math.max(-4, Math.min(4, y)) : 0.5
  };
}

function normalizeUniverseGraphEdge(value, nodeCount) {
  const source = value && typeof value === "object" ? value : {};
  const a = Number(source.a);
  const b = Number(source.b);
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= nodeCount || b >= nodeCount || a === b) {
    return null;
  }
  const modes = Array.isArray(source.modes)
    ? source.modes
        .map((mode) => cleanText(mode, 20))
        .filter(Boolean)
        .slice(0, 8)
    : [];
  return {
    a: Math.min(a, b),
    b: Math.max(a, b),
    modes
  };
}

function createDefaultState() {
  return {
    version: 4,
    labels: ["Who", "What", "Where", "When", "Why", "How"],
    entries: [],
    sentenceGraph: createDefaultSentenceGraph(),
    history: [],
    graphLockEnabled: false,
    localAssistEnabled: true,
    diagnostics: createDefaultDiagnosticsState(),
    lastSavedAt: null
  };
}

function createDefaultSentenceGraph() {
  return {
    nodes: [],
    links: []
  };
}

function createDefaultAuthState() {
  return {
    version: 1,
    account: null,
    lastAuthAt: null
  };
}

function createDefaultDiagnosticsState() {
  return {
    version: 1,
    errors: [],
    perf: []
  };
}

function createDefaultUniverseCacheState() {
  return {
    version: 1,
    datasetSignature: "",
    modelKey: "",
    config: {},
    bookmarks: [],
    graph: {
      nodes: [],
      edges: [],
      meta: {}
    },
    updatedAt: null
  };
}

function normalizeUniverseCacheState(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  const graphSource = source.graph && typeof source.graph === "object" ? source.graph : {};
  const nodes = Array.isArray(graphSource.nodes)
    ? graphSource.nodes.map((node, index) => normalizeUniverseGraphNode(node, index)).slice(0, 12000)
    : [];
  const nodeCount = nodes.length;
  const edgeSet = new Set();
  const edges = [];
  (Array.isArray(graphSource.edges) ? graphSource.edges : []).forEach((edge) => {
    const normalized = normalizeUniverseGraphEdge(edge, nodeCount);
    if (!normalized) {
      return;
    }
    const key = normalized.a * Math.max(1, nodeCount) + normalized.b;
    if (edgeSet.has(key)) {
      return;
    }
    edgeSet.add(key);
    edges.push(normalized);
  });

  const metaSource = graphSource.meta && typeof graphSource.meta === "object" ? graphSource.meta : {};
  const nodeCountMeta = Number(metaSource.nodeCount);
  const edgeCountMeta = Number(metaSource.edgeCount);
  const componentCountMeta = Number(metaSource.components);
  const isolatedMeta = Number(metaSource.isolated);
  const largestComponentMeta = Number(metaSource.largestComponent);
  const edgeModeCountsSource =
    metaSource.edgeModeCounts && typeof metaSource.edgeModeCounts === "object" ? metaSource.edgeModeCounts : {};

  const defaultState = createDefaultUniverseCacheState();
  return {
    version: 1,
    datasetSignature: cleanText(source.datasetSignature, 200),
    modelKey: cleanText(source.modelKey, 200),
    config: source.config && typeof source.config === "object" ? source.config : {},
    bookmarks: (Array.isArray(source.bookmarks) ? source.bookmarks : [])
      .map((bookmark, index) => normalizeUniverseBookmark(bookmark, `View ${index + 1}`))
      .slice(0, 30),
    graph: {
      nodes,
      edges,
      meta: {
        nodeCount: Number.isFinite(nodeCountMeta) ? Math.max(0, Math.floor(nodeCountMeta)) : nodes.length,
        edgeCount: Number.isFinite(edgeCountMeta) ? Math.max(0, Math.floor(edgeCountMeta)) : edges.length,
        components: Number.isFinite(componentCountMeta) ? Math.max(0, Math.floor(componentCountMeta)) : 0,
        isolated: Number.isFinite(isolatedMeta) ? Math.max(0, Math.floor(isolatedMeta)) : 0,
        largestComponent: Number.isFinite(largestComponentMeta) ? Math.max(0, Math.floor(largestComponentMeta)) : 0,
        capped: Boolean(metaSource.capped),
        edgeModeCounts: {
          contains: Math.max(0, Math.floor(Number(edgeModeCountsSource.contains) || 0)),
          prefix: Math.max(0, Math.floor(Number(edgeModeCountsSource.prefix) || 0)),
          suffix: Math.max(0, Math.floor(Number(edgeModeCountsSource.suffix) || 0)),
          stem: Math.max(0, Math.floor(Number(edgeModeCountsSource.stem) || 0)),
          sameLabel: Math.max(0, Math.floor(Number(edgeModeCountsSource.sameLabel) || 0))
        }
      }
    },
    updatedAt: cleanText(source.updatedAt, 80) || defaultState.updatedAt
  };
}

function mergeEntriesByWordIdentity(entries) {
  const mergedEntries = [];
  const byWordIdentity = new Map();
  const idAliases = new Map();

  (Array.isArray(entries) ? entries : []).forEach((entry) => {
    const item = entry && typeof entry === "object" ? entry : null;
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
    const existingDefinition = cleanText(existing.definition, 30000);
    const incomingDefinition = cleanText(item.definition, 30000);

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
      existing.word = cleanText(item.word, 120) || existing.word;
      existing.mode = normalizeEntryMode(item.mode || existing.mode);
      existing.language = cleanText(item.language, 80) || existing.language;
      existing.updatedAt = cleanText(item.updatedAt, 80) || existing.updatedAt;
    } else if (!existing.language) {
      existing.language = cleanText(item.language, 80);
    }

    if (incomingCreatedMs && (!existingCreatedMs || incomingCreatedMs < existingCreatedMs)) {
      existing.createdAt = cleanText(item.createdAt, 80) || existing.createdAt;
    }
  });

  return {
    entries: mergedEntries,
    idAliases
  };
}

function resolveEntryIdAlias(entryId, idAliases, validEntryIds) {
  let current = cleanText(entryId, 120);
  if (!current) {
    return "";
  }
  const seen = new Set();
  while (idAliases instanceof Map && idAliases.has(current) && !seen.has(current)) {
    seen.add(current);
    current = cleanText(idAliases.get(current), 120);
    if (!current) {
      return "";
    }
  }
  return validEntryIds instanceof Set && validEntryIds.has(current) ? current : "";
}

function remapSentenceGraphEntryIds(graph, idAliases, validEntryIds) {
  const source = graph && typeof graph === "object" ? graph : createDefaultSentenceGraph();
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
  const source = rawGraph && typeof rawGraph === "object" ? rawGraph : createDefaultSentenceGraph();
  const nodes = [];
  const nodeIds = new Set();

  if (Array.isArray(source.nodes)) {
    source.nodes.forEach((node) => {
      const item = node && typeof node === "object" ? node : {};
      const word = cleanText(item.word, 120);
      if (!word) {
        return;
      }

      const id = cleanText(item.id, 120) || crypto.randomUUID();
      if (nodeIds.has(id)) {
        return;
      }
      nodeIds.add(id);

      nodes.push({
        id,
        entryId: cleanText(item.entryId, 120),
        word,
        locked: Boolean(item.locked),
        x: normalizeGraphCoordinate(item.x, 8, 2200 - 180 - 8),
        y: normalizeGraphCoordinate(item.y, 8, 1200 - 56 - 8)
      });
    });
  }

  const links = [];
  const linkKeys = new Set();
  if (Array.isArray(source.links)) {
    source.links.forEach((link) => {
      const item = link && typeof link === "object" ? link : {};
      const fromNodeId = cleanText(item.fromNodeId, 120);
      const toNodeId = cleanText(item.toNodeId, 120);
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
        id: cleanText(item.id, 120) || crypto.randomUUID(),
        fromNodeId,
        toNodeId
      });
    });
  }

  return { nodes, links };
}

function normalizeStateEntry(entry) {
  const source = entry && typeof entry === "object" ? entry : {};
  const word = cleanText(source.word, 120);
  const definition = cleanText(source.definition, 30000);
  const entryLabels = Array.isArray(source.labels)
    ? source.labels
        .map(normalizeLabel)
        .filter(Boolean)
        .filter((item, index, list) => list.indexOf(item) === index)
    : [];

  if (!word && !definition) {
    return null;
  }

  return {
    id: cleanText(source.id, 120) || crypto.randomUUID(),
    word,
    definition,
    labels: entryLabels,
    favorite: Boolean(source.favorite),
    archivedAt: cleanText(source.archivedAt, 80) || null,
    mode: normalizeEntryMode(source.mode),
    language: cleanText(source.language, 80),
    usageCount: normalizeEntryUsageCount(source.usageCount),
    createdAt: cleanText(source.createdAt, 80) || new Date().toISOString(),
    updatedAt: cleanText(source.updatedAt, 80) || new Date().toISOString()
  };
}

function normalizeHistoryCheckpoint(checkpoint) {
  const source = checkpoint && typeof checkpoint === "object" ? checkpoint : {};
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
    id: cleanText(source.id, 120) || crypto.randomUUID(),
    reason: cleanText(source.reason, 80) || "checkpoint",
    createdAt: cleanText(source.createdAt, 80) || new Date().toISOString(),
    labels: Array.isArray(source.labels)
      ? source.labels
          .map(normalizeLabel)
          .filter(Boolean)
          .filter((item, index, list) => list.indexOf(item) === index)
      : [],
    entries: mergedEntries.entries,
    sentenceGraph
  };
}

function normalizeState(rawState) {
  const fallback = createDefaultState();
  const migrated = migrateStateToV4(rawState);
  const state = migrated && typeof migrated === "object" ? migrated : fallback;

  const labels = Array.isArray(state.labels)
    ? state.labels
        .map(normalizeLabel)
        .filter(Boolean)
        .filter((item, index, list) => list.indexOf(item) === index)
    : fallback.labels;

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
    ? state.history.map(normalizeHistoryCheckpoint).slice(0, HISTORY_MAX)
    : fallback.history;
  const diagnostics = normalizeDiagnosticsState(state.diagnostics);

  return {
    version: 4,
    labels,
    entries,
    sentenceGraph,
    history,
    graphLockEnabled: Boolean(state.graphLockEnabled),
    localAssistEnabled: state.localAssistEnabled !== false,
    diagnostics,
    lastSavedAt: cleanText(state.lastSavedAt, 80) || null
  };
}

function normalizeDiagnosticsState(rawDiagnosticsState) {
  const source =
    rawDiagnosticsState && typeof rawDiagnosticsState === "object"
      ? rawDiagnosticsState
      : createDefaultDiagnosticsState();
  const errors = Array.isArray(source.errors)
    ? source.errors
        .map((item) => {
          const errorItem = item && typeof item === "object" ? item : {};
          const message = cleanText(errorItem.message, 500);
          if (!message) {
            return null;
          }
          return {
            at: cleanText(errorItem.at, 80) || new Date().toISOString(),
            code: cleanText(errorItem.code, 80) || "renderer_error",
            message,
            context: cleanText(errorItem.context || "", 400)
          };
        })
        .filter(Boolean)
        .slice(-DIAGNOSTICS_MAX_ERRORS)
    : [];
  const perf = Array.isArray(source.perf)
    ? source.perf
        .map((item) => {
          const perfItem = item && typeof item === "object" ? item : {};
          const key = cleanText(perfItem.key, 80);
          if (!key) {
            return null;
          }
          const ms = Number(perfItem.ms);
          return {
            at: cleanText(perfItem.at, 80) || new Date().toISOString(),
            key,
            ms: Number.isFinite(ms) ? Math.max(0, Math.round(ms * 1000) / 1000) : 0
          };
        })
        .filter(Boolean)
        .slice(-DIAGNOSTICS_MAX_PERF)
    : [];
  return {
    version: 1,
    errors,
    perf
  };
}

function normalizeAuthState(rawAuthState) {
  const fallback = createDefaultAuthState();
  const state = rawAuthState && typeof rawAuthState === "object" ? rawAuthState : fallback;
  const sourceAccount = state.account && typeof state.account === "object" ? state.account : null;
  const username = normalizeUsername(sourceAccount?.username || "");
  const salt = cleanText(sourceAccount?.salt || "", 200);
  const passwordHash = cleanText(sourceAccount?.passwordHash || "", 200);

  const account =
    username && salt && passwordHash
      ? {
          username,
          salt,
          passwordHash,
          createdAt: cleanText(sourceAccount?.createdAt, 80) || new Date().toISOString(),
          updatedAt: cleanText(sourceAccount?.updatedAt, 80) || new Date().toISOString()
        }
      : null;

  return {
    version: 1,
    account,
    lastAuthAt: cleanText(state.lastAuthAt, 80) || null
  };
}

module.exports = {
  cleanText,
  normalizeLabel,
  normalizeUsername,
  normalizePassword,
  normalizeEntryMode,
  normalizeEntryUsageCount,
  toTimestampMs,
  normalizeGraphCoordinate,
  createDefaultState,
  createDefaultSentenceGraph,
  createDefaultAuthState,
  createDefaultDiagnosticsState,
  createDefaultUniverseCacheState,
  normalizeUniverseCacheState,
  normalizeState,
  normalizeDiagnosticsState,
  normalizeAuthState,
  normalizeStateEntry,
  compactState
};

// compactState defined below to avoid hoisting issues
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
