#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/refactor-blocking-gate.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "countLines",
  "ensureFilesExist",
  "extractGroupSetModuleKeys",
  "extractObjectKeys",
  "fail",
  "logLine",
  "main",
  "pass",
  "printSmokeChecklist",
  "readText",
  "runAlignmentChecks",
  "runCommand",
  "runShapeChecks",
  "runSizeChecks"
]
AIO_SYMBOL_MAP = {
  "countLines": "count_lines",
  "ensureFilesExist": "ensure_files_exist",
  "extractGroupSetModuleKeys": "extract_group_set_module_keys",
  "extractObjectKeys": "extract_object_keys",
  "fail": "fail",
  "logLine": "log_line",
  "main": "main",
  "pass": "pass",
  "printSmokeChecklist": "print_smoke_checklist",
  "readText": "read_text",
  "runAlignmentChecks": "run_alignment_checks",
  "runCommand": "run_command",
  "runShapeChecks": "run_shape_checks",
  "runSizeChecks": "run_size_checks"
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

def count_lines(*args, **kwargs):
    return invoke_source_function("countLines", *args, **kwargs)

def ensure_files_exist(*args, **kwargs):
    return invoke_source_function("ensureFilesExist", *args, **kwargs)

def extract_group_set_module_keys(*args, **kwargs):
    return invoke_source_function("extractGroupSetModuleKeys", *args, **kwargs)

def extract_object_keys(*args, **kwargs):
    return invoke_source_function("extractObjectKeys", *args, **kwargs)

def fail(*args, **kwargs):
    return invoke_source_function("fail", *args, **kwargs)

def log_line(*args, **kwargs):
    return invoke_source_function("logLine", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def pass(*args, **kwargs):
    return invoke_source_function("pass", *args, **kwargs)

def print_smoke_checklist(*args, **kwargs):
    return invoke_source_function("printSmokeChecklist", *args, **kwargs)

def read_text(*args, **kwargs):
    return invoke_source_function("readText", *args, **kwargs)

def run_alignment_checks(*args, **kwargs):
    return invoke_source_function("runAlignmentChecks", *args, **kwargs)

def run_command(*args, **kwargs):
    return invoke_source_function("runCommand", *args, **kwargs)

def run_shape_checks(*args, **kwargs):
    return invoke_source_function("runShapeChecks", *args, **kwargs)

def run_size_checks(*args, **kwargs):
    return invoke_source_function("runSizeChecks", *args, **kwargs)


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
