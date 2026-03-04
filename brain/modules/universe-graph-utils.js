(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Universe_Graph_Utils = __MODULE_API;
  root.DictionaryUniverseGraphUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function cleanText(value, maxLength = 1000) {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim().slice(0, maxLength);
  }

  function normalizeWordLower(word, maxLength = 120) {
    return cleanText(word, maxLength).toLowerCase();
  }

  function getNodeWordLower(node, maxLength = 120) {
    const existing = cleanText(node?.wordLower, maxLength).toLowerCase();
    if (existing) {
      return existing;
    }
    const computed = normalizeWordLower(node?.word || "", maxLength);
    if (node && typeof node === "object") {
      node.wordLower = computed;
    }
    return computed;
  }

  function buildGraphCacheToken(graphCacheKey, maxLength = 200) {
    return cleanText(graphCacheKey, maxLength);
  }

  function buildIndexFlags(nodeCount, indices) {
    const size = Math.max(0, Math.floor(Number(nodeCount) || 0));
    const flags = new Uint8Array(size);
    if (!indices || typeof indices[Symbol.iterator] !== "function") {
      return flags;
    }
    for (const value of indices) {
      const index = Math.floor(Number(value));
      if (index >= 0 && index < size) {
        flags[index] = 1;
      }
    }
    return flags;
  }

  function computeHighlightState(options = {}) {
    const nodes = Array.isArray(options.nodes) ? options.nodes : [];
    const maxWordLength = Math.max(1, Math.floor(Number(options.maxWordLength) || 120));
    const filter = cleanText(options.filterLower, maxWordLength).toLowerCase();
    const previousFlags = options.previousFlags instanceof Uint8Array ? options.previousFlags : new Uint8Array(0);
    const previousCount = Math.max(0, Math.floor(Number(options.previousCount) || 0));
    const previousCacheKey = cleanText(options.previousCacheKey, 400);

    if (!filter) {
      if (previousCacheKey || previousFlags.length !== nodes.length) {
        return {
          flags: new Uint8Array(nodes.length),
          count: 0,
          cacheKey: ""
        };
      }
      return {
        flags: previousFlags,
        count: 0,
        cacheKey: ""
      };
    }

    const cacheKey = `${buildGraphCacheToken(options.graphCacheKey, 200)}|${nodes.length}|${filter}`;
    if (previousCacheKey === cacheKey && previousFlags.length === nodes.length) {
      return {
        flags: previousFlags,
        count: previousCount,
        cacheKey
      };
    }

    const flags = new Uint8Array(nodes.length);
    let count = 0;
    for (let index = 0; index < nodes.length; index += 1) {
      if (getNodeWordLower(nodes[index], maxWordLength).includes(filter)) {
        flags[index] = 1;
        count += 1;
      }
    }
    return {
      flags,
      count,
      cacheKey
    };
  }

  function buildAdjacency(nodes, edges) {
    const safeNodes = Array.isArray(nodes) ? nodes : [];
    const safeEdges = Array.isArray(edges) ? edges : [];
    const adjacency = Array.from({ length: safeNodes.length }, () => []);
    for (let index = 0; index < safeEdges.length; index += 1) {
      const edge = safeEdges[index];
      const a = Number(edge?.a);
      const b = Number(edge?.b);
      if (
        !Number.isInteger(a) ||
        !Number.isInteger(b) ||
        a < 0 ||
        b < 0 ||
        a >= safeNodes.length ||
        b >= safeNodes.length ||
        a === b
      ) {
        continue;
      }
      adjacency[a].push(b);
      adjacency[b].push(a);
    }
    return adjacency;
  }

  function computeAdjacencyState(options = {}) {
    const nodes = Array.isArray(options.nodes) ? options.nodes : [];
    const edges = Array.isArray(options.edges) ? options.edges : [];
    const previousCacheKey = cleanText(options.previousCacheKey, 400);
    const previousAdjacency = Array.isArray(options.previousAdjacency) ? options.previousAdjacency : [];
    const cacheKey = `${buildGraphCacheToken(options.graphCacheKey, 200)}|${nodes.length}|${edges.length}`;
    if (previousCacheKey === cacheKey && previousAdjacency.length === nodes.length) {
      return {
        adjacency: previousAdjacency,
        cacheKey
      };
    }
    return {
      adjacency: buildAdjacency(nodes, edges),
      cacheKey
    };
  }

  function findPathIndices(fromIndex, toIndex, nodeCount, adjacency) {
    const size = Math.max(0, Math.floor(Number(nodeCount) || 0));
    const from = Math.floor(Number(fromIndex));
    const to = Math.floor(Number(toIndex));
    if (from < 0 || to < 0 || from >= size || to >= size) {
      return [];
    }
    if (from === to) {
      return [from];
    }

    const safeAdjacency = Array.isArray(adjacency) ? adjacency : [];
    const queue = [from];
    let queueHead = 0;
    const visited = new Uint8Array(size);
    const previous = new Int32Array(size);
    previous.fill(-1);
    visited[from] = 1;

    while (queueHead < queue.length) {
      const current = queue[queueHead];
      queueHead += 1;
      const neighbors = Array.isArray(safeAdjacency[current]) ? safeAdjacency[current] : [];
      for (let index = 0; index < neighbors.length; index += 1) {
        const neighbor = Math.floor(Number(neighbors[index]));
        if (neighbor < 0 || neighbor >= size || visited[neighbor] === 1) {
          continue;
        }
        visited[neighbor] = 1;
        previous[neighbor] = current;
        if (neighbor === to) {
          const path = [];
          let cursor = to;
          while (cursor >= 0) {
            path.push(cursor);
            cursor = previous[cursor];
          }
          path.reverse();
          return path;
        }
        queue.push(neighbor);
      }
    }
    return [];
  }

  return {
    getNodeWordLower,
    buildGraphCacheToken,
    buildIndexFlags,
    computeHighlightState,
    computeAdjacencyState,
    findPathIndices
  };
});
