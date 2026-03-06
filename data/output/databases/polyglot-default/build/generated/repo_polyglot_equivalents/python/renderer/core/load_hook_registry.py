#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "renderer/core/load_hook_registry.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "apply_record_filter",
  "build_load_hook_argument_payload",
  "chain_match",
  "clean_text",
  "compare_chain_records",
  "compare_records",
  "create_load_hook_api",
  "ensure_load_hook_registry",
  "ensure_tree_page",
  "ensure_tree_window",
  "get_load_hook_arguments",
  "get_load_hook_arguments_by_tag",
  "get_load_hook_chain",
  "get_search_blob",
  "get_window_page_control_tree",
  "list_load_hook_records",
  "normalize_argument_spec",
  "normalize_argument_specs",
  "normalize_hook_record",
  "normalize_registry",
  "normalize_scope",
  "normalize_stage",
  "normalize_string_array",
  "publish_load_hook_api",
  "read_ctx",
  "register_load_hook",
  "register_post_load_hook",
  "register_pre_load_hook",
  "search_load_hooks",
  "string_match",
  "unique_by"
]
AIO_SYMBOL_MAP = {
  "apply_record_filter": "apply_record_filter",
  "build_load_hook_argument_payload": "build_load_hook_argument_payload",
  "chain_match": "chain_match",
  "clean_text": "clean_text",
  "compare_chain_records": "compare_chain_records",
  "compare_records": "compare_records",
  "create_load_hook_api": "create_load_hook_api",
  "ensure_load_hook_registry": "ensure_load_hook_registry",
  "ensure_tree_page": "ensure_tree_page",
  "ensure_tree_window": "ensure_tree_window",
  "get_load_hook_arguments": "get_load_hook_arguments",
  "get_load_hook_arguments_by_tag": "get_load_hook_arguments_by_tag",
  "get_load_hook_chain": "get_load_hook_chain",
  "get_search_blob": "get_search_blob",
  "get_window_page_control_tree": "get_window_page_control_tree",
  "list_load_hook_records": "list_load_hook_records",
  "normalize_argument_spec": "normalize_argument_spec",
  "normalize_argument_specs": "normalize_argument_specs",
  "normalize_hook_record": "normalize_hook_record",
  "normalize_registry": "normalize_registry",
  "normalize_scope": "normalize_scope",
  "normalize_stage": "normalize_stage",
  "normalize_string_array": "normalize_string_array",
  "publish_load_hook_api": "publish_load_hook_api",
  "read_ctx": "read_ctx",
  "register_load_hook": "register_load_hook",
  "register_post_load_hook": "register_post_load_hook",
  "register_pre_load_hook": "register_pre_load_hook",
  "search_load_hooks": "search_load_hooks",
  "string_match": "string_match",
  "unique_by": "unique_by"
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

def apply_record_filter(*args, **kwargs):
    return invoke_source_function("apply_record_filter", *args, **kwargs)

def build_load_hook_argument_payload(*args, **kwargs):
    return invoke_source_function("build_load_hook_argument_payload", *args, **kwargs)

def chain_match(*args, **kwargs):
    return invoke_source_function("chain_match", *args, **kwargs)

def clean_text(*args, **kwargs):
    return invoke_source_function("clean_text", *args, **kwargs)

def compare_chain_records(*args, **kwargs):
    return invoke_source_function("compare_chain_records", *args, **kwargs)

def compare_records(*args, **kwargs):
    return invoke_source_function("compare_records", *args, **kwargs)

def create_load_hook_api(*args, **kwargs):
    return invoke_source_function("create_load_hook_api", *args, **kwargs)

def ensure_load_hook_registry(*args, **kwargs):
    return invoke_source_function("ensure_load_hook_registry", *args, **kwargs)

def ensure_tree_page(*args, **kwargs):
    return invoke_source_function("ensure_tree_page", *args, **kwargs)

def ensure_tree_window(*args, **kwargs):
    return invoke_source_function("ensure_tree_window", *args, **kwargs)

def get_load_hook_arguments(*args, **kwargs):
    return invoke_source_function("get_load_hook_arguments", *args, **kwargs)

def get_load_hook_arguments_by_tag(*args, **kwargs):
    return invoke_source_function("get_load_hook_arguments_by_tag", *args, **kwargs)

def get_load_hook_chain(*args, **kwargs):
    return invoke_source_function("get_load_hook_chain", *args, **kwargs)

def get_search_blob(*args, **kwargs):
    return invoke_source_function("get_search_blob", *args, **kwargs)

def get_window_page_control_tree(*args, **kwargs):
    return invoke_source_function("get_window_page_control_tree", *args, **kwargs)

def list_load_hook_records(*args, **kwargs):
    return invoke_source_function("list_load_hook_records", *args, **kwargs)

def normalize_argument_spec(*args, **kwargs):
    return invoke_source_function("normalize_argument_spec", *args, **kwargs)

def normalize_argument_specs(*args, **kwargs):
    return invoke_source_function("normalize_argument_specs", *args, **kwargs)

def normalize_hook_record(*args, **kwargs):
    return invoke_source_function("normalize_hook_record", *args, **kwargs)

def normalize_registry(*args, **kwargs):
    return invoke_source_function("normalize_registry", *args, **kwargs)

def normalize_scope(*args, **kwargs):
    return invoke_source_function("normalize_scope", *args, **kwargs)

def normalize_stage(*args, **kwargs):
    return invoke_source_function("normalize_stage", *args, **kwargs)

def normalize_string_array(*args, **kwargs):
    return invoke_source_function("normalize_string_array", *args, **kwargs)

def publish_load_hook_api(*args, **kwargs):
    return invoke_source_function("publish_load_hook_api", *args, **kwargs)

def read_ctx(*args, **kwargs):
    return invoke_source_function("read_ctx", *args, **kwargs)

def register_load_hook(*args, **kwargs):
    return invoke_source_function("register_load_hook", *args, **kwargs)

def register_post_load_hook(*args, **kwargs):
    return invoke_source_function("register_post_load_hook", *args, **kwargs)

def register_pre_load_hook(*args, **kwargs):
    return invoke_source_function("register_pre_load_hook", *args, **kwargs)

def search_load_hooks(*args, **kwargs):
    return invoke_source_function("search_load_hooks", *args, **kwargs)

def string_match(*args, **kwargs):
    return invoke_source_function("string_match", *args, **kwargs)

def unique_by(*args, **kwargs):
    return invoke_source_function("unique_by", *args, **kwargs)


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
