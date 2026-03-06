#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_init_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "applyMotionPreference",
  "applyUiPreferences",
  "applyUiTheme",
  "clearUiSettingsSaveTimer",
  "closeUiSettingsPopover",
  "getNormalizedUiPreferences",
  "getUiSettingsFocusableElements",
  "initializeStatsWorker",
  "initializeUiMotion",
  "initializeUniverseWorker",
  "isMotionReduced",
  "isSystemReducedMotionEnabled",
  "isUiSettingsPopoverOpen",
  "loadUiPreferencesFromDisk",
  "onLeave",
  "onMove",
  "onPointer",
  "openUiSettingsPopover",
  "saveUiPreferencesNow",
  "scheduleUiPreferencesSave",
  "syncUiSettingsControls",
  "toggleUiSettingsPopover",
  "updateReduceMotionPreference",
  "updateUiThemePreference"
]
AIO_SYMBOL_MAP = {
  "applyMotionPreference": "apply_motion_preference",
  "applyUiPreferences": "apply_ui_preferences",
  "applyUiTheme": "apply_ui_theme",
  "clearUiSettingsSaveTimer": "clear_ui_settings_save_timer",
  "closeUiSettingsPopover": "close_ui_settings_popover",
  "getNormalizedUiPreferences": "get_normalized_ui_preferences",
  "getUiSettingsFocusableElements": "get_ui_settings_focusable_elements",
  "initializeStatsWorker": "initialize_stats_worker",
  "initializeUiMotion": "initialize_ui_motion",
  "initializeUniverseWorker": "initialize_universe_worker",
  "isMotionReduced": "is_motion_reduced",
  "isSystemReducedMotionEnabled": "is_system_reduced_motion_enabled",
  "isUiSettingsPopoverOpen": "is_ui_settings_popover_open",
  "loadUiPreferencesFromDisk": "load_ui_preferences_from_disk",
  "onLeave": "on_leave",
  "onMove": "on_move",
  "onPointer": "on_pointer",
  "openUiSettingsPopover": "open_ui_settings_popover",
  "saveUiPreferencesNow": "save_ui_preferences_now",
  "scheduleUiPreferencesSave": "schedule_ui_preferences_save",
  "syncUiSettingsControls": "sync_ui_settings_controls",
  "toggleUiSettingsPopover": "toggle_ui_settings_popover",
  "updateReduceMotionPreference": "update_reduce_motion_preference",
  "updateUiThemePreference": "update_ui_theme_preference"
}


def _load_proxy_runner():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "../../_shared/repo_module_proxy.py").resolve()
    spec = importlib.util.spec_from_file_location("aio_repo_module_proxy", shared_runner_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load shared runner: {shared_runner_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_PROXY = _load_proxy_runner()


def module_equivalent_metadata():
    return {
        "source_js_file": AIO_SOURCE_JS_FILE,
        "equivalent_kind": AIO_EQUIVALENT_KIND,
        "function_tokens": list(AIO_FUNCTION_TOKENS),
        "symbol_map": dict(AIO_SYMBOL_MAP),
    }


def invoke_source_function(function_name, *args, **kwargs):
    return _PROXY.invoke_js_function(AIO_SOURCE_JS_FILE, function_name, list(args), dict(kwargs))


def run_source_entrypoint(args=None):
    return _PROXY.run_js_entrypoint(AIO_SOURCE_JS_FILE, list(args or []))

def apply_motion_preference(*args, **kwargs):
    return invoke_source_function("applyMotionPreference", *args, **kwargs)

def apply_ui_preferences(*args, **kwargs):
    return invoke_source_function("applyUiPreferences", *args, **kwargs)

def apply_ui_theme(*args, **kwargs):
    return invoke_source_function("applyUiTheme", *args, **kwargs)

def clear_ui_settings_save_timer(*args, **kwargs):
    return invoke_source_function("clearUiSettingsSaveTimer", *args, **kwargs)

def close_ui_settings_popover(*args, **kwargs):
    return invoke_source_function("closeUiSettingsPopover", *args, **kwargs)

def get_normalized_ui_preferences(*args, **kwargs):
    return invoke_source_function("getNormalizedUiPreferences", *args, **kwargs)

def get_ui_settings_focusable_elements(*args, **kwargs):
    return invoke_source_function("getUiSettingsFocusableElements", *args, **kwargs)

def initialize_stats_worker(*args, **kwargs):
    return invoke_source_function("initializeStatsWorker", *args, **kwargs)

def initialize_ui_motion(*args, **kwargs):
    return invoke_source_function("initializeUiMotion", *args, **kwargs)

def initialize_universe_worker(*args, **kwargs):
    return invoke_source_function("initializeUniverseWorker", *args, **kwargs)

def is_motion_reduced(*args, **kwargs):
    return invoke_source_function("isMotionReduced", *args, **kwargs)

def is_system_reduced_motion_enabled(*args, **kwargs):
    return invoke_source_function("isSystemReducedMotionEnabled", *args, **kwargs)

def is_ui_settings_popover_open(*args, **kwargs):
    return invoke_source_function("isUiSettingsPopoverOpen", *args, **kwargs)

def load_ui_preferences_from_disk(*args, **kwargs):
    return invoke_source_function("loadUiPreferencesFromDisk", *args, **kwargs)

def on_leave(*args, **kwargs):
    return invoke_source_function("onLeave", *args, **kwargs)

def on_move(*args, **kwargs):
    return invoke_source_function("onMove", *args, **kwargs)

def on_pointer(*args, **kwargs):
    return invoke_source_function("onPointer", *args, **kwargs)

def open_ui_settings_popover(*args, **kwargs):
    return invoke_source_function("openUiSettingsPopover", *args, **kwargs)

def save_ui_preferences_now(*args, **kwargs):
    return invoke_source_function("saveUiPreferencesNow", *args, **kwargs)

def schedule_ui_preferences_save(*args, **kwargs):
    return invoke_source_function("scheduleUiPreferencesSave", *args, **kwargs)

def sync_ui_settings_controls(*args, **kwargs):
    return invoke_source_function("syncUiSettingsControls", *args, **kwargs)

def toggle_ui_settings_popover(*args, **kwargs):
    return invoke_source_function("toggleUiSettingsPopover", *args, **kwargs)

def update_reduce_motion_preference(*args, **kwargs):
    return invoke_source_function("updateReduceMotionPreference", *args, **kwargs)

def update_ui_theme_preference(*args, **kwargs):
    return invoke_source_function("updateUiThemePreference", *args, **kwargs)


def _main(argv):
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--function", dest="function_name", default="")
    parser.add_argument("--args-json", dest="args_json", default="[]")
    parsed, _ = parser.parse_known_args(argv)
    if parsed.function_name:
        args = json.loads(parsed.args_json)
        result = invoke_source_function(parsed.function_name, *list(args))
        sys.stdout.write(json.dumps({"ok": True, "result": result}) + "\n")
        return 0
    report = run_source_entrypoint(argv)
    return int(report.get("exit_code", 0))


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv[1:]))
