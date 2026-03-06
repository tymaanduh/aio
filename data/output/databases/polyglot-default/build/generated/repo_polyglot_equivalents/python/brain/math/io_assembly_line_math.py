#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/math/io_assembly_line_math.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildAliasLookup",
  "create_math_io_database",
  "create_math_io_handler",
  "createStageRuntime",
  "execute_stage",
  "get_database_snapshot",
  "get_slot_value",
  "identify_needed_data",
  "isPlainObject",
  "load_data",
  "loadDefaultCatalogSpec",
  "loadNodeCatalogSpec",
  "loadRuntimeCatalogSpec",
  "normalizeAliasIndex",
  "normalizeGroupIndex",
  "normalizeInstructionSet",
  "normalizeInstructionTemplateIndex",
  "normalizeLabelIndex",
  "normalizeOperationIndex",
  "normalizeRuntimeDefaults",
  "normalizeText",
  "nowIso",
  "readRuntimeSymbol",
  "resolve_operation",
  "resolveInstructionSet",
  "resolveStageSlotToken",
  "resolveSymbolFromAlias",
  "run_assembly_line",
  "runInstructionSet",
  "toArray",
  "toFiniteNumber",
  "toUniqueTextList",
  "unload_data",
  "writeRuntimeSymbol"
]
AIO_SYMBOL_MAP = {
  "buildAliasLookup": "build_alias_lookup",
  "create_math_io_database": "create_math_io_database",
  "create_math_io_handler": "create_math_io_handler",
  "createStageRuntime": "create_stage_runtime",
  "execute_stage": "execute_stage",
  "get_database_snapshot": "get_database_snapshot",
  "get_slot_value": "get_slot_value",
  "identify_needed_data": "identify_needed_data",
  "isPlainObject": "is_plain_object",
  "load_data": "load_data",
  "loadDefaultCatalogSpec": "load_default_catalog_spec",
  "loadNodeCatalogSpec": "load_node_catalog_spec",
  "loadRuntimeCatalogSpec": "load_runtime_catalog_spec",
  "normalizeAliasIndex": "normalize_alias_index",
  "normalizeGroupIndex": "normalize_group_index",
  "normalizeInstructionSet": "normalize_instruction_set",
  "normalizeInstructionTemplateIndex": "normalize_instruction_template_index",
  "normalizeLabelIndex": "normalize_label_index",
  "normalizeOperationIndex": "normalize_operation_index",
  "normalizeRuntimeDefaults": "normalize_runtime_defaults",
  "normalizeText": "normalize_text",
  "nowIso": "now_iso",
  "readRuntimeSymbol": "read_runtime_symbol",
  "resolve_operation": "resolve_operation",
  "resolveInstructionSet": "resolve_instruction_set",
  "resolveStageSlotToken": "resolve_stage_slot_token",
  "resolveSymbolFromAlias": "resolve_symbol_from_alias",
  "run_assembly_line": "run_assembly_line",
  "runInstructionSet": "run_instruction_set",
  "toArray": "to_array",
  "toFiniteNumber": "to_finite_number",
  "toUniqueTextList": "to_unique_text_list",
  "unload_data": "unload_data",
  "writeRuntimeSymbol": "write_runtime_symbol"
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

def build_alias_lookup(*args, **kwargs):
    return invoke_source_function("buildAliasLookup", *args, **kwargs)

def create_math_io_database(*args, **kwargs):
    return invoke_source_function("create_math_io_database", *args, **kwargs)

def create_math_io_handler(*args, **kwargs):
    return invoke_source_function("create_math_io_handler", *args, **kwargs)

def create_stage_runtime(*args, **kwargs):
    return invoke_source_function("createStageRuntime", *args, **kwargs)

def execute_stage(*args, **kwargs):
    return invoke_source_function("execute_stage", *args, **kwargs)

def get_database_snapshot(*args, **kwargs):
    return invoke_source_function("get_database_snapshot", *args, **kwargs)

def get_slot_value(*args, **kwargs):
    return invoke_source_function("get_slot_value", *args, **kwargs)

def identify_needed_data(*args, **kwargs):
    return invoke_source_function("identify_needed_data", *args, **kwargs)

def is_plain_object(*args, **kwargs):
    return invoke_source_function("isPlainObject", *args, **kwargs)

def load_data(*args, **kwargs):
    return invoke_source_function("load_data", *args, **kwargs)

def load_default_catalog_spec(*args, **kwargs):
    return invoke_source_function("loadDefaultCatalogSpec", *args, **kwargs)

def load_node_catalog_spec(*args, **kwargs):
    return invoke_source_function("loadNodeCatalogSpec", *args, **kwargs)

def load_runtime_catalog_spec(*args, **kwargs):
    return invoke_source_function("loadRuntimeCatalogSpec", *args, **kwargs)

def normalize_alias_index(*args, **kwargs):
    return invoke_source_function("normalizeAliasIndex", *args, **kwargs)

def normalize_group_index(*args, **kwargs):
    return invoke_source_function("normalizeGroupIndex", *args, **kwargs)

def normalize_instruction_set(*args, **kwargs):
    return invoke_source_function("normalizeInstructionSet", *args, **kwargs)

def normalize_instruction_template_index(*args, **kwargs):
    return invoke_source_function("normalizeInstructionTemplateIndex", *args, **kwargs)

def normalize_label_index(*args, **kwargs):
    return invoke_source_function("normalizeLabelIndex", *args, **kwargs)

def normalize_operation_index(*args, **kwargs):
    return invoke_source_function("normalizeOperationIndex", *args, **kwargs)

def normalize_runtime_defaults(*args, **kwargs):
    return invoke_source_function("normalizeRuntimeDefaults", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("nowIso", *args, **kwargs)

def read_runtime_symbol(*args, **kwargs):
    return invoke_source_function("readRuntimeSymbol", *args, **kwargs)

def resolve_operation(*args, **kwargs):
    return invoke_source_function("resolve_operation", *args, **kwargs)

def resolve_instruction_set(*args, **kwargs):
    return invoke_source_function("resolveInstructionSet", *args, **kwargs)

def resolve_stage_slot_token(*args, **kwargs):
    return invoke_source_function("resolveStageSlotToken", *args, **kwargs)

def resolve_symbol_from_alias(*args, **kwargs):
    return invoke_source_function("resolveSymbolFromAlias", *args, **kwargs)

def run_assembly_line(*args, **kwargs):
    return invoke_source_function("run_assembly_line", *args, **kwargs)

def run_instruction_set(*args, **kwargs):
    return invoke_source_function("runInstructionSet", *args, **kwargs)

def to_array(*args, **kwargs):
    return invoke_source_function("toArray", *args, **kwargs)

def to_finite_number(*args, **kwargs):
    return invoke_source_function("toFiniteNumber", *args, **kwargs)

def to_unique_text_list(*args, **kwargs):
    return invoke_source_function("toUniqueTextList", *args, **kwargs)

def unload_data(*args, **kwargs):
    return invoke_source_function("unload_data", *args, **kwargs)

def write_runtime_symbol(*args, **kwargs):
    return invoke_source_function("writeRuntimeSymbol", *args, **kwargs)


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
