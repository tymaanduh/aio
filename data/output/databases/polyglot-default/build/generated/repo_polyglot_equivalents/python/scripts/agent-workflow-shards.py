#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/agent-workflow-shards.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildShards",
  "ensureDir",
  "ensureShardsCurrent",
  "getPaths",
  "isShardsCurrent",
  "listWorkflowAgents",
  "loadWorkflowFromCanonical",
  "loadWorkflowFromShards",
  "normalizePathForJson",
  "normalizeScopeGuardrailsCatalog",
  "normalizeText",
  "readCanonicalDoc",
  "readJson",
  "readShardIndex",
  "readWorkflowDoc",
  "resolveScopeGuardrails",
  "sha256",
  "toShardFileName",
  "writeJsonIfChanged"
]
AIO_SYMBOL_MAP = {
  "buildShards": "build_shards",
  "ensureDir": "ensure_dir",
  "ensureShardsCurrent": "ensure_shards_current",
  "getPaths": "get_paths",
  "isShardsCurrent": "is_shards_current",
  "listWorkflowAgents": "list_workflow_agents",
  "loadWorkflowFromCanonical": "load_workflow_from_canonical",
  "loadWorkflowFromShards": "load_workflow_from_shards",
  "normalizePathForJson": "normalize_path_for_json",
  "normalizeScopeGuardrailsCatalog": "normalize_scope_guardrails_catalog",
  "normalizeText": "normalize_text",
  "readCanonicalDoc": "read_canonical_doc",
  "readJson": "read_json",
  "readShardIndex": "read_shard_index",
  "readWorkflowDoc": "read_workflow_doc",
  "resolveScopeGuardrails": "resolve_scope_guardrails",
  "sha256": "sha256",
  "toShardFileName": "to_shard_file_name",
  "writeJsonIfChanged": "write_json_if_changed"
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

def build_shards(*args, **kwargs):
    return invoke_source_function("buildShards", *args, **kwargs)

def ensure_dir(*args, **kwargs):
    return invoke_source_function("ensureDir", *args, **kwargs)

def ensure_shards_current(*args, **kwargs):
    return invoke_source_function("ensureShardsCurrent", *args, **kwargs)

def get_paths(*args, **kwargs):
    return invoke_source_function("getPaths", *args, **kwargs)

def is_shards_current(*args, **kwargs):
    return invoke_source_function("isShardsCurrent", *args, **kwargs)

def list_workflow_agents(*args, **kwargs):
    return invoke_source_function("listWorkflowAgents", *args, **kwargs)

def load_workflow_from_canonical(*args, **kwargs):
    return invoke_source_function("loadWorkflowFromCanonical", *args, **kwargs)

def load_workflow_from_shards(*args, **kwargs):
    return invoke_source_function("loadWorkflowFromShards", *args, **kwargs)

def normalize_path_for_json(*args, **kwargs):
    return invoke_source_function("normalizePathForJson", *args, **kwargs)

def normalize_scope_guardrails_catalog(*args, **kwargs):
    return invoke_source_function("normalizeScopeGuardrailsCatalog", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def read_canonical_doc(*args, **kwargs):
    return invoke_source_function("readCanonicalDoc", *args, **kwargs)

def read_json(*args, **kwargs):
    return invoke_source_function("readJson", *args, **kwargs)

def read_shard_index(*args, **kwargs):
    return invoke_source_function("readShardIndex", *args, **kwargs)

def read_workflow_doc(*args, **kwargs):
    return invoke_source_function("readWorkflowDoc", *args, **kwargs)

def resolve_scope_guardrails(*args, **kwargs):
    return invoke_source_function("resolveScopeGuardrails", *args, **kwargs)

def sha256(*args, **kwargs):
    return invoke_source_function("sha256", *args, **kwargs)

def to_shard_file_name(*args, **kwargs):
    return invoke_source_function("toShardFileName", *args, **kwargs)

def write_json_if_changed(*args, **kwargs):
    return invoke_source_function("writeJsonIfChanged", *args, **kwargs)


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
