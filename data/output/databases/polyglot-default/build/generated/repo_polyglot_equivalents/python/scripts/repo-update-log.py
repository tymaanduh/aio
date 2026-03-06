#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/repo-update-log.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "addWatcher",
  "appendNdjson",
  "buildDirectoryList",
  "classifyDiffs",
  "configureRuntime",
  "createEventId",
  "createFileHash",
  "ensureDir",
  "ensureLogPaths",
  "fileSnapshot",
  "isIgnored",
  "nowIso",
  "parseArgs",
  "printHelpAndExit",
  "readState",
  "recordEvent",
  "removeWatcherByPrefix",
  "run",
  "runScanMode",
  "runWatchMode",
  "saveKnownState",
  "scanFileState",
  "scheduleSync",
  "shutdown",
  "syncPath",
  "toRelativePath",
  "unique",
  "writeState"
]
AIO_SYMBOL_MAP = {
  "addWatcher": "add_watcher",
  "appendNdjson": "append_ndjson",
  "buildDirectoryList": "build_directory_list",
  "classifyDiffs": "classify_diffs",
  "configureRuntime": "configure_runtime",
  "createEventId": "create_event_id",
  "createFileHash": "create_file_hash",
  "ensureDir": "ensure_dir",
  "ensureLogPaths": "ensure_log_paths",
  "fileSnapshot": "file_snapshot",
  "isIgnored": "is_ignored",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "readState": "read_state",
  "recordEvent": "record_event",
  "removeWatcherByPrefix": "remove_watcher_by_prefix",
  "run": "run",
  "runScanMode": "run_scan_mode",
  "runWatchMode": "run_watch_mode",
  "saveKnownState": "save_known_state",
  "scanFileState": "scan_file_state",
  "scheduleSync": "schedule_sync",
  "shutdown": "shutdown",
  "syncPath": "sync_path",
  "toRelativePath": "to_relative_path",
  "unique": "unique",
  "writeState": "write_state"
}


def _load_proxy_runner():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "../_shared/repo_module_proxy.py").resolve()
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

def add_watcher(*args, **kwargs):
    return invoke_source_function("addWatcher", *args, **kwargs)

def append_ndjson(*args, **kwargs):
    return invoke_source_function("appendNdjson", *args, **kwargs)

def build_directory_list(*args, **kwargs):
    return invoke_source_function("buildDirectoryList", *args, **kwargs)

def classify_diffs(*args, **kwargs):
    return invoke_source_function("classifyDiffs", *args, **kwargs)

def configure_runtime(*args, **kwargs):
    return invoke_source_function("configureRuntime", *args, **kwargs)

def create_event_id(*args, **kwargs):
    return invoke_source_function("createEventId", *args, **kwargs)

def create_file_hash(*args, **kwargs):
    return invoke_source_function("createFileHash", *args, **kwargs)

def ensure_dir(*args, **kwargs):
    return invoke_source_function("ensureDir", *args, **kwargs)

def ensure_log_paths(*args, **kwargs):
    return invoke_source_function("ensureLogPaths", *args, **kwargs)

def file_snapshot(*args, **kwargs):
    return invoke_source_function("fileSnapshot", *args, **kwargs)

def is_ignored(*args, **kwargs):
    return invoke_source_function("isIgnored", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("nowIso", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def print_help_and_exit(*args, **kwargs):
    return invoke_source_function("printHelpAndExit", *args, **kwargs)

def read_state(*args, **kwargs):
    return invoke_source_function("readState", *args, **kwargs)

def record_event(*args, **kwargs):
    return invoke_source_function("recordEvent", *args, **kwargs)

def remove_watcher_by_prefix(*args, **kwargs):
    return invoke_source_function("removeWatcherByPrefix", *args, **kwargs)

def run(*args, **kwargs):
    return invoke_source_function("run", *args, **kwargs)

def run_scan_mode(*args, **kwargs):
    return invoke_source_function("runScanMode", *args, **kwargs)

def run_watch_mode(*args, **kwargs):
    return invoke_source_function("runWatchMode", *args, **kwargs)

def save_known_state(*args, **kwargs):
    return invoke_source_function("saveKnownState", *args, **kwargs)

def scan_file_state(*args, **kwargs):
    return invoke_source_function("scanFileState", *args, **kwargs)

def schedule_sync(*args, **kwargs):
    return invoke_source_function("scheduleSync", *args, **kwargs)

def shutdown(*args, **kwargs):
    return invoke_source_function("shutdown", *args, **kwargs)

def sync_path(*args, **kwargs):
    return invoke_source_function("syncPath", *args, **kwargs)

def to_relative_path(*args, **kwargs):
    return invoke_source_function("toRelativePath", *args, **kwargs)

def unique(*args, **kwargs):
    return invoke_source_function("unique", *args, **kwargs)

def write_state(*args, **kwargs):
    return invoke_source_function("writeState", *args, **kwargs)


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
