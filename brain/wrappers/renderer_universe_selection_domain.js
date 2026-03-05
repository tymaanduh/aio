/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Universe_Selection_Domain = __MODULE_API;
  root.DictionaryRendererUniverseSelectionDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function buildUniverseEdgeKey(a, b, nodeCountInput = G_UNI.graph.nodes.length) {
    return runExtractedFunction(
      PATTERN_EXTRACTED_MODULE.MATH_GRAPH,
      "build_universe_edge_key",
      [a, b, nodeCountInput],
      (leftInput, rightInput, countInput) => {
        const nodeCount = Math.max(1, Number(countInput) || 1);
        const left = Math.max(0, Math.min(nodeCount - 1, Math.floor(Number(leftInput) || 0)));
        const right = Math.max(0, Math.min(nodeCount - 1, Math.floor(Number(rightInput) || 0)));
        return left <= right ? String(left) + ":" + String(right) : String(right) + ":" + String(left);
      }
    );
  }

  function getUniverseSelectedIndicesSorted() {
    return [...G_UNI.sel.nodeIdxSet]
      .filter((index) => Number.isInteger(index) && index >= 0 && index < G_UNI.graph.nodes.length)
      .sort((left, right) => left - right);
  }

  function getUniverseSelectedNodes() {
    const indices = getUniverseSelectedIndicesSorted();
    return indices.map((index) => ({
      index,
      node: G_UNI.graph.nodes[index]
    }));
  }

  function setNodeSelectionSet(indices, primaryIndex = -1) {
    const next = new Set(
      (Array.isArray(indices) ? indices : [])
        .map((value) => Math.floor(Number(value)))
        .filter((value) => Number.isInteger(value) && value >= 0 && value < G_UNI.graph.nodes.length)
    );
    G_UNI.sel.nodeIdxSet = next;
    syncSelectionFlags();
    if (Number.isInteger(primaryIndex) && next.has(primaryIndex)) {
      G_UNI.view.selectedNodeIndex = primaryIndex;
      G_UNI.view.hoverNodeIndex = primaryIndex;
      return;
    }
    const first = getUniverseSelectedIndicesSorted()[0];
    if (Number.isInteger(first)) {
      G_UNI.view.selectedNodeIndex = first;
      G_UNI.view.hoverNodeIndex = first;
      return;
    }
    G_UNI.view.selectedNodeIndex = -1;
    G_UNI.view.hoverNodeIndex = -1;
  }

  function clearUniverseNodeSelection(options = {}) {
    const { announce = false } = options;
    setNodeSelectionSet([], -1);
    G_UNI.sel.activeSetId = "";
    G_PAGE.universe.renderCluster();
    G_PAGE.universe.reqRender();
    announce && setStatus("Universe selection cleared.");
  }

  function getUniverseVisibleNodeIndices() {
    const filter = cleanText(G_UNI.view.filter, MAX.WORD).toLowerCase();
    if (!filter) {
      return G_UNI.graph.nodes.map((_node, index) => index);
    }
    const result = [];
    G_UNI.graph.nodes.forEach((node, index) => {
      getNodeWord(node).includes(filter) && result.push(index);
    });
    return result;
  }

  function selectAllUniverseVisibleNodes(options = {}) {
    const { announce = true } = options;
    const visibleIndices = getUniverseVisibleNodeIndices();
    if (visibleIndices.length === 0) {
      if (announce) {
        setStatus("No visible universe nodes to select.", true);
      }
      return false;
    }
    const primaryIndex =
      Number.isInteger(G_UNI.view.selectedNodeIndex) && visibleIndices.includes(G_UNI.view.selectedNodeIndex)
        ? G_UNI.view.selectedNodeIndex
        : visibleIndices[0];
    setNodeSelectionSet(visibleIndices, primaryIndex);
    G_UNI.sel.activeSetId = "";
    G_PAGE.universe.renderCluster();
    G_PAGE.universe.reqRender();
    if (announce) {
      setStatus(`Selected ${visibleIndices.length} universe node(s).`);
    }
    return true;
  }

  function toggleUniverseNodeSelection(nodeIndex, options = {}) {
    const { focusEntry = true, center = false, announce = "" } = options;
    const normalizedIndex = Math.floor(Number(nodeIndex));
    if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= G_UNI.graph.nodes.length) {
      return false;
    }
    const next = new Set(G_UNI.sel.nodeIdxSet);
    if (next.has(normalizedIndex)) {
      if (next.size > 1) {
        next.delete(normalizedIndex);
      }
    } else {
      next.add(normalizedIndex);
    }
    const primaryIndex = next.has(normalizedIndex) ? normalizedIndex : ([...next][next.size - 1] ?? -1);
    setNodeSelectionSet([...next], primaryIndex);
    G_UNI.sel.activeSetId = "";
    const node = G_UNI.graph.nodes[G_UNI.view.selectedNodeIndex];
    center && node && (centerUniverseOnNode(node), queueCacheSave());
    focusEntry && node?.entryId && focusEntryWithoutUsage(node.entryId);
    G_PAGE.universe.renderCluster();
    G_PAGE.universe.reqRender();
    announce && setStatus(announce);
    return true;
  }

  function getUniverseNodeDefinitionPreview(node) {
    const entry = getEntryForGraphNode(node);
    const text = cleanText(entry?.definition || "", 360);
    if (!text) {
      return "No definition linked to this node.";
    }
    return text.length > 220 ? `${text.slice(0, 220)}...` : text;
  }

  function getUniverseNodeOriginLabel(node) {
    const entry = getEntryForGraphNode(node);
    const language = normalizeEntryLanguage(entry?.language || "");
    if (language) {
      return language;
    }
    const mode = normalizeEntryMode(node?.mode);
    if (mode && mode !== "definition") {
      return `mode:${mode}`;
    }
    return "local dictionary";
  }

  function getUniverseNodeLinkage(nodeIndex) {
    const summary = {
      neighbors: [],
      modeCounts: {
        contains: 0,
        prefix: 0,
        suffix: 0,
        stem: 0,
        sameLabel: 0
      }
    };
    if (!Number.isInteger(nodeIndex) || nodeIndex < 0 || nodeIndex >= G_UNI.graph.nodes.length) {
      return summary;
    }
    const neighborIndexSet = new Set();
    G_UNI.graph.edges.forEach((edge) => {
      const left = Number(edge?.a);
      const right = Number(edge?.b);
      if (!Number.isInteger(left) || !Number.isInteger(right)) {
        return;
      }
      if (left !== nodeIndex && right !== nodeIndex) {
        return;
      }
      const neighborIndex = left === nodeIndex ? right : left;
      if (!Number.isInteger(neighborIndex) || neighborIndex < 0 || neighborIndex >= G_UNI.graph.nodes.length) {
        return;
      }
      neighborIndexSet.add(neighborIndex);
      (Array.isArray(edge.modes) ? edge.modes : []).forEach((mode) => {
        const key = cleanText(mode, 20);
        summary.modeCounts[key] !== undefined && (summary.modeCounts[key] += 1);
      });
    });
    summary.neighbors = [...neighborIndexSet]
      .map((index) => ({
        index,
        node: G_UNI.graph.nodes[index]
      }))
      .filter((item) => item.node)
      .sort((left, right) => {
        return (
          (Number(right.node.degree) || 0) - (Number(left.node.degree) || 0) ||
          String(left.node.word).localeCompare(String(right.node.word))
        );
      });
    return summary;
  }

  function resolveUniverseCustomSetNodeIndices(customSet) {
    if (!customSet || typeof customSet !== "object") {
      return [];
    }
    const indices = new Set();
    (Array.isArray(customSet.entryIds) ? customSet.entryIds : []).forEach((entryId) => {
      const index = G_UNI.idx.entry.get(cleanText(entryId, MAX.WORD));
      Number.isInteger(index) && indices.add(index);
    });
    (Array.isArray(customSet.words) ? customSet.words : []).forEach((word) => {
      const index = G_UNI.idx.word.get(normalizeWordLower(word));
      Number.isInteger(index) && indices.add(index);
    });
    return [...indices].sort((left, right) => left - right);
  }

  function appendNodesToUniverseCustomSet(setId, nodeIndices) {
    const normalizedSetId = cleanText(setId, MAX.WORD);
    if (!normalizedSetId) {
      return false;
    }
    const normalizedIndices = (Array.isArray(nodeIndices) ? nodeIndices : [])
      .map((value) => Math.floor(Number(value)))
      .filter((value) => Number.isInteger(value) && value >= 0 && value < G_UNI.graph.nodes.length);
    if (normalizedIndices.length === 0) {
      return false;
    }
    let changed = false;
    G_UNI.sel.sets = G_UNI.sel.sets.map((set) => {
      if (set.id !== normalizedSetId) {
        return set;
      }
      const entryIds = new Set(Array.isArray(set.entryIds) ? set.entryIds : []);
      const words = new Set(Array.isArray(set.words) ? set.words.map((item) => normalizeWordLower(item)) : []);
      normalizedIndices.forEach((index) => {
        const node = G_UNI.graph.nodes[index];
        if (!node) {
          return;
        }
        const entryId = cleanText(node.entryId, MAX.WORD);
        const wordLower = getNodeWord(node);
        entryId && !entryIds.has(entryId) && (entryIds.add(entryId), (changed = true));
        wordLower && !words.has(wordLower) && (words.add(wordLower), (changed = true));
      });
      return {
        ...set,
        entryIds: [...entryIds].slice(0, 5000),
        words: [...words].slice(0, 5000)
      };
    });
    changed && (queueCacheSave(), G_PAGE.universe.renderCluster());
    return changed;
  }

  function createUniverseCustomSetFromSelection(nameInput = "") {
    const selected = getUniverseSelectedNodes();
    if (selected.length === 0) {
      setStatus("Select universe nodes first.", true);
      return false;
    }
    const name = cleanText(nameInput, 80) || `Set ${G_UNI.sel.sets.length + 1}`;
    const nextSet = normalizeUniverseCustomSearchSet({
      id: window.crypto.randomUUID(),
      name,
      entryIds: selected.map((item) => cleanText(item.node?.entryId || "", MAX.WORD)).filter(Boolean),
      words: selected.map((item) => normalizeWordLower(item.node?.word || "")).filter(Boolean),
      createdAt: nowIso()
    });
    G_UNI.sel.sets = [nextSet, ...G_UNI.sel.sets].slice(0, 120);
    G_UNI.sel.activeSetId = nextSet.id;
    queueCacheSave();
    G_PAGE.universe.renderCluster();
    setStatus(`Custom set created: ${nextSet.name}`);
    return true;
  }

  function removeUniverseCustomSearchSet(setId) {
    const normalizedSetId = cleanText(setId, MAX.WORD);
    if (!normalizedSetId) {
      return false;
    }
    const before = G_UNI.sel.sets.length;
    G_UNI.sel.sets = G_UNI.sel.sets.filter((set) => set.id !== normalizedSetId);
    if (G_UNI.sel.sets.length === before) {
      return false;
    }
    G_UNI.sel.activeSetId === normalizedSetId && (G_UNI.sel.activeSetId = "");
    queueCacheSave();
    G_PAGE.universe.renderCluster();
    return true;
  }

  function applyCustomSet(setId, options = {}) {
    const { announce = true, center = true } = options;
    const normalizedSetId = cleanText(setId, MAX.WORD);
    if (!normalizedSetId) {
      return false;
    }
    const customSet = G_UNI.sel.sets.find((set) => set.id === normalizedSetId);
    if (!customSet) {
      return false;
    }
    const indices = resolveUniverseCustomSetNodeIndices(customSet);
    if (indices.length === 0) {
      if (announce) {
        setStatus(`No graph nodes currently match set "${customSet.name}".`, true);
      }
      return false;
    }
    G_UNI.sel.activeSetId = customSet.id;
    setNodeSelectionSet(indices, indices[0]);
    const primaryNode = G_UNI.graph.nodes[indices[0]];
    center && primaryNode && centerUniverseOnNode(primaryNode);
    queueCacheSave();
    G_PAGE.universe.renderCluster();
    G_PAGE.universe.reqRender();
    if (announce) {
      setStatus(`Applied set "${customSet.name}" (${indices.length} node(s)).`);
    }
    return true;
  }

  function getUniverseDragSelectionIndices(fallbackIndex = -1) {
    const selected = getUniverseSelectedIndicesSorted();
    if (selected.length > 0) {
      return selected;
    }
    const normalizedFallback = Math.floor(Number(fallbackIndex));
    if (
      Number.isInteger(normalizedFallback) &&
      normalizedFallback >= 0 &&
      normalizedFallback < G_UNI.graph.nodes.length
    ) {
      return [normalizedFallback];
    }
    return [];
  }

  function parseUniverseDraggedSelectionPayload(event) {
    const transfer = event?.dataTransfer;
    if (!transfer) {
      return [];
    }
    const serialized =
      transfer.getData("application/x-dictionary-universe-selection") || transfer.getData("text/plain") || "";
    if (!serialized) {
      return [];
    }
    try {
      const payload = JSON.parse(serialized);
      const indices = Array.isArray(payload?.indices) ? payload.indices : [];
      return indices
        .map((value) => Math.floor(Number(value)))
        .filter((value) => Number.isInteger(value) && value >= 0 && value < G_UNI.graph.nodes.length);
    } catch {
      return [];
    }
  }

  function findPathIndices(fromIndex, toIndex) {
    return findPath(fromIndex, toIndex, G_UNI.graph.nodes.length, getAdjacency());
  }

  function centerUniverseOnNode(node) {
    if (!node) {
      return;
    }
    G_UNI.view.panX = clampUniversePan(0.5 - (Number(node.x) || 0.5));
    G_UNI.view.panY = clampUniversePan(0.5 - (Number(node.y) || 0.5));
    clearProjectionCache();
  }

  function focusNodeIndex(nodeIndex, options = {}) {
    const { center = true, announce = "", focusEntry = true, pulse = false } = options;
    if (!Number.isInteger(nodeIndex) || nodeIndex < 0 || nodeIndex >= G_UNI.graph.nodes.length) {
      return false;
    }
    setNodeSelectionSet([nodeIndex], nodeIndex);
    G_UNI.sel.activeSetId = "";
    const node = G_UNI.graph.nodes[nodeIndex];
    center && (centerUniverseOnNode(node), queueCacheSave());
    focusEntry && node?.entryId && focusEntryWithoutUsage(node.entryId);
    pulse && ((G_UNI.view.pulseNodeIndex = nodeIndex), (G_UNI.view.pulseUntil = Date.now() + 1200));
    G_PAGE.universe.renderCluster();
    G_PAGE.universe.reqRender();
    announce && setStatus(announce);
    return true;
  }

  function resetUniverseCamera() {
    G_UNI.view.zoom = 1;
    G_UNI.view.panX = 0;
    G_UNI.view.panY = 0;
    markInteraction(160);
    clearProjectionCache();
    queueCacheSave();
    G_PAGE.universe.reqRender();
  }

  function fitUniverseCamera() {
    const input = {
      nodes: Array.isArray(G_UNI.graph.nodes) ? G_UNI.graph.nodes : [],
      zoomMin: CONSTANT_UNIVERSE.ZOOM_MIN,
      zoomMax: CONSTANT_UNIVERSE.ZOOM_MAX,
      panMin: PATTERN_UNIVERSE_PAN_RANGE.MIN,
      panMax: PATTERN_UNIVERSE_PAN_RANGE.MAX
    };

    const next = runExtractedFunction(PATTERN_EXTRACTED_MODULE.MATH_CAMERA, "compute_fit_camera", [input], () => ({
      panX: 0,
      panY: 0,
      zoom: 1
    }));

    G_UNI.view.panX = clampUniversePan(next.panX);
    G_UNI.view.panY = clampUniversePan(next.panY);
    G_UNI.view.zoom = clampNumber(next.zoom, CONSTANT_UNIVERSE.ZOOM_MIN, CONSTANT_UNIVERSE.ZOOM_MAX);
    clearProjectionCache();
    G_PAGE.universe.reqRender();
  }

  function saveUniverseBookmark() {
    const existingCount = G_UNI.cfg.bookmarks.length;
    const next = normalizeUniverseBookmark({
      name: `View ${existingCount + 1}`,
      panX: G_UNI.view.panX,
      panY: G_UNI.view.panY,
      zoom: G_UNI.view.zoom,
      createdAt: nowIso()
    });
    G_UNI.cfg.bookmarks = [next, ...G_UNI.cfg.bookmarks].slice(0, CONSTANT_UNIVERSE.BOOKMARK_LIMIT);
    updateUniverseBookmarkSelect();
    G_DOM.universeBookmarkSelect instanceof HTMLSelectElement && (G_DOM.universeBookmarkSelect.value = next.id);
    queueCacheSave();
    setStatus(`Saved camera view "${next.name}".`);
  }

  function loadUniverseBookmark(bookmarkId) {
    const normalizedId = cleanText(bookmarkId, MAX.WORD);
    if (!normalizedId) {
      return false;
    }
    const bookmark = G_UNI.cfg.bookmarks.find((item) => item.id === normalizedId);
    if (!bookmark) {
      return false;
    }
    G_UNI.view.panX = clampUniversePan(bookmark.panX);
    G_UNI.view.panY = clampUniversePan(bookmark.panY);
    G_UNI.view.zoom = clampNumber(bookmark.zoom, CONSTANT_UNIVERSE.ZOOM_MIN, CONSTANT_UNIVERSE.ZOOM_MAX);
    markInteraction(160);
    clearProjectionCache();
    queueCacheSave();
    G_PAGE.universe.reqRender();
    setStatus(`Loaded view "${bookmark.name}".`);
    return true;
  }

  function exportUniverseGraphJson() {
    const payload = {
      exportedAt: nowIso(),
      datasetSignature: G_RT.uDataSig,
      modelKey: G_RT.uGraphKey,
      config: {
        ...normalizeConfig(G_UNI.cfg),
        bookmarks: undefined
      },
      bookmarks: G_UNI.cfg.bookmarks,
      graph: G_UNI.graph
    };
    if (window.app_api?.exportUniverse) {
      window.app_api
        .exportUniverse({
          format: "json",
          data: payload
        })
        .then((result) => {
          if (result?.ok) {
            setStatus(`Universe JSON exported: ${result.filePath}`);
            return;
          }
          setStatus("Universe JSON export failed.", true);
        })
        .catch((error) => {
          recordDiagnosticError("universe_export_json_failed", String(error?.message || error), "universeExport");
          setStatus("Universe JSON export failed.", true);
        });
      return;
    }
    triggerDownload(
      JSON.stringify(payload, null, 2),
      `universe-${new Date().toISOString().slice(0, 10)}.json`,
      "application/json"
    );
    setStatus("Universe JSON exported.");
  }

  function exportUniversePng() {
    const canvas = getActiveCanvas();
    if (!(canvas instanceof HTMLCanvasElement)) {
      setStatus("Universe canvas unavailable.", true);
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    if (window.app_api?.exportUniverse) {
      window.app_api
        .exportUniverse({
          format: "png",
          dataUrl
        })
        .then((result) => {
          if (result?.ok) {
            setStatus(`Universe PNG exported: ${result.filePath}`);
            return;
          }
          setStatus("Universe PNG export failed.", true);
        })
        .catch((error) => {
          recordDiagnosticError("universe_export_png_failed", String(error?.message || error), "universeExport");
          setStatus("Universe PNG export failed.", true);
        });
      return;
    }
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = `universe-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setStatus("Universe PNG exported.");
  }

  function jumpToUniverseFilter() {
    const filter = cleanText(G_UNI.view.filter, MAX.WORD).toLowerCase();
    if (!filter) {
      setStatus("Type a word fragment first.", true);
      return;
    }
    const index = G_UNI.graph.nodes.findIndex((node) => getNodeWord(node).includes(filter));
    if (index < 0) {
      setStatus(`No word found for "${filter}".`, true);
      return;
    }
    focusNodeIndex(index, {
      center: true,
      announce: `Jumped to "${G_UNI.graph.nodes[index].word}".`,
      pulse: true
    });
  }

  function applyUniversePathFinder() {
    const fromWord = cleanText(
      G_DOM.universePathFromInput instanceof HTMLInputElement ? G_DOM.universePathFromInput.value : "",
      MAX.WORD
    );
    const toWord = cleanText(
      G_DOM.universePathToInput instanceof HTMLInputElement ? G_DOM.universePathToInput.value : "",
      MAX.WORD
    );
    const fromLower = normalizeWordLower(fromWord);
    const toLower = normalizeWordLower(toWord);
    if (!fromLower || !toLower) {
      G_PAGE.universe.setPathStatus("Path requires both From and To words.", true);
      return;
    }
    const fromIndex = G_UNI.idx.word.get(fromLower);
    const toIndex = G_UNI.idx.word.get(toLower);
    if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
      clearPathHighlights();
      G_PAGE.universe.setPathStatus("Path words are not present in the current universe graph.", true);
      G_PAGE.universe.reqRender();
      return;
    }
    const pathIndices = findPathIndices(fromIndex, toIndex);
    if (pathIndices.length === 0) {
      clearPathHighlights();
      G_PAGE.universe.setPathStatus(`No link path found between "${fromWord}" and "${toWord}".`, true);
      G_PAGE.universe.reqRender();
      return;
    }
    G_UNI.path.nodeIdx = pathIndices;
    G_UNI.path.edgeKeys = new Set();
    const nodeCount = Math.max(1, G_UNI.graph.nodes.length);
    for (let index = 1; index < pathIndices.length; index += 1) {
      G_UNI.path.edgeKeys.add(buildUniverseEdgeKey(pathIndices[index - 1], pathIndices[index], nodeCount));
    }
    G_UNI.path.words = pathIndices.map((index) => G_UNI.graph.nodes[index]?.word || "");
    syncPathFlags();
    G_PAGE.universe.setPathStatus(`${pathIndices.length} step(s): ${G_UNI.path.words.join(" -> ")}`);
    focusNodeIndex(fromIndex, {
      center: true,
      announce: `Path highlighted from "${fromWord}" to "${toWord}".`,
      focusEntry: false,
      pulse: true
    });
  }

  function applyUniverseOptionsFromInputs() {
    const minWordLength =
      G_DOM.universeMinWordLengthInput instanceof HTMLInputElement
        ? Math.floor(Number(G_DOM.universeMinWordLengthInput.value) || G_UNI.cfg.minWordLength)
        : G_UNI.cfg.minWordLength;
    const maxNodes =
      G_DOM.universeMaxNodesInput instanceof HTMLInputElement
        ? Math.floor(Number(G_DOM.universeMaxNodesInput.value) || G_UNI.cfg.maxNodes)
        : G_UNI.cfg.maxNodes;
    const maxEdges =
      G_DOM.universeMaxEdgesInput instanceof HTMLInputElement
        ? Math.floor(Number(G_DOM.universeMaxEdgesInput.value) || G_UNI.cfg.maxEdges)
        : G_UNI.cfg.maxEdges;
    const favoritesOnly =
      G_DOM.universeFavoritesOnlyInput instanceof HTMLInputElement
        ? Boolean(G_DOM.universeFavoritesOnlyInput.checked)
        : G_UNI.cfg.favoritesOnly;
    const labelFilter =
      G_DOM.universeLabelFilterInput instanceof HTMLInputElement
        ? cleanText(G_DOM.universeLabelFilterInput.value, MAX.LABEL).toLowerCase()
        : G_UNI.cfg.labelFilter;

    const nextConfig = normalizeConfig({
      ...G_UNI.cfg,
      minWordLength,
      maxNodes,
      maxEdges,
      favoritesOnly,
      labelFilter
    });
    const previousFingerprint = JSON.stringify({
      minWordLength: G_UNI.cfg.minWordLength,
      maxNodes: G_UNI.cfg.maxNodes,
      maxEdges: G_UNI.cfg.maxEdges,
      favoritesOnly: G_UNI.cfg.favoritesOnly,
      labelFilter: G_UNI.cfg.labelFilter
    });
    const nextFingerprint = JSON.stringify({
      minWordLength: nextConfig.minWordLength,
      maxNodes: nextConfig.maxNodes,
      maxEdges: nextConfig.maxEdges,
      favoritesOnly: nextConfig.favoritesOnly,
      labelFilter: nextConfig.labelFilter
    });
    G_UNI.cfg = {
      ...nextConfig,
      bookmarks: G_UNI.cfg.bookmarks
    };
    G_PAGE.universe.syncControls();
    previousFingerprint !== nextFingerprint &&
      (invalidateUniverseGraph(), scheduleGraphBuild(), queueCacheSave(), setStatus("Universe filters applied."));
    G_PAGE.universe.renderSummary();
    G_PAGE.universe.reqRender();
  }

  function toggleUniverseEdgeMode(modeKey) {
    const edgeModes = {
      ...G_UNI.cfg.edgeModes,
      [modeKey]: !G_UNI.cfg.edgeModes?.[modeKey]
    };
    !edgeModes.contains &&
      !edgeModes.prefix &&
      !edgeModes.suffix &&
      !edgeModes.stem &&
      !edgeModes.sameLabel &&
      (edgeModes.contains = true);
    G_UNI.cfg = normalizeConfig({
      ...G_UNI.cfg,
      edgeModes,
      bookmarks: G_UNI.cfg.bookmarks
    });
    G_PAGE.universe.syncControls();
    invalidateUniverseGraph();
    scheduleGraphBuild();
    queueCacheSave();
    G_PAGE.universe.renderSummary();
    G_PAGE.universe.reqRender();
  }

  return {
    buildUniverseEdgeKey,
    modular_buildUniverseEdgeKey: buildUniverseEdgeKey,
    getUniverseSelectedIndicesSorted,
    modular_getUniverseSelectedIndicesSorted: getUniverseSelectedIndicesSorted,
    getUniverseSelectedNodes,
    modular_getUniverseSelectedNodes: getUniverseSelectedNodes,
    setNodeSelectionSet,
    modular_setNodeSelectionSet: setNodeSelectionSet,
    clearUniverseNodeSelection,
    modular_clearUniverseNodeSelection: clearUniverseNodeSelection,
    getUniverseVisibleNodeIndices,
    modular_getUniverseVisibleNodeIndices: getUniverseVisibleNodeIndices,
    selectAllUniverseVisibleNodes,
    modular_selectAllUniverseVisibleNodes: selectAllUniverseVisibleNodes,
    toggleUniverseNodeSelection,
    modular_toggleUniverseNodeSelection: toggleUniverseNodeSelection,
    getUniverseNodeDefinitionPreview,
    modular_getUniverseNodeDefinitionPreview: getUniverseNodeDefinitionPreview,
    getUniverseNodeOriginLabel,
    modular_getUniverseNodeOriginLabel: getUniverseNodeOriginLabel,
    getUniverseNodeLinkage,
    modular_getUniverseNodeLinkage: getUniverseNodeLinkage,
    resolveUniverseCustomSetNodeIndices,
    modular_resolveUniverseCustomSetNodeIndices: resolveUniverseCustomSetNodeIndices,
    appendNodesToUniverseCustomSet,
    modular_appendNodesToUniverseCustomSet: appendNodesToUniverseCustomSet,
    createUniverseCustomSetFromSelection,
    modular_createUniverseCustomSetFromSelection: createUniverseCustomSetFromSelection,
    removeUniverseCustomSearchSet,
    modular_removeUniverseCustomSearchSet: removeUniverseCustomSearchSet,
    applyCustomSet,
    modular_applyCustomSet: applyCustomSet,
    getUniverseDragSelectionIndices,
    modular_getUniverseDragSelectionIndices: getUniverseDragSelectionIndices,
    parseUniverseDraggedSelectionPayload,
    modular_parseUniverseDraggedSelectionPayload: parseUniverseDraggedSelectionPayload,
    findPathIndices,
    modular_findPathIndices: findPathIndices,
    centerUniverseOnNode,
    modular_centerUniverseOnNode: centerUniverseOnNode,
    focusNodeIndex,
    modular_focusNodeIndex: focusNodeIndex,
    resetUniverseCamera,
    modular_resetUniverseCamera: resetUniverseCamera,
    fitUniverseCamera,
    modular_fitUniverseCamera: fitUniverseCamera,
    saveUniverseBookmark,
    modular_saveUniverseBookmark: saveUniverseBookmark,
    loadUniverseBookmark,
    modular_loadUniverseBookmark: loadUniverseBookmark,
    exportUniverseGraphJson,
    modular_exportUniverseGraphJson: exportUniverseGraphJson,
    exportUniversePng,
    modular_exportUniversePng: exportUniversePng,
    jumpToUniverseFilter,
    modular_jumpToUniverseFilter: jumpToUniverseFilter,
    applyUniversePathFinder,
    modular_applyUniversePathFinder: applyUniversePathFinder,
    applyUniverseOptionsFromInputs,
    modular_applyUniverseOptionsFromInputs: applyUniverseOptionsFromInputs,

    toggleUniverseEdgeMode,
    modular_toggleUniverseEdgeMode: toggleUniverseEdgeMode
  };
});
