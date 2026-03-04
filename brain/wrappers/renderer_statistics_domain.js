/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Statistics_Domain = __MODULE_API;
  root.DictionaryRendererStatisticsDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function buildStatisticsModelSync() {
  const entries = G_APP.s.entries;
  const activeEntries = entries.filter((entry) => !entry.archivedAt);
  const archivedEntries = entries.filter((entry) => Boolean(entry.archivedAt));
  const favoriteEntries = entries.filter((entry) => Boolean(entry.favorite));
  const linkedEntryIds = getGraphEntryIdSet();
  const linkedCount = entries.filter((entry) => linkedEntryIds.has(entry.id)).length;

  const modeCounts = {
    definition: 0,
    slang: 0,
    code: 0,
    bytes: 0
  };
  entries.forEach((entry) => {
    const mode = normalizeEntryMode(entry.mode);
    modeCounts[mode] += 1;
  });

  const byUsage = [...activeEntries].sort((left, right) => {
    return getEntryUsageScore(right) - getEntryUsageScore(left) || left.word.localeCompare(right.word);
  });

  const leastUsage = [...activeEntries].sort((left, right) => {
    return getEntryUsageScore(left) - getEntryUsageScore(right) || left.word.localeCompare(right.word);
  });

  const recent = [...entries].sort((left, right) =>
    String(right.updatedAt || "").localeCompare(String(left.updatedAt || ""))
  );

  const labelCounts = {};
  entries.forEach((entry) => {
    const labels = entry.labels.length > 0 ? entry.labels : [UNLABELED_NAME];
    labels.forEach((label) => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
  });

  const sortedLabels = Object.keys(labelCounts).sort(
    (a, b) => (labelCounts[b] || 0) - (labelCounts[a] || 0) || a.localeCompare(b)
  );

  return {
    overview: {
      totalEntries: entries.length,
      activeEntries: activeEntries.length,
      archivedEntries: archivedEntries.length,
      favorites: favoriteEntries.length,
      linked: linkedCount,
      graphNodes: G_APP.s.sentenceGraph.nodes.length,
      graphLinks: G_APP.s.sentenceGraph.links.length
    },
    mostUsed: byUsage.slice(0, 12).map((entry) => ({ word: entry.word, score: getEntryUsageScore(entry) })),
    leastUsed: leastUsage.slice(0, 12).map((entry) => ({ word: entry.word, score: getEntryUsageScore(entry) })),
    recent: recent.slice(0, 12).map((entry) => ({ word: entry.word, updatedAt: entry.updatedAt })),
    labels: sortedLabels.slice(0, 12).map((label) => ({ label, count: labelCounts[label] || 0 })),
    modes: Object.keys(modeCounts).map((mode) => ({ mode, count: modeCounts[mode] }))
  };
}

function getStatisticsModel() {
  const modelKey = getStatsModelKey();
  if (G_RT.statsWorkerModel && G_RT.statsWorkerModelKey === modelKey) {
    return G_RT.statsWorkerModel;
  }
  if (G_RT.statsCacheModel && G_RT.statsCacheKey === modelKey) {
    return G_RT.statsCacheModel;
  }
  G_RT.statsCacheModel = buildStatisticsModelSync();
  G_RT.statsCacheKey = modelKey;
  return G_RT.statsCacheModel;
}

function renderStatisticsView() {
  if (
    !(G_DOM.statsOverviewList instanceof HTMLElement) ||
    !(G_DOM.statsMostUsedList instanceof HTMLElement) ||
    !(G_DOM.statsLeastUsedList instanceof HTMLElement) ||
    !(G_DOM.statsRecentList instanceof HTMLElement) ||
    !(G_DOM.statsLabelsList instanceof HTMLElement) ||
    !(G_DOM.statsModeList instanceof HTMLElement)
  ) {
    return;
  }

  const model = getStatisticsModel();

  G_DOM.statsOverviewList.innerHTML = "";
  G_DOM.statsOverviewList.appendChild(listItem(`Total entries: ${model.overview.totalEntries || 0}`));
  G_DOM.statsOverviewList.appendChild(listItem(`Active entries: ${model.overview.activeEntries || 0}`));
  G_DOM.statsOverviewList.appendChild(listItem(`Archived entries: ${model.overview.archivedEntries || 0}`));
  G_DOM.statsOverviewList.appendChild(listItem(`Favorites: ${model.overview.favorites || 0}`));
  G_DOM.statsOverviewList.appendChild(listItem(`Linked in graph: ${model.overview.linked || 0}`));
  G_DOM.statsOverviewList.appendChild(
    listItem(`Graph nodes/links: ${model.overview.graphNodes || 0}/${model.overview.graphLinks || 0}`)
  );

  G_DOM.statsMostUsedList.innerHTML = "";
  model.mostUsed.forEach((item) => {
    G_DOM.statsMostUsedList.appendChild(listItem(`${item.word} (${item.score})`));
  });
  (model.mostUsed.length === 0) && (G_DOM.statsMostUsedList.appendChild(listItem("No entries yet.")));

  G_DOM.statsLeastUsedList.innerHTML = "";
  model.leastUsed.forEach((item) => {
    G_DOM.statsLeastUsedList.appendChild(listItem(`${item.word} (${item.score})`));
  });
  (model.leastUsed.length === 0) && (G_DOM.statsLeastUsedList.appendChild(listItem("No entries yet.")));

  G_DOM.statsRecentList.innerHTML = "";
  model.recent.forEach((item) => {
    G_DOM.statsRecentList.appendChild(listItem(`${item.word} (${new Date(item.updatedAt).toLocaleString()})`));
  });
  (model.recent.length === 0) && (G_DOM.statsRecentList.appendChild(listItem("No entries yet.")));

  G_DOM.statsLabelsList.innerHTML = "";
  model.labels.forEach((item) => {
    G_DOM.statsLabelsList.appendChild(listItem(`${item.label}: ${item.count}`));
  });
  (model.labels.length === 0) && (G_DOM.statsLabelsList.appendChild(listItem("No labels yet.")));

  G_DOM.statsModeList.innerHTML = "";
  model.modes.forEach((item) => {
    G_DOM.statsModeList.appendChild(listItem(`${item.mode}: ${item.count}`));
  });
}

function getStatsModelKey() {
  return `${G_RT.entriesVersion}|${G_RT.gVer}`;
}

function invalidateStatisticsCache() {
  G_RT.statsCacheKey = "";
  G_RT.statsCacheModel = null;
  G_RT.statsWorkerModelKey = "";
  G_RT.statsWorkerModel = null;
}

function requestStatsWorkerComputeNow() {
  if (!G_RT.statsWorkerReady || !G_RT.statsWorker || G_APP.s.entries.length < STATS_WORKER_MIN_ENTRIES) {
    return;
  }
  const versionKey = getStatsModelKey();
  G_RT.latestStatsWorkerRequestId += 1;
  const requestId = G_RT.latestStatsWorkerRequestId;
  G_RT.statsWorkerRequestId = requestId;
  try {
    G_RT.statsWorker.postMessage({
      type: "computeStats",
      requestId,
      versionKey,
      entries: G_APP.s.entries.map((entry) => ({
        id: entry.id,
        word: entry.word,
        labels: entry.labels,
        favorite: Boolean(entry.favorite),
        archivedAt: entry.archivedAt || null,
        mode: entry.mode,
        updatedAt: entry.updatedAt,
        usageCount: Number(entry.usageCount) || 0
      })),
      nodes: G_APP.s.sentenceGraph.nodes.map((node) => ({
        entryId: node.entryId || ""
      })),
      graphLinks: G_APP.s.sentenceGraph.links.length
    });
  } catch {
    G_RT.statsWorkerReady = false;
  }
}

function scheduleStatsWorkerCompute() {
  if (!G_RT.statsWorkerTask) {
    return;
  }
  G_RT.statsWorkerTask.schedule();
}


function getEntryUsageScore(entry) {
  const usageCount = Number.isFinite(Number(entry?.usageCount)) ? Number(entry.usageCount) : 0;
  const backlinks = getEntryBacklinkCount(entry?.id || "");
  return usageCount + backlinks * 2;
}

  return {
    buildStatisticsModelSync,
    legacy_buildStatisticsModelSync: buildStatisticsModelSync,
    modular_buildStatisticsModelSync: buildStatisticsModelSync,
    getStatisticsModel,
    legacy_getStatisticsModel: getStatisticsModel,
    modular_getStatisticsModel: getStatisticsModel,
    renderStatisticsView,
    legacy_renderStatisticsView: renderStatisticsView,
    modular_renderStatisticsView: renderStatisticsView,
    getStatsModelKey,
    legacy_getStatsModelKey: getStatsModelKey,
    modular_getStatsModelKey: getStatsModelKey,
    invalidateStatisticsCache,
    legacy_invalidateStatisticsCache: invalidateStatisticsCache,
    modular_invalidateStatisticsCache: invalidateStatisticsCache,
    requestStatsWorkerComputeNow,
    legacy_requestStatsWorkerComputeNow: requestStatsWorkerComputeNow,
    modular_requestStatsWorkerComputeNow: requestStatsWorkerComputeNow,
    scheduleStatsWorkerCompute,
    legacy_scheduleStatsWorkerCompute: scheduleStatsWorkerCompute,
    modular_scheduleStatsWorkerCompute: scheduleStatsWorkerCompute,

    getEntryUsageScore,
    legacy_getEntryUsageScore: getEntryUsageScore,
    modular_getEntryUsageScore: getEntryUsageScore,
  };
});
