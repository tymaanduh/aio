(function () {
  const list = document.getElementById("logList");
  const statusNode = document.getElementById("status");
  const toggleButton = document.getElementById("toggleButton");
  const clearButton = document.getElementById("clearButton");

  const ALLOWED_THEMES = new Set(["enterprise", "futuristic", "monochrome"]);
  let enabled = true;

  function setStatus(message) {
    statusNode.textContent = message;
  }

  function normalizeTheme(theme) {
    const value = String(theme || "")
      .trim()
      .toLowerCase();
    return ALLOWED_THEMES.has(value) ? value : "futuristic";
  }

  function applyUiPreferences(preferences) {
    const source = preferences && typeof preferences === "object" ? preferences : {};
    const theme = normalizeTheme(source.theme);
    const reduceMotion = Boolean(source.reduceMotion);

    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    document.body.classList.toggle("motion-reduced", reduceMotion);
    document.body.classList.toggle("motion-ready", !reduceMotion);
    document.documentElement.style.colorScheme = theme === "futuristic" ? "dark" : "light";
  }

  async function hydrateUiPreferences() {
    if (!window.dictionaryAPI?.loadUiPreferences) {
      applyUiPreferences({ theme: "futuristic", reduceMotion: false });
      return;
    }
    try {
      const prefs = await window.dictionaryAPI.loadUiPreferences();
      applyUiPreferences(prefs);
    } catch {
      applyUiPreferences({ theme: "futuristic", reduceMotion: false });
    }
  }

  function appendRow(entry) {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const row = document.createElement("li");
    row.className = "logRow";

    const meta = document.createElement("div");
    meta.className = "meta";

    const level = document.createElement("span");
    const levelValue = String(entry.level || "info").toLowerCase();
    level.className = `level level-${levelValue}`;
    level.textContent = levelValue;

    const source = document.createElement("span");
    source.textContent = `[${String(entry.source || "app")}]`;

    const at = document.createElement("span");
    const date = new Date(entry.at || Date.now());
    at.textContent = date.toLocaleString();

    meta.appendChild(level);
    meta.appendChild(source);
    meta.appendChild(at);

    const message = document.createElement("div");
    message.className = "message";
    message.textContent = String(entry.message || "");

    row.appendChild(meta);
    row.appendChild(message);

    const contextText = String(entry.context || "").trim();
    if (contextText) {
      const context = document.createElement("div");
      context.className = "context";
      context.textContent = contextText;
      row.appendChild(context);
    }

    list.appendChild(row);
    if (list.children.length > 1600) {
      list.removeChild(list.firstChild);
    }
    list.scrollTop = list.scrollHeight;
  }

  async function hydrateLogs() {
    if (!window.dictionaryAPI?.loadRuntimeLogs) {
      setStatus("Runtime API unavailable.");
      return;
    }
    try {
      const payload = await window.dictionaryAPI.loadRuntimeLogs();
      const entries = Array.isArray(payload?.entries) ? payload.entries : [];
      enabled = payload?.enabled !== false;
      toggleButton.textContent = enabled ? "Disable Logs" : "Enable Logs";
      list.innerHTML = "";
      entries.forEach(appendRow);
      setStatus(`Connected. ${entries.length} buffered log entries.`);
    } catch (error) {
      setStatus(`Failed to load logs: ${String(error?.message || error)}`);
    }
  }

  toggleButton.addEventListener("click", async () => {
    if (!window.dictionaryAPI?.setRuntimeLogEnabled) {
      return;
    }
    try {
      const next = await window.dictionaryAPI.setRuntimeLogEnabled(!enabled);
      enabled = next?.enabled !== false;
      toggleButton.textContent = enabled ? "Disable Logs" : "Enable Logs";
      setStatus(enabled ? "Live logging enabled." : "Live logging disabled.");
    } catch (error) {
      setStatus(`Could not change logger state: ${String(error?.message || error)}`);
    }
  });

  clearButton.addEventListener("click", () => {
    list.innerHTML = "";
  });

  if (window.dictionaryAPI?.onRuntimeLog) {
    window.dictionaryAPI.onRuntimeLog((entry) => {
      if (!enabled) {
        return;
      }
      appendRow(entry);
    });
  }

  window.addEventListener("focus", () => {
    hydrateUiPreferences().catch(() => {});
  });

  Promise.all([hydrateUiPreferences(), hydrateLogs()]).catch(() => {
    setStatus("Runtime console initialized with fallback settings.");
  });
})();
