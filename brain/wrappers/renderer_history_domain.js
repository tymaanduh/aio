/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_History_Domain = __MODULE_API;
  root.DictionaryRendererHistoryDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function updateHistoryRestoreOptions() {
    if (!(G_DOM.historyRestoreSelect instanceof HTMLSelectElement)) {
      return;
    }

    G_DOM.historyRestoreSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = `Restore checkpoint (${G_APP.s.history.length})`;
    G_DOM.historyRestoreSelect.appendChild(placeholder);

    G_APP.s.history.forEach((checkpoint) => {
      const option = document.createElement("option");
      option.value = checkpoint.id;
      option.textContent = `${new Date(checkpoint.createdAt).toLocaleString()} - ${checkpoint.reason || "snapshot"}`;
      G_DOM.historyRestoreSelect.appendChild(option);
    });
  }

  function buildCheckpointDigest(payload) {
    return JSON.stringify({
      labels: payload.labels,
      entries: payload.entries.map((entry) => ({
        word: entry.word,
        definition: entry.definition,
        labels: entry.labels,
        favorite: Boolean(entry.favorite),
        archivedAt: entry.archivedAt || null,
        mode: normalizeEntryMode(entry.mode),
        language: normalizeEntryLanguage(entry.language || ""),
        usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0))
      })),
      sentenceGraph: payload.sentenceGraph
    });
  }

  function buildHistoryCheckpoint(reason = "checkpoint") {
    return {
      id: window.crypto.randomUUID(),
      reason: cleanText(reason, 80) || "checkpoint",
      createdAt: nowIso(),
      labels: [...G_APP.s.labels],
      entries: G_APP.s.entries.map((entry) => ({
        id: entry.id,
        word: entry.word,
        definition: entry.definition,
        labels: [...entry.labels],
        favorite: Boolean(entry.favorite),
        archivedAt: entry.archivedAt || null,
        mode: normalizeEntryMode(entry.mode),
        language: normalizeEntryLanguage(entry.language || ""),
        usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0)),
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      })),
      sentenceGraph: {
        nodes: G_APP.s.sentenceGraph.nodes.map((node) => ({ ...node })),
        links: G_APP.s.sentenceGraph.links.map((link) => ({ ...link }))
      }
    };
  }

  function ensureCheckpoint(reason = "autosave") {
    const checkpoint = buildHistoryCheckpoint(reason);
    const digest = buildCheckpointDigest(checkpoint);
    if (digest === G_RT.lastHistoryDigest) {
      return;
    }
    G_RT.lastHistoryDigest = digest;
    G_APP.s.history = [checkpoint, ...G_APP.s.history].slice(0, HISTORY_MAX);
    updateHistoryRestoreOptions();
  }

  function restoreCheckpointById(checkpointId) {
    const id = cleanText(checkpointId, MAX.WORD);
    if (!id) {
      return false;
    }
    const checkpoint = G_APP.s.history.find((item) => item.id === id);
    if (!checkpoint) {
      return false;
    }

    G_APP.st.setLabels(normalizeLabelArray(checkpoint.labels));
    G_APP.st.setEntries(
      (Array.isArray(checkpoint.entries) ? checkpoint.entries : []).map(normalizeLoadedEntry).filter(Boolean)
    );
    sortEntries();
    G_APP.st.setGraph(normalizeLoadedSentenceGraph(checkpoint.sentenceGraph));
    G_APP.s.selectedEntryId = null;
    G_APP.s.selectedGraphNodeId = null;
    clearEntrySelections();
    clearPendingLink();
    G_PAGE.tree.reqRender();
    G_PAGE.sentence.reqRender();
    setSentenceStatus(`Restored checkpoint: ${checkpoint.reason}`);
    scheduleAutosave();
    return true;
  }

  function buildUndoSnapshot(reason = "change") {
    return {
      id: window.crypto.randomUUID(),
      reason: cleanText(reason, 80) || "change",
      createdAt: nowIso(),
      labels: [...G_APP.s.labels],
      entries: G_APP.s.entries.map((entry) => ({
        ...entry,
        labels: [...entry.labels]
      })),
      sentenceGraph: {
        nodes: G_APP.s.sentenceGraph.nodes.map((node) => ({ ...node })),
        links: G_APP.s.sentenceGraph.links.map((link) => ({ ...link }))
      },
      graphLockEnabled: G_APP.s.graphLockEnabled
    };
  }

  function digestUndoSnapshot(snapshot) {
    return JSON.stringify({
      labels: snapshot.labels,
      entries: snapshot.entries.map((entry) => ({
        word: entry.word,
        definition: entry.definition,
        labels: entry.labels,
        archivedAt: entry.archivedAt || null,
        favorite: Boolean(entry.favorite),
        mode: normalizeEntryMode(entry.mode),
        language: normalizeEntryLanguage(entry.language || ""),
        usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0))
      })),
      sentenceGraph: snapshot.sentenceGraph,
      graphLockEnabled: snapshot.graphLockEnabled
    });
  }

  function captureUndoSnapshot(reason = "change") {
    if (G_RT.undoReplayActive) {
      return;
    }
    const snapshot = buildUndoSnapshot(reason);
    const digest = digestUndoSnapshot(snapshot);
    if (digest === G_RT.lastUndoDigest) {
      return;
    }
    G_RT.undoStack = [...G_RT.undoStack, snapshot].slice(-120);
    G_RT.redoStack = [];
    G_RT.lastUndoDigest = digest;
  }

  function applyUndoSnapshot(snapshot, options = {}) {
    const { announce = "" } = options;
    if (!snapshot) {
      return false;
    }
    G_RT.undoReplayActive = true;
    G_APP.st.setLabels(normalizeLabelArray(snapshot.labels));
    G_APP.st.setEntries(
      (Array.isArray(snapshot.entries) ? snapshot.entries : []).map(normalizeLoadedEntry).filter(Boolean)
    );
    sortEntries();
    G_APP.st.setGraph(normalizeLoadedSentenceGraph(snapshot.sentenceGraph));
    G_APP.s.graphLockEnabled = Boolean(snapshot.graphLockEnabled);
    G_APP.s.selectedEntryId = null;
    G_APP.s.selectedGraphNodeId = null;
    clearEntrySelections();
    clearPendingLink();
    G_PAGE.tree.reqRender();
    G_PAGE.sentence.reqRender();
    announce && setStatus(announce);
    G_RT.undoReplayActive = false;
    return true;
  }

  function runUndo() {
    if (G_RT.undoStack.length < 2) {
      return false;
    }
    const current = G_RT.undoStack.pop();
    const previous = G_RT.undoStack[G_RT.undoStack.length - 1];
    if (!previous) {
      if (current) {
        G_RT.undoStack.push(current);
      }
      return false;
    }
    current && (G_RT.redoStack = [...G_RT.redoStack, current].slice(-120));
    applyUndoSnapshot(previous, { announce: "Undo applied." });
    return true;
  }

  function runRedo() {
    const next = G_RT.redoStack.pop();
    if (!next) {
      return false;
    }
    G_RT.undoStack = [...G_RT.undoStack, next].slice(-120);
    applyUndoSnapshot(next, { announce: "Redo applied." });
    return true;
  }

  return {
    updateHistoryRestoreOptions,
    modular_updateHistoryRestoreOptions: updateHistoryRestoreOptions,
    buildCheckpointDigest,
    modular_buildCheckpointDigest: buildCheckpointDigest,
    buildHistoryCheckpoint,
    modular_buildHistoryCheckpoint: buildHistoryCheckpoint,
    ensureCheckpoint,
    modular_ensureCheckpoint: ensureCheckpoint,
    restoreCheckpointById,
    modular_restoreCheckpointById: restoreCheckpointById,
    buildUndoSnapshot,
    modular_buildUndoSnapshot: buildUndoSnapshot,
    digestUndoSnapshot,
    modular_digestUndoSnapshot: digestUndoSnapshot,
    captureUndoSnapshot,
    modular_captureUndoSnapshot: captureUndoSnapshot,
    applyUndoSnapshot,
    modular_applyUndoSnapshot: applyUndoSnapshot,
    runUndo,
    modular_runUndo: runUndo,
    runRedo,
    modular_runRedo: runRedo
  };
});
