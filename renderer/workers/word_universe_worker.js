"use strict";

const DEFAULTS = {
  minWordLength: 3,
  maxWordLength: 28,
  maxNodes: 1800,
  maxEdges: 18000,
  seed: 1337,
  favoritesOnly: false,
  labelFilter: "",
  sameLabelNeighborLimit: 10,
  edgeModes: {
    contains: true,
    prefix: false,
    suffix: false,
    stem: false,
    sameLabel: false
  }
};
const POS_LABELS = new Set([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
  "determiner",
  "article",
  "numeral"
]);
const STEM_SUFFIXES = ["ingly", "edly", "ing", "ed", "ly", "ment", "ness", "tion", "sion", "able", "ible"];

function cleanText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function normalizeWord(word, options) {
  return cleanText(word, options.maxWordLength).toLowerCase();
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
}

function toFiniteNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function toBooleanScore(value) {
  return value ? 1 : 0;
}

function normalizeEdgeModes(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const next = {
    contains: source.contains !== false,
    prefix: source.prefix === true,
    suffix: source.suffix === true,
    stem: source.stem === true || source.exactStem === true,
    sameLabel: source.sameLabel === true
  };
  if (!next.contains && !next.prefix && !next.suffix && !next.stem && !next.sameLabel) {
    next.contains = true;
  }
  return next;
}

function normalizeStem(wordLower) {
  let stem = cleanText(wordLower, 80).toLowerCase();
  if (!stem) {
    return "";
  }
  if (stem.length > 4 && stem.endsWith("ies")) {
    return `${stem.slice(0, -3)}y`;
  }
  for (let index = 0; index < STEM_SUFFIXES.length; index += 1) {
    const suffix = STEM_SUFFIXES[index];
    if (stem.length - suffix.length < 3) {
      continue;
    }
    if (stem.endsWith(suffix)) {
      stem = stem.slice(0, -suffix.length);
      break;
    }
  }
  if (stem.length > 3 && stem.endsWith("es")) {
    stem = stem.slice(0, -2);
  } else if (stem.length > 3 && stem.endsWith("s")) {
    stem = stem.slice(0, -1);
  }
  return stem;
}

function normalizeLabelList(rawLabels) {
  return (Array.isArray(rawLabels) ? rawLabels : [])
    .map((label) => cleanText(label, 60))
    .filter(Boolean)
    .filter((label, index, list) => list.indexOf(label) === index);
}

function resolvePartOfSpeech(labelsLower) {
  for (let index = 0; index < labelsLower.length; index += 1) {
    const labelLower = labelsLower[index];
    if (POS_LABELS.has(labelLower)) {
      return labelLower;
    }
  }
  return "";
}

function selectNodes(entries, options) {
  const bestByWord = new Map();
  (Array.isArray(entries) ? entries : []).forEach((entryRaw) => {
    const entry = entryRaw && typeof entryRaw === "object" ? entryRaw : {};
    if (entry.archivedAt) {
      return;
    }
    const favorite = Boolean(entry.favorite);
    if (options.favoritesOnly && !favorite) {
      return;
    }
    const wordLower = normalizeWord(entry.word, options);
    if (!wordLower || wordLower.length < options.minWordLength) {
      return;
    }
    const labels = normalizeLabelList(entry.labels);
    const labelsLower = labels.map((label) => label.toLowerCase());
    if (options.labelFilter) {
      const matches = labelsLower.some((label) => label.includes(options.labelFilter));
      if (!matches) {
        return;
      }
    }
    const usageCount = Math.max(0, Math.floor(toFiniteNumber(entry.usageCount, 0)));
    const score = usageCount * 2 + toBooleanScore(favorite) * 8 + Math.min(8, wordLower.length);
    const mode = cleanText(entry.mode, 20).toLowerCase() || "definition";
    const partOfSpeech = resolvePartOfSpeech(labelsLower);
    const stem = normalizeStem(wordLower);
    const existing = bestByWord.get(wordLower);
    if (!existing || existing.score < score) {
      bestByWord.set(wordLower, {
        entryId: cleanText(entry.id, 120),
        word: cleanText(entry.word, 120) || wordLower,
        wordLower,
        score,
        labels,
        labelsLower,
        favorite,
        mode,
        partOfSpeech,
        stem
      });
    }
  });

  const ranked = [...bestByWord.values()].sort((left, right) => {
    return (
      right.score - left.score ||
      left.wordLower.length - right.wordLower.length ||
      left.wordLower.localeCompare(right.wordLower)
    );
  });

  return ranked.slice(0, options.maxNodes).map((item, index) => ({
    index,
    entryId: item.entryId,
    word: item.word,
    wordLower: item.wordLower,
    labels: item.labels,
    labelsLower: item.labelsLower,
    mode: item.mode,
    partOfSpeech: item.partOfSpeech,
    stem: item.stem,
    degree: 0,
    componentSize: 1,
    componentId: "",
    x: 0.5,
    y: 0.5
  }));
}

function createEdgeContext(nodes, options) {
  const wordToIndex = new Map();
  const stemToIndices = new Map();
  const labelToIndices = new Map();

  nodes.forEach((node, index) => {
    if (!wordToIndex.has(node.wordLower)) {
      wordToIndex.set(node.wordLower, index);
    }
    if (node.stem) {
      if (!stemToIndices.has(node.stem)) {
        stemToIndices.set(node.stem, []);
      }
      stemToIndices.get(node.stem).push(index);
    }
    (Array.isArray(node.labelsLower) ? node.labelsLower : []).forEach((labelLower) => {
      if (!labelLower) {
        return;
      }
      if (!labelToIndices.has(labelLower)) {
        labelToIndices.set(labelLower, []);
      }
      labelToIndices.get(labelLower).push(index);
    });
  });

  const nodeCount = nodes.length;
  const edgeMap = new Map();
  let capped = false;

  function addEdge(leftIndex, rightIndex, mode) {
    const left = Math.min(leftIndex, rightIndex);
    const right = Math.max(leftIndex, rightIndex);
    if (left === right || left < 0 || right >= nodeCount) {
      return false;
    }
    const key = left * nodeCount + right;
    const existing = edgeMap.get(key);
    if (existing) {
      if (!existing.modes.includes(mode)) {
        existing.modes.push(mode);
      }
      return true;
    }
    if (edgeMap.size >= options.maxEdges) {
      capped = true;
      return false;
    }
    edgeMap.set(key, {
      a: left,
      b: right,
      modes: [mode]
    });
    nodes[left].degree += 1;
    nodes[right].degree += 1;
    return true;
  }

  return {
    nodeCount,
    wordToIndex,
    stemToIndices,
    labelToIndices,
    edgeMap,
    addEdge,
    isCapped() {
      return capped || edgeMap.size >= options.maxEdges;
    }
  };
}

function buildContainmentEdges(nodes, options, context) {
  const wordToIndex = context.wordToIndex;
  for (let index = 0; index < nodes.length; index += 1) {
    if (context.isCapped()) {
      break;
    }
    const word = nodes[index].wordLower;
    const wordLength = word.length;
    const localMatches = new Set();

    for (let subLength = options.minWordLength; subLength < wordLength; subLength += 1) {
      const maxStart = wordLength - subLength;
      for (let start = 0; start <= maxStart; start += 1) {
        const subWord = word.slice(start, start + subLength);
        const targetIndex = wordToIndex.get(subWord);
        if (targetIndex === undefined || targetIndex === index || localMatches.has(targetIndex)) {
          continue;
        }
        localMatches.add(targetIndex);
        context.addEdge(index, targetIndex, "contains");
        if (context.isCapped()) {
          break;
        }
      }
      if (context.isCapped()) {
        break;
      }
    }
  }
}

function buildPrefixEdges(nodes, options, context) {
  const wordToIndex = context.wordToIndex;
  for (let index = 0; index < nodes.length; index += 1) {
    if (context.isCapped()) {
      break;
    }
    const word = nodes[index].wordLower;
    const seenTargets = new Set();
    for (let subLength = options.minWordLength; subLength < word.length; subLength += 1) {
      const candidate = word.slice(0, subLength);
      const target = wordToIndex.get(candidate);
      if (target === undefined || target === index || seenTargets.has(target)) {
        continue;
      }
      seenTargets.add(target);
      context.addEdge(index, target, "prefix");
      if (context.isCapped()) {
        break;
      }
    }
  }
}

function buildSuffixEdges(nodes, options, context) {
  const wordToIndex = context.wordToIndex;
  for (let index = 0; index < nodes.length; index += 1) {
    if (context.isCapped()) {
      break;
    }
    const word = nodes[index].wordLower;
    const seenTargets = new Set();
    for (let subLength = options.minWordLength; subLength < word.length; subLength += 1) {
      const candidate = word.slice(word.length - subLength);
      const target = wordToIndex.get(candidate);
      if (target === undefined || target === index || seenTargets.has(target)) {
        continue;
      }
      seenTargets.add(target);
      context.addEdge(index, target, "suffix");
      if (context.isCapped()) {
        break;
      }
    }
  }
}

function buildStemEdges(context) {
  const groups = context.stemToIndices;
  for (const indices of groups.values()) {
    if (context.isCapped()) {
      break;
    }
    if (!Array.isArray(indices) || indices.length < 2) {
      continue;
    }
    for (let index = 1; index < indices.length; index += 1) {
      context.addEdge(indices[index - 1], indices[index], "stem");
      if (context.isCapped()) {
        break;
      }
    }
    if (!context.isCapped() && indices.length > 2) {
      context.addEdge(indices[0], indices[indices.length - 1], "stem");
    }
  }
}

function buildSameLabelEdges(options, context) {
  const groups = context.labelToIndices;
  const neighborLimit = Math.max(
    1,
    Math.floor(toFiniteNumber(options.sameLabelNeighborLimit, DEFAULTS.sameLabelNeighborLimit))
  );
  for (const indices of groups.values()) {
    if (context.isCapped()) {
      break;
    }
    if (!Array.isArray(indices) || indices.length < 2) {
      continue;
    }
    for (let index = 0; index < indices.length; index += 1) {
      const maxNeighbor = Math.min(indices.length, index + neighborLimit + 1);
      for (let neighbor = index + 1; neighbor < maxNeighbor; neighbor += 1) {
        context.addEdge(indices[index], indices[neighbor], "sameLabel");
        if (context.isCapped()) {
          break;
        }
      }
      if (context.isCapped()) {
        break;
      }
    }
  }
}

function buildEdges(nodes, options) {
  const context = createEdgeContext(nodes, options);
  if (options.edgeModes.contains) {
    buildContainmentEdges(nodes, options, context);
  }
  if (!context.isCapped() && options.edgeModes.prefix) {
    buildPrefixEdges(nodes, options, context);
  }
  if (!context.isCapped() && options.edgeModes.suffix) {
    buildSuffixEdges(nodes, options, context);
  }
  if (!context.isCapped() && options.edgeModes.stem) {
    buildStemEdges(context);
  }
  if (!context.isCapped() && options.edgeModes.sameLabel) {
    buildSameLabelEdges(options, context);
  }

  return {
    edges: [...context.edgeMap.values()],
    capped: context.isCapped()
  };
}

function buildComponentSizes(nodes, edges) {
  const parent = nodes.map((_, index) => index);
  const rank = nodes.map(() => 0);

  function find(index) {
    let current = index;
    while (parent[current] !== current) {
      parent[current] = parent[parent[current]];
      current = parent[current];
    }
    return current;
  }

  function union(left, right) {
    const rootLeft = find(left);
    const rootRight = find(right);
    if (rootLeft === rootRight) {
      return;
    }
    const rankLeft = rank[rootLeft];
    const rankRight = rank[rootRight];
    if (rankLeft < rankRight) {
      parent[rootLeft] = rootRight;
      return;
    }
    if (rankLeft > rankRight) {
      parent[rootRight] = rootLeft;
      return;
    }
    parent[rootRight] = rootLeft;
    rank[rootLeft] += 1;
  }

  edges.forEach((edge) => {
    union(edge.a, edge.b);
  });

  const sizeByRoot = new Map();
  for (let index = 0; index < nodes.length; index += 1) {
    const root = find(index);
    sizeByRoot.set(root, (sizeByRoot.get(root) || 0) + 1);
  }

  const componentByRoot = new Map();
  nodes.forEach((node, index) => {
    const root = find(index);
    if (!componentByRoot.has(root)) {
      componentByRoot.set(root, `c${componentByRoot.size + 1}`);
    }
    node.componentSize = sizeByRoot.get(root) || 1;
    node.componentId = componentByRoot.get(root) || "";
  });

  let largestComponent = 0;
  sizeByRoot.forEach((size) => {
    if (size > largestComponent) {
      largestComponent = size;
    }
  });

  return {
    components: sizeByRoot.size,
    largestComponent
  };
}

function layoutNodes(nodes, edges, options) {
  const nodeCount = nodes.length;
  if (nodeCount === 0) {
    return;
  }

  const random = createRng(options.seed);
  const x = new Float32Array(nodeCount);
  const y = new Float32Array(nodeCount);
  const vx = new Float32Array(nodeCount);
  const vy = new Float32Array(nodeCount);
  const fx = new Float32Array(nodeCount);
  const fy = new Float32Array(nodeCount);

  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < nodeCount; index += 1) {
    const hash = hashString(nodes[index].wordLower);
    const seedAngle = (hash % 1000000) / 1000000;
    const angle = seedAngle * Math.PI * 2 + index * golden;
    const radius = 0.2 + 0.78 * Math.sqrt((index + 1) / nodeCount);
    x[index] = Math.cos(angle) * radius;
    y[index] = Math.sin(angle) * radius;
  }

  const iterations = Math.min(240, Math.max(80, Math.floor(Math.sqrt(nodeCount) * 6 + 70)));
  const repulsionSamples = nodeCount > 1400 ? 4 : nodeCount > 900 ? 5 : 7;

  for (let step = 0; step < iterations; step += 1) {
    const cooling = 1 - step / iterations;

    for (let index = 0; index < nodeCount; index += 1) {
      fx[index] = -x[index] * 0.018;
      fy[index] = -y[index] * 0.018;
    }

    for (let edgeIndex = 0; edgeIndex < edges.length; edgeIndex += 1) {
      const edge = edges[edgeIndex];
      const left = edge.a;
      const right = edge.b;
      const dx = x[right] - x[left];
      const dy = y[right] - y[left];
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
      const desired =
        0.05 + 0.01 * Math.log2(2 + Math.min(nodes[left].wordLower.length, nodes[right].wordLower.length));
      const spring = (dist - desired) * 0.06;
      const sx = (dx / dist) * spring;
      const sy = (dy / dist) * spring;
      fx[left] += sx;
      fy[left] += sy;
      fx[right] -= sx;
      fy[right] -= sy;
    }

    for (let index = 0; index < nodeCount; index += 1) {
      for (let sample = 0; sample < repulsionSamples; sample += 1) {
        const other = Math.floor(random() * nodeCount);
        if (other === index) {
          continue;
        }
        const dx = x[index] - x[other];
        const dy = y[index] - y[other];
        const dist2 = dx * dx + dy * dy + 0.0016;
        const repulse = 0.0012 / dist2;
        fx[index] += dx * repulse;
        fy[index] += dy * repulse;
      }
    }

    for (let index = 0; index < nodeCount; index += 1) {
      vx[index] = (vx[index] + fx[index]) * 0.86;
      vy[index] = (vy[index] + fy[index]) * 0.86;
      x[index] += vx[index] * cooling;
      y[index] += vy[index] * cooling;
      if (x[index] < -1.4) {
        x[index] = -1.4;
        vx[index] *= -0.4;
      } else if (x[index] > 1.4) {
        x[index] = 1.4;
        vx[index] *= -0.4;
      }
      if (y[index] < -1.4) {
        y[index] = -1.4;
        vy[index] *= -0.4;
      } else if (y[index] > 1.4) {
        y[index] = 1.4;
        vy[index] *= -0.4;
      }
    }
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < nodeCount; index += 1) {
    if (x[index] < minX) {
      minX = x[index];
    }
    if (x[index] > maxX) {
      maxX = x[index];
    }
    if (y[index] < minY) {
      minY = y[index];
    }
    if (y[index] > maxY) {
      maxY = y[index];
    }
  }

  const rangeX = Math.max(0.0001, maxX - minX);
  const rangeY = Math.max(0.0001, maxY - minY);
  const pad = 0.06;

  for (let index = 0; index < nodeCount; index += 1) {
    nodes[index].x = pad + ((x[index] - minX) / rangeX) * (1 - pad * 2);
    nodes[index].y = pad + ((y[index] - minY) / rangeY) * (1 - pad * 2);
  }
}

function buildUniverseGraph(entries, optionsRaw = {}) {
  const options = {
    minWordLength: Math.max(2, Math.floor(toFiniteNumber(optionsRaw.minWordLength, DEFAULTS.minWordLength))),
    maxWordLength: Math.max(8, Math.floor(toFiniteNumber(optionsRaw.maxWordLength, DEFAULTS.maxWordLength))),
    maxNodes: Math.max(50, Math.floor(toFiniteNumber(optionsRaw.maxNodes, DEFAULTS.maxNodes))),
    maxEdges: Math.max(100, Math.floor(toFiniteNumber(optionsRaw.maxEdges, DEFAULTS.maxEdges))),
    seed: Math.max(1, Math.floor(toFiniteNumber(optionsRaw.seed, DEFAULTS.seed))),
    favoritesOnly: Boolean(optionsRaw.favoritesOnly),
    labelFilter: cleanText(String(optionsRaw.labelFilter || ""), 60).toLowerCase(),
    sameLabelNeighborLimit: Math.max(
      1,
      Math.min(20, Math.floor(toFiniteNumber(optionsRaw.sameLabelNeighborLimit, DEFAULTS.sameLabelNeighborLimit)))
    ),
    edgeModes: normalizeEdgeModes(optionsRaw.edgeModes)
  };

  const nodes = selectNodes(entries, options);
  const edgeResult = buildEdges(nodes, options);
  const edges = edgeResult.edges;
  const componentsMeta = buildComponentSizes(nodes, edges);
  layoutNodes(nodes, edges, options);

  let isolated = 0;
  const edgeModeCounts = {
    contains: 0,
    prefix: 0,
    suffix: 0,
    stem: 0,
    sameLabel: 0
  };
  nodes.forEach((node) => {
    if ((node.degree || 0) === 0) {
      isolated += 1;
    }
  });
  edges.forEach((edge) => {
    (Array.isArray(edge.modes) ? edge.modes : []).forEach((mode) => {
      if (Object.prototype.hasOwnProperty.call(edgeModeCounts, mode)) {
        edgeModeCounts[mode] += 1;
      }
    });
  });

  return {
    nodes: nodes.map((node) => ({
      id: node.entryId || `node-${node.index}`,
      entryId: node.entryId,
      word: node.word,
      labels: node.labels,
      partOfSpeech: node.partOfSpeech,
      mode: node.mode,
      degree: node.degree,
      componentSize: node.componentSize,
      componentId: node.componentId,
      x: node.x,
      y: node.y
    })),
    edges: edges.map((edge) => ({
      a: edge.a,
      b: edge.b,
      modes: edge.modes
    })),
    meta: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      components: componentsMeta.components,
      isolated,
      largestComponent: componentsMeta.largestComponent,
      capped: edgeResult.capped,
      edgeModeCounts
    }
  };
}

self.onmessage = (event) => {
  const payload = event?.data && typeof event.data === "object" ? event.data : {};
  if (payload.type !== "buildUniverseGraph") {
    return;
  }
  const requestId = toFiniteNumber(payload.requestId, 0);
  const versionKey = cleanText(payload.versionKey, 120);
  try {
    const graph = buildUniverseGraph(payload.entries, payload.options);
    self.postMessage({
      type: "universeGraphResult",
      requestId,
      versionKey,
      graph
    });
  } catch (error) {
    self.postMessage({
      type: "universeGraphError",
      requestId,
      versionKey,
      message: cleanText(String(error?.message || error), 600)
    });
  }
};
