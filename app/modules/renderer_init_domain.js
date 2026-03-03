/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Init_Domain = __MODULE_API;
  root.DictionaryRendererInitDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function getNormalizedUiPreferences(input) {
  try {
    return normalizeUiPreferences(input);
  } catch {
    return createDefaultUiPreferences();
  }
}

function isSystemReducedMotionEnabled() {
  return Boolean(G_RT.reduceMotionMediaQuery && G_RT.reduceMotionMediaQuery.matches);
}

function isMotionReduced() {
  return Boolean(G_UNI.ui.prefs?.reduceMotion) || isSystemReducedMotionEnabled();
}

function applyUiTheme(theme) {
  const normalizedTheme = normalizeUiTheme(theme);
  document.documentElement.setAttribute("data-theme", normalizedTheme);
  (document.body) && (document.body.setAttribute("data-theme", normalizedTheme));
  document.documentElement.style.colorScheme = normalizedTheme === "futuristic" ? "dark" : "light";
  return normalizedTheme;
}

function applyMotionPreference(reduceMotion) {
  G_UNI.ui.prefs = getNormalizedUiPreferences({
    ...G_UNI.ui.prefs,
    reduceMotion: Boolean(reduceMotion)
  });

  const reduced = isMotionReduced();
  document.body.classList.toggle("motion-reduced", reduced);
  document.body.classList.toggle("motion-ready", !reduced);
  if (reduced) {
    document.documentElement.style.setProperty("--mx", "0.5");
    document.documentElement.style.setProperty("--my", "0.5");
    document.querySelectorAll(".authCard").forEach((target) => {
      (target instanceof HTMLElement) && (target.style.removeProperty("transform"));
    });
  }
  return reduced;
}

function syncUiSettingsControls() {
  const theme = normalizeUiTheme(G_UNI.ui.prefs?.theme);
  (G_DOM.uiThemeEnterpriseInput instanceof HTMLInputElement) && (G_DOM.uiThemeEnterpriseInput.checked = theme === "enterprise");
  (G_DOM.uiThemeFuturisticInput instanceof HTMLInputElement) && (G_DOM.uiThemeFuturisticInput.checked = theme === "futuristic");
  (G_DOM.uiThemeMonochromeInput instanceof HTMLInputElement) && (G_DOM.uiThemeMonochromeInput.checked = theme === "monochrome");
  (G_DOM.uiReduceMotionInput instanceof HTMLInputElement) && (G_DOM.uiReduceMotionInput.checked = Boolean(G_UNI.ui.prefs?.reduceMotion));
}

function applyUiPreferences(input) {
  G_UNI.ui.prefs = getNormalizedUiPreferences(input);
  G_UNI.ui.prefs.theme = applyUiTheme(G_UNI.ui.prefs.theme);
  applyMotionPreference(G_UNI.ui.prefs.reduceMotion);
  G_APP.s.uiPreferences = G_UNI.ui.prefs;
  syncUiSettingsControls();
}

async function saveUiPreferencesNow() {
  if (!window.app_api?.saveUiPreferences) {
    return G_UNI.ui.prefs;
  }
  const payload = getNormalizedUiPreferences(G_UNI.ui.prefs);
  const saved = await window.app_api.saveUiPreferences(payload);
  const normalizedSaved = getNormalizedUiPreferences(saved);
  applyUiPreferences(normalizedSaved);
  return normalizedSaved;
}

function clearUiSettingsSaveTimer(flush = false) {
  (G_RT.uiSettingsSaveTimer) && (window.clearTimeout(G_RT.uiSettingsSaveTimer), G_RT.uiSettingsSaveTimer = 0);
  if (flush) {
    saveUiPreferencesNow().catch((error) => {
      recordDiagnosticError("ui_preferences_save", String(error?.message || error), "saveUiPreferencesNow");
    });
  }
}

function scheduleUiPreferencesSave() {
  clearUiSettingsSaveTimer(false);
  G_RT.uiSettingsSaveTimer = window.setTimeout(() => {
    G_RT.uiSettingsSaveTimer = 0;
    saveUiPreferencesNow().catch((error) => {
      recordDiagnosticError("ui_preferences_save", String(error?.message || error), "saveUiPreferencesNow");
    });
  }, UI_PREFERENCES_SAVE_DELAY_MS);
}

function updateUiThemePreference(theme, options = {}) {
  const normalizedTheme = normalizeUiTheme(theme);
  const persist = options.persist !== false;
  applyUiPreferences({
    ...G_UNI.ui.prefs,
    theme: normalizedTheme
  });
  (persist) && (scheduleUiPreferencesSave());
}

function updateReduceMotionPreference(reduceMotion, options = {}) {
  const persist = options.persist !== false;
  applyUiPreferences({
    ...G_UNI.ui.prefs,
    reduceMotion: Boolean(reduceMotion)
  });
  (persist) && (scheduleUiPreferencesSave());
}

async function loadUiPreferencesFromDisk() {
  if (!window.app_api?.loadUiPreferences) {
    applyUiPreferences(createDefaultUiPreferences());
    return G_UNI.ui.prefs;
  }
  try {
    const loaded = await window.app_api.loadUiPreferences();
    applyUiPreferences(loaded);
  } catch (error) {
    applyUiPreferences(createDefaultUiPreferences());
    recordDiagnosticError("ui_preferences_load", String(error?.message || error), "loadUiPreferencesFromDisk");
  }
  return G_UNI.ui.prefs;
}

function isUiSettingsPopoverOpen() {
  return G_DOM.uiSettingsPopover instanceof HTMLElement && !G_DOM.uiSettingsPopover.classList.contains("hidden");
}

function getUiSettingsFocusableElements() {
  if (!(G_DOM.uiSettingsPopover instanceof HTMLElement)) {
    return [];
  }
  return [...G_DOM.uiSettingsPopover.querySelectorAll(UI_SETTINGS_FOCUSABLE_SELECTOR)].filter((item) => {
    if (!(item instanceof HTMLElement)) {
      return false;
    }
    return !item.hasAttribute("disabled");
  });
}

function openUiSettingsPopover() {
  if (!(G_DOM.uiSettingsPopover instanceof HTMLElement) || !(G_DOM.uiSettingsTrigger instanceof HTMLElement)) {
    return;
  }
  G_RT.uiSettingsRestoreFocusElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : G_DOM.uiSettingsTrigger;
  G_DOM.uiSettingsPopover.classList.remove("hidden");
  G_DOM.uiSettingsTrigger.setAttribute("aria-expanded", "true");
  syncUiSettingsControls();
  const focusables = getUiSettingsFocusableElements();
  const nextFocus = focusables[0];
  if (nextFocus instanceof HTMLElement) {
    nextFocus.focus();
  } else {
    G_DOM.uiSettingsPopover.focus();
  }
}

function closeUiSettingsPopover({ restoreFocus = true } = {}) {
  if (!(G_DOM.uiSettingsPopover instanceof HTMLElement) || !(G_DOM.uiSettingsTrigger instanceof HTMLElement)) {
    return;
  }
  G_DOM.uiSettingsPopover.classList.add("hidden");
  G_DOM.uiSettingsTrigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) {
    const fallback = G_DOM.uiSettingsTrigger;
    const target = G_RT.uiSettingsRestoreFocusElement instanceof HTMLElement ? G_RT.uiSettingsRestoreFocusElement : fallback;
    target.focus();
  }
}

function toggleUiSettingsPopover() {
  if (isUiSettingsPopoverOpen()) {
    closeUiSettingsPopover();
    return;
  }
  openUiSettingsPopover();
}

function initializeUiMotion() {
  if (G_RT.uiMotionInitialized) {
    applyMotionPreference(G_UNI.ui.prefs?.reduceMotion);
    return;
  }
  G_RT.uiMotionInitialized = true;

  if (window.matchMedia) {
    G_RT.reduceMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    G_RT.reduceMotionMediaQueryListener = () => {
      applyMotionPreference(G_UNI.ui.prefs?.reduceMotion);
    };
    if (typeof G_RT.reduceMotionMediaQuery.addEventListener === "function") {
      G_RT.reduceMotionMediaQuery.addEventListener("change", G_RT.reduceMotionMediaQueryListener);
    } else {
      (typeof G_RT.reduceMotionMediaQuery.addListener === "function") &&
        (G_RT.reduceMotionMediaQuery.addListener(G_RT.reduceMotionMediaQueryListener));
    }
  }

  applyMotionPreference(G_UNI.ui.prefs?.reduceMotion);

  const motionTargets = [...document.querySelectorAll(".authCard")];
  motionTargets.forEach((target) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const onMove = (event) => {
      if (!(event instanceof PointerEvent) || event.pointerType === "touch") {
        return;
      }
      if (document.body.classList.contains("motion-reduced")) {
        target.style.removeProperty("transform");
        return;
      }
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = clampNumber(-dy * 2.4, -2.4, 2.4);
      const rotateY = clampNumber(dx * 2.8, -2.8, 2.8);
      target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const onLeave = () => {
      target.style.removeProperty("transform");
    };

    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave);
  });

  let pointerFrame = 0;
  let nextX = 0.5;
  let nextY = 0.5;
  const onPointer = (event) => {
    if (document.body.classList.contains("motion-reduced") || document.body.classList.contains("app-active")) {
      return;
    }
    nextX = clampNumber(event.clientX / Math.max(1, window.innerWidth), 0, 1);
    nextY = clampNumber(event.clientY / Math.max(1, window.innerHeight), 0, 1);
    if (pointerFrame) {
      return;
    }
    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = 0;
      const root = document.documentElement;
      root.style.setProperty("--mx", String(nextX));
      root.style.setProperty("--my", String(nextY));
    });
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
}

function initializeStatsWorker() {
  if (typeof Worker !== "function") {
    return;
  }
  try {
    G_RT.statsWorker = new Worker("../workers/stats_worker.js");
  } catch {
    G_RT.statsWorker = null;
    G_RT.statsWorkerReady = false;
    return;
  }
  G_RT.statsWorkerReady = true;
  G_RT.statsWorker.onmessage = (event) => {
    const payload = event?.data && typeof event.data === "object" ? event.data : {};
    if (payload.type === "statsError") {
      recordDiagnosticError(
        "stats_worker_error",
        cleanText(payload.message || "Unknown stats worker error.", 300),
        "G_RT.statsWorker"
      );
      return;
    }
    if (payload.type !== "statsResult") {
      return;
    }
    const requestId = Number(payload.requestId) || 0;
    if (requestId < G_RT.statsWorkerRequestId) {
      return;
    }
    G_RT.statsWorkerRequestId = requestId;
    G_RT.statsWorkerModelKey = cleanText(payload.versionKey, 80);
    G_RT.statsWorkerModel = payload.model && typeof payload.model === "object" ? payload.model : null;
    (G_APP.s.activeView === VIEW_STATISTICS) && (renderStatisticsView());
  };
  G_RT.statsWorker.onerror = (error) => {
    G_RT.statsWorkerReady = false;
    recordDiagnosticError("stats_worker_failed", cleanText(String(error?.message || error), 300), "G_RT.statsWorker");
  };
}

function initializeUniverseWorker() {
  if (typeof Worker !== "function") {
    return;
  }
  try {
    G_RT.uWorker = new Worker("../workers/word_universe_worker.js");
  } catch {
    G_RT.uWorker = null;
    G_RT.uWorkerReady = false;
    return;
  }
  G_RT.uWorkerReady = true;
  G_RT.uWorker.onmessage = (event) => {
    const payload = event?.data && typeof event.data === "object" ? event.data : {};
    if (payload.type === "universeGraphError") {
      recordDiagnosticError(
        "universe_worker_error",
        cleanText(payload.message || "Universe graph worker error.", 320),
        "G_RT.uWorker"
      );
      return;
    }
    if (payload.type !== "universeGraphResult") {
      return;
    }
    const requestId = Number(payload.requestId) || 0;
    if (requestId < G_RT.uWorkerReqId) {
      return;
    }
    G_RT.uWorkerReqId = requestId;
    G_RT.uGraphKey = cleanText(payload.versionKey, 200);
    const rawGraph = payload.graph && typeof payload.graph === "object" ? payload.graph : null;
    if (!rawGraph) {
      return;
    }
    G_UNI.graph = normalizeUniverseGraph(rawGraph);
    clearProjectionCache();
    rebuildUniverseNodeIndexes();
    clearPathHighlights();
    G_UNI.view.hoverNodeIndex = -1;
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
  };
  G_RT.uWorker.onerror = (error) => {
    G_RT.uWorkerReady = false;
    recordDiagnosticError("universe_worker_failed", cleanText(String(error?.message || error), 320), "G_RT.uWorker");
  };
}

  return {
    getNormalizedUiPreferences,
    legacy_getNormalizedUiPreferences: getNormalizedUiPreferences,
    modular_getNormalizedUiPreferences: getNormalizedUiPreferences,
    isSystemReducedMotionEnabled,
    legacy_isSystemReducedMotionEnabled: isSystemReducedMotionEnabled,
    modular_isSystemReducedMotionEnabled: isSystemReducedMotionEnabled,
    isMotionReduced,
    legacy_isMotionReduced: isMotionReduced,
    modular_isMotionReduced: isMotionReduced,
    applyUiTheme,
    legacy_applyUiTheme: applyUiTheme,
    modular_applyUiTheme: applyUiTheme,
    applyMotionPreference,
    legacy_applyMotionPreference: applyMotionPreference,
    modular_applyMotionPreference: applyMotionPreference,
    syncUiSettingsControls,
    legacy_syncUiSettingsControls: syncUiSettingsControls,
    modular_syncUiSettingsControls: syncUiSettingsControls,
    applyUiPreferences,
    legacy_applyUiPreferences: applyUiPreferences,
    modular_applyUiPreferences: applyUiPreferences,
    saveUiPreferencesNow,
    legacy_saveUiPreferencesNow: saveUiPreferencesNow,
    modular_saveUiPreferencesNow: saveUiPreferencesNow,
    clearUiSettingsSaveTimer,
    legacy_clearUiSettingsSaveTimer: clearUiSettingsSaveTimer,
    modular_clearUiSettingsSaveTimer: clearUiSettingsSaveTimer,
    scheduleUiPreferencesSave,
    legacy_scheduleUiPreferencesSave: scheduleUiPreferencesSave,
    modular_scheduleUiPreferencesSave: scheduleUiPreferencesSave,
    updateUiThemePreference,
    legacy_updateUiThemePreference: updateUiThemePreference,
    modular_updateUiThemePreference: updateUiThemePreference,
    updateReduceMotionPreference,
    legacy_updateReduceMotionPreference: updateReduceMotionPreference,
    modular_updateReduceMotionPreference: updateReduceMotionPreference,
    loadUiPreferencesFromDisk,
    legacy_loadUiPreferencesFromDisk: loadUiPreferencesFromDisk,
    modular_loadUiPreferencesFromDisk: loadUiPreferencesFromDisk,
    isUiSettingsPopoverOpen,
    legacy_isUiSettingsPopoverOpen: isUiSettingsPopoverOpen,
    modular_isUiSettingsPopoverOpen: isUiSettingsPopoverOpen,
    getUiSettingsFocusableElements,
    legacy_getUiSettingsFocusableElements: getUiSettingsFocusableElements,
    modular_getUiSettingsFocusableElements: getUiSettingsFocusableElements,
    openUiSettingsPopover,
    legacy_openUiSettingsPopover: openUiSettingsPopover,
    modular_openUiSettingsPopover: openUiSettingsPopover,
    closeUiSettingsPopover,
    legacy_closeUiSettingsPopover: closeUiSettingsPopover,
    modular_closeUiSettingsPopover: closeUiSettingsPopover,
    toggleUiSettingsPopover,
    legacy_toggleUiSettingsPopover: toggleUiSettingsPopover,
    modular_toggleUiSettingsPopover: toggleUiSettingsPopover,
    initializeUiMotion,
    legacy_initializeUiMotion: initializeUiMotion,
    modular_initializeUiMotion: initializeUiMotion,
    initializeStatsWorker,
    legacy_initializeStatsWorker: initializeStatsWorker,
    modular_initializeStatsWorker: initializeStatsWorker,
    initializeUniverseWorker,
    legacy_initializeUniverseWorker: initializeUniverseWorker,
    modular_initializeUniverseWorker: initializeUniverseWorker,
  };
});
