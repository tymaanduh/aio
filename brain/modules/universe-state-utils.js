(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Universe_State_Utils = __MODULE_API;
  root.DictionaryUniverseStateUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function cleanText(value, maxLength = 1000) {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim().slice(0, maxLength);
  }

  function clampNumber(value, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return min;
    }
    return Math.max(min, Math.min(max, numeric));
  }

  function unique(values) {
    const seen = new Set();
    const result = [];
    (Array.isArray(values) ? values : []).forEach((item) => {
      if (seen.has(item)) {
        return;
      }
      seen.add(item);
      result.push(item);
    });
    return result;
  }

  function normalizeWordLower(word, maxLength = 120) {
    return cleanText(word, maxLength).toLowerCase();
  }

  function normalizeLabelArray(labels, maxLength = 80) {
    return unique(
      (Array.isArray(labels) ? labels : [])
        .map((label) => cleanText(label, maxLength))
        .filter(Boolean)
    );
  }

  function normalizeEntryMode(value) {
    const mode = cleanText(value, 20).toLowerCase();
    if (mode === "slang" || mode === "code" || mode === "bytes") {
      return mode;
    }
    return "definition";
  }

  function inferQuestionBucketFromLabels(labels, maxLabelLength = 80) {
    const source = Array.isArray(labels) ? labels : [];
    for (let index = 0; index < source.length; index += 1) {
      const label = cleanText(source[index], maxLabelLength).toLowerCase();
      if (!label) {
        continue;
      }
      if (label === "who") {
        return "who";
      }
      if (label === "where") {
        return "where";
      }
      if (label === "when") {
        return "when";
      }
      if (label === "why") {
        return "why";
      }
      if (label === "how") {
        return "how";
      }
    }
    return "what";
  }

  function createFallbackId(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 12)}`;
  }

  function createUniverseStateTools(options = {}) {
    const maxWord = Math.max(1, Math.floor(Number(options.maxWord) || 120));
    const maxLabel = Math.max(1, Math.floor(Number(options.maxLabel) || 80));
    const maxDate = Math.max(8, Math.floor(Number(options.maxDate) || 80));

    const minWordDefault = Math.max(1, Math.floor(Number(options.minWordLength) || 2));
    const maxWordDefault = Math.max(minWordDefault, Math.floor(Number(options.maxWordLength) || 24));
    const maxNodesDefault = Math.max(1, Math.floor(Number(options.maxNodes) || 1800));
    const maxEdgesDefault = Math.max(1, Math.floor(Number(options.maxEdges) || 22000));

    const zoomMin = Number.isFinite(Number(options.zoomMin)) ? Number(options.zoomMin) : 0.45;
    const zoomMax = Number.isFinite(Number(options.zoomMax)) ? Number(options.zoomMax) : 4.5;

    const colorModeQuestion = cleanText(options.colorModeQuestion, 20) || "question";
    const colorModePos = cleanText(options.colorModePos, 20) || "pos";
    const colorModeMode = cleanText(options.colorModeMode, 20) || "mode";
    const viewModeCanvas = cleanText(options.viewModeCanvas, 20) || "canvas";
    const viewModeWebgl = cleanText(options.viewModeWebgl, 20) || "webgl";

    const bookmarkLimit = Math.max(1, Math.floor(Number(options.bookmarkLimit) || 20));
    const customSetLimit = Math.max(1, Math.floor(Number(options.customSetLimit) || 120));
    const customSetItemLimit = Math.max(1, Math.floor(Number(options.customSetItemLimit) || 5000));

    const nowIso = typeof options.nowIso === "function" ? options.nowIso : () => new Date().toISOString();
    const createUuid =
      typeof options.createUuid === "function"
        ? options.createUuid
        : () => {
            if (typeof crypto !== "undefined" && crypto && typeof crypto.randomUUID === "function") {
              return crypto.randomUUID();
            }
            return createFallbackId("uuid");
          };

    function createEmptyUniverseGraph() {
      return {
        nodes: [],
        edges: [],
        meta: {
          nodeCount: 0,
          edgeCount: 0,
          components: 0,
          isolated: 0,
          largestComponent: 0,
          capped: false,
          edgeModeCounts: {
            contains: 0,
            prefix: 0,
            suffix: 0,
            stem: 0,
            sameLabel: 0
          }
        }
      };
    }

    function createDefaultUniverseConfig() {
      return {
        minWordLength: minWordDefault,
        maxWordLength: maxWordDefault,
        maxNodes: maxNodesDefault,
        maxEdges: maxEdgesDefault,
        favoritesOnly: false,
        labelFilter: "",
        colorMode: colorModeQuestion,
        renderMode: viewModeWebgl,
        edgeModes: {
          contains: true,
          prefix: false,
          suffix: false,
          stem: false,
          sameLabel: false
        },
        bookmarks: []
      };
    }

    function normalizeUniverseBookmark(value, index = 0) {
      const source = value && typeof value === "object" ? value : {};
      const panX = Number(source.panX);
      const panY = Number(source.panY);
      const zoom = Number(source.zoom);
      return {
        id: cleanText(source.id, 120) || createUuid(),
        name: cleanText(source.name, 60) || `View ${index + 1}`,
        panX: Number.isFinite(panX) ? clampNumber(panX, -1.6, 1.6) : 0,
        panY: Number.isFinite(panY) ? clampNumber(panY, -1.6, 1.6) : 0,
        zoom: Number.isFinite(zoom) ? clampNumber(zoom, zoomMin, zoomMax) : 1,
        createdAt: cleanText(source.createdAt, maxDate) || nowIso()
      };
    }

    function normalizeUniverseCustomSearchSet(value, index = 0) {
      const source = value && typeof value === "object" ? value : {};
      const entryIds = unique(
        (Array.isArray(source.entryIds) ? source.entryIds : [])
          .map((entryId) => cleanText(entryId, maxWord))
          .filter(Boolean)
      ).slice(0, customSetItemLimit);
      const words = unique(
        (Array.isArray(source.words) ? source.words : [])
          .map((word) => normalizeWordLower(cleanText(word, maxWord), maxWord))
          .filter(Boolean)
      ).slice(0, customSetItemLimit);
      return {
        id: cleanText(source.id, maxWord) || createUuid(),
        name: cleanText(source.name, 80) || `Set ${index + 1}`,
        entryIds,
        words,
        createdAt: cleanText(source.createdAt, maxDate) || nowIso()
      };
    }

    function normalizeUniverseCustomSearchSets(rawSets) {
      return (Array.isArray(rawSets) ? rawSets : [])
        .map((item, index) => normalizeUniverseCustomSearchSet(item, index))
        .slice(0, customSetLimit);
    }

    function normalizeConfig(rawConfig) {
      const defaults = createDefaultUniverseConfig();
      const source = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
      const minWordLength = clampNumber(Math.floor(Number(source.minWordLength) || defaults.minWordLength), 2, 12);
      const maxNodes = clampNumber(Math.floor(Number(source.maxNodes) || defaults.maxNodes), 50, 5000);
      const maxEdges = clampNumber(Math.floor(Number(source.maxEdges) || defaults.maxEdges), 100, 50000);
      const maxWordLength = clampNumber(Math.floor(Number(source.maxWordLength) || defaults.maxWordLength), 8, 48);
      const colorMode = cleanText(source.colorMode, 20);
      const renderMode = cleanText(source.renderMode, 20);
      const edgeModesSource = source.edgeModes && typeof source.edgeModes === "object" ? source.edgeModes : {};
      const edgeModes = {
        contains: edgeModesSource.contains !== false,
        prefix: edgeModesSource.prefix === true,
        suffix: edgeModesSource.suffix === true,
        stem: edgeModesSource.stem === true,
        sameLabel: edgeModesSource.sameLabel === true
      };
      if (!edgeModes.contains && !edgeModes.prefix && !edgeModes.suffix && !edgeModes.stem && !edgeModes.sameLabel) {
        edgeModes.contains = true;
      }
      return {
        minWordLength,
        maxWordLength,
        maxNodes,
        maxEdges,
        favoritesOnly: Boolean(source.favoritesOnly),
        labelFilter: cleanText(source.labelFilter, maxLabel).toLowerCase(),
        colorMode: colorMode === colorModePos || colorMode === colorModeMode ? colorMode : colorModeQuestion,
        renderMode: renderMode === viewModeCanvas ? viewModeCanvas : viewModeWebgl,
        edgeModes,
        bookmarks: (Array.isArray(source.bookmarks) ? source.bookmarks : [])
          .map((bookmark, index) => normalizeUniverseBookmark(bookmark, index))
          .slice(0, bookmarkLimit)
      };
    }

    function getUniverseDatasetSignature(entries) {
      const active = (Array.isArray(entries) ? entries : [])
        .filter((entry) => entry && typeof entry === "object" && !entry.archivedAt)
        .map((entry) => {
          const labels = normalizeLabelArray(entry.labels, maxLabel).sort((a, b) => a.localeCompare(b));
          return [
            cleanText(entry.id, maxWord),
            normalizeWordLower(entry.word, maxWord),
            normalizeEntryMode(entry.mode),
            String(Math.max(0, Math.floor(Number(entry.usageCount) || 0))),
            entry.favorite ? "1" : "0",
            labels.join("|")
          ].join(":");
        })
        .sort((left, right) => left.localeCompare(right));
      let hashA = 2166136261;
      let hashB = 2166136261;
      for (let itemIndex = 0; itemIndex < active.length; itemIndex += 1) {
        const token = active[itemIndex];
        for (let charIndex = 0; charIndex < token.length; charIndex += 1) {
          const code = token.charCodeAt(charIndex);
          hashA ^= code;
          hashA = Math.imul(hashA, 16777619);
          hashB ^= code + ((charIndex + 1) * 31 + itemIndex);
          hashB = Math.imul(hashB, 16777619);
        }
        hashA ^= 59;
        hashA = Math.imul(hashA, 16777619);
        hashB ^= 43;
        hashB = Math.imul(hashB, 16777619);
      }
      return `${active.length}:${(hashA >>> 0).toString(16)}:${(hashB >>> 0).toString(16)}`;
    }

    function normalizeUniverseGraph(graphRaw) {
      const source = graphRaw && typeof graphRaw === "object" ? graphRaw : {};
      const nodes = Array.isArray(source.nodes)
        ? source.nodes.map((nodeRaw, index) => {
            const node = nodeRaw && typeof nodeRaw === "object" ? nodeRaw : {};
            const word = cleanText(node.word, maxWord);
            const labels = normalizeLabelArray(node.labels || [], maxLabel).slice(0, 20);
            const nodeX = Number(node.x);
            const nodeY = Number(node.y);
            return {
              id: cleanText(node.id, maxWord) || `universe-node-${index}`,
              entryId: cleanText(node.entryId, maxWord),
              word,
              wordLower: normalizeWordLower(word, maxWord),
              labels,
              questionBucket: inferQuestionBucketFromLabels(labels, maxLabel),
              partOfSpeech: cleanText(node.partOfSpeech, maxLabel).toLowerCase(),
              mode: normalizeEntryMode(node.mode),
              degree: Math.max(0, Math.floor(Number(node.degree) || 0)),
              componentSize: Math.max(1, Math.floor(Number(node.componentSize) || 1)),
              componentId: cleanText(node.componentId, 40),
              x: Number.isFinite(nodeX) ? clampNumber(nodeX, -4, 4) : 0.5,
              y: Number.isFinite(nodeY) ? clampNumber(nodeY, -4, 4) : 0.5
            };
          })
        : [];

      const edgeSet = new Set();
      const edges = [];
      const nodeCount = nodes.length;
      (Array.isArray(source.edges) ? source.edges : []).forEach((edgeRaw) => {
        const edge = edgeRaw && typeof edgeRaw === "object" ? edgeRaw : {};
        const a = Math.floor(Number(edge.a));
        const b = Math.floor(Number(edge.b));
        if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= nodeCount || b >= nodeCount || a === b) {
          return;
        }
        const left = Math.min(a, b);
        const right = Math.max(a, b);
        const key = left * Math.max(1, nodeCount) + right;
        if (edgeSet.has(key)) {
          return;
        }
        edgeSet.add(key);
        const modes = unique(
          (Array.isArray(edge.modes) ? edge.modes : []).map((mode) => cleanText(mode, 20)).filter(Boolean)
        );
        edges.push({
          a: left,
          b: right,
          modes,
          hasSameLabel: modes.includes("sameLabel")
        });
      });

      const metaSource = source.meta && typeof source.meta === "object" ? source.meta : {};
      const modeCountsSource =
        metaSource.edgeModeCounts && typeof metaSource.edgeModeCounts === "object" ? metaSource.edgeModeCounts : {};
      return {
        nodes,
        edges,
        meta: {
          nodeCount: Math.max(0, Math.floor(Number(metaSource.nodeCount) || nodes.length)),
          edgeCount: Math.max(0, Math.floor(Number(metaSource.edgeCount) || edges.length)),
          components: Math.max(0, Math.floor(Number(metaSource.components) || 0)),
          isolated: Math.max(0, Math.floor(Number(metaSource.isolated) || 0)),
          largestComponent: Math.max(0, Math.floor(Number(metaSource.largestComponent) || 0)),
          capped: Boolean(metaSource.capped),
          edgeModeCounts: {
            contains: Math.max(0, Math.floor(Number(modeCountsSource.contains) || 0)),
            prefix: Math.max(0, Math.floor(Number(modeCountsSource.prefix) || 0)),
            suffix: Math.max(0, Math.floor(Number(modeCountsSource.suffix) || 0)),
            stem: Math.max(0, Math.floor(Number(modeCountsSource.stem) || 0)),
            sameLabel: Math.max(0, Math.floor(Number(modeCountsSource.sameLabel) || 0))
          }
        }
      };
    }

    return {
      createEmptyUniverseGraph,
      createDefaultUniverseConfig,
      normalizeUniverseBookmark,
      normalizeUniverseCustomSearchSet,
      normalizeUniverseCustomSearchSets,
      normalizeConfig,
      getUniverseDatasetSignature,
      inferQuestionBucketFromLabels,
      normalizeUniverseGraph,
      normalizeEntryMode,
      normalizeLabelArray,
      normalizeWordLower
    };
  }

  return {
    createUniverseStateTools
  };
});
