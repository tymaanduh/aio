/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Diagnostics_Domain = __MODULE_API;
  root.DictionaryRendererDiagnosticsDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function pushRuntimeLog(level, source, message, context = "") {
    if (!G_RT.runtimeLogEnabled || !window.app_api?.appendRuntimeLog) {
      return;
    }
    window.app_api
      .appendRuntimeLog({
        at: nowIso(),
        level,
        source,
        message: cleanText(message, 1200),
        context: cleanText(context, 1000)
      })
      .catch(() => {});
  }

  function recordDiagnosticError(code, message, context = "") {
    G_APP.s.diagnostics = mergeDiagnostics(G_APP.s.diagnostics, {
      errors: [
        {
          at: nowIso(),
          code: cleanText(code, 80) || "renderer_error",
          message: cleanText(message, 500),
          context: cleanText(context, 400)
        }
      ],
      perf: []
    });
    renderDiagnosticsSummary();
    pushRuntimeLog("error", "renderer", `${code}: ${message}`, context);
    scheduleDiagnosticsFlush();
  }

  function recordDiagnosticPerf(key, ms) {
    G_APP.s.diagnostics = mergeDiagnostics(G_APP.s.diagnostics, {
      errors: [],
      perf: [
        {
          at: nowIso(),
          key: cleanText(key, 80) || "perf",
          ms: Number.isFinite(ms) ? Math.max(0, ms) : 0
        }
      ]
    });
    renderDiagnosticsSummary();
    (G_APP.s.diagnostics.perf || []).length >= 50 && scheduleDiagnosticsFlush(300);
  }

  function renderDiagnosticsSummary() {
    if (!(G_DOM.diagnosticsSummary instanceof HTMLElement)) {
      return;
    }
    const errors = Array.isArray(G_APP.s.diagnostics.errors) ? G_APP.s.diagnostics.errors.length : 0;
    const perf = Array.isArray(G_APP.s.diagnostics.perf) ? G_APP.s.diagnostics.perf.length : 0;
    G_DOM.diagnosticsSummary.textContent = `Diagnostics: ${errors} error(s), ${perf} perf sample(s). Local only.`;
    renderDiagnosticsPanel();
  }

  function renderDiagnosticsPanel() {
    if (!(G_DOM.diagnosticsErrorsList instanceof HTMLElement) || !(G_DOM.diagnosticsPerfList instanceof HTMLElement)) {
      return;
    }
    const latestErrors = (Array.isArray(G_APP.s.diagnostics.errors) ? G_APP.s.diagnostics.errors : [])
      .slice(-8)
      .reverse();
    const latestPerf = (Array.isArray(G_APP.s.diagnostics.perf) ? G_APP.s.diagnostics.perf : []).slice(-8).reverse();
    G_DOM.diagnosticsErrorsList.innerHTML = "";
    G_DOM.diagnosticsPerfList.innerHTML = "";

    if (latestErrors.length === 0) {
      const emptyError = document.createElement("li");
      emptyError.textContent = "No errors recorded.";
      G_DOM.diagnosticsErrorsList.appendChild(emptyError);
    } else {
      latestErrors.forEach((item) => {
        const row = document.createElement("li");
        row.textContent = `${item.code}: ${item.message}`;
        G_DOM.diagnosticsErrorsList.appendChild(row);
      });
    }

    if (latestPerf.length === 0) {
      const emptyPerf = document.createElement("li");
      emptyPerf.textContent = "No timing samples yet.";
      G_DOM.diagnosticsPerfList.appendChild(emptyPerf);
    } else {
      latestPerf.forEach((item) => {
        const row = document.createElement("li");
        row.textContent = `${item.key}: ${Number(item.ms).toFixed(2)}ms`;
        G_DOM.diagnosticsPerfList.appendChild(row);
      });
    }
  }

  function clearDiagnosticsFlushTimer() {
    G_RT.diagnosticsFlushTimer && (window.clearTimeout(G_RT.diagnosticsFlushTimer), (G_RT.diagnosticsFlushTimer = 0));
  }

  function scheduleDiagnosticsFlush(delayMs = 1200) {
    clearDiagnosticsFlushTimer();
    G_RT.diagnosticsFlushTimer = window.setTimeout(async () => {
      G_RT.diagnosticsFlushTimer = 0;
      if (!window.app_api?.appendDiagnostics) {
        return;
      }
      const payload = normalizeDiagnostics(G_APP.s.diagnostics);
      if (payload.errors.length === 0 && payload.perf.length === 0) {
        return;
      }
      try {
        await window.app_api.appendDiagnostics(payload);
        G_APP.s.diagnostics = createDefaultDiagnostics();
        renderDiagnosticsSummary();
      } catch {
        // Keep local queue for later flush.
      }
    }, delayMs);
  }

  function setSentenceStatus(message) {
    G_DOM.sentenceStatus.textContent = message;
    message !== G_RT.lastSentenceStatusLog &&
      ((G_RT.lastSentenceStatusLog = message), pushRuntimeLog("info", "graph", message, "sentenceStatus"));
  }

  function setEntryWarnings(messages = []) {
    if (!(G_DOM.entryWarnings instanceof HTMLElement)) {
      return;
    }
    const warnings = Array.isArray(messages) ? messages.filter(Boolean) : [];
    if (warnings.length === 0) {
      G_DOM.entryWarnings.textContent = "No warnings.";
      G_DOM.entryWarnings.classList.remove("error");
      return;
    }
    G_DOM.entryWarnings.textContent = warnings.join(" | ");
    G_DOM.entryWarnings.classList.add("error");
  }

  return {
    pushRuntimeLog,
    legacy_pushRuntimeLog: pushRuntimeLog,
    modular_pushRuntimeLog: pushRuntimeLog,
    recordDiagnosticError,
    legacy_recordDiagnosticError: recordDiagnosticError,
    modular_recordDiagnosticError: recordDiagnosticError,
    recordDiagnosticPerf,
    legacy_recordDiagnosticPerf: recordDiagnosticPerf,
    modular_recordDiagnosticPerf: recordDiagnosticPerf,
    renderDiagnosticsSummary,
    legacy_renderDiagnosticsSummary: renderDiagnosticsSummary,
    modular_renderDiagnosticsSummary: renderDiagnosticsSummary,
    renderDiagnosticsPanel,
    legacy_renderDiagnosticsPanel: renderDiagnosticsPanel,
    modular_renderDiagnosticsPanel: renderDiagnosticsPanel,
    clearDiagnosticsFlushTimer,
    legacy_clearDiagnosticsFlushTimer: clearDiagnosticsFlushTimer,
    modular_clearDiagnosticsFlushTimer: clearDiagnosticsFlushTimer,
    scheduleDiagnosticsFlush,
    legacy_scheduleDiagnosticsFlush: scheduleDiagnosticsFlush,
    modular_scheduleDiagnosticsFlush: scheduleDiagnosticsFlush,

    setSentenceStatus,
    legacy_setSentenceStatus: setSentenceStatus,
    modular_setSentenceStatus: setSentenceStatus,
    setEntryWarnings,
    legacy_setEntryWarnings: setEntryWarnings,
    modular_setEntryWarnings: setEntryWarnings
  };
});
