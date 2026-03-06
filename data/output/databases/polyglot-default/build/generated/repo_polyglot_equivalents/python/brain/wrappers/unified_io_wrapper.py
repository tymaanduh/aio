#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/unified_io_wrapper.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "attachRuntimeAliases",
  "build_pipeline_from_function_specs",
  "build_pipeline_from_operation_ids",
  "buildAliasLookup",
  "buildFunctionSignatureIndexFromOperations",
  "buildTwoPassFailure",
  "buildTwoPassSuccess",
  "collectCallArgsForStage",
  "create_default_function_registry",
  "create_runtime_io_reader",
  "create_runtime_io_stream",
  "create_runtime_io_writer",
  "create_unified_wrapper",
  "create_unified_wrapper_catalog",
  "createStageResult",
  "ensureRuntimeGroup",
  "ensureRuntimeMeta",
  "execute_pipeline",
  "identify_arguments",
  "initializeRuntimeBanks",
  "isPlainObject",
  "loadDefaultSpec",
  "loadNodeSpec",
  "loadRuntimeSpec",
  "normalize_runtime_io_stream",
  "normalize_stage_from_function_spec",
  "normalizeAliasIndex",
  "normalizeFunctionSignatureIndex",
  "normalizeGroupIndex",
  "normalizeInputArgs",
  "normalizeLabelIndex",
  "normalizeOperationIndex",
  "normalizeOperationList",
  "normalizePipelineIndex",
  "normalizeRuntimeDefaults",
  "normalizeText",
  "normalizeWrapperIndex",
  "nowIso",
  "read_symbol_value",
  "recordPassExecute",
  "recordPassIdentify",
  "resolve_operation_by_function_id",
  "resolveCanonicalSymbol",
  "resolveRuntimeGroupIds",
  "resolveStageOperation",
  "run_auto_pipeline",
  "run_pipeline_by_id",
  "run_two_pass",
  "run_two_pass_with_stream",
  "toArray",
  "toFiniteNumber",
  "toUniqueTextList",
  "write_symbol_value"
]
AIO_SYMBOL_MAP = {
  "attachRuntimeAliases": "attach_runtime_aliases",
  "build_pipeline_from_function_specs": "build_pipeline_from_function_specs",
  "build_pipeline_from_operation_ids": "build_pipeline_from_operation_ids",
  "buildAliasLookup": "build_alias_lookup",
  "buildFunctionSignatureIndexFromOperations": "build_function_signature_index_from_operations",
  "buildTwoPassFailure": "build_two_pass_failure",
  "buildTwoPassSuccess": "build_two_pass_success",
  "collectCallArgsForStage": "collect_call_args_for_stage",
  "create_default_function_registry": "create_default_function_registry",
  "create_runtime_io_reader": "create_runtime_io_reader",
  "create_runtime_io_stream": "create_runtime_io_stream",
  "create_runtime_io_writer": "create_runtime_io_writer",
  "create_unified_wrapper": "create_unified_wrapper",
  "create_unified_wrapper_catalog": "create_unified_wrapper_catalog",
  "createStageResult": "create_stage_result",
  "ensureRuntimeGroup": "ensure_runtime_group",
  "ensureRuntimeMeta": "ensure_runtime_meta",
  "execute_pipeline": "execute_pipeline",
  "identify_arguments": "identify_arguments",
  "initializeRuntimeBanks": "initialize_runtime_banks",
  "isPlainObject": "is_plain_object",
  "loadDefaultSpec": "load_default_spec",
  "loadNodeSpec": "load_node_spec",
  "loadRuntimeSpec": "load_runtime_spec",
  "normalize_runtime_io_stream": "normalize_runtime_io_stream",
  "normalize_stage_from_function_spec": "normalize_stage_from_function_spec",
  "normalizeAliasIndex": "normalize_alias_index",
  "normalizeFunctionSignatureIndex": "normalize_function_signature_index",
  "normalizeGroupIndex": "normalize_group_index",
  "normalizeInputArgs": "normalize_input_args",
  "normalizeLabelIndex": "normalize_label_index",
  "normalizeOperationIndex": "normalize_operation_index",
  "normalizeOperationList": "normalize_operation_list",
  "normalizePipelineIndex": "normalize_pipeline_index",
  "normalizeRuntimeDefaults": "normalize_runtime_defaults",
  "normalizeText": "normalize_text",
  "normalizeWrapperIndex": "normalize_wrapper_index",
  "nowIso": "now_iso",
  "read_symbol_value": "read_symbol_value",
  "recordPassExecute": "record_pass_execute",
  "recordPassIdentify": "record_pass_identify",
  "resolve_operation_by_function_id": "resolve_operation_by_function_id",
  "resolveCanonicalSymbol": "resolve_canonical_symbol",
  "resolveRuntimeGroupIds": "resolve_runtime_group_ids",
  "resolveStageOperation": "resolve_stage_operation",
  "run_auto_pipeline": "run_auto_pipeline",
  "run_pipeline_by_id": "run_pipeline_by_id",
  "run_two_pass": "run_two_pass",
  "run_two_pass_with_stream": "run_two_pass_with_stream",
  "toArray": "to_array",
  "toFiniteNumber": "to_finite_number",
  "toUniqueTextList": "to_unique_text_list",
  "write_symbol_value": "write_symbol_value"
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

def attach_runtime_aliases(*args, **kwargs):
    return invoke_source_function("attachRuntimeAliases", *args, **kwargs)

def build_pipeline_from_function_specs(*args, **kwargs):
    return invoke_source_function("build_pipeline_from_function_specs", *args, **kwargs)

def build_pipeline_from_operation_ids(*args, **kwargs):
    return invoke_source_function("build_pipeline_from_operation_ids", *args, **kwargs)

def build_alias_lookup(*args, **kwargs):
    return invoke_source_function("buildAliasLookup", *args, **kwargs)

def build_function_signature_index_from_operations(*args, **kwargs):
    return invoke_source_function("buildFunctionSignatureIndexFromOperations", *args, **kwargs)

def build_two_pass_failure(*args, **kwargs):
    return invoke_source_function("buildTwoPassFailure", *args, **kwargs)

def build_two_pass_success(*args, **kwargs):
    return invoke_source_function("buildTwoPassSuccess", *args, **kwargs)

def collect_call_args_for_stage(*args, **kwargs):
    return invoke_source_function("collectCallArgsForStage", *args, **kwargs)

def create_default_function_registry(*args, **kwargs):
    return invoke_source_function("create_default_function_registry", *args, **kwargs)

def create_runtime_io_reader(*args, **kwargs):
    return invoke_source_function("create_runtime_io_reader", *args, **kwargs)

def create_runtime_io_stream(*args, **kwargs):
    return invoke_source_function("create_runtime_io_stream", *args, **kwargs)

def create_runtime_io_writer(*args, **kwargs):
    return invoke_source_function("create_runtime_io_writer", *args, **kwargs)

def create_unified_wrapper(*args, **kwargs):
    return invoke_source_function("create_unified_wrapper", *args, **kwargs)

def create_unified_wrapper_catalog(*args, **kwargs):
    return invoke_source_function("create_unified_wrapper_catalog", *args, **kwargs)

def create_stage_result(*args, **kwargs):
    return invoke_source_function("createStageResult", *args, **kwargs)

def ensure_runtime_group(*args, **kwargs):
    return invoke_source_function("ensureRuntimeGroup", *args, **kwargs)

def ensure_runtime_meta(*args, **kwargs):
    return invoke_source_function("ensureRuntimeMeta", *args, **kwargs)

def execute_pipeline(*args, **kwargs):
    return invoke_source_function("execute_pipeline", *args, **kwargs)

def identify_arguments(*args, **kwargs):
    return invoke_source_function("identify_arguments", *args, **kwargs)

def initialize_runtime_banks(*args, **kwargs):
    return invoke_source_function("initializeRuntimeBanks", *args, **kwargs)

def is_plain_object(*args, **kwargs):
    return invoke_source_function("isPlainObject", *args, **kwargs)

def load_default_spec(*args, **kwargs):
    return invoke_source_function("loadDefaultSpec", *args, **kwargs)

def load_node_spec(*args, **kwargs):
    return invoke_source_function("loadNodeSpec", *args, **kwargs)

def load_runtime_spec(*args, **kwargs):
    return invoke_source_function("loadRuntimeSpec", *args, **kwargs)

def normalize_runtime_io_stream(*args, **kwargs):
    return invoke_source_function("normalize_runtime_io_stream", *args, **kwargs)

def normalize_stage_from_function_spec(*args, **kwargs):
    return invoke_source_function("normalize_stage_from_function_spec", *args, **kwargs)

def normalize_alias_index(*args, **kwargs):
    return invoke_source_function("normalizeAliasIndex", *args, **kwargs)

def normalize_function_signature_index(*args, **kwargs):
    return invoke_source_function("normalizeFunctionSignatureIndex", *args, **kwargs)

def normalize_group_index(*args, **kwargs):
    return invoke_source_function("normalizeGroupIndex", *args, **kwargs)

def normalize_input_args(*args, **kwargs):
    return invoke_source_function("normalizeInputArgs", *args, **kwargs)

def normalize_label_index(*args, **kwargs):
    return invoke_source_function("normalizeLabelIndex", *args, **kwargs)

def normalize_operation_index(*args, **kwargs):
    return invoke_source_function("normalizeOperationIndex", *args, **kwargs)

def normalize_operation_list(*args, **kwargs):
    return invoke_source_function("normalizeOperationList", *args, **kwargs)

def normalize_pipeline_index(*args, **kwargs):
    return invoke_source_function("normalizePipelineIndex", *args, **kwargs)

def normalize_runtime_defaults(*args, **kwargs):
    return invoke_source_function("normalizeRuntimeDefaults", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def normalize_wrapper_index(*args, **kwargs):
    return invoke_source_function("normalizeWrapperIndex", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("nowIso", *args, **kwargs)

def read_symbol_value(*args, **kwargs):
    return invoke_source_function("read_symbol_value", *args, **kwargs)

def record_pass_execute(*args, **kwargs):
    return invoke_source_function("recordPassExecute", *args, **kwargs)

def record_pass_identify(*args, **kwargs):
    return invoke_source_function("recordPassIdentify", *args, **kwargs)

def resolve_operation_by_function_id(*args, **kwargs):
    return invoke_source_function("resolve_operation_by_function_id", *args, **kwargs)

def resolve_canonical_symbol(*args, **kwargs):
    return invoke_source_function("resolveCanonicalSymbol", *args, **kwargs)

def resolve_runtime_group_ids(*args, **kwargs):
    return invoke_source_function("resolveRuntimeGroupIds", *args, **kwargs)

def resolve_stage_operation(*args, **kwargs):
    return invoke_source_function("resolveStageOperation", *args, **kwargs)

def run_auto_pipeline(*args, **kwargs):
    return invoke_source_function("run_auto_pipeline", *args, **kwargs)

def run_pipeline_by_id(*args, **kwargs):
    return invoke_source_function("run_pipeline_by_id", *args, **kwargs)

def run_two_pass(*args, **kwargs):
    return invoke_source_function("run_two_pass", *args, **kwargs)

def run_two_pass_with_stream(*args, **kwargs):
    return invoke_source_function("run_two_pass_with_stream", *args, **kwargs)

def to_array(*args, **kwargs):
    return invoke_source_function("toArray", *args, **kwargs)

def to_finite_number(*args, **kwargs):
    return invoke_source_function("toFiniteNumber", *args, **kwargs)

def to_unique_text_list(*args, **kwargs):
    return invoke_source_function("toUniqueTextList", *args, **kwargs)

def write_symbol_value(*args, **kwargs):
    return invoke_source_function("write_symbol_value", *args, **kwargs)


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
