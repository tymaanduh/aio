"use strict";

const crypto = require("crypto");
const {
  NORMALIZE_LIMITS,
  NORMALIZE_RANGES,
  NORMALIZE_PATTERNS,
  NORMALIZE_UNIVERSE_DEFAULTS,
  now_iso,
  clamp_number,
  to_source_object,
  cleanText,
  to_non_negative_int,
  build_edge_mode_counts
} = require("./normalize_core.js");
const { createDefaultUniverseCacheState } = require("./normalize_defaults.js");

function normalizeUniverseBookmark(value, fallbackName = NORMALIZE_PATTERNS.DEFAULT_BOOKMARK_NAME) {
  const source = to_source_object(value);
  return {
    id: cleanText(source.id, NORMALIZE_LIMITS.WORD_IDENTITY) || crypto.randomUUID(),
    name: cleanText(source.name, NORMALIZE_LIMITS.BOOKMARK_NAME) || fallbackName,
    panX: clamp_number(source.panX, NORMALIZE_RANGES.BOOKMARK_PAN.MIN, NORMALIZE_RANGES.BOOKMARK_PAN.MAX, 0),
    panY: clamp_number(source.panY, NORMALIZE_RANGES.BOOKMARK_PAN.MIN, NORMALIZE_RANGES.BOOKMARK_PAN.MAX, 0),
    zoom: clamp_number(source.zoom, NORMALIZE_RANGES.BOOKMARK_ZOOM.MIN, NORMALIZE_RANGES.BOOKMARK_ZOOM.MAX, 1),
    createdAt: cleanText(source.createdAt, NORMALIZE_LIMITS.TIMESTAMP) || now_iso()
  };
}

function normalizeUniverseGraphNode(value, index) {
  const source = to_source_object(value);
  const x = Number(source.x);
  const y = Number(source.y);
  const degree = Number(source.degree);
  const componentSize = Number(source.componentSize);
  return {
    id: cleanText(source.id, NORMALIZE_LIMITS.WORD_IDENTITY) || `node-${index}`,
    entryId: cleanText(source.entryId, NORMALIZE_LIMITS.WORD_IDENTITY),
    word: cleanText(source.word, NORMALIZE_LIMITS.WORD_IDENTITY),
    labels: Array.isArray(source.labels)
      ? source.labels
          .map((label) => cleanText(label, NORMALIZE_LIMITS.LABEL))
          .filter(Boolean)
          .slice(0, NORMALIZE_LIMITS.LABELS_PER_NODE_MAX)
      : [],
    partOfSpeech: cleanText(source.partOfSpeech, NORMALIZE_LIMITS.PART_OF_SPEECH).toLowerCase(),
    mode: cleanText(source.mode, NORMALIZE_LIMITS.MODE).toLowerCase() || NORMALIZE_PATTERNS.DEFAULT_ENTRY_MODE,
    degree: Number.isFinite(degree)
      ? Math.max(NORMALIZE_RANGES.UNIVERSE_NODE_DEGREE.MIN, Math.min(NORMALIZE_RANGES.UNIVERSE_NODE_DEGREE.MAX, Math.floor(degree)))
      : NORMALIZE_RANGES.UNIVERSE_NODE_DEGREE.MIN,
    componentSize: Number.isFinite(componentSize)
      ? Math.max(
          NORMALIZE_RANGES.UNIVERSE_NODE_COMPONENT_SIZE.MIN,
          Math.min(NORMALIZE_RANGES.UNIVERSE_NODE_COMPONENT_SIZE.MAX, Math.floor(componentSize))
        )
      : NORMALIZE_RANGES.UNIVERSE_NODE_COMPONENT_SIZE.MIN,
    componentId: cleanText(source.componentId, NORMALIZE_LIMITS.COMPONENT_ID),
    x: clamp_number(x, NORMALIZE_RANGES.UNIVERSE_NODE_COORD.MIN, NORMALIZE_RANGES.UNIVERSE_NODE_COORD.MAX, 0.5),
    y: clamp_number(y, NORMALIZE_RANGES.UNIVERSE_NODE_COORD.MIN, NORMALIZE_RANGES.UNIVERSE_NODE_COORD.MAX, 0.5)
  };
}

function normalizeUniverseGraphEdge(value, nodeCount) {
  const source = to_source_object(value);
  const a = Number(source.a);
  const b = Number(source.b);
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= nodeCount || b >= nodeCount || a === b) {
    return null;
  }
  const modes = Array.isArray(source.modes)
    ? source.modes
        .map((mode) => cleanText(mode, NORMALIZE_LIMITS.MODE))
        .filter(Boolean)
        .slice(0, NORMALIZE_LIMITS.NODE_MODES_MAX)
    : [];
  return {
    a: Math.min(a, b),
    b: Math.max(a, b),
    modes
  };
}

function normalizeUniverseCacheState(payload) {
  const source = to_source_object(payload);
  const graphSource = to_source_object(source.graph);
  const nodes = Array.isArray(graphSource.nodes)
    ? graphSource.nodes
        .map((node, index) => normalizeUniverseGraphNode(node, index))
        .slice(0, NORMALIZE_LIMITS.UNIVERSE_GRAPH_NODES_MAX)
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

  const metaSource = to_source_object(graphSource.meta);
  const nodeCountMeta = Number(metaSource.nodeCount);
  const edgeCountMeta = Number(metaSource.edgeCount);
  const componentCountMeta = Number(metaSource.components);
  const isolatedMeta = Number(metaSource.isolated);
  const largestComponentMeta = Number(metaSource.largestComponent);
  const edgeModeCountsSource = to_source_object(metaSource.edgeModeCounts);

  const defaultState = createDefaultUniverseCacheState();
  return {
    version: NORMALIZE_UNIVERSE_DEFAULTS.VERSION,
    datasetSignature: cleanText(source.datasetSignature, NORMALIZE_LIMITS.UNIVERSE_KEY),
    modelKey: cleanText(source.modelKey, NORMALIZE_LIMITS.UNIVERSE_KEY),
    config: to_source_object(source.config),
    bookmarks: (Array.isArray(source.bookmarks) ? source.bookmarks : [])
      .map((bookmark, index) => normalizeUniverseBookmark(bookmark, `View ${index + 1}`))
      .slice(0, NORMALIZE_LIMITS.BOOKMARKS_MAX),
    graph: {
      nodes,
      edges,
      meta: {
        nodeCount: to_non_negative_int(nodeCountMeta, nodes.length),
        edgeCount: to_non_negative_int(edgeCountMeta, edges.length),
        components: to_non_negative_int(componentCountMeta, 0),
        isolated: to_non_negative_int(isolatedMeta, 0),
        largestComponent: to_non_negative_int(largestComponentMeta, 0),
        capped: Boolean(metaSource.capped),
        edgeModeCounts: build_edge_mode_counts(edgeModeCountsSource)
      }
    },
    updatedAt: cleanText(source.updatedAt, NORMALIZE_LIMITS.TIMESTAMP) || defaultState.updatedAt
  };
}

module.exports = {
  normalizeUniverseBookmark,
  normalizeUniverseGraphNode,
  normalizeUniverseGraphEdge,
  normalizeUniverseCacheState
};
