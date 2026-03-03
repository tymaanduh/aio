"use strict";

const path = require("path");
const { BrowserWindow } = require("electron");

const WINDOW_PATHS = Object.freeze({
  PRELOAD_FILE: path.join(__dirname, "..", "..", "preload.js"),
  VIEW_DIRECTORY: path.join(__dirname, "..", "..", "renderer", "views")
});

const WINDOW_CHROME_STYLE = Object.freeze({
  TITLE_BAR_STYLE_HIDDEN: "hidden",
  TITLE_BAR_OVERLAY: Object.freeze({
    color: "#0b1114",
    symbolColor: "#d5fbff",
    height: 34
  })
});

const WINDOW_WEB_PREFERENCES_BASE = Object.freeze({
  preload: WINDOW_PATHS.PRELOAD_FILE,
  contextIsolation: true,
  nodeIntegration: false
});

function is_windows_platform() {
  return process.platform === "win32";
}

function create_window_chrome_options() {
  if (!is_windows_platform()) {
    return {
      titleBarStyle: undefined,
      titleBarOverlay: false
    };
  }
  return {
    titleBarStyle: WINDOW_CHROME_STYLE.TITLE_BAR_STYLE_HIDDEN,
    titleBarOverlay: WINDOW_CHROME_STYLE.TITLE_BAR_OVERLAY
  };
}

function resolve_window_view_path(view_file_name) {
  return path.join(WINDOW_PATHS.VIEW_DIRECTORY, view_file_name);
}

function create_browser_window(window_style = {}, web_preferences = {}) {
  return new BrowserWindow({
    ...window_style,
    ...create_window_chrome_options(),
    webPreferences: {
      ...WINDOW_WEB_PREFERENCES_BASE,
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
  WINDOW_PATHS,
  WINDOW_CHROME_STYLE,
  WINDOW_WEB_PREFERENCES_BASE,
  is_windows_platform,
  create_window_chrome_options,
  resolve_window_view_path,
  create_browser_window,
  create_window_from_spec
};
