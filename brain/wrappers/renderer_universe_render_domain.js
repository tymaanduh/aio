/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Universe_Render_Domain = __MODULE_API;
  root.DictionaryRendererUniverseRenderDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function getActiveCanvas() {
    if (
      G_UNI.cfg.renderMode === CONSTANT_UNIVERSE.VIEW_MODE_WEBGL &&
      G_DOM.universeCanvasGl instanceof HTMLCanvasElement
    ) {
      return G_DOM.universeCanvasGl;
    }
    return G_DOM.universeCanvas instanceof HTMLCanvasElement ? G_DOM.universeCanvas : null;
  }

  function syncCanvasVisibility() {
    const showGl = G_UNI.cfg.renderMode === CONSTANT_UNIVERSE.VIEW_MODE_WEBGL;
    G_DOM.universeCanvas instanceof HTMLCanvasElement && G_DOM.universeCanvas.classList.toggle("hidden", showGl);
    G_DOM.universeCanvasGl instanceof HTMLCanvasElement && G_DOM.universeCanvasGl.classList.toggle("hidden", !showGl);
    showGl && G_UNI_FX.resetCanvasContext();
  }

  function setUniverseRenderMode(mode, options = {}) {
    const { allowUnsafe = false, announce = false } = options;
    const targetMode =
      mode === CONSTANT_UNIVERSE.VIEW_MODE_CANVAS
        ? CONSTANT_UNIVERSE.VIEW_MODE_CANVAS
        : CONSTANT_UNIVERSE.VIEW_MODE_WEBGL;
    if (targetMode === CONSTANT_UNIVERSE.VIEW_MODE_WEBGL && G_RT.uForceCanvas && !allowUnsafe) {
      if (announce) {
        setStatus("WebGL is disabled due to recent GPU instability. Use 'Try WebGL Renderer' to override.", true);
      }
      G_PAGE.universe.syncControls();
      return false;
    }
    G_UNI.cfg = normalizeConfig({
      ...G_UNI.cfg,
      renderMode: targetMode,
      bookmarks: G_UNI.cfg.bookmarks
    });
    targetMode === CONSTANT_UNIVERSE.VIEW_MODE_WEBGL && allowUnsafe && (G_RT.uForceCanvas = false);
    G_PAGE.universe.syncControls();
    syncCanvasVisibility();
    ensureUniverseCanvasSize();
    queueCacheSave();
    G_PAGE.universe.reqRender({ force: true });
    announce &&
      setStatus(
        targetMode === CONSTANT_UNIVERSE.VIEW_MODE_WEBGL
          ? "Universe renderer set to WebGL."
          : "Universe renderer set to Canvas."
      );
    return true;
  }

  function syncControls() {
    G_DOM.universeFilterInput instanceof HTMLInputElement &&
      (G_DOM.universeFilterInput.value = G_UNI.view.filter || "");
    G_DOM.universeMinWordLengthInput instanceof HTMLInputElement &&
      (G_DOM.universeMinWordLengthInput.value = String(G_UNI.cfg.minWordLength));
    G_DOM.universeMaxNodesInput instanceof HTMLInputElement &&
      (G_DOM.universeMaxNodesInput.value = String(G_UNI.cfg.maxNodes));
    G_DOM.universeMaxEdgesInput instanceof HTMLInputElement &&
      (G_DOM.universeMaxEdgesInput.value = String(G_UNI.cfg.maxEdges));
    G_DOM.universeFavoritesOnlyInput instanceof HTMLInputElement &&
      (G_DOM.universeFavoritesOnlyInput.checked = Boolean(G_UNI.cfg.favoritesOnly));
    G_DOM.universeLabelFilterInput instanceof HTMLInputElement &&
      (G_DOM.universeLabelFilterInput.value = G_UNI.cfg.labelFilter || "");
    G_DOM.universeColorModeSelect instanceof HTMLSelectElement &&
      (G_DOM.universeColorModeSelect.value = G_UNI.cfg.colorMode);
    G_DOM.universeRenderModeSelect instanceof HTMLSelectElement &&
      (G_DOM.universeRenderModeSelect.value = G_UNI.cfg.renderMode);
    PATTERN_UNIVERSE_EDGE_ACTIONS.forEach(([elementKey, modeKey]) => {
      const element = G_DOM[elementKey];
      element instanceof HTMLElement && element.classList.toggle("active", Boolean(G_UNI.cfg.edgeModes?.[modeKey]));
    });
  }

  function updateUniverseBookmarkSelect() {
    if (!(G_DOM.universeBookmarkSelect instanceof HTMLSelectElement)) {
      return;
    }
    G_DOM.universeBookmarkSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = G_UNI.cfg.bookmarks.length > 0 ? "Saved views" : "No saved views";
    G_DOM.universeBookmarkSelect.appendChild(placeholder);
    G_UNI.cfg.bookmarks.forEach((bookmark) => {
      const option = document.createElement("option");
      option.value = bookmark.id;
      option.textContent = bookmark.name;
      G_DOM.universeBookmarkSelect.appendChild(option);
    });
  }

  function setPathStatus(text, isError = false) {
    if (!(G_DOM.universePathStatus instanceof HTMLElement)) {
      return;
    }
    G_DOM.universePathStatus.textContent = cleanText(text, 280) || "Path finder ready.";
    G_DOM.universePathStatus.classList.toggle("danger", Boolean(isError));
  }

  function formatUniverseGpuLabel() {
    if (!G_RT.uGpu || G_RT.uGpu.ok === false) {
      return "GPU ?";
    }
    const mode = cleanText(G_RT.uGpu.effectiveGpuMode, 20) || "auto";
    const angle = cleanText(G_RT.uGpu.effectiveAngleBackend, 24);
    const gl = cleanText(G_RT.uGpu.effectiveGlImplementation, 24);
    if (mode === "off") {
      return "GPU off";
    }
    if (angle && angle !== "n/a" && angle !== "disabled") {
      return `ANGLE ${angle}`;
    }
    if (gl && gl !== "default" && gl !== "disabled") {
      return `GL ${gl}`;
    }
    return `GPU ${mode}`;
  }

  function isGpuStatusDegraded(status) {
    const source = status && typeof status === "object" ? status : {};
    const mode = cleanText(source.effectiveGpuMode, 20);
    if (mode === "off") {
      return true;
    }
    const feature = source.featureStatus && typeof source.featureStatus === "object" ? source.featureStatus : {};
    const compositing = cleanText(String(feature.gpu_compositing || ""), 80).toLowerCase();
    const webgl = cleanText(String(feature.webgl || feature.webgl2 || ""), 80).toLowerCase();
    if (compositing.includes("disabled") || compositing.includes("unavailable")) {
      return true;
    }
    // Rasterization may be intentionally disabled while WebGL compositing remains healthy.
    if (webgl && (webgl.includes("disabled") || webgl.includes("unavailable"))) {
      return true;
    }
    return false;
  }

  function applyUniverseSafeRenderModeFromGpuStatus(status) {
    if (!isGpuStatusDegraded(status)) {
      return false;
    }
    if (G_UNI.cfg.renderMode === CONSTANT_UNIVERSE.VIEW_MODE_CANVAS) {
      G_RT.uForceCanvas = true;
      return false;
    }
    G_UNI.cfg = normalizeConfig({
      ...G_UNI.cfg,
      renderMode: CONSTANT_UNIVERSE.VIEW_MODE_CANVAS,
      bookmarks: G_UNI.cfg.bookmarks
    });
    G_RT.uForceCanvas = true;
    syncCanvasVisibility();
    G_PAGE.universe.syncControls();
    clearProjectionCache();
    setStatus("GPU degraded. Universe switched to Canvas mode for stability.");
    queueCacheSave();
    G_PAGE.universe.reqRender({ force: true });
    return true;
  }

  function renderPerfHud(force = false) {
    if (!(G_DOM.universePerfHud instanceof HTMLElement)) {
      return;
    }
    const now = performance.now();
    if (!force && now - G_RT.uHudAt < UNIVERSE_PERF_HUD_UPDATE_INTERVAL_MS) {
      return;
    }
    G_RT.uHudAt = now;

    const fps = G_RT.uFrameMs > 0 ? 1000 / G_RT.uFrameMs : 0;
    const fpsText = Number.isFinite(fps) && fps > 0 ? fps.toFixed(1) : "--";
    const renderText = G_RT.uPerfMs > 0 ? G_RT.uPerfMs.toFixed(2) : "--";
    let benchmarkText = "";
    if (G_RT.uBench.running) {
      benchmarkText = ` | Bench ${Math.round(getUniverseBenchmarkProgress(now) * 100)}%`;
    } else if (G_RT.uBench.lastResult) {
      benchmarkText = ` | Last ${Number(G_RT.uBench.lastResult.avgFps || 0).toFixed(1)} FPS`;
    }

    G_DOM.universePerfHud.textContent = `FPS: ${fpsText} | Render: ${renderText} ms | ${formatUniverseGpuLabel()}${benchmarkText}`;

    G_DOM.universeBenchmarkAction instanceof HTMLElement &&
      G_DOM.universeBenchmarkAction.classList.toggle("hidden", G_RT.uBench.running);
    G_DOM.universeBenchmarkStopAction instanceof HTMLElement &&
      G_DOM.universeBenchmarkStopAction.classList.toggle("hidden", !G_RT.uBench.running);
  }

  function updateUniverseFrameMetrics(frameStartedAt, frameMs) {
    if (G_RT.uFrameAt > 0) {
      const frameInterval = frameStartedAt - G_RT.uFrameAt;
      if (frameInterval > 0 && frameInterval < 5000) {
        G_RT.uFrameMs = G_RT.uFrameMs === 0 ? frameInterval : G_RT.uFrameMs * 0.86 + frameInterval * 0.14;
        if (G_RT.uBench.running) {
          appendUniverseBenchmarkSample(G_RT.uBench.frameIntervalsMs, frameInterval);
        }
      }
    }
    G_RT.uFrameAt = frameStartedAt;

    G_RT.uPerfMs = G_RT.uPerfMs === 0 ? frameMs : G_RT.uPerfMs * 0.86 + frameMs * 0.14;
    frameStartedAt - G_RT.uPerfAt >= UNIVERSE_PERF_SAMPLE_INTERVAL_MS &&
      ((G_RT.uPerfAt = frameStartedAt), recordDiagnosticPerf("render_universe_ms", G_RT.uPerfMs));

    if (G_RT.uBench.running) {
      appendUniverseBenchmarkSample(G_RT.uBench.renderTimesMs, frameMs);
      if (getUniverseBenchmarkProgress(frameStartedAt) >= 1) {
        completeUniverseBenchmark("completed");
        return;
      }
      G_PAGE.universe.reqRender({ force: true });
    }

    renderPerfHud();
  }

  function getUniverseTargetDpr() {
    const nativeDpr = Math.max(1, Math.min(UNIVERSE_DPR_MAX, window.devicePixelRatio || 1));
    const nodeCount = Array.isArray(G_UNI.graph.nodes) ? G_UNI.graph.nodes.length : 0;
    const edgeCount = Array.isArray(G_UNI.graph.edges) ? G_UNI.graph.edges.length : 0;

    let cap = nativeDpr;
    (nodeCount > 1400 || edgeCount > 14000) && (cap = Math.min(cap, UNIVERSE_DPR_HEAVY));
    if (G_RT.uBench.running || G_RT.uPerfMs > 11 || nodeCount > 2200 || edgeCount > 22000) {
      cap = Math.min(cap, UNIVERSE_DPR_LOW);
    } else {
      G_RT.uPerfMs > 8 && (cap = Math.min(cap, UNIVERSE_DPR_SOFT));
    }
    return Math.max(1, cap);
  }

  function ensureUniverseCanvasSize() {
    const canvas = getActiveCanvas();
    if (!(canvas instanceof HTMLCanvasElement)) {
      return false;
    }
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = getUniverseTargetDpr();
    const nextPixelWidth = Math.floor(width * dpr);
    const nextPixelHeight = Math.floor(height * dpr);
    const changed =
      G_UNI.canvas.size.width !== width ||
      G_UNI.canvas.size.height !== height ||
      G_UNI.canvas.size.dpr !== dpr ||
      canvas.width !== nextPixelWidth ||
      canvas.height !== nextPixelHeight;
    if (!changed) {
      return false;
    }
    G_UNI.canvas.size = {
      width,
      height,
      dpr
    };
    canvas.width = nextPixelWidth;
    canvas.height = nextPixelHeight;
    return true;
  }

  function getCanvasCtx(canvas) {
    return G_UNI_FX.getCanvasContext(canvas);
  }

  function markInteraction(durationMs = CONSTANT_UNIVERSE.INTERACTION_ACTIVE_MS) {
    G_UNI_FX.markInteraction(durationMs);
  }

  function getEdgeStride(edgeCount) {
    return G_UNI_FX.getEdgeStride(edgeCount, {
      benchmarkRunning: G_RT.uBench.running,
      perfSmoothedMs: G_RT.uPerfMs
    });
  }

  function buildProjectionInput(nodes, width, height) {
    return {
      nodes,
      width,
      height,
      zoom: clampNumber(G_UNI.view.zoom, CONSTANT_UNIVERSE.ZOOM_MIN, CONSTANT_UNIVERSE.ZOOM_MAX),
      panX: clampUniversePan(G_UNI.view.panX),
      panY: clampUniversePan(G_UNI.view.panY),
      cacheToken: getGraphCacheToken(160)
    };
  }

  function getProjection(nodes, width, height) {
    return G_UNI_FX.getProjectionData(buildProjectionInput(nodes, width, height));
  }

  function findNodeAt(canvasX, canvasY) {
    return G_UNI_FX.findNodeIndexAt({
      canvasX,
      canvasY,
      ...buildProjectionInput(G_UNI.graph.nodes, G_UNI.canvas.size.width, G_UNI.canvas.size.height)
    });
  }

  function reqGraph(options = {}) {
    const { force = false } = options;
    if (!force && !isUniverseVisible()) {
      return;
    }
    if (G_RT.uRenderFrame) {
      return;
    }
    G_RT.uRenderFrame = window.requestAnimationFrame(() => {
      G_RT.uRenderFrame = 0;
      renderUniverseGraph();
    });
  }

  function drawUniverseNodeLabel(context, text, x, y) {
    const label = cleanText(text, 120);
    if (!label) {
      return;
    }
    context.save();
    context.font = "600 12px 'Space Grotesk', sans-serif";
    const textWidth = context.measureText(label).width;
    const width = textWidth + 14;
    const height = 22;
    const left = x - width / 2;
    const top = y - 30;
    context.fillStyle = "rgba(7, 14, 26, 0.86)";
    context.strokeStyle = "rgba(125, 178, 252, 0.45)";
    context.lineWidth = 1;
    context.beginPath();
    if (typeof context.roundRect === "function") {
      context.roundRect(left, top, width, height, 8);
    } else {
      context.rect(left, top, width, height);
    }
    context.fill();
    context.stroke();
    context.fillStyle = "#d9ebff";
    context.fillText(label, left + 7, top + 15);
    context.restore();
  }

  function renderGraphWebgl(
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
  ) {
    return G_UNI_FX.renderWebgl({
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
      projection,
      benchmarkRunning: G_RT.uBench.running,
      perfSmoothedMs: G_RT.uPerfMs,
      pulseNodeIndex: G_UNI.view.pulseNodeIndex,
      pulseUntil: G_UNI.view.pulseUntil,
      getNodeColor: getUniverseNodeColor,
      getEdgeKey: buildUniverseEdgeKey,
      now: Date.now()
    });
  }

  function isUniverseVisible() {
    return G_DOM.universeView instanceof HTMLElement && !G_DOM.universeView.classList.contains("hidden");
  }

  function isSentenceGraphVisible() {
    return G_DOM.sentenceGraphView instanceof HTMLElement && !G_DOM.sentenceGraphView.classList.contains("hidden");
  }

  function createUniverseBenchmarkState(lastResult = null) {
    return {
      running: false,
      startedAt: 0,
      durationMs: UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS,
      seed: 0,
      baseCamera: null,
      frameIntervalsMs: [],
      renderTimesMs: [],
      lastResult
    };
  }

  function getUniverseBenchmarkProgress(nowMs = performance.now()) {
    if (!G_RT.uBench.running) {
      return 0;
    }
    return clampNumber((nowMs - G_RT.uBench.startedAt) / Math.max(1, G_RT.uBench.durationMs), 0, 1);
  }

  function appendUniverseBenchmarkSample(samples, value) {
    if (!Array.isArray(samples)) {
      return;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
      return;
    }
    samples.push(numeric);
    samples.length > UNIVERSE_BENCHMARK_SAMPLE_LIMIT &&
      samples.splice(0, samples.length - UNIVERSE_BENCHMARK_SAMPLE_LIMIT);
  }

  function updateUniverseBenchmarkCamera(progress) {
    if (!G_RT.uBench.running) {
      return;
    }
    const clamped = clampNumber(progress, 0, 1);
    const phase = G_RT.uBench.seed + clamped * Math.PI * 8;
    const zoom = 1.02 + Math.sin(clamped * Math.PI * 6) * 0.32;
    G_UNI.view.zoom = clampNumber(zoom, CONSTANT_UNIVERSE.ZOOM_MIN, CONSTANT_UNIVERSE.ZOOM_MAX);
    G_UNI.view.panX = clampUniversePan(Math.cos(phase) * 0.26);
    G_UNI.view.panY = clampUniversePan(Math.sin(phase * 0.8) * 0.22);
    markInteraction(CONSTANT_UNIVERSE.INTERACTION_ACTIVE_MS + 140);
    clearProjectionCache();
  }

  function completeUniverseBenchmark(reason = "completed") {
    if (!G_RT.uBench.running) {
      return G_RT.uBench.lastResult || null;
    }
    const elapsedMs = Math.max(1, performance.now() - G_RT.uBench.startedAt);
    const frameIntervals = G_RT.uBench.frameIntervalsMs.slice();
    const renderTimes = G_RT.uBench.renderTimesMs.slice();
    const totalFrames = renderTimes.length;
    const avgFrameMs =
      frameIntervals.length > 0 ? frameIntervals.reduce((sum, sample) => sum + sample, 0) / frameIntervals.length : 0;
    const avgFps = avgFrameMs > 0 ? 1000 / avgFrameMs : 0;
    const slowFrames = frameIntervals.filter((sample) => sample > 25).length;
    const result = {
      reason: cleanText(reason, 40) || "completed",
      at: nowIso(),
      elapsedMs,
      totalFrames,
      avgFps,
      minFps: frameIntervals.length > 0 ? 1000 / Math.max(...frameIntervals) : 0,
      p95FrameMs: calculatePercentile(frameIntervals, 0.95),
      avgRenderMs:
        renderTimes.length > 0 ? renderTimes.reduce((sum, sample) => sum + sample, 0) / renderTimes.length : 0,
      p95RenderMs: calculatePercentile(renderTimes, 0.95),
      slowFrames
    };
    const baseCamera = G_RT.uBench.baseCamera;
    G_RT.uBench = createUniverseBenchmarkState(result);
    baseCamera &&
      ((G_UNI.view.zoom = clampNumber(baseCamera.zoom, CONSTANT_UNIVERSE.ZOOM_MIN, CONSTANT_UNIVERSE.ZOOM_MAX)),
      (G_UNI.view.panX = clampUniversePan(baseCamera.panX)),
      (G_UNI.view.panY = clampUniversePan(baseCamera.panY)),
      clearProjectionCache());
    renderPerfHud(true);

    const summary = `3D benchmark ${result.reason}: avg ${result.avgFps.toFixed(1)} FPS, p95 frame ${result.p95FrameMs.toFixed(2)}ms, slow frames ${result.slowFrames}.`;
    const isErrorReason = result.reason !== "completed" && result.reason !== "stopped";
    setStatus(summary, isErrorReason);
    pushRuntimeLog(
      isErrorReason ? "warn" : "info",
      "benchmark",
      summary,
      cleanText(
        JSON.stringify({
          elapsedMs: result.elapsedMs,
          totalFrames: result.totalFrames,
          avgFps: Number(result.avgFps.toFixed(2)),
          minFps: Number(result.minFps.toFixed(2)),
          avgRenderMs: Number(result.avgRenderMs.toFixed(2)),
          p95RenderMs: Number(result.p95RenderMs.toFixed(2))
        }),
        960
      )
    );
    recordDiagnosticPerf("benchmark_universe_avg_render_ms", result.avgRenderMs);
    recordDiagnosticPerf("benchmark_universe_p95_render_ms", result.p95RenderMs);
    recordDiagnosticPerf("benchmark_universe_p95_frame_ms", result.p95FrameMs);
    G_PAGE.universe.reqRender({ force: true });
    return result;
  }

  function startUniverseBenchmark(durationMs = UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS) {
    if (G_RT.uBench.running) {
      setStatus("3D benchmark is already running.");
      return false;
    }
    const nodeCount = Array.isArray(G_UNI.graph.nodes) ? G_UNI.graph.nodes.length : 0;
    if (nodeCount < 2) {
      setStatus("Add more words before running the 3D benchmark.", true);
      return false;
    }
    const duration = clampNumber(
      Math.floor(Number(durationMs) || UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS),
      2000,
      UNIVERSE_BENCHMARK_MAX_DURATION_MS
    );
    G_APP.s.activeView !== CONSTANT_VIEW.UNIVERSE && setActiveView(CONSTANT_VIEW.UNIVERSE);
    G_RT.uBench = {
      running: true,
      startedAt: performance.now(),
      durationMs: duration,
      seed: Math.random() * Math.PI * 2,
      baseCamera: {
        zoom: G_UNI.view.zoom,
        panX: G_UNI.view.panX,
        panY: G_UNI.view.panY
      },
      frameIntervalsMs: [],
      renderTimesMs: [],
      lastResult: G_RT.uBench.lastResult
    };
    G_RT.uFrameAt = 0;
    G_RT.uFrameMs = 0;
    renderPerfHud(true);
    setStatus(`Running 3D benchmark for ${(duration / 1000).toFixed(0)}s...`);
    pushRuntimeLog("info", "benchmark", "3D benchmark started.", `durationMs=${duration};nodes=${nodeCount}`);
    void loadUniverseGpuStatus(false);
    G_PAGE.universe.reqRender({ force: true });
    return true;
  }

  function stopUniverseBenchmark(reason = "stopped") {
    if (!G_RT.uBench.running) {
      return null;
    }
    return completeUniverseBenchmark(reason);
  }

  async function showUniverseGpuStatus(force = true) {
    const status = await loadUniverseGpuStatus(force);
    if (!status) {
      setStatus("GPU status unavailable.", true);
      return;
    }
    const featureStatus = status.featureStatus && typeof status.featureStatus === "object" ? status.featureStatus : {};
    const summary = `${formatUniverseGpuLabel()} | compositing: ${featureStatus.gpu_compositing || "unknown"} | raster: ${featureStatus.gpu_rasterization || "unknown"}`;
    setStatus(summary);
    pushRuntimeLog(
      "info",
      "gpu",
      "GPU status requested.",
      cleanText(
        JSON.stringify({
          mode: status.effectiveGpuMode || "auto",
          angle: status.effectiveAngleBackend || "",
          gl: status.effectiveGlImplementation || "",
          switches: Array.isArray(status.switches) ? status.switches.slice(0, 20) : [],
          compositing: featureStatus.gpu_compositing || "unknown",
          rasterization: featureStatus.gpu_rasterization || "unknown"
        }),
        960
      )
    );
  }

  function getUniverseQuestionBucket(node) {
    const cached = cleanText(node?.questionBucket, 20).toLowerCase();
    if (
      cached === "who" ||
      cached === "what" ||
      cached === "where" ||
      cached === "when" ||
      cached === "why" ||
      cached === "how"
    ) {
      return cached;
    }
    const bucket = inferUniverseQuestionBucketFromLabels(node?.labels);
    node && typeof node === "object" && (node.questionBucket = bucket);
    return bucket;
  }

  function getUniverseNodeColor(node) {
    const colorMode = G_UNI.cfg.colorMode;
    if (colorMode === CONSTANT_UNIVERSE.COLOR_MODE_POS) {
      const pos = cleanText(node?.partOfSpeech, 30).toLowerCase();
      if (pos === "noun") {
        return "#77d4ff";
      }
      if (pos === "verb") {
        return "#ff9f6a";
      }
      if (pos === "adjective") {
        return "#c39bff";
      }
      if (pos === "adverb") {
        return "#ffd36b";
      }
      if (pos === "pronoun") {
        return "#7fffb8";
      }
      return "#98b8e6";
    }

    if (colorMode === CONSTANT_UNIVERSE.COLOR_MODE_MODE) {
      const mode = normalizeEntryMode(node?.mode);
      if (mode === "slang") {
        return "#66e2af";
      }
      if (mode === "code") {
        return "#64beff";
      }
      if (mode === "bytes") {
        return "#ff8bc2";
      }
      return "#e0c06f";
    }

    const bucket = getUniverseQuestionBucket(node);
    if (bucket === "who") {
      return "#86d4ff";
    }
    if (bucket === "where") {
      return "#77efc8";
    }
    if (bucket === "when") {
      return "#ffd97d";
    }
    if (bucket === "why") {
      return "#d7a3ff";
    }
    if (bucket === "how") {
      return "#ffa989";
    }
    return "#87a8d7";
  }

  return {
    getActiveCanvas,
    modular_getActiveCanvas: getActiveCanvas,
    syncCanvasVisibility,
    modular_syncCanvasVisibility: syncCanvasVisibility,
    setUniverseRenderMode,
    modular_setUniverseRenderMode: setUniverseRenderMode,
    syncControls,
    modular_syncControls: syncControls,
    updateUniverseBookmarkSelect,
    modular_updateUniverseBookmarkSelect: updateUniverseBookmarkSelect,
    setPathStatus,
    modular_setPathStatus: setPathStatus,
    formatUniverseGpuLabel,
    modular_formatUniverseGpuLabel: formatUniverseGpuLabel,
    isGpuStatusDegraded,
    modular_isGpuStatusDegraded: isGpuStatusDegraded,
    applyUniverseSafeRenderModeFromGpuStatus,
    modular_applyUniverseSafeRenderModeFromGpuStatus: applyUniverseSafeRenderModeFromGpuStatus,
    renderPerfHud,
    modular_renderPerfHud: renderPerfHud,
    updateUniverseFrameMetrics,
    modular_updateUniverseFrameMetrics: updateUniverseFrameMetrics,
    getUniverseTargetDpr,
    modular_getUniverseTargetDpr: getUniverseTargetDpr,
    ensureUniverseCanvasSize,
    modular_ensureUniverseCanvasSize: ensureUniverseCanvasSize,
    getCanvasCtx,
    modular_getCanvasCtx: getCanvasCtx,
    markInteraction,
    modular_markInteraction: markInteraction,
    getEdgeStride,
    modular_getEdgeStride: getEdgeStride,
    buildProjectionInput,
    modular_buildProjectionInput: buildProjectionInput,
    getProjection,
    modular_getProjection: getProjection,
    findNodeAt,
    modular_findNodeAt: findNodeAt,
    reqGraph,
    modular_reqGraph: reqGraph,
    drawUniverseNodeLabel,
    modular_drawUniverseNodeLabel: drawUniverseNodeLabel,
    renderGraphWebgl,
    modular_renderGraphWebgl: renderGraphWebgl,

    isUniverseVisible,
    modular_isUniverseVisible: isUniverseVisible,
    isSentenceGraphVisible,
    modular_isSentenceGraphVisible: isSentenceGraphVisible,
    createUniverseBenchmarkState,
    modular_createUniverseBenchmarkState: createUniverseBenchmarkState,
    getUniverseBenchmarkProgress,
    modular_getUniverseBenchmarkProgress: getUniverseBenchmarkProgress,
    appendUniverseBenchmarkSample,
    modular_appendUniverseBenchmarkSample: appendUniverseBenchmarkSample,
    updateUniverseBenchmarkCamera,
    modular_updateUniverseBenchmarkCamera: updateUniverseBenchmarkCamera,
    completeUniverseBenchmark,
    modular_completeUniverseBenchmark: completeUniverseBenchmark,
    startUniverseBenchmark,
    modular_startUniverseBenchmark: startUniverseBenchmark,
    stopUniverseBenchmark,
    modular_stopUniverseBenchmark: stopUniverseBenchmark,
    showUniverseGpuStatus,
    modular_showUniverseGpuStatus: showUniverseGpuStatus,

    getUniverseQuestionBucket,
    modular_getUniverseQuestionBucket: getUniverseQuestionBucket,
    getUniverseNodeColor,
    modular_getUniverseNodeColor: getUniverseNodeColor
  };
});
