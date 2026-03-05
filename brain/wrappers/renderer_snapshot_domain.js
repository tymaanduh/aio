/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Snapshot_Domain = __MODULE_API;
  root.DictionaryRendererSnapshotDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function buildSnapshot() {
    return {
      version: 4,
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
        nodes: G_APP.s.sentenceGraph.nodes.map((node) => ({
          id: node.id,
          entryId: node.entryId,
          word: node.word,
          locked: Boolean(node.locked),
          x: node.x,
          y: node.y
        })),
        links: G_APP.s.sentenceGraph.links.map((link) => ({
          id: link.id,
          fromNodeId: link.fromNodeId,
          toNodeId: link.toNodeId
        }))
      },
      history: G_APP.s.history.map((checkpoint) => ({
        id: checkpoint.id,
        reason: checkpoint.reason,
        createdAt: checkpoint.createdAt,
        labels: checkpoint.labels,
        entries: checkpoint.entries,
        sentenceGraph: checkpoint.sentenceGraph
      })),
      graphLockEnabled: G_APP.s.graphLockEnabled,
      localAssistEnabled: G_APP.s.localAssistEnabled,
      diagnostics: normalizeDiagnostics(G_APP.s.diagnostics),
      lastSavedAt: G_APP.s.lastSavedAt
    };
  }

  function hydrateState(loaded) {
    const source = loaded && typeof loaded === "object" ? loaded : {};

    const hydratedLabels = Array.isArray(source.labels) ? normalizeLabelArray(source.labels) : [...DEFAULT_LABELS];
    const hydratedEntries = [];
    const labelSet = new Set(hydratedLabels.length > 0 ? hydratedLabels : DEFAULT_LABELS);

    if (Array.isArray(source.entries)) {
      source.entries.forEach((entry) => {
        const normalized = normalizeLoadedEntry(entry);
        if (!normalized) {
          return;
        }
        hydratedEntries.push(normalized);
        normalized.labels.forEach((label) => {
          labelSet.add(label);
        });
      });
    }

    G_APP.st.setLabels([...labelSet].sort((a, b) => a.localeCompare(b)));
    G_APP.st.setEntries(hydratedEntries);
    sortEntries();
    G_APP.st.setGraph(normalizeLoadedSentenceGraph(source.sentenceGraph));
    G_APP.s.selectedEntryId = null;
    clearEntrySelections();
    G_APP.s.selectedGraphNodeId = null;
    clearPendingLink();
    G_APP.s.activeView = VIEW_WORKBENCH;

    G_APP.s.treeSearch = "";
    G_APP.s.treeLabelFilter = LABEL_FILTER_ALL;
    G_APP.s.treePartOfSpeechFilter = TREE_POS_FILTER_ALL;
    G_APP.s.treeActivityFilter = TREE_ACTIVITY_FILTER_ALL;
    G_APP.s.treeHasGraphOnly = false;
    G_APP.s.treeShowArchived = false;
    G_APP.s.selectedTreeGroupKey = "";
    G_APP.s.selectedTreeLabel = "";
    G_APP.s.explorerLayoutMode = EXPLORER_LAYOUT_NORMAL;
    G_APP.s.archiveSearch = "";
    G_APP.s.localAssistEnabled = source.localAssistEnabled !== false;
    G_APP.s.expandedGroups = {
      [keyForCategory(CATEGORY_POS_KEY)]: true,
      [keyForCategory(CATEGORY_LABELS_KEY)]: true,
      [keyForCategory(CATEGORY_UNLABELED_KEY)]: true
    };
    G_APP.s.groupLimits = {};
    G_APP.s.groupScrollTops = {};
    G_APP.s.graphLockEnabled = Boolean(source.graphLockEnabled);
    G_UNI.cfg = createDefaultUniverseConfig();
    G_UNI.view.filter = "";
    G_UNI.view.zoom = 1;
    G_UNI.view.panX = 0;
    G_UNI.view.panY = 0;
    G_UNI.view.hoverNodeIndex = -1;
    G_UNI.view.selectedNodeIndex = -1;
    G_UNI.view.pulseNodeIndex = -1;
    G_UNI.view.pulseUntil = 0;
    G_RT.uPerfAt = 0;
    G_RT.uPerfMs = 0;
    G_RT.uFrameAt = 0;
    G_RT.uFrameMs = 0;
    G_RT.uHudAt = 0;
    G_UNI.sel.nodeIdxSet = new Set();
    G_UNI.canvas.flags.selected = new Uint8Array(0);
    G_UNI.sel.sets = [];
    G_UNI.sel.activeSetId = "";
    G_RT.uBench = createUniverseBenchmarkState(G_RT.uBench.lastResult);
    G_RT.uForceCanvas = false;
    resetHighlightCache();
    resetAdjacencyCache();
    clearPathHighlights();
    G_APP.s.diagnostics = normalizeDiagnostics(source.diagnostics);
    G_APP.s.history = Array.isArray(source.history)
      ? source.history
          .map((checkpoint) => {
            const item = checkpoint && typeof checkpoint === "object" ? checkpoint : {};
            return {
              id: cleanText(item.id, MAX.WORD) || window.crypto.randomUUID(),
              reason: cleanText(item.reason, 80) || "checkpoint",
              createdAt: cleanText(item.createdAt, MAX.DATE) || nowIso(),
              labels: normalizeLabelArray(item.labels),
              entries: (Array.isArray(item.entries) ? item.entries : []).map(normalizeLoadedEntry).filter(Boolean),
              sentenceGraph: normalizeLoadedSentenceGraph(item.sentenceGraph)
            };
          })
          .slice(0, HISTORY_MAX)
      : [];
    G_RT.lastHistoryDigest = "";
    G_APP.s.lastSavedAt = cleanText(source.lastSavedAt, MAX.DATE) || null;
    G_RT.undoStack = [];
    G_RT.redoStack = [];
    G_RT.lastUndoDigest = "";
    captureUndoSnapshot("initial");
    G_DOM.localAssistEnabled instanceof HTMLInputElement &&
      (G_DOM.localAssistEnabled.checked = G_APP.s.localAssistEnabled);
    setExplorerLayoutMode(EXPLORER_LAYOUT_NORMAL, { announce: false });
    setEntryWarnings([]);
    renderDiagnosticsSummary();
    scheduleIndexWarmup();
    scheduleGraphBuild();
    updateHistoryRestoreOptions();
    setActiveView(VIEW_WORKBENCH);
    setQuickCaptureStatus("Quick capture ready.");
    G_DOM.archiveSearchInput instanceof HTMLInputElement && (G_DOM.archiveSearchInput.value = "");
    G_DOM.universeFilterInput instanceof HTMLInputElement && (G_DOM.universeFilterInput.value = "");
    G_DOM.universePathFromInput instanceof HTMLInputElement && (G_DOM.universePathFromInput.value = "");
    G_DOM.universePathToInput instanceof HTMLInputElement && (G_DOM.universePathToInput.value = "");
    G_PAGE.universe.syncControls();
    updateUniverseBookmarkSelect();
    syncCanvasVisibility();
    renderPerfHud(true);
    G_PAGE.universe.renderCluster();
  }

  async function loadDictionaryData() {
    try {
      const loaded = await window.app_api.load();
      hydrateState(loaded);
      if (window.app_api?.loadDiagnostics) {
        try {
          const diagnostics = await window.app_api.loadDiagnostics();
          G_APP.s.diagnostics = normalizeDiagnostics(diagnostics);
        } catch (error) {
          recordDiagnosticError("diagnostics_load_failed", String(error?.message || error), "loadDictionaryData");
        }
      }
      await loadUniverseCache();
      G_DOM.treeSearchInput instanceof HTMLInputElement && (G_DOM.treeSearchInput.value = "");
      resetEditor();
      if (G_APP.s.sentenceGraph.nodes.length === 0) {
        setSentenceStatus("Add words, drag nodes, and connect right port to left port.");
      } else {
        setSentenceStatus(`Graph loaded: ${G_APP.s.sentenceGraph.nodes.length} node(s).`);
      }
      setActiveView(VIEW_WORKBENCH);
      renderStatisticsView();
      G_PAGE.universe.renderSummary();
      void loadUniverseGpuStatus(true);
      G_PAGE.universe.reqRender();
      renderDiagnosticsSummary();
      setStatus(formatSaved(G_APP.s.lastSavedAt));
      G_DOM.wordInput instanceof HTMLInputElement && (G_DOM.wordInput.focus(), G_DOM.wordInput.select());
      G_RT.readyForAutosave = true;
      return true;
    } catch (error) {
      G_RT.readyForAutosave = false;
      setStatus("Failed to load dictionary file.", true);
      setAuthHint("Could not open dictionary after login.", true);
      console.error(error);
      return false;
    }
  }

  async function submitAuth() {
    if (G_RT.authBusy) {
      return;
    }

    const { username, password } = getAuthCredentials();
    if (!username || !password) {
      setAuthHint("Username and password are required.", true);
      return;
    }

    G_RT.authBusy = true;
    pushRuntimeLog("info", "auth", `Auth submit requested for "${username}".`, G_RT.authMode);
    setAuthHint(G_RT.authMode === AUTH_MODE_CREATE ? "Creating account..." : "Signing in...");

    try {
      let result =
        G_RT.authMode === AUTH_MODE_CREATE
          ? await window.app_api.createAccount(username, password)
          : await window.app_api.login(username, password);

      if (!result?.ok && G_RT.authMode === AUTH_MODE_CREATE && /already exists/i.test(String(result?.error || ""))) {
        result = await window.app_api.login(username, password);
      } else {
        !result?.ok &&
          G_RT.authMode === AUTH_MODE_LOGIN &&
          /no account found/i.test(String(result?.error || "")) &&
          (result = await window.app_api.createAccount(username, password));
      }

      if (!result?.ok) {
        setAuthHint(result?.error || "Authentication failed.", true);
        pushRuntimeLog("warn", "auth", `Authentication failed for "${username}".`, String(result?.error || ""));
        return;
      }

      G_DOM.authPasswordInput.value = "";
      setAuthGateVisible(false);
      pushRuntimeLog("info", "auth", `Authenticated as "${result.username || username}".`, G_RT.authMode);
      await loadDictionaryData();
    } catch (error) {
      setAuthHint("Authentication failed.", true);
      pushRuntimeLog("error", "auth", "Authentication exception.", String(error?.message || error));
      console.error(error);
    } finally {
      G_RT.authBusy = false;
    }
  }

  async function initializeAuthGate() {
    try {
      const status = await window.app_api.getAuthStatus();
      G_RT.authStatus = {
        quickLoginEnabled: Boolean(status?.quickLoginEnabled)
      };
      const shouldShowLogin = Boolean(status?.hasAccount) || G_RT.authStatus.quickLoginEnabled;
      setAuthMode(shouldShowLogin ? AUTH_MODE_LOGIN : AUTH_MODE_CREATE);
      setAuthGateVisible(true);
      G_DOM.authUsernameInput.value = "";
      G_DOM.authPasswordInput.value = "";
      G_DOM.authUsernameInput.focus();
    } catch (error) {
      G_RT.authStatus = {
        quickLoginEnabled: false
      };
      setAuthMode(AUTH_MODE_CREATE);
      setAuthHint("Could not read account G_APP.s.", true);
      setAuthGateVisible(true);
      console.error(error);
    }
  }

  return {
    buildSnapshot,
    legacy_buildSnapshot: buildSnapshot,
    modular_buildSnapshot: buildSnapshot,
    hydrateState,
    legacy_hydrateState: hydrateState,
    modular_hydrateState: hydrateState,
    loadDictionaryData,
    legacy_loadDictionaryData: loadDictionaryData,
    modular_loadDictionaryData: loadDictionaryData,
    submitAuth,
    legacy_submitAuth: submitAuth,
    modular_submitAuth: submitAuth,
    initializeAuthGate,
    legacy_initializeAuthGate: initializeAuthGate,
    modular_initializeAuthGate: initializeAuthGate
  };
});
