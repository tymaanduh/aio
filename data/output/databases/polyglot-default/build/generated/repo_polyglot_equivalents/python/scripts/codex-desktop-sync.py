#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/codex-desktop-sync.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "copyDirectory",
  "ensureDirectory",
  "ensureManagedDestination",
  "listFilesRecursively",
  "listSkillDirectories",
  "main",
  "normalizePath",
  "normalizeRelativePath",
  "parseArgs",
  "readJsonIfExists",
  "readManagementMarker",
  "syncAgentsSnapshot",
  "syncSkills"
]
AIO_SYMBOL_MAP = {
  "copyDirectory": "copy_directory",
  "ensureDirectory": "ensure_directory",
  "ensureManagedDestination": "ensure_managed_destination",
  "listFilesRecursively": "list_files_recursively",
  "listSkillDirectories": "list_skill_directories",
  "main": "main",
  "normalizePath": "normalize_path",
  "normalizeRelativePath": "normalize_relative_path",
  "parseArgs": "parse_args",
  "readJsonIfExists": "read_json_if_exists",
  "readManagementMarker": "read_management_marker",
  "syncAgentsSnapshot": "sync_agents_snapshot",
  "syncSkills": "sync_skills"
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

def copy_directory(*args, **kwargs):
    return invoke_source_function("copyDirectory", *args, **kwargs)

def ensure_directory(*args, **kwargs):
    return invoke_source_function("ensureDirectory", *args, **kwargs)

def ensure_managed_destination(*args, **kwargs):
    return invoke_source_function("ensureManagedDestination", *args, **kwargs)

def list_files_recursively(*args, **kwargs):
    return invoke_source_function("listFilesRecursively", *args, **kwargs)

def list_skill_directories(*args, **kwargs):
    return invoke_source_function("listSkillDirectories", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_path(*args, **kwargs):
    return invoke_source_function("normalizePath", *args, **kwargs)

def normalize_relative_path(*args, **kwargs):
    return invoke_source_function("normalizeRelativePath", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def read_json_if_exists(*args, **kwargs):
    return invoke_source_function("readJsonIfExists", *args, **kwargs)

def read_management_marker(*args, **kwargs):
    return invoke_source_function("readManagementMarker", *args, **kwargs)

def sync_agents_snapshot(*args, **kwargs):
    return invoke_source_function("syncAgentsSnapshot", *args, **kwargs)

def sync_skills(*args, **kwargs):
    return invoke_source_function("syncSkills", *args, **kwargs)


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
