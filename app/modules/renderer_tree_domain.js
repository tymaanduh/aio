/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Tree_Domain = __MODULE_API;
  root.DictionaryRendererTreeDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function getTopTreeLabels() {
  const seen = new Set();
  const labels = [];
  TOP_TREE_LABELS.forEach((label) => {
    const normalized = normalizeLabel(label);
    if (!normalized || seen.has(normalized.toLowerCase())) {
      return;
    }
    seen.add(normalized.toLowerCase());
    labels.push(normalized);
  });
  G_APP.s.labels.forEach((label) => {
    const normalized = normalizeLabel(label);
    if (!normalized || seen.has(normalized.toLowerCase())) {
      return;
    }
    seen.add(normalized.toLowerCase());
    labels.push(normalized);
  });
  return labels.slice(0, 12);
}

function getTopLabelCount(label) {
  const normalized = normalizeLabel(label).toLowerCase();
  if (!normalized) {
    return 0;
  }
  const entriesIndex = G_PAGE.dictionary.getEntriesIndex();
  if (entriesIndex.labelCountsActive[normalized] !== undefined) {
    return entriesIndex.labelCountsActive[normalized] || 0;
  }
  const canonical = entriesIndex.sortedLabels.find((item) => item.toLowerCase() === normalized);
  if (!canonical) {
    return 0;
  }
  return entriesIndex.labelCountsActive[canonical] || 0;
}

function selectTopLabel(label) {
  const normalized = normalizeLabel(label);
  if (!normalized) {
    return;
  }
  ensureLabelExists(normalized);
  G_APP.s.treeLabelFilter = normalized;
  G_APP.s.selectedTreeLabel = normalized;
  G_APP.s.selectedTreeGroupKey = keyForLabel(normalized);
  (!G_APP.s.selectedEntryId && G_DOM.labelsInput instanceof HTMLInputElement) && (G_DOM.labelsInput.value = normalized);
  setQuickCaptureStatus(`Label filter set: ${normalized}`);
  G_PAGE.tree.reqRender();
}

function selectTopLabelByIndex(index) {
  const labels = getTopTreeLabels();
  const value = labels[index];
  if (!value) {
    return;
  }
  selectTopLabel(value);
}

function renderTopLabelBar() {
  if (!(G_DOM.topLabelBar instanceof HTMLElement)) {
    return;
  }
  G_DOM.topLabelBar.innerHTML = "";
  const allChip = document.createElement("span");
  allChip.className = `toolAction topLabelChip${G_APP.s.treeLabelFilter === LABEL_FILTER_ALL ? " active" : ""}`;
  const allCount = G_PAGE.dictionary.getEntriesIndex().activeEntriesCount || 0;
  allChip.textContent = `All (${allCount})`;
  allChip.setAttribute("role", "button");
  allChip.tabIndex = 0;
  const onAllSelect = () => {
    G_APP.s.treeLabelFilter = LABEL_FILTER_ALL;
    G_APP.s.selectedTreeLabel = "";
    G_APP.s.selectedTreeGroupKey = "";
    G_PAGE.tree.reqRender();
  };
  allChip.addEventListener("click", onAllSelect);
  allChip.addEventListener("keydown", (event) => {
    (event.key === "Enter" || event.key === " ") && (event.preventDefault(), onAllSelect());
  });
  G_DOM.topLabelBar.appendChild(allChip);

  getTopTreeLabels().forEach((label, index) => {
    const chip = document.createElement("span");
    chip.className = `toolAction topLabelChip${G_APP.s.treeLabelFilter === label ? " active" : ""}`;
    chip.textContent = `${label} (${getTopLabelCount(label)})`;
    chip.setAttribute("role", "button");
    chip.title = `Alt+${index + 1}`;
    chip.tabIndex = 0;
    const onLabelSelect = () => {
      selectTopLabel(label);
    };
    chip.addEventListener("click", onLabelSelect);
    chip.addEventListener("keydown", (event) => {
      (event.key === "Enter" || event.key === " ") && (event.preventDefault(), onLabelSelect());
    });
    G_DOM.topLabelBar.appendChild(chip);
  });
}

function parseQuickBatchWords(rawText) {
  return unique(
    String(rawText || "")
      .split(/[\n,;]+/)
      .map((value) => cleanText(value, MAX.WORD))
      .filter(Boolean)
  );
}

function parseSentenceInputWords(rawText) {
  return String(rawText || "")
    .replace(/\r?\n+/g, " ")
    .split(/\s+/)
    .map((token) => token.replace(/^[^A-Za-z0-9_#@.+/'-]+|[^A-Za-z0-9_#@.+/'-]+$/g, ""))
    .map((token) => cleanText(token, MAX.WORD))
    .filter(Boolean)
    .slice(0, 180);
}

async function captureSingleWord(word, options = {}) {
  const { quiet = false } = options;
  const normalizedWord = cleanText(word, MAX.WORD);
  if (!normalizedWord) {
    return {
      saved: false,
      skipped: true
    };
  }

  const existing = getDuplicateEntry(normalizedWord);
  if (existing) {
    selectEntry(existing.id);
    if (!quiet) {
      setQuickCaptureStatus(`"${normalizedWord}" already exists. Selected existing entry.`);
    }
    return {
      saved: false,
      skipped: true
    };
  }

  const preferredLabel = resolvePreferredEntryLabel();

  beginNewEntryInLabel(preferredLabel);
  G_DOM.wordInput.value = normalizedWord;
  G_DOM.definitionInput.value = "";
  (preferredLabel) && (G_DOM.labelsInput.value = preferredLabel);
  setHelperText(`Fetching and saving definition for "${normalizedWord}"...`);
  await lookupAndSaveEntry(normalizedWord);
  const saved = Boolean(getDuplicateEntry(normalizedWord));
  if (!quiet) {
    setQuickCaptureStatus(saved ? `Saved "${normalizedWord}".` : `Could not save "${normalizedWord}".`, !saved);
  }
  return {
    saved,
    skipped: false
  };
}

async function captureWordFromQuickInput() {
  if (G_RT.quickBatchRunning || !(G_DOM.quickWordInput instanceof HTMLInputElement)) {
    return;
  }
  const word = cleanText(G_DOM.quickWordInput.value, MAX.WORD);
  if (!word) {
    return;
  }
  G_DOM.quickWordInput.value = "";
  await captureSingleWord(word);
  G_DOM.quickWordInput.focus();
}

async function captureBatchWordsFromQuickInput() {
  if (G_RT.quickBatchRunning || !(G_DOM.quickBatchInput instanceof HTMLTextAreaElement)) {
    return;
  }
  const words = parseQuickBatchWords(G_DOM.quickBatchInput.value).slice(0, 400);
  if (words.length === 0) {
    setQuickCaptureStatus("No words found in batch input.", true);
    return;
  }

  G_RT.quickBatchRunning = true;
  G_DOM.quickBatchInput.disabled = true;
  let saved = 0;
  let skipped = 0;

  try {
    for (let index = 0; index < words.length; index += 1) {
      const word = words[index];
      setQuickCaptureStatus(`Capturing ${index + 1}/${words.length}: ${word}`);
      const result = await captureSingleWord(word, { quiet: true });
      if (result.saved) {
        saved += 1;
      } else {
        skipped += 1;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
    setQuickCaptureStatus(`Batch complete: ${saved} saved, ${skipped} skipped.`);
  } catch (error) {
    setQuickCaptureStatus("Batch capture stopped due to an error.", true);
    recordDiagnosticError("quick_batch_failed", String(error?.message || error), "captureBatchWordsFromQuickInput");
  } finally {
    G_RT.quickBatchRunning = false;
    G_DOM.quickBatchInput.disabled = false;
    G_DOM.quickBatchInput.value = "";
    G_DOM.quickWordInput?.focus();
  }
}

function entryPassesAdvancedFilters(entry, graphEntryIds, nowMs = Date.now()) {
  const posFilter = cleanText(G_APP.s.treePartOfSpeechFilter, 40).toLowerCase();
  if (posFilter && posFilter !== TREE_POS_FILTER_ALL) {
    if (!entry.labels.some((label) => label.toLowerCase() === posFilter)) {
      return false;
    }
  }
  if (G_APP.s.treeHasGraphOnly && !graphEntryIds.has(entry.id)) {
    return false;
  }
  if (G_APP.s.treeActivityFilter === "favorites" && !entry.favorite) {
    return false;
  }
  if (G_APP.s.treeActivityFilter === "linked" && !graphEntryIds.has(entry.id)) {
    return false;
  }
  if (G_APP.s.treeActivityFilter === "recent") {
    const ageMs = nowMs - new Date(entry.updatedAt || 0).getTime();
    if (!Number.isFinite(ageMs) || ageMs > 1000 * 60 * 60 * 24 * 14) {
      return false;
    }
  }
  return true;
}

function buildEntryFilterContext(searchQuery, searchMatchIds) {
  const graphEntryIds = getGraphEntryIdSet();
  const nowMs = Date.now();
  const visibleEntryIds = new Set();
  G_APP.s.entries.forEach((entry) => {
    if (!G_APP.s.treeShowArchived && entry.archivedAt) {
      return;
    }
    if (!entryPassesAdvancedFilters(entry, graphEntryIds, nowMs)) {
      return;
    }
    if (searchQuery && searchMatchIds && !searchMatchIds.has(entry.id)) {
      return;
    }
    visibleEntryIds.add(entry.id);
  });
  return {
    graphEntryIds,
    visibleEntryIds
  };
}

function buildGroupDescriptor({ key, title, labelValue, canRemove, entries, searchQuery, filterContext }) {
  const visibleEntryIds = filterContext?.visibleEntryIds instanceof Set ? filterContext.visibleEntryIds : null;
  const filtered = entries.filter((entry) => {
    if (!visibleEntryIds) {
      return true;
    }
    return visibleEntryIds.has(entry.id);
  });
  if (searchQuery && filtered.length === 0) {
    return null;
  }
  return {
    key,
    title,
    labelValue,
    canRemove,
    entries: filtered
  };
}

function buildTreeModel() {
  const searchQuery = getSearchQuery();
  const cacheKey = `${G_RT.entriesVersion}|${G_RT.gVer}|${G_APP.s.treeLabelFilter}|${G_APP.s.treePartOfSpeechFilter}|${G_APP.s.treeActivityFilter}|${G_APP.s.treeHasGraphOnly ? 1 : 0}|${G_APP.s.treeShowArchived ? 1 : 0}|${searchQuery}`;
  if (G_RT.treeModelKey === cacheKey && G_RT.treeModelVal) {
    return G_RT.treeModelVal;
  }

  const sortedLabels = G_PAGE.dictionary.getEntriesIndex().sortedLabels;
  const categories = [];
  const searchMatchIds = computeSearchMatchIds(searchQuery);
  const filterContext = buildEntryFilterContext(searchQuery, searchMatchIds);
  const graphEntryIds = filterContext.graphEntryIds;

  const buildLabelGroup = (label) =>
    buildGroupDescriptor({
      key: keyForLabel(label),
      title: label,
      labelValue: label,
      canRemove: true,
      entries: getEntriesForLabel(label),
      searchQuery,
      filterContext
    });

  const unlabeledGroup = buildGroupDescriptor({
    key: UNLABELED_KEY,
    title: UNLABELED_NAME,
    labelValue: "",
    canRemove: false,
    entries: getUnlabeledEntries(),
    searchQuery,
    filterContext
  });

  if (G_APP.s.treeLabelFilter === LABEL_FILTER_UNLABELED) {
    if (unlabeledGroup) {
      categories.push({
        key: CATEGORY_UNLABELED_KEY,
        title: UNLABELED_NAME,
        groups: [unlabeledGroup]
      });
    }
    G_RT.treeModelKey = cacheKey;
    G_RT.treeModelVal = { categories, searchQuery };
    return G_RT.treeModelVal;
  }

  if (G_APP.s.treeLabelFilter !== LABEL_FILTER_ALL) {
    const selected = G_APP.s.treeLabelFilter;
    if (sortedLabels.includes(selected)) {
      const group = buildLabelGroup(selected);
      if (group) {
        categories.push({
          key: isPartOfSpeechLabel(selected) ? CATEGORY_POS_KEY : CATEGORY_FILTERED_KEY,
          title: isPartOfSpeechLabel(selected) ? "Parts of Speech" : "Labels",
          groups: [group]
        });
      }
    }
    G_RT.treeModelKey = cacheKey;
    G_RT.treeModelVal = { categories, searchQuery };
    return G_RT.treeModelVal;
  }

  const buildActivityGroup = (key, title, entries) =>
    buildGroupDescriptor({
      key,
      title,
      labelValue: "",
      canRemove: false,
      entries,
      searchQuery,
      filterContext
    });

  const favoriteGroup = buildActivityGroup(
    "activity:favorites",
    "Favorites",
    G_APP.s.entries.filter((entry) => entry.favorite)
  );
  const linkedGroup = buildActivityGroup(
    "activity:linked",
    "Linked in Graph",
    G_APP.s.entries.filter((entry) => graphEntryIds.has(entry.id))
  );
  const recentGroup = buildActivityGroup(
    "activity:recent",
    "Recently Updated",
    [...G_APP.s.entries]
      .sort((left, right) => String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")))
      .slice(0, 200)
  );
  const activityGroups = [favoriteGroup, linkedGroup, recentGroup].filter(Boolean);
  if (activityGroups.length > 0) {
    categories.push({
      key: "activity",
      title: "Activity",
      groups: activityGroups
    });
  }

  const partOfSpeechGroups = [];
  const labelGroups = [];

  sortedLabels.forEach((label) => {
    const group = buildLabelGroup(label);
    if (!group) {
      return;
    }
    if (isPartOfSpeechLabel(label)) {
      partOfSpeechGroups.push(group);
    } else {
      labelGroups.push(group);
    }
  });

  if (partOfSpeechGroups.length > 0) {
    categories.push({
      key: CATEGORY_POS_KEY,
      title: "Parts of Speech",
      groups: partOfSpeechGroups
    });
  }

  if (labelGroups.length > 0) {
    categories.push({
      key: CATEGORY_LABELS_KEY,
      title: "Labels",
      groups: labelGroups
    });
  }

  if (unlabeledGroup) {
    categories.push({
      key: CATEGORY_UNLABELED_KEY,
      title: UNLABELED_NAME,
      groups: [unlabeledGroup]
    });
  }

  G_RT.treeModelKey = cacheKey;
  G_RT.treeModelVal = { categories, searchQuery };
  return G_RT.treeModelVal;
}

function createFileRow(entry) {
  const row = document.createElement("li");
  row.className = "fileItem";
  row.setAttribute("role", "button");
  row.tabIndex = 0;
  const selectedSet = new Set(G_APP.s.selectedEntryIds);
  (entry.id === G_APP.s.selectedEntryId) && (row.classList.add("selected"));
  (selectedSet.has(entry.id)) && (row.classList.add("multi"));
  row.dataset.action = "select-entry";
  row.dataset.entryId = entry.id;
  const favoritePrefix = entry.favorite ? "* " : "";
  const archivedSuffix = entry.archivedAt ? " [archived]" : "";
  const mode = normalizeEntryMode(entry.mode);
  const modePrefix = mode === "definition" ? "" : `[${mode}] `;
  row.textContent = `${favoritePrefix}${modePrefix}${entry.word}${archivedSuffix}`;
  return row;
}

function renderVirtualizedGroupRows(viewport, descriptor) {
  if (!(viewport instanceof HTMLElement)) {
    return;
  }
  const spacer = viewport.querySelector(".virtualListSpacer");
  const fileList = viewport.querySelector(".virtualFileList");
  if (!(spacer instanceof HTMLElement) || !(fileList instanceof HTMLElement)) {
    return;
  }

  const entryCount = descriptor.entries.length;
  const fallbackHeight = Math.min(
    TREE_VIRTUAL_VIEWPORT_MAX_HEIGHT,
    Math.max(TREE_VIRTUAL_ROW_HEIGHT, entryCount * TREE_VIRTUAL_ROW_HEIGHT)
  );
  const viewportHeight = viewport.clientHeight || fallbackHeight;
  const scrollTop = Number(G_APP.s.groupScrollTops[descriptor.key]) || viewport.scrollTop || 0;

  const windowState = calculateVirtualWindow({
    totalCount: entryCount,
    scrollTop,
    viewportHeight,
    rowHeight: TREE_VIRTUAL_ROW_HEIGHT,
    overscan: TREE_VIRTUAL_OVERSCAN
  });

  G_APP.s.groupScrollTops[descriptor.key] = windowState.scrollTop;
  (viewport.scrollTop !== windowState.scrollTop) && (viewport.scrollTop = windowState.scrollTop);
  spacer.style.height = `${windowState.totalHeight}px`;
  fileList.style.transform = `translateY(${windowState.offsetTop}px)`;
  fileList.innerHTML = "";

  const visibleEntries = descriptor.entries.slice(windowState.start, windowState.end);
  if (visibleEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "emptyFolder";
    empty.textContent = "empty";
    fileList.appendChild(empty);
    return;
  }

  visibleEntries.forEach((entry) => {
    fileList.appendChild(createFileRow(entry));
  });
}

function createVirtualizedFileList(descriptor) {
  const viewport = document.createElement("div");
  viewport.className = "virtualListViewport";
  viewport.dataset.groupKey = descriptor.key;
  const viewportHeight = Math.min(
    TREE_VIRTUAL_VIEWPORT_MAX_HEIGHT,
    Math.max(TREE_VIRTUAL_ROW_HEIGHT * 4, descriptor.entries.length * TREE_VIRTUAL_ROW_HEIGHT)
  );
  viewport.style.maxHeight = `${viewportHeight}px`;
  viewport.style.height = `${viewportHeight}px`;

  const spacer = document.createElement("div");
  spacer.className = "virtualListSpacer";

  const fileList = document.createElement("ul");
  fileList.className = "fileList virtualFileList";

  viewport.appendChild(spacer);
  viewport.appendChild(fileList);

  const savedScrollTop = Number(G_APP.s.groupScrollTops[descriptor.key]) || 0;
  (savedScrollTop > 0) && (viewport.scrollTop = savedScrollTop);

  viewport.addEventListener("scroll", () => {
    G_APP.s.groupScrollTops[descriptor.key] = viewport.scrollTop;
    renderVirtualizedGroupRows(viewport, descriptor);
  });

  renderVirtualizedGroupRows(viewport, descriptor);
  return viewport;
}

function createTreeGroup(descriptor, forceExpanded) {
  const group = document.createElement("li");
  group.className = "treeGroup";
  group.dataset.groupKey = descriptor.key;
  (descriptor.canRemove && descriptor.labelValue) && (group.dataset.label = descriptor.labelValue);

  const folderRow = document.createElement("div");
  folderRow.className = "folderRow";
  folderRow.setAttribute("role", "button");
  folderRow.tabIndex = 0;
  folderRow.dataset.action = "select-folder";
  folderRow.dataset.groupKey = descriptor.key;
  folderRow.dataset.label = descriptor.labelValue || "";
  (G_APP.s.selectedTreeGroupKey === descriptor.key) && (folderRow.classList.add("selected"));

  const toggleControl = document.createElement("span");
  const expanded = forceExpanded || isGroupExpanded(descriptor.key);
  toggleControl.className = "treeControl toggleControl";
  toggleControl.setAttribute("role", "button");
  toggleControl.tabIndex = 0;
  toggleControl.dataset.action = "toggle-group";
  toggleControl.dataset.groupKey = descriptor.key;
  toggleControl.setAttribute("aria-expanded", expanded ? "true" : "false");
  toggleControl.textContent = expanded ? "▾" : "▸";

  const folderName = document.createElement("span");
  folderName.className = "folderName";
  folderName.textContent = `${descriptor.title}/ (${descriptor.entries.length})`;

  folderRow.appendChild(toggleControl);
  folderRow.appendChild(folderName);
  group.appendChild(folderRow);

  if (!expanded) {
    return group;
  }

  if (shouldVirtualizeGroup(descriptor.entries.length, TREE_VIRTUALIZATION_THRESHOLD)) {
    group.appendChild(createVirtualizedFileList(descriptor));
    return group;
  }

  const limit = getGroupLimit(descriptor.key);
  const visibleEntries = descriptor.entries.slice(0, limit);
  const fileList = document.createElement("ul");
  fileList.className = "fileList";

  if (visibleEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "emptyFolder";
    empty.textContent = "empty";
    fileList.appendChild(empty);
  } else {
    visibleEntries.forEach((entry) => {
      fileList.appendChild(createFileRow(entry));
    });
  }

  group.appendChild(fileList);

  if (descriptor.entries.length > visibleEntries.length) {
    const showMoreControl = document.createElement("span");
    showMoreControl.className = "treeControl showMoreControl";
    showMoreControl.setAttribute("role", "button");
    showMoreControl.tabIndex = 0;
    showMoreControl.dataset.action = "show-more";
    showMoreControl.dataset.groupKey = descriptor.key;
    const remaining = descriptor.entries.length - visibleEntries.length;
    showMoreControl.textContent = `Show ${Math.min(remaining, TREE_PAGE_SIZE)} more`;
    group.appendChild(showMoreControl);
  }

  return group;
}

function createCategoryGroup(category, forceExpanded) {
  const categoryStateKey = keyForCategory(category.key);
  const categoryItem = document.createElement("li");
  categoryItem.className = "categoryGroup";
  categoryItem.dataset.groupKey = categoryStateKey;

  const categoryRow = document.createElement("div");
  categoryRow.className = "categoryRow";
  categoryRow.setAttribute("role", "button");
  categoryRow.tabIndex = 0;
  categoryRow.dataset.action = "select-folder";
  categoryRow.dataset.groupKey = categoryStateKey;
  categoryRow.dataset.label = "";
  (G_APP.s.selectedTreeGroupKey === categoryStateKey) && (categoryRow.classList.add("selected"));

  const toggleControl = document.createElement("span");
  const expanded = forceExpanded || isGroupExpanded(categoryStateKey);
  toggleControl.className = "treeControl toggleControl";
  toggleControl.setAttribute("role", "button");
  toggleControl.tabIndex = 0;
  toggleControl.dataset.action = "toggle-group";
  toggleControl.dataset.groupKey = categoryStateKey;
  toggleControl.setAttribute("aria-expanded", expanded ? "true" : "false");
  toggleControl.textContent = expanded ? "▾" : "▸";

  const categoryName = document.createElement("span");
  categoryName.className = "categoryName";
  categoryName.textContent = `${category.title}/ (${category.groups.length})`;

  categoryRow.appendChild(toggleControl);
  categoryRow.appendChild(categoryName);
  categoryItem.appendChild(categoryRow);

  if (!expanded) {
    return categoryItem;
  }

  const children = document.createElement("ul");
  children.className = "categoryChildren";
  category.groups.forEach((group) => {
    children.appendChild(createTreeGroup(group, forceExpanded));
  });
  categoryItem.appendChild(children);

  return categoryItem;
}

function renderTreeSummary(categories, searchQuery) {
  const visibleWordIds = new Set();
  let folderCount = 0;
  const contextLabel = normalizeLabel(G_APP.s.selectedTreeLabel);
  const contextSuffix = contextLabel ? ` Context: ${contextLabel}.` : "";

  categories.forEach((category) => {
    folderCount += category.groups.length;
    category.groups.forEach((group) => {
      group.entries.forEach((entry) => visibleWordIds.add(entry.id));
    });
  });

  if (categories.length === 0) {
    G_DOM.treeSummary.textContent = `No results.${contextSuffix}`.trim();
    return;
  }

  if (searchQuery) {
    G_DOM.treeSummary.textContent = `Found ${visibleWordIds.size} matching words in ${folderCount} folder(s).${contextSuffix}`;
    return;
  }

  if (G_APP.s.treeLabelFilter !== LABEL_FILTER_ALL) {
    G_DOM.treeSummary.textContent = `Showing ${visibleWordIds.size} words.${contextSuffix}`;
    return;
  }

  if (G_APP.s.treeActivityFilter !== TREE_ACTIVITY_FILTER_ALL) {
    G_DOM.treeSummary.textContent = `Showing ${visibleWordIds.size} words in activity filter "${G_APP.s.treeActivityFilter}".${contextSuffix}`;
    return;
  }

  G_DOM.treeSummary.textContent = `Brain: ${visibleWordIds.size} active words across ${folderCount} folders. Alt+1..6 = quick top-label filter.${contextSuffix}`;
}

function getFilteredArchivedEntries() {
  const query = cleanText(G_APP.s.archiveSearch, MAX.WORD).toLowerCase();
  return G_APP.s.entries
    .filter((entry) => entry.archivedAt)
    .filter((entry) => {
      if (!query) {
        return true;
      }
      return (
        entry.word.toLowerCase().includes(query) ||
        entry.definition.toLowerCase().includes(query) ||
        entry.labels.some((label) => label.toLowerCase().includes(query))
      );
    })
    .sort((left, right) => String(right.archivedAt || "").localeCompare(String(left.archivedAt || "")));
}

function restoreFilteredArchivedEntries() {
  const list = getFilteredArchivedEntries();
  if (list.length === 0) {
    setStatus("No archived words match filter.", true);
    return;
  }
  list.forEach((entry) => restoreEntryById(entry.id));
  setStatus(`Restored ${list.length} archived word(s).`);
}

function purgeFilteredArchivedEntries() {
  const list = getFilteredArchivedEntries();
  if (list.length === 0) {
    setStatus("No archived words match filter.", true);
    return;
  }
  const approved = window.confirm(`Permanently delete ${list.length} archived word(s)? This cannot be undone.`);
  if (!approved) {
    return;
  }
  list.forEach((entry) => deleteEntryById(entry.id));
  setStatus(`Permanently deleted ${list.length} archived word(s).`);
}

function renderArchivePanel() {
  if (!(G_DOM.archiveList instanceof HTMLElement) || !(G_DOM.archiveSummary instanceof HTMLElement)) {
    return;
  }
  const filtered = getFilteredArchivedEntries();
  const totalArchived = G_APP.s.entries.filter((entry) => entry.archivedAt).length;
  const searchText = cleanText(G_APP.s.archiveSearch, MAX.WORD);
  G_DOM.archiveSummary.textContent = searchText
    ? `Archive: ${filtered.length}/${totalArchived} word(s) match "${searchText}".`
    : `Archive: ${totalArchived} word(s).`;

  G_DOM.archiveList.innerHTML = "";
  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "archiveItem";
    empty.textContent = "No archived words.";
    G_DOM.archiveList.appendChild(empty);
    return;
  }

  filtered.slice(0, 160).forEach((entry) => {
    const row = document.createElement("li");
    row.className = "archiveItem";
    row.textContent = `${entry.word} (${entry.labels.join(", ") || "no-label"})`;
    row.dataset.entryId = entry.id;
    row.addEventListener("dblclick", () => {
      restoreEntryById(entry.id);
      setStatus(`Restored "${entry.word}".`);
    });
    G_DOM.archiveList.appendChild(row);
  });
}

function renderTree() {
  const startedAt = performance.now();
  updateLabelFilterOptions();
  updatePartOfSpeechFilterOptions();
  updateActivityFilterOptions();
  renderTopLabelBar();
  updateHistoryRestoreOptions();
  (G_DOM.treeHasGraphOnly instanceof HTMLInputElement) && (G_DOM.treeHasGraphOnly.checked = G_APP.s.treeHasGraphOnly);
  (G_DOM.treeShowArchived instanceof HTMLInputElement) && (G_DOM.treeShowArchived.checked = G_APP.s.treeShowArchived);
  (G_DOM.toggleGraphLockAction instanceof HTMLElement) && (G_DOM.toggleGraphLockAction.textContent = G_APP.s.graphLockEnabled ? "Unlock Graph Drag" : "Lock Graph Drag");

  const { categories, searchQuery } = buildTreeModel();
  const forceExpanded = searchQuery.length > 0;

  G_DOM.treeView.innerHTML = "";
  renderTreeSummary(categories, searchQuery);

  if (categories.length === 0) {
    const empty = document.createElement("li");
    empty.className = "treeEmpty";
    empty.textContent = "No words found.";
    G_DOM.treeView.appendChild(empty);
    renderArchivePanel();
    return;
  }

  categories.forEach((category) => {
    G_DOM.treeView.appendChild(createCategoryGroup(category, forceExpanded));
  });
  renderArchivePanel();
  if (G_APP.s.activeView === VIEW_STATISTICS) {
    renderStatisticsView();
  } else {
    (G_APP.s.activeView === VIEW_UNIVERSE) &&
      (G_PAGE.universe.renderSummary(), G_PAGE.universe.renderCluster(), G_PAGE.universe.reqRender());
  }
  recordDiagnosticPerf("render_tree_ms", performance.now() - startedAt);
}

function getAllGroupKeys() {
  const sortedLabels = G_PAGE.dictionary.getEntriesIndex().sortedLabels;
  return [
    keyForCategory(CATEGORY_POS_KEY),
    keyForCategory(CATEGORY_LABELS_KEY),
    keyForCategory(CATEGORY_UNLABELED_KEY),
    keyForCategory(CATEGORY_FILTERED_KEY),
    keyForCategory("activity"),
    "activity:favorites",
    "activity:linked",
    "activity:recent",
    ...sortedLabels.map(keyForLabel),
    UNLABELED_KEY
  ];
}

function expandAllGroups() {
  getAllGroupKeys().forEach((groupKey) => {
    setGroupExpanded(groupKey, true);
  });
  G_PAGE.tree.reqRender();
}

function collapseAllGroups() {
  G_APP.s.expandedGroups = {};
  G_APP.s.groupScrollTops = {};
  G_PAGE.tree.reqRender();
}

  return {
    getTopTreeLabels,
    legacy_getTopTreeLabels: getTopTreeLabels,
    modular_getTopTreeLabels: getTopTreeLabels,
    getTopLabelCount,
    legacy_getTopLabelCount: getTopLabelCount,
    modular_getTopLabelCount: getTopLabelCount,
    selectTopLabel,
    legacy_selectTopLabel: selectTopLabel,
    modular_selectTopLabel: selectTopLabel,
    selectTopLabelByIndex,
    legacy_selectTopLabelByIndex: selectTopLabelByIndex,
    modular_selectTopLabelByIndex: selectTopLabelByIndex,
    renderTopLabelBar,
    legacy_renderTopLabelBar: renderTopLabelBar,
    modular_renderTopLabelBar: renderTopLabelBar,
    parseQuickBatchWords,
    legacy_parseQuickBatchWords: parseQuickBatchWords,
    modular_parseQuickBatchWords: parseQuickBatchWords,
    parseSentenceInputWords,
    legacy_parseSentenceInputWords: parseSentenceInputWords,
    modular_parseSentenceInputWords: parseSentenceInputWords,
    captureSingleWord,
    legacy_captureSingleWord: captureSingleWord,
    modular_captureSingleWord: captureSingleWord,
    captureWordFromQuickInput,
    legacy_captureWordFromQuickInput: captureWordFromQuickInput,
    modular_captureWordFromQuickInput: captureWordFromQuickInput,
    captureBatchWordsFromQuickInput,
    legacy_captureBatchWordsFromQuickInput: captureBatchWordsFromQuickInput,
    modular_captureBatchWordsFromQuickInput: captureBatchWordsFromQuickInput,
    entryPassesAdvancedFilters,
    legacy_entryPassesAdvancedFilters: entryPassesAdvancedFilters,
    modular_entryPassesAdvancedFilters: entryPassesAdvancedFilters,
    buildEntryFilterContext,
    legacy_buildEntryFilterContext: buildEntryFilterContext,
    modular_buildEntryFilterContext: buildEntryFilterContext,
    buildGroupDescriptor,
    legacy_buildGroupDescriptor: buildGroupDescriptor,
    modular_buildGroupDescriptor: buildGroupDescriptor,
    buildTreeModel,
    legacy_buildTreeModel: buildTreeModel,
    modular_buildTreeModel: buildTreeModel,
    createFileRow,
    legacy_createFileRow: createFileRow,
    modular_createFileRow: createFileRow,
    renderVirtualizedGroupRows,
    legacy_renderVirtualizedGroupRows: renderVirtualizedGroupRows,
    modular_renderVirtualizedGroupRows: renderVirtualizedGroupRows,
    createVirtualizedFileList,
    legacy_createVirtualizedFileList: createVirtualizedFileList,
    modular_createVirtualizedFileList: createVirtualizedFileList,
    createTreeGroup,
    legacy_createTreeGroup: createTreeGroup,
    modular_createTreeGroup: createTreeGroup,
    createCategoryGroup,
    legacy_createCategoryGroup: createCategoryGroup,
    modular_createCategoryGroup: createCategoryGroup,
    renderTreeSummary,
    legacy_renderTreeSummary: renderTreeSummary,
    modular_renderTreeSummary: renderTreeSummary,
    getFilteredArchivedEntries,
    legacy_getFilteredArchivedEntries: getFilteredArchivedEntries,
    modular_getFilteredArchivedEntries: getFilteredArchivedEntries,
    restoreFilteredArchivedEntries,
    legacy_restoreFilteredArchivedEntries: restoreFilteredArchivedEntries,
    modular_restoreFilteredArchivedEntries: restoreFilteredArchivedEntries,
    purgeFilteredArchivedEntries,
    legacy_purgeFilteredArchivedEntries: purgeFilteredArchivedEntries,
    modular_purgeFilteredArchivedEntries: purgeFilteredArchivedEntries,
    renderArchivePanel,
    legacy_renderArchivePanel: renderArchivePanel,
    modular_renderArchivePanel: renderArchivePanel,
    renderTree,
    legacy_renderTree: renderTree,
    modular_renderTree: renderTree,
    getAllGroupKeys,
    legacy_getAllGroupKeys: getAllGroupKeys,
    modular_getAllGroupKeys: getAllGroupKeys,
    expandAllGroups,
    legacy_expandAllGroups: expandAllGroups,
    modular_expandAllGroups: expandAllGroups,
    collapseAllGroups,
    legacy_collapseAllGroups: collapseAllGroups,
    modular_collapseAllGroups: collapseAllGroups,
  };
});
