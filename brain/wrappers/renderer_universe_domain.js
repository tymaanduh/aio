/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Universe_Domain = __MODULE_API;
  root.DictionaryRendererUniverseDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function renderClusterPanel() {
  const selectedNodes = getUniverseSelectedNodes();
  const selectedCount = selectedNodes.length;
  const visibleIndices = getUniverseVisibleNodeIndices();
  const selectedIndex = G_UNI.view.selectedNodeIndex;
  const selected = Number.isInteger(selectedIndex) && selectedIndex >= 0 ? G_UNI.graph.nodes[selectedIndex] : null;

  if (
    G_DOM.universeInspectorSummary instanceof HTMLElement &&
    G_DOM.universeSelectionSummary instanceof HTMLElement &&
    G_DOM.universeSelectionList instanceof HTMLElement &&
    G_DOM.universeNodeInspectorTitle instanceof HTMLElement &&
    G_DOM.universeNodeInspectorMeta instanceof HTMLElement &&
    G_DOM.universeNodeInspectorDefinition instanceof HTMLElement &&
    G_DOM.universeNodeInspectorFacts instanceof HTMLElement &&
    G_DOM.universeCustomSetsSummary instanceof HTMLElement &&
    G_DOM.universeCustomSetsList instanceof HTMLElement
  ) {
    G_DOM.universeInspectorSummary.textContent = `Nodes: ${G_UNI.graph.nodes.length}. Visible: ${visibleIndices.length}. Selected: ${selectedCount}.`;
    G_DOM.universeSelectionSummary.textContent = `${selectedCount} selected definition(s).`;
    G_DOM.universeSelectionList.innerHTML = "";

    if (selectedNodes.length === 0) {
      const emptySelection = document.createElement("li");
      emptySelection.className = "universeSelectionItem";
      emptySelection.textContent =
        "No nodes selected. Click a node, Shift/Ctrl-click for multi-select, or use Select All Visible.";
      G_DOM.universeSelectionList.appendChild(emptySelection);
    } else {
      selectedNodes.slice(0, 240).forEach(({ index, node }) => {
        const row = document.createElement("li");
        row.className = `universeSelectionItem${index === selectedIndex ? " primary" : " secondary"}`;
        row.dataset.nodeIndex = String(index);
        row.draggable = true;
        const title = document.createElement("strong");
        title.textContent = node?.word || "word";
        const mini = document.createElement("span");
        mini.className = "mini";
        mini.textContent = getUniverseNodeDefinitionPreview(node);
        row.appendChild(title);
        row.appendChild(mini);
        row.addEventListener("click", (event) => {
          if (event.shiftKey || event.ctrlKey || event.metaKey) {
            toggleUniverseNodeSelection(index, { focusEntry: true, center: false });
            return;
          }
          focusNodeIndex(index, { center: false, focusEntry: true });
        });
        row.addEventListener("dragstart", (event) => {
          const indices = getUniverseDragSelectionIndices(index);
          if (!event.dataTransfer) {
            return;
          }
          event.dataTransfer.effectAllowed = "copyMove";
          const payload = JSON.stringify({
            type: "universe-node-selection",
            indices
          });
          event.dataTransfer.setData("application/x-dictionary-universe-selection", payload);
          event.dataTransfer.setData("text/plain", payload);
        });
        G_DOM.universeSelectionList.appendChild(row);
      });
      if (selectedNodes.length > 240) {
        const tail = document.createElement("li");
        tail.className = "universeSelectionItem";
        tail.textContent = `... ${selectedNodes.length - 240} more selected`;
        G_DOM.universeSelectionList.appendChild(tail);
      }
    }

    G_DOM.universeCustomSetsList.innerHTML = "";
    G_DOM.universeCustomSetsSummary.textContent =
      G_UNI.sel.sets.length > 0
        ? `${G_UNI.sel.sets.length} custom set(s). Drag selected definitions onto a set to append.`
        : "No sets yet. Select nodes and create one.";
    if (G_UNI.sel.sets.length === 0) {
      const emptySet = document.createElement("li");
      emptySet.className = "universeCustomSetItem";
      emptySet.textContent = "Create a set from selected nodes.";
      G_DOM.universeCustomSetsList.appendChild(emptySet);
    } else {
      G_UNI.sel.sets.forEach((set) => {
        const row = document.createElement("li");
        row.className = `universeCustomSetItem${G_UNI.sel.activeSetId === set.id ? " active" : ""}`;
        row.dataset.setId = set.id;
        const name = document.createElement("div");
        name.className = "name";
        name.setAttribute("role", "button");
        name.tabIndex = 0;
        name.textContent = set.name;
        const indices = resolveUniverseCustomSetNodeIndices(set);
        const meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = `${indices.length} node(s) mapped`;
        name.appendChild(meta);
        name.addEventListener("click", () => {
          applyCustomSet(set.id);
        });
        name.addEventListener("keydown", (event) => {
          (event.key === "Enter" || event.key === " ") && (event.preventDefault(), applyCustomSet(set.id));
        });
        const remove = document.createElement("span");
        remove.className = "universeCustomSetDelete";
        remove.setAttribute("role", "button");
        remove.tabIndex = 0;
        remove.textContent = "×";
        remove.title = `Delete set "${set.name}"`;
        const onRemove = () => {
          removeUniverseCustomSearchSet(set.id);
        };
        remove.addEventListener("click", (event) => {
          event.stopPropagation();
          onRemove();
        });
        remove.addEventListener("keydown", (event) => {
          (event.key === "Enter" || event.key === " ") && (event.preventDefault(), event.stopPropagation(), onRemove());
        });
        row.addEventListener("dragover", (event) => {
          event.preventDefault();
          row.classList.add("dropTarget");
        });
        row.addEventListener("dragleave", () => {
          row.classList.remove("dropTarget");
        });
        row.addEventListener("drop", (event) => {
          event.preventDefault();
          row.classList.remove("dropTarget");
          const dragged = parseUniverseDraggedSelectionPayload(event);
          if (dragged.length === 0) {
            return;
          }
          const changed = appendNodesToUniverseCustomSet(set.id, dragged);
          if (changed) {
            setStatus(`Added ${dragged.length} node(s) to "${set.name}".`);
          }
        });
        row.appendChild(name);
        row.appendChild(remove);
        G_DOM.universeCustomSetsList.appendChild(row);
      });
    }

    if (!selected) {
      G_DOM.universeNodeInspectorTitle.textContent = "Node Details";
      G_DOM.universeNodeInspectorMeta.textContent = "Select a node in Universe to inspect.";
      G_DOM.universeNodeInspectorDefinition.textContent = "Definition preview appears here.";
      G_DOM.universeNodeInspectorFacts.innerHTML = "";
    } else {
      const linkage = getUniverseNodeLinkage(selectedIndex);
      const entry = getEntryForGraphNode(selected);
      const posType = cleanText(selected.partOfSpeech, 40) || "unknown";
      const mode = normalizeEntryMode(selected.mode);
      const origin = getUniverseNodeOriginLabel(selected);
      const labels = normalizeLabelArray(selected.labels).join(", ") || "none";
      const linkedWords = linkage.neighbors
        .slice(0, 8)
        .map((item) => cleanText(item.node?.word || "", MAX.WORD))
        .filter(Boolean)
        .join(", ");
      const modeCounts = linkage.modeCounts;
      const typeBreakdown = Object.keys(modeCounts)
        .filter((key) => modeCounts[key] > 0)
        .map((key) => `${key}:${modeCounts[key]}`)
        .join(", ");

      G_DOM.universeNodeInspectorTitle.textContent = selected.word || "Node";
      G_DOM.universeNodeInspectorMeta.textContent = `Type: ${posType} | Mode: ${mode} | Origin: ${origin}`;
      G_DOM.universeNodeInspectorDefinition.textContent = getUniverseNodeDefinitionPreview(selected);
      G_DOM.universeNodeInspectorFacts.innerHTML = "";
      const facts = [
        `Linkage: ${linkage.neighbors.length} linked node(s), degree ${Math.max(0, Number(selected.degree) || 0)}.`,
        `Edge types: ${typeBreakdown || "none"}.`,
        `Cluster: ${cleanText(selected.componentId, 40) || "n/a"} (${Math.max(1, Number(selected.componentSize) || 1)} node(s)).`,
        `Labels: ${labels}.`,
        `Linked words: ${linkedWords || "none"}.`,
        `Entry source: ${entry?.id ? entry.id : "detached node"}`
      ];
      facts.forEach((fact) => {
        const li = document.createElement("li");
        li.className = "universeNodeInspectorFact";
        li.textContent = fact;
        G_DOM.universeNodeInspectorFacts.appendChild(li);
      });
    }
  }

  if (
    !(G_DOM.universeClusterList instanceof HTMLElement) ||
    !(G_DOM.universeClusterSummary instanceof HTMLElement)
  ) {
    return;
  }
  G_DOM.universeClusterList.innerHTML = "";
  if (!selected) {
    G_DOM.universeClusterSummary.textContent = "Select a node to inspect its cluster.";
    const empty = document.createElement("li");
    empty.className = "archiveItem";
    empty.textContent = "No cluster selected.";
    G_DOM.universeClusterList.appendChild(empty);
    return;
  }
  const clusterId = cleanText(selected.componentId, 40);
  let clusterNodes = [];
  if (clusterId) {
    clusterNodes = G_UNI.graph.nodes.filter((node) => cleanText(node.componentId, 40) === clusterId);
  } else {
    clusterNodes = G_UNI.graph.nodes.filter((node) => node.componentSize === selected.componentSize);
  }
  clusterNodes.sort((left, right) => {
    return (
      (Number(right.degree) || 0) - (Number(left.degree) || 0) || String(left.word).localeCompare(String(right.word))
    );
  });
  const maxList = clusterNodes.slice(0, 120);
  G_DOM.universeClusterSummary.textContent = `"${selected.word}" cluster: ${clusterNodes.length} word(s).`;
  maxList.forEach((node) => {
    const row = document.createElement("li");
    row.className = "archiveItem";
    row.dataset.entryId = node.entryId || "";
    row.textContent = `${node.word} (${Math.max(0, Number(node.degree) || 0)} links)`;
    row.addEventListener("click", () => {
      const index = G_UNI.idx.word.get(getNodeWord(node));
      if (Number.isInteger(index)) {
        focusNodeIndex(index, { center: true, focusEntry: true });
      }
    });
    G_DOM.universeClusterList.appendChild(row);
  });
  if (clusterNodes.length > maxList.length) {
    const tail = document.createElement("li");
    tail.className = "archiveItem";
    tail.textContent = `... ${clusterNodes.length - maxList.length} more`;
    G_DOM.universeClusterList.appendChild(tail);
  }
}

function renderUniverseGraph() {
  const startedAt = performance.now();
  const canvas = getActiveCanvas();
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }
  const resized = ensureUniverseCanvasSize();
  if (!isUniverseVisible() && !resized) {
    return;
  }
  const width = G_UNI.canvas.size.width;
  const height = G_UNI.canvas.size.height;
  const dpr = G_UNI.canvas.size.dpr;
  const nodes = Array.isArray(G_UNI.graph.nodes) ? G_UNI.graph.nodes : [];
  const edges = Array.isArray(G_UNI.graph.edges) ? G_UNI.graph.edges : [];
  const filter = cleanText(G_UNI.view.filter, MAX.WORD).toLowerCase();
  const highlightState = getHighlightState(nodes, filter);
  const highlightFlags = highlightState.flags;

  const selectedIndex = G_UNI.view.selectedNodeIndex;
  const selectedFlags = G_UNI.canvas.flags.selected;
  const hoverIndex = G_UNI.view.hoverNodeIndex;
  const pathNodeFlags = G_UNI.canvas.flags.path;
  const pathEdgeSet = G_UNI.path.edgeKeys;
  const filterActive = filter.length > 0;
  (G_RT.uBench.running) && (updateUniverseBenchmarkCamera(getUniverseBenchmarkProgress(startedAt)));
  const projection = getProjection(nodes, width, height);

  if (G_UNI.cfg.renderMode === UNIVERSE_VIEW_MODE_WEBGL) {
    const rendered = renderGraphWebgl(
      canvas,
      width,
      height,
      dpr,
      nodes,
      edges,
      filterActive,
      highlightFlags,
      selectedIndex,
      selectedFlags,
      hoverIndex,
      pathNodeFlags,
      pathEdgeSet,
      projection
    );
    if (rendered) {
      if (G_UNI.view.pulseNodeIndex >= 0 && G_UNI.view.pulseUntil > Date.now()) {
        G_PAGE.universe.reqRender();
      }
      updateUniverseFrameMetrics(startedAt, performance.now() - startedAt);
      return;
    }
    G_UNI.cfg = normalizeConfig({
      ...G_UNI.cfg,
      renderMode: UNIVERSE_VIEW_MODE_CANVAS,
      bookmarks: G_UNI.cfg.bookmarks
    });
    G_RT.uForceCanvas = true;
    syncCanvasVisibility();
    G_PAGE.universe.syncControls();
    setStatus("WebGL unavailable, switched to canvas renderer.", true);
    G_PAGE.universe.reqRender();
    return;
  }

  const context = getCanvasCtx(canvas);
  if (!context) {
    return;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  if (nodes.length === 0) {
    context.fillStyle = "rgba(177, 198, 228, 0.92)";
    context.font = "600 14px 'Space Grotesk', sans-serif";
    context.fillText("No universe data yet. Add more words to build links.", 20, 30);
    if (G_RT.uBench.running) {
      completeUniverseBenchmark("no-data");
    }
    renderPerfHud();
    return;
  }

  const projectionX = projection.x;
  const projectionY = projection.y;
  const projectionRadius = projection.radius;
  const nodeCount = Math.max(1, nodes.length);

  const edgeStride = getEdgeStride(edges.length);
  const hasPathHighlights = pathEdgeSet.size > 0;
  context.save();
  for (let edgeIndex = 0; edgeIndex < edges.length; edgeIndex += 1) {
    const edge = edges[edgeIndex];
    const a = Math.floor(Number(edge?.a));
    const b = Math.floor(Number(edge?.b));
    const left = nodes[a];
    const right = nodes[b];
    if (!left || !right) {
      continue;
    }
    const isPathEdge = hasPathHighlights && pathEdgeSet.has(buildUniverseEdgeKey(a, b, nodeCount));
    if (!isPathEdge && edgeStride > 1 && edgeIndex % edgeStride !== 0) {
      continue;
    }
    context.beginPath();
    if (isPathEdge) {
      context.strokeStyle = "rgba(154, 228, 255, 0.92)";
      context.lineWidth = 1.8;
    } else if (filterActive && highlightFlags[a] !== 1 && highlightFlags[b] !== 1) {
      context.strokeStyle = "rgba(106, 135, 179, 0.06)";
      context.lineWidth = 1;
    } else if (edge?.hasSameLabel === true) {
      context.strokeStyle = "rgba(170, 151, 255, 0.18)";
      context.lineWidth = 1;
    } else {
      context.strokeStyle = "rgba(129, 168, 226, 0.14)";
      context.lineWidth = 1;
    }
    context.moveTo(projectionX[a], projectionY[a]);
    context.lineTo(projectionX[b], projectionY[b]);
    context.stroke();
  }
  context.restore();

  const now = Date.now();
  for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
    const node = nodes[nodeIndex];
    const projectedX = projectionX[nodeIndex];
    const projectedY = projectionY[nodeIndex];
    const radius = projectionRadius[nodeIndex];
    const isHighlighted = highlightFlags[nodeIndex] === 1;
    const isHovered = nodeIndex === hoverIndex;
    const isPrimarySelected = nodeIndex === selectedIndex;
    const isSecondarySelected = selectedFlags[nodeIndex] === 1 && !isPrimarySelected;
    const isPathNode = pathNodeFlags[nodeIndex] === 1;
    const isPulsing = nodeIndex === G_UNI.view.pulseNodeIndex && G_UNI.view.pulseUntil > now;
    const baseColor = getUniverseNodeColor(node);

    let alphaBase = 0.36 + Math.min(0.44, (Number(node.degree) || 0) / 18);
    (filterActive && !isHighlighted && !isPrimarySelected && !isSecondarySelected && !isHovered && !isPathNode) && (alphaBase *= 0.18);
    context.beginPath();
    context.arc(
      projectedX,
      projectedY,
      isHovered || isPrimarySelected || isSecondarySelected || isPathNode ? radius + 0.9 : radius,
      0,
      Math.PI * 2
    );
    if (isPrimarySelected) {
      context.fillStyle = "rgba(237, 248, 255, 0.98)";
    } else if (isSecondarySelected) {
      context.fillStyle = "rgba(159, 210, 255, 0.95)";
    } else if (isHovered) {
      context.fillStyle = "rgba(188, 226, 255, 0.95)";
    } else if (isPathNode) {
      context.fillStyle = "rgba(167, 233, 255, 0.94)";
    } else if (isHighlighted) {
      context.fillStyle = "rgba(126, 197, 255, 0.92)";
    } else {
      const colorAlpha = alphaBase.toFixed(3);
      const [red, green, blue] = colorRgbBytes(baseColor);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${colorAlpha})`;
    }
    context.fill();
    if (isPulsing) {
      const age = Math.max(0, G_UNI.view.pulseUntil - now);
      const ringAlpha = clampNumber(age / 1200, 0, 1);
      context.beginPath();
      context.arc(projectedX, projectedY, radius + 6, 0, Math.PI * 2);
      context.strokeStyle = `rgba(159, 232, 255, ${ringAlpha.toFixed(3)})`;
      context.lineWidth = 1.3;
      context.stroke();
    }
  }

  const selectedNode = selectedIndex >= 0 ? nodes[selectedIndex] : null;
  const hoverNode = hoverIndex >= 0 ? nodes[hoverIndex] : null;
  (selectedNode) && (drawUniverseNodeLabel(context, selectedNode.word, projectionX[selectedIndex], projectionY[selectedIndex]));
  (hoverNode && hoverIndex !== selectedIndex) && (drawUniverseNodeLabel(context, hoverNode.word, projectionX[hoverIndex], projectionY[hoverIndex]));
  (G_UNI.view.pulseNodeIndex >= 0 && G_UNI.view.pulseUntil > now) && (G_PAGE.universe.reqRender());
  updateUniverseFrameMetrics(startedAt, performance.now() - startedAt);
}

function queueCacheSave() {
  if (!window.app_api?.saveUniverseCache) {
    return;
  }
  (G_RT.uCacheSaveTimer) && (window.clearTimeout(G_RT.uCacheSaveTimer));
  G_RT.uCacheSaveTimer = window.setTimeout(async () => {
    G_RT.uCacheSaveTimer = 0;
    try {
      await window.app_api.saveUniverseCache(buildUniverseCachePayload());
    } catch (error) {
      recordDiagnosticError("universe_cache_save_failed", String(error?.message || error), "universeCache");
    }
  }, UNIVERSE_CACHE_SAVE_DELAY_MS);
}

function requestGraphBuildNow() {
  const versionKey = getUniverseModelKey();
  const datasetSignature = getUniverseDatasetSignature(G_APP.s.entries);
  if (G_RT.uGraphKey === versionKey && G_RT.uDataSig === datasetSignature) {
    return;
  }

  if (!G_RT.uWorkerReady || !G_RT.uWorker) {
    G_UNI.graph = normalizeUniverseGraph(buildUniverseGraphFallback());
    G_RT.uGraphKey = versionKey;
    G_RT.uDataSig = datasetSignature;
    clearProjectionCache();
    rebuildUniverseNodeIndexes();
    clearPathHighlights();
    if (
      !G_UNI.sel.activeSetId ||
      !applyCustomSet(G_UNI.sel.activeSetId, {
        announce: false,
        center: false
      })
    ) {
      syncSelectionWithEntry(G_APP.s.selectedEntryId || "");
    }
    queueCacheSave();
    (G_APP.s.activeView === VIEW_UNIVERSE) && (G_PAGE.universe.renderSummary(), G_PAGE.universe.reqRender());
    return;
  }

  G_RT.uWorkerReqLatest += 1;
  const requestId = G_RT.uWorkerReqLatest;
  G_RT.uWorkerReqId = requestId;
  (G_APP.s.activeView === VIEW_UNIVERSE && G_DOM.universeSummary instanceof HTMLElement) && (G_DOM.universeSummary.textContent = "Building word universe...");
  try {
    G_RT.uWorker.postMessage({
      type: "buildUniverseGraph",
      requestId,
      versionKey,
      entries: G_APP.s.entries.map((entry) => ({
        id: entry.id,
        word: entry.word,
        labels: entry.labels,
        mode: normalizeEntryMode(entry.mode),
        usageCount: Number(entry.usageCount) || 0,
        favorite: Boolean(entry.favorite),
        archivedAt: entry.archivedAt || null
      })),
      options: {
        minWordLength: G_UNI.cfg.minWordLength,
        maxWordLength: G_UNI.cfg.maxWordLength,
        maxNodes: G_UNI.cfg.maxNodes,
        maxEdges: G_UNI.cfg.maxEdges,
        favoritesOnly: G_UNI.cfg.favoritesOnly,
        labelFilter: G_UNI.cfg.labelFilter,
        edgeModes: {
          contains: G_UNI.cfg.edgeModes.contains,
          prefix: G_UNI.cfg.edgeModes.prefix,
          suffix: G_UNI.cfg.edgeModes.suffix,
          stem: G_UNI.cfg.edgeModes.stem,
          sameLabel: G_UNI.cfg.edgeModes.sameLabel
        },
        seed: 1337
      }
    });
    G_RT.uDataSig = datasetSignature;
  } catch (error) {
    G_RT.uWorkerReady = false;
    recordDiagnosticError(
      "universe_worker_post_failed",
      cleanText(String(error?.message || error), 320),
      "G_RT.uWorker"
    );
  }
}

  return {
    renderClusterPanel,
    legacy_renderClusterPanel: renderClusterPanel,
    modular_renderClusterPanel: renderClusterPanel,
    renderUniverseGraph,
    legacy_renderUniverseGraph: renderUniverseGraph,
    modular_renderUniverseGraph: renderUniverseGraph,
    queueCacheSave,
    legacy_queueCacheSave: queueCacheSave,
    modular_queueCacheSave: queueCacheSave,
    requestGraphBuildNow,
    legacy_requestGraphBuildNow: requestGraphBuildNow,
    modular_requestGraphBuildNow: requestGraphBuildNow,
  };
});
