#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/workflow-preflight.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildReport",
  "checkHardGovernanceGate",
  "checkRequiredFiles",
  "checkRequiredJson",
  "checkRoutingKeywordConflicts",
  "checkScriptSwapCatalog",
  "checkShellShebangLineEndings",
  "checkWorkflowOrderGate",
  "checkWorkflowShards",
  "collectUnmergedFiles",
  "ensureParentDir",
  "listTextFiles",
  "main",
  "parseArgs",
  "runSwappableCheck",
  "scanConflictMarkers"
]
AIO_SYMBOL_MAP = {
  "buildReport": "build_report",
  "checkHardGovernanceGate": "check_hard_governance_gate",
  "checkRequiredFiles": "check_required_files",
  "checkRequiredJson": "check_required_json",
  "checkRoutingKeywordConflicts": "check_routing_keyword_conflicts",
  "checkScriptSwapCatalog": "check_script_swap_catalog",
  "checkShellShebangLineEndings": "check_shell_shebang_line_endings",
  "checkWorkflowOrderGate": "check_workflow_order_gate",
  "checkWorkflowShards": "check_workflow_shards",
  "collectUnmergedFiles": "collect_unmerged_files",
  "ensureParentDir": "ensure_parent_dir",
  "listTextFiles": "list_text_files",
  "main": "main",
  "parseArgs": "parse_args",
  "runSwappableCheck": "run_swappable_check",
  "scanConflictMarkers": "scan_conflict_markers"
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

def build_report(*args, **kwargs):
    return invoke_source_function("buildReport", *args, **kwargs)

def check_hard_governance_gate(*args, **kwargs):
    return invoke_source_function("checkHardGovernanceGate", *args, **kwargs)

def check_required_files(*args, **kwargs):
    return invoke_source_function("checkRequiredFiles", *args, **kwargs)

def check_required_json(*args, **kwargs):
    return invoke_source_function("checkRequiredJson", *args, **kwargs)

def check_routing_keyword_conflicts(*args, **kwargs):
    return invoke_source_function("checkRoutingKeywordConflicts", *args, **kwargs)

def check_script_swap_catalog(*args, **kwargs):
    return invoke_source_function("checkScriptSwapCatalog", *args, **kwargs)

def check_shell_shebang_line_endings(*args, **kwargs):
    return invoke_source_function("checkShellShebangLineEndings", *args, **kwargs)

def check_workflow_order_gate(*args, **kwargs):
    return invoke_source_function("checkWorkflowOrderGate", *args, **kwargs)

def check_workflow_shards(*args, **kwargs):
    return invoke_source_function("checkWorkflowShards", *args, **kwargs)

def collect_unmerged_files(*args, **kwargs):
    return invoke_source_function("collectUnmergedFiles", *args, **kwargs)

def ensure_parent_dir(*args, **kwargs):
    return invoke_source_function("ensureParentDir", *args, **kwargs)

def list_text_files(*args, **kwargs):
    return invoke_source_function("listTextFiles", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def run_swappable_check(*args, **kwargs):
    return invoke_source_function("runSwappableCheck", *args, **kwargs)

def scan_conflict_markers(*args, **kwargs):
    return invoke_source_function("scanConflictMarkers", *args, **kwargs)


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
