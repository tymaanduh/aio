"use strict";

const path = require("path");
const { BrowserWindow } = require("electron");
const WINDOW_SHARED_CATALOG = require("../../data/input/shared/main/window_shared_catalog.json");

function as_object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function as_non_empty_text(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function as_path_segments(value, fallback) {
  const source = Array.isArray(value) ? value : fallback;
  const output = [];
  for (const item of source) {
    if (typeof item !== "string") {
      continue;
    }
    const trimmed = item.trim();
    if (!trimmed) {
      continue;
    }
    output.push(trimmed);
  }
  return output.length ? output : fallback.slice();
}

const windowPlatform = (() => {
  const source = as_object(WINDOW_SHARED_CATALOG.platform);
  return Object.freeze({
    WINDOWS: as_non_empty_text(source.windows, "win32").toLowerCase()
  });
})();

const windowPaths = (() => {
  const source = as_object(WINDOW_SHARED_CATALOG.paths);
  const preloadSegments = as_path_segments(source.preload_file_segments, ["..", "..", "preload.js"]);
  const viewDirectorySegments = as_path_segments(source.view_directory_segments, ["..", "..", "renderer", "views"]);
  return Object.freeze({
    PRELOAD_FILE: path.join(__dirname, ...preloadSegments),
    VIEW_DIRECTORY: path.join(__dirname, ...viewDirectorySegments)
  });
})();

const windowChromeStyle = (() => {
  const source = as_object(WINDOW_SHARED_CATALOG.chrome_style);
  const overlay = as_object(source.title_bar_overlay);
  return Object.freeze({
    TITLE_BAR_STYLE_HIDDEN: as_non_empty_text(source.title_bar_style_hidden, "hidden"),
    TITLE_BAR_OVERLAY: Object.freeze({
      color: as_non_empty_text(overlay.color, "#0b1114"),
      symbolColor: as_non_empty_text(overlay.symbol_color, "#d5fbff"),
      height: Number.isFinite(Number(overlay.height)) ? Number(overlay.height) : 34
    })
  });
})();

const windowWebPreferencesBase = (() => {
  const source = as_object(WINDOW_SHARED_CATALOG.web_preferences_base);
  return Object.freeze({
    preload: windowPaths.PRELOAD_FILE,
    contextIsolation: source.context_isolation !== false,
    nodeIntegration: source.node_integration === true
  });
})();

function is_windows_platform() {
  return process.platform === windowPlatform.WINDOWS;
}

function create_window_chrome_options(window_style = {}) {
  if (!is_windows_platform()) {
    return {
      titleBarStyle: undefined,
      titleBarOverlay: false
    };
  }
  if (window_style && window_style.frame === false) {
    return {};
  }
  return {
    titleBarStyle: windowChromeStyle.TITLE_BAR_STYLE_HIDDEN,
    titleBarOverlay: windowChromeStyle.TITLE_BAR_OVERLAY
  };
}

function resolve_window_view_path(view_file_name) {
  return path.join(windowPaths.VIEW_DIRECTORY, view_file_name);
}

function create_browser_window(window_style = {}, web_preferences = {}) {
  return new BrowserWindow({
    ...window_style,
    ...create_window_chrome_options(window_style),
    webPreferences: {
      ...windowWebPreferencesBase,
      ...web_preferences
    }
  });
}

function create_window_from_spec(window_spec = {}) {
  const source = window_spec && typeof window_spec === "object" ? window_spec : {};
  const window_style = source.window_style && typeof source.window_style === "object" ? source.window_style : {};
  const web_preferences = source.web_preferences && typeof source.web_preferences === "object" ? source.web_preferences : {};
  const view_file_name = typeof source.view_file_name === "string" ? source.view_file_name : "";
  const window_instance = create_browser_window(window_style, web_preferences);
  if (view_file_name) {
    window_instance.loadFile(resolve_window_view_path(view_file_name));
  }
  return window_instance;
}

module.exports = {
  WINDOW_PATHS: windowPaths,
  WINDOW_CHROME_STYLE: windowChromeStyle,
  WINDOW_WEB_PREFERENCES_BASE: windowWebPreferencesBase,
  is_windows_platform,
  create_window_chrome_options,
  resolve_window_view_path,
  create_browser_window,
  create_window_from_spec
};
