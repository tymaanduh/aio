/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Selection_Domain = __MODULE_API;
  root.DictionaryRendererSelectionDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function clearEntrySelections() {
  G_APP.s.selectedEntryIds = [];
  G_APP.s.lastSelectedEntryId = null;
}

function setSingleEntrySelection(entryId) {
  G_APP.s.selectedEntryIds = entryId ? [entryId] : [];
  G_APP.s.lastSelectedEntryId = entryId || null;
}

function toggleEntrySelection(entryId) {
  if (!entryId) {
    return;
  }
  const selected = new Set(G_APP.s.selectedEntryIds);
  if (selected.has(entryId)) {
    selected.delete(entryId);
  } else {
    selected.add(entryId);
  }
  G_APP.s.selectedEntryIds = [...selected];
  G_APP.s.lastSelectedEntryId = entryId;
}

function selectEntryRange(targetEntryId) {
  const visible = getVisibleTreeEntries();
  if (visible.length === 0 || !targetEntryId) {
    return;
  }

  const anchorId = G_APP.s.lastSelectedEntryId || G_APP.s.selectedEntryId || targetEntryId;
  const fromIndex = visible.findIndex((entry) => entry.id === anchorId);
  const toIndex = visible.findIndex((entry) => entry.id === targetEntryId);
  if (fromIndex < 0 || toIndex < 0) {
    setSingleEntrySelection(targetEntryId);
    return;
  }

  const [start, end] = fromIndex < toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex];
  G_APP.s.selectedEntryIds = visible.slice(start, end + 1).map((entry) => entry.id);
  G_APP.s.lastSelectedEntryId = targetEntryId;
}

function getSelectedEntries() {
  if (!Array.isArray(G_APP.s.selectedEntryIds) || G_APP.s.selectedEntryIds.length === 0) {
    return [];
  }
  const selectedSet = new Set(G_APP.s.selectedEntryIds);
  return G_APP.s.entries.filter((entry) => selectedSet.has(entry.id));
}

function syncSelectionWithEntry(entryId) {
  const normalizedId = cleanText(entryId, MAX.WORD);
  G_UNI.sel.activeSetId = "";
  if (!normalizedId) {
    setNodeSelectionSet([], -1);
    G_PAGE.universe.renderCluster();
    if (G_APP.s.activeView === CONSTANT_VIEW.UNIVERSE) {
      G_PAGE.universe.reqRender();
    }
    return;
  }
  const nextIndex = G_UNI.idx.entry.get(normalizedId);
  if (Number.isInteger(nextIndex)) {
    setNodeSelectionSet([nextIndex], nextIndex);
  } else {
    setNodeSelectionSet([], -1);
  }
  G_PAGE.universe.renderCluster();
  (G_APP.s.activeView === CONSTANT_VIEW.UNIVERSE) && (G_PAGE.universe.reqRender());
}

function focusEntryWithoutUsage(entryId) {
  const entry = getEntryById(entryId);
  if (!entry) {
    return;
  }
  renderEditorForEntry(entry, {
    syncUniverse: false
  });
  ensureEntryVisible(entry);
  G_PAGE.tree.reqRender();
  renderStatisticsView();
}

function getEntryById(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return null;
  }
  return G_PAGE.dictionary.getEntriesIndex().byId.get(id) || null;
}


function getGraphEntryIdSet() {
  const linkedEntryIds = G_PAGE.sentence.getIndex().linkedEntryIds;
  if (linkedEntryIds instanceof Set) {
    return linkedEntryIds;
  }
  return new Set();
}

function getVisibleTreeEntries() {
  const { categories } = buildTreeModel();
  const visible = [];
  const seen = new Set();
  categories.forEach((category) => {
    category.groups.forEach((group) => {
      group.entries.forEach((entry) => {
        if (seen.has(entry.id)) {
          return;
        }
        seen.add(entry.id);
        visible.push(entry);
      });
    });
  });
  return visible;
}

  return {
    clearEntrySelections,
    legacy_clearEntrySelections: clearEntrySelections,
    modular_clearEntrySelections: clearEntrySelections,
    setSingleEntrySelection,
    legacy_setSingleEntrySelection: setSingleEntrySelection,
    modular_setSingleEntrySelection: setSingleEntrySelection,
    toggleEntrySelection,
    legacy_toggleEntrySelection: toggleEntrySelection,
    modular_toggleEntrySelection: toggleEntrySelection,
    selectEntryRange,
    legacy_selectEntryRange: selectEntryRange,
    modular_selectEntryRange: selectEntryRange,
    getSelectedEntries,
    legacy_getSelectedEntries: getSelectedEntries,
    modular_getSelectedEntries: getSelectedEntries,
    syncSelectionWithEntry,
    legacy_syncSelectionWithEntry: syncSelectionWithEntry,
    modular_syncSelectionWithEntry: syncSelectionWithEntry,
    focusEntryWithoutUsage,
    legacy_focusEntryWithoutUsage: focusEntryWithoutUsage,
    modular_focusEntryWithoutUsage: focusEntryWithoutUsage,
    getEntryById,
    legacy_getEntryById: getEntryById,
    modular_getEntryById: getEntryById,

    getGraphEntryIdSet,
    legacy_getGraphEntryIdSet: getGraphEntryIdSet,
    modular_getGraphEntryIdSet: getGraphEntryIdSet,
    getVisibleTreeEntries,
    legacy_getVisibleTreeEntries: getVisibleTreeEntries,
    modular_getVisibleTreeEntries: getVisibleTreeEntries,
  };
});
