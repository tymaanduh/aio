"use strict";

const ENTRY_MODES = new Set(["definition", "slang", "code", "bytes"]);
const UNLABELED_NAME = "Unlabeled";

function cleanText(value, maxLength = 120) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function normalizeEntryMode(value) {
  const mode = cleanText(value, 20).toLowerCase();
  if (!mode || !ENTRY_MODES.has(mode)) {
    return "definition";
  }
  return mode;
}

function normalizeUsageCount(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, Math.floor(numeric));
}

function toTimestamp(value) {
  const numeric = new Date(String(value || "")).getTime();
  return Number.isFinite(numeric) ? numeric : 0;
}

function computeModel(entries, nodes, graphLinks) {
  const safeEntries = Array.isArray(entries) ? entries : [];
  const safeNodes = Array.isArray(nodes) ? nodes : [];

  const linkedEntryIds = new Set();
  const backlinkCountByEntryId = new Map();
  safeNodes.forEach((node) => {
    const entryId = cleanText(node?.entryId || "", 120);
    if (!entryId) {
      return;
    }
    linkedEntryIds.add(entryId);
    backlinkCountByEntryId.set(entryId, (backlinkCountByEntryId.get(entryId) || 0) + 1);
  });

  const modeCounts = {
    definition: 0,
    slang: 0,
    code: 0,
    bytes: 0
  };

  const labelCounts = {};
  const activeEntries = [];
  const archivedEntries = [];
  let favoriteCount = 0;
  let linkedCount = 0;

  safeEntries.forEach((entryRaw) => {
    const entry = entryRaw && typeof entryRaw === "object" ? entryRaw : {};
    const id = cleanText(entry.id, 120);
    const word = cleanText(entry.word, 120);
    const mode = normalizeEntryMode(entry.mode);
    modeCounts[mode] += 1;

    if (entry.favorite) {
      favoriteCount += 1;
    }
    if (id && linkedEntryIds.has(id)) {
      linkedCount += 1;
    }

    const labels = Array.isArray(entry.labels) ? entry.labels.map((item) => cleanText(item, 60)).filter(Boolean) : [];
    const effectiveLabels = labels.length > 0 ? labels : [UNLABELED_NAME];
    effectiveLabels.forEach((label) => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });

    const normalizedEntry = {
      id,
      word,
      updatedAt: cleanText(entry.updatedAt, 80),
      mode,
      archivedAt: cleanText(entry.archivedAt, 80),
      usageCount: normalizeUsageCount(entry.usageCount),
      backlinks: id ? backlinkCountByEntryId.get(id) || 0 : 0
    };

    if (normalizedEntry.archivedAt) {
      archivedEntries.push(normalizedEntry);
      return;
    }
    activeEntries.push(normalizedEntry);
  });

  const usageSortedDesc = [...activeEntries].sort((left, right) => {
    const rightScore = right.usageCount + right.backlinks * 2;
    const leftScore = left.usageCount + left.backlinks * 2;
    return rightScore - leftScore || left.word.localeCompare(right.word);
  });

  const usageSortedAsc = [...activeEntries].sort((left, right) => {
    const leftScore = left.usageCount + left.backlinks * 2;
    const rightScore = right.usageCount + right.backlinks * 2;
    return leftScore - rightScore || left.word.localeCompare(right.word);
  });

  const recentSorted = [...safeEntries]
    .map((entryRaw) => {
      const entry = entryRaw && typeof entryRaw === "object" ? entryRaw : {};
      return {
        word: cleanText(entry.word, 120),
        updatedAt: cleanText(entry.updatedAt, 80),
        updatedAtMs: toTimestamp(entry.updatedAt)
      };
    })
    .sort((left, right) => right.updatedAtMs - left.updatedAtMs);

  const sortedLabels = Object.keys(labelCounts).sort(
    (a, b) => (labelCounts[b] || 0) - (labelCounts[a] || 0) || a.localeCompare(b)
  );
  const modes = Object.keys(modeCounts).map((mode) => ({ mode, count: modeCounts[mode] || 0 }));

  return {
    overview: {
      totalEntries: safeEntries.length,
      activeEntries: activeEntries.length,
      archivedEntries: archivedEntries.length,
      favorites: favoriteCount,
      linked: linkedCount,
      graphNodes: safeNodes.length,
      graphLinks: Math.max(0, Math.floor(Number(graphLinks) || 0))
    },
    mostUsed: usageSortedDesc.slice(0, 12).map((entry) => ({
      word: entry.word,
      score: entry.usageCount + entry.backlinks * 2
    })),
    leastUsed: usageSortedAsc.slice(0, 12).map((entry) => ({
      word: entry.word,
      score: entry.usageCount + entry.backlinks * 2
    })),
    recent: recentSorted.slice(0, 12).map((entry) => ({
      word: entry.word,
      updatedAt: entry.updatedAt
    })),
    labels: sortedLabels.slice(0, 12).map((label) => ({
      label,
      count: labelCounts[label] || 0
    })),
    modes
  };
}

self.onmessage = (event) => {
  const payload = event?.data && typeof event.data === "object" ? event.data : {};
  if (payload.type !== "computeStats") {
    return;
  }
  const requestId = Number(payload.requestId) || 0;
  const versionKey = cleanText(payload.versionKey, 120);
  try {
    const model = computeModel(payload.entries, payload.nodes, payload.graphLinks);
    self.postMessage({
      type: "statsResult",
      requestId,
      versionKey,
      model
    });
  } catch (error) {
    self.postMessage({
      type: "statsError",
      requestId,
      versionKey,
      message: cleanText(String(error?.message || error), 500)
    });
  }
};
