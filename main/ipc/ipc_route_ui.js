"use strict";

const { BrowserWindow } = require("electron");
const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function with_focused_window(run_logic) {
  const focused_window = BrowserWindow.getFocusedWindow();
  if (!focused_window || focused_window.isDestroyed()) {
    return {
      ok: false,
      error: "No focused window."
    };
  }
  return run_logic(focused_window);
}

function create_ipc_route_ui(deps) {
  const { repository_ui_preferences } = deps;
  return [
    create_ipc_route_spec(
      IPC_CHANNELS.UI_LOAD_PREFERENCES,
      IPC_ROUTE_AUTH.OPTIONAL,
      () => repository_ui_preferences.load_ui_preferences_state()
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.UI_SAVE_PREFERENCES,
      IPC_ROUTE_AUTH.OPTIONAL,
      (payload) => repository_ui_preferences.save_ui_preferences_state(payload)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.WINDOW_MINIMIZE,
      IPC_ROUTE_AUTH.OPTIONAL,
      () =>
        with_focused_window((win) => {
          win.minimize();
          return { ok: true, isMaximized: false };
        })
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.WINDOW_TOGGLE_MAXIMIZE,
      IPC_ROUTE_AUTH.OPTIONAL,
      () =>
        with_focused_window((win) => {
          if (win.isMaximized()) {
            win.unmaximize();
          } else {
            win.maximize();
          }
          return { ok: true, isMaximized: win.isMaximized() };
        })
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.WINDOW_CLOSE,
      IPC_ROUTE_AUTH.OPTIONAL,
      () =>
        with_focused_window((win) => {
          win.close();
          return { ok: true };
        })
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.WINDOW_IS_MAXIMIZED,
      IPC_ROUTE_AUTH.OPTIONAL,
      () =>
        with_focused_window((win) => {
          return { ok: true, isMaximized: win.isMaximized() };
        })
    )
  ];
}

module.exports = {
  create_ipc_route_ui
};
