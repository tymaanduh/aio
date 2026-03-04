/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Universe_Events = __MODULE_API;
  root.DictionaryRendererUniverseEvents = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function bindUniverseInteractions() {
  const canvases = [G_DOM.universeCanvas, G_DOM.universeCanvasGl].filter(
    (canvas) => canvas instanceof HTMLCanvasElement
  );
  if (canvases.length === 0) {
    return;
  }
  G_PAGE.universe.syncControls();
  updateUniverseBookmarkSelect();
  syncCanvasVisibility();
  renderPerfHud(true);

  if (typeof ResizeObserver === "function") {
    G_RT.uResizeObs = new ResizeObserver(() => {
      if (ensureUniverseCanvasSize() && G_APP.s.activeView === VIEW_UNIVERSE) {
        G_PAGE.universe.reqRender();
      }
    });
    canvases.forEach((canvas) => G_RT.uResizeObs.observe(canvas));
  }

  if (G_DOM.universeFilterInput instanceof HTMLInputElement) {
    G_DOM.universeFilterInput.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      G_UNI.view.filter = target.value;
      G_PAGE.universe.renderSummary();
      G_PAGE.universe.renderCluster();
      G_PAGE.universe.reqRender();
    });
    G_DOM.universeFilterInput.addEventListener("keydown", (event) => {
      (event.key === "Enter") && (event.preventDefault(), jumpToUniverseFilter());
    });
  }
  bindActionElement(G_DOM.universeJumpAction, () => jumpToUniverseFilter());
  bindActionElement(G_DOM.universeBenchmarkAction, () => startUniverseBenchmark());
  bindActionElement(G_DOM.universeBenchmarkStopAction, () => stopUniverseBenchmark("stopped"));
  bindActionElement(G_DOM.universeGpuStatusAction, () => {
    void showUniverseGpuStatus(true);
  });

  if (G_DOM.universeColorModeSelect instanceof HTMLSelectElement) {
    G_DOM.universeColorModeSelect.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) {
        return;
      }
      G_UNI.cfg = normalizeConfig({
        ...G_UNI.cfg,
        colorMode: target.value,
        bookmarks: G_UNI.cfg.bookmarks
      });
      G_PAGE.universe.syncControls();
      queueCacheSave();
      G_PAGE.universe.reqRender();
    });
  }

  if (G_DOM.universeRenderModeSelect instanceof HTMLSelectElement) {
    G_DOM.universeRenderModeSelect.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) {
        return;
      }
      setUniverseRenderMode(target.value, {
        allowUnsafe: false,
        announce: true
      });
    });
  }

  bindActionElement(G_DOM.universeApplyFiltersAction, () => applyUniverseOptionsFromInputs());
  [
    G_DOM.universeMinWordLengthInput,
    G_DOM.universeMaxNodesInput,
    G_DOM.universeMaxEdgesInput,
    G_DOM.universeLabelFilterInput
  ].forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    input.addEventListener("keydown", (event) => {
      (event.key === "Enter") && (event.preventDefault(), applyUniverseOptionsFromInputs());
    });
  });
  if (G_DOM.universeFavoritesOnlyInput instanceof HTMLInputElement) {
    G_DOM.universeFavoritesOnlyInput.addEventListener("change", () => {
      applyUniverseOptionsFromInputs();
    });
  }

  PATTERN_UNIVERSE_EDGE_ACTIONS.forEach(([elementKey, modeKey]) => {
    bindActionElement(G_DOM[elementKey], () => toggleUniverseEdgeMode(modeKey));
  });

  bindActionElement(G_DOM.universeFindPathAction, () => applyUniversePathFinder());
  if (G_DOM.universePathFromInput instanceof HTMLInputElement) {
    G_DOM.universePathFromInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyUniversePathFinder();
      }
    });
  }
  if (G_DOM.universePathToInput instanceof HTMLInputElement) {
    G_DOM.universePathToInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyUniversePathFinder();
      }
    });
  }

  bindActionElement(G_DOM.universeResetCameraAction, () => {
    resetUniverseCamera();
    setStatus("Universe camera reset.");
  });
  bindActionElement(G_DOM.universeFitCameraAction, () => {
    fitUniverseCamera();
    setStatus("Universe camera fitted.");
  });
  bindActionElement(G_DOM.universeSaveViewAction, () => saveUniverseBookmark());
  bindActionElement(G_DOM.universeLoadViewAction, () => {
    if (!(G_DOM.universeBookmarkSelect instanceof HTMLSelectElement)) {
      return;
    }
    (!loadUniverseBookmark(G_DOM.universeBookmarkSelect.value)) && (setStatus("Select a saved view first.", true));
  });
  bindActionElement(G_DOM.universeExportPngAction, () => exportUniversePng());
  bindActionElement(G_DOM.universeExportJsonAction, () => exportUniverseGraphJson());

  const toCanvasPoint = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const stopDrag = (canvas) => {
    G_UNI.view.dragActive = false;
    (canvas instanceof HTMLCanvasElement) && (canvas.classList.remove("dragging"));
  };

  const scheduleHoverHitTest = () => {
    if (G_RT.uHoverFrame) {
      return;
    }
    G_RT.uHoverFrame = window.requestAnimationFrame(() => {
      G_RT.uHoverFrame = 0;
      const point = G_RT.uHoverPoint;
      if (!point || G_UNI.view.dragActive) {
        return;
      }
      const hoverIndex = findNodeAt(point.x, point.y);
      (hoverIndex !== G_UNI.view.hoverNodeIndex) && (G_UNI.view.hoverNodeIndex = hoverIndex, G_PAGE.universe.reqRender());
    });
  };

  const attachCanvasInteractions = (canvas) => {
    canvas.addEventListener("pointerdown", (event) => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      const point = toCanvasPoint(event, canvas);
      G_UNI.view.dragActive = true;
      G_UNI.view.dragMoved = false;
      G_UNI.view.dragStartX = point.x;
      G_UNI.view.dragStartY = point.y;
      G_UNI.view.dragPanX = G_UNI.view.panX;
      G_UNI.view.dragPanY = G_UNI.view.panY;
      markInteraction();
      canvas.classList.add("dragging");
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      const point = toCanvasPoint(event, canvas);
      if (G_UNI.view.dragActive) {
        const dx = point.x - G_UNI.view.dragStartX;
        const dy = point.y - G_UNI.view.dragStartY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          G_UNI.view.dragMoved = true;
        }
        const zoom = clampNumber(G_UNI.view.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
        G_UNI.view.panX = clampNumber(
          G_UNI.view.dragPanX + dx / (Math.max(1, G_UNI.canvas.size.width) * zoom),
          -1.6,
          1.6
        );
        G_UNI.view.panY = clampNumber(
          G_UNI.view.dragPanY + dy / (Math.max(1, G_UNI.canvas.size.height) * zoom),
          -1.6,
          1.6
        );
        markInteraction();
        clearProjectionCache();
        G_PAGE.universe.reqRender();
        return;
      }
      G_RT.uHoverPoint = point;
      scheduleHoverHitTest();
    });

    canvas.addEventListener("pointerup", (event) => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      if (!G_UNI.view.dragActive) {
        return;
      }
      (canvas.hasPointerCapture(event.pointerId)) && (canvas.releasePointerCapture(event.pointerId));
      const dragged = G_UNI.view.dragMoved;
      stopDrag(canvas);
      if (dragged) {
        queueCacheSave();
        return;
      }
      const point = toCanvasPoint(event, canvas);
      G_RT.uHoverPoint = point;
      const nodeIndex = findNodeAt(point.x, point.y);
      if (!Number.isInteger(nodeIndex) || nodeIndex < 0) {
        clearUniverseNodeSelection();
        return;
      }
      const withModifier = event.shiftKey || event.ctrlKey || event.metaKey;
      if (withModifier) {
        toggleUniverseNodeSelection(nodeIndex, {
          center: false,
          focusEntry: true,
          announce: `Updated selection: "${G_UNI.graph.nodes[nodeIndex]?.word || "word"}".`
        });
        return;
      }
      focusNodeIndex(nodeIndex, {
        center: false,
        announce: `Selected "${G_UNI.graph.nodes[nodeIndex]?.word || "word"}" from universe.`,
        focusEntry: true
      });
    });

    canvas.addEventListener("pointerleave", () => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      if (G_UNI.view.dragActive) {
        return;
      }
      (G_RT.uHoverFrame) && (window.cancelAnimationFrame(G_RT.uHoverFrame), G_RT.uHoverFrame = 0);
      G_RT.uHoverPoint = null;
      (G_UNI.view.hoverNodeIndex !== -1) && (G_UNI.view.hoverNodeIndex = -1, G_PAGE.universe.reqRender());
    });

    canvas.addEventListener("pointercancel", () => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      stopDrag(canvas);
      (G_RT.uHoverFrame) && (window.cancelAnimationFrame(G_RT.uHoverFrame), G_RT.uHoverFrame = 0);
      G_RT.uHoverPoint = null;
    });

    canvas.addEventListener(
      "wheel",
      (event) => {
        if (canvas !== getActiveCanvas()) {
          return;
        }
        event.preventDefault();
        const delta = event.deltaY < 0 ? 1.1 : 1 / 1.1;
        G_UNI.view.zoom = clampNumber(G_UNI.view.zoom * delta, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
        markInteraction();
        clearProjectionCache();
        G_PAGE.universe.reqRender();
      },
      { passive: false }
    );
  };

  canvases.forEach((canvas) => attachCanvasInteractions(canvas));
}

  return {
    bindUniverseInteractions,
    legacy_bindUniverseInteractions: bindUniverseInteractions,
    modular_bindUniverseInteractions: bindUniverseInteractions,
  };
});
