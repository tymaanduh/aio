/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Ui_Shell_Domain = __MODULE_API;
  root.DictionaryRendererUiShellDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function setStatus(message, isError = false) {
  G_DOM.saveStatus.textContent = message;
  G_DOM.saveStatus.classList.toggle("error", isError);
  const nextKey = `${isError ? "error" : "info"}:${message}`;
  (nextKey !== G_RT.lastStatusLog) && (G_RT.lastStatusLog = nextKey, pushRuntimeLog(isError ? "error" : "info", "status", message, "saveStatus"));
  (isError) && (recordDiagnosticError("status_error", message, "setStatus"));
}

function formatSaved(timestamp) {
  if (!timestamp) {
    return "Ready";
  }
  return `Saved ${new Date(timestamp).toLocaleString()}`;
}

function setHelperText(message) {
  G_DOM.helperText.textContent = message;
}

function normalizeExplorerLayoutMode(mode) {
  if (mode === EXPLORER_LAYOUT_COMPACT || mode === EXPLORER_LAYOUT_MAXIMIZED) {
    return mode;
  }
  return EXPLORER_LAYOUT_NORMAL;
}

function syncExplorerLayoutControls() {
  const compactActive = G_APP.s.explorerLayoutMode === EXPLORER_LAYOUT_COMPACT;
  const focusActive = G_APP.s.explorerLayoutMode === EXPLORER_LAYOUT_MAXIMIZED;
  (G_DOM.explorerCompactAction instanceof HTMLElement) && (G_DOM.explorerCompactAction.classList.toggle("active", compactActive), G_DOM.explorerCompactAction.setAttribute("aria-pressed", compactActive ? "true" : "false"));
  (G_DOM.explorerFocusAction instanceof HTMLElement) && (G_DOM.explorerFocusAction.classList.toggle("active", focusActive), G_DOM.explorerFocusAction.setAttribute("aria-pressed", focusActive ? "true" : "false"));
}

function setExplorerLayoutMode(mode, options = {}) {
  const { announce = true } = options;
  const normalized = normalizeExplorerLayoutMode(mode);
  G_APP.s.explorerLayoutMode = normalized;
  (G_DOM.appRoot instanceof HTMLElement) && (G_DOM.appRoot.classList.toggle("explorer-compact", normalized === EXPLORER_LAYOUT_COMPACT), G_DOM.appRoot.classList.toggle("explorer-maximized", normalized === EXPLORER_LAYOUT_MAXIMIZED));
  syncExplorerLayoutControls();
  if (!announce) {
    return;
  }
  if (normalized === EXPLORER_LAYOUT_MAXIMIZED) {
    setStatus("Explorer focused to full width.");
    return;
  }
  if (normalized === EXPLORER_LAYOUT_COMPACT) {
    setStatus("Explorer switched to compact mode.");
    return;
  }
  setStatus("Explorer restored to standard layout.");
}

function isElementVisibleForInteraction(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  if (element.classList.contains("hidden")) {
    return false;
  }
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

function resolvePreferredEntryLabel(providedLabel = "") {
  const explicit = normalizeLabel(providedLabel);
  if (explicit) {
    return explicit;
  }
  const selectedFolder = normalizeLabel(G_APP.s.selectedTreeLabel);
  if (selectedFolder) {
    return selectedFolder;
  }
  if (G_APP.s.treeLabelFilter !== LABEL_FILTER_ALL && G_APP.s.treeLabelFilter !== LABEL_FILTER_UNLABELED) {
    return normalizeLabel(G_APP.s.treeLabelFilter);
  }
  return "";
}

function setTreeFolderSelection(groupKey, label = "", options = {}) {
  const { announce = true } = options;
  G_APP.s.selectedTreeGroupKey = cleanText(groupKey, 160);
  G_APP.s.selectedTreeLabel = normalizeLabel(label);
  (!G_APP.s.selectedEntryId && G_APP.s.selectedTreeLabel && G_DOM.labelsInput instanceof HTMLInputElement) && (G_DOM.labelsInput.value = G_APP.s.selectedTreeLabel);
  if (!announce) {
    return;
  }
  if (G_APP.s.selectedTreeLabel) {
    setStatus(`Folder selected: ${G_APP.s.selectedTreeLabel}`);
    return;
  }
  setStatus("Folder selected.");
}

function isAuthGateVisible() {
  return !G_DOM.authGate.classList.contains("hidden");
}

function setAuthGateVisible(visible) {
  G_DOM.authGate.classList.toggle("hidden", !visible);
  G_DOM.appRoot.classList.toggle("hidden", visible);
  document.body.classList.toggle("auth-active", visible);
  document.body.classList.toggle("app-active", !visible);
}

function setAuthHint(message, isError = false) {
  G_DOM.authHint.textContent = message;
  G_DOM.authHint.classList.toggle("error", isError);
  pushRuntimeLog(isError ? "warn" : "info", "auth", message, "authHint");
}

function setAuthMode(mode) {
  G_RT.authMode = mode === AUTH_MODE_LOGIN ? AUTH_MODE_LOGIN : AUTH_MODE_CREATE;
  if (G_RT.authMode === AUTH_MODE_CREATE) {
    G_DOM.authTitle.textContent = "Create Account";
    G_DOM.authSubtitle.textContent = "Create your first local account to unlock your dictionary.";
    setAuthHint(getAuthSubmitHint());
    return;
  }

  G_DOM.authTitle.textContent = "Login";
  G_DOM.authSubtitle.textContent = G_RT.authStatus.quickLoginEnabled
    ? "Enter your username and password to open your dictionary. Quick login enabled for this build: admin/admin, demo/demo, root/root, user/user, guest/guest."
    : "Enter your username and password to open your dictionary.";
  setAuthHint(getAuthSubmitHint());
}

function getAuthCredentials() {
  return {
    username: cleanText(G_DOM.authUsernameInput.value, 40),
    password: String(G_DOM.authPasswordInput.value || "").slice(0, 120)
  };
}

  return {
    setStatus,
    legacy_setStatus: setStatus,
    modular_setStatus: setStatus,
    formatSaved,
    legacy_formatSaved: formatSaved,
    modular_formatSaved: formatSaved,
    setHelperText,
    legacy_setHelperText: setHelperText,
    modular_setHelperText: setHelperText,
    normalizeExplorerLayoutMode,
    legacy_normalizeExplorerLayoutMode: normalizeExplorerLayoutMode,
    modular_normalizeExplorerLayoutMode: normalizeExplorerLayoutMode,
    syncExplorerLayoutControls,
    legacy_syncExplorerLayoutControls: syncExplorerLayoutControls,
    modular_syncExplorerLayoutControls: syncExplorerLayoutControls,
    setExplorerLayoutMode,
    legacy_setExplorerLayoutMode: setExplorerLayoutMode,
    modular_setExplorerLayoutMode: setExplorerLayoutMode,
    isElementVisibleForInteraction,
    legacy_isElementVisibleForInteraction: isElementVisibleForInteraction,
    modular_isElementVisibleForInteraction: isElementVisibleForInteraction,
    resolvePreferredEntryLabel,
    legacy_resolvePreferredEntryLabel: resolvePreferredEntryLabel,
    modular_resolvePreferredEntryLabel: resolvePreferredEntryLabel,
    setTreeFolderSelection,
    legacy_setTreeFolderSelection: setTreeFolderSelection,
    modular_setTreeFolderSelection: setTreeFolderSelection,
    isAuthGateVisible,
    legacy_isAuthGateVisible: isAuthGateVisible,
    modular_isAuthGateVisible: isAuthGateVisible,
    setAuthGateVisible,
    legacy_setAuthGateVisible: setAuthGateVisible,
    modular_setAuthGateVisible: setAuthGateVisible,
    setAuthHint,
    legacy_setAuthHint: setAuthHint,
    modular_setAuthHint: setAuthHint,
    setAuthMode,
    legacy_setAuthMode: setAuthMode,
    modular_setAuthMode: setAuthMode,
    getAuthCredentials,
    legacy_getAuthCredentials: getAuthCredentials,
    modular_getAuthCredentials: getAuthCredentials,
  };
});
