#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/polyglot-default-pipeline.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "appendIfMissingMarker",
  "arraysEqualAsSet",
  "artifactPaths",
  "buildContractRuntimeIndex",
  "buildEnglishBlueprint",
  "buildFinalRecommendation",
  "buildHierarchyOrderDoc",
  "buildIncrementalEnglishSection",
  "buildIncrementalPseudocodeSection",
  "buildInstructionTemplateRegistry",
  "buildLanguageSupportFiles",
  "buildOutputSummary",
  "buildPolyglotImplementation",
  "buildPseudocodeBlueprint",
  "buildRuntimeDispatchCatalog",
  "buildStagePlan",
  "bytesOfText",
  "clone_plain_object",
  "createInitialUpdateScanReport",
  "DEFAULT_WRAPPER_PREFLIGHT",
  "derivePlannedUpdates",
  "deriveProjectName",
  "deriveScopeSummary",
  "detectToolchains",
  "emptyFunctionLanguagePlan",
  "emptyWinnerMapping",
  "ensureDir",
  "ensureOutputLayout",
  "ensureParentDir",
  "extensionForLanguage",
  "fileExists",
  "finalizeUpdateScanReport",
  "hashText",
  "median",
  "normalizeActionIdList",
  "normalizeContractCatalog",
  "normalizeInstructionTemplateIndex",
  "normalizeLanguageId",
  "nowIso",
  "parseArgs",
  "parseJsonFromCommandOutput",
  "parseJsonObject",
  "pickBenchmarkRanking",
  "pickBenchmarkTopLanguage",
  "pickFunctionLanguagePlan",
  "pickWinnerMapping",
  "printHelpAndExit",
  "readBrief",
  "readJsonIfExists",
  "readTextIfExists",
  "renderCppContractDataHeader",
  "renderCppWrapperModule",
  "renderLanguageStub",
  "renderPythonContractDataModule",
  "renderPythonWrapperModule",
  "resolveFirstExistingPath",
  "resolveRunMode",
  "resolveRuntimeBenchmarkLanguages",
  "runBenchmark",
  "runBuildChecks",
  "runPipeline",
  "runProbeBenchmark",
  "runSecurityAudit",
  "runUpdateScan",
  "runWrapperPreflight",
  "scoreLanguages",
  "stageSkip",
  "toCppStringLiteral",
  "toPascalCase",
  "toPythonLiteral",
  "toSortedUniqueArray",
  "toUpdateScanOk",
  "writeJson",
  "writeText",
  "writeUpdateScanReport"
]
AIO_SYMBOL_MAP = {
  "appendIfMissingMarker": "append_if_missing_marker",
  "arraysEqualAsSet": "arrays_equal_as_set",
  "artifactPaths": "artifact_paths",
  "buildContractRuntimeIndex": "build_contract_runtime_index",
  "buildEnglishBlueprint": "build_english_blueprint",
  "buildFinalRecommendation": "build_final_recommendation",
  "buildHierarchyOrderDoc": "build_hierarchy_order_doc",
  "buildIncrementalEnglishSection": "build_incremental_english_section",
  "buildIncrementalPseudocodeSection": "build_incremental_pseudocode_section",
  "buildInstructionTemplateRegistry": "build_instruction_template_registry",
  "buildLanguageSupportFiles": "build_language_support_files",
  "buildOutputSummary": "build_output_summary",
  "buildPolyglotImplementation": "build_polyglot_implementation",
  "buildPseudocodeBlueprint": "build_pseudocode_blueprint",
  "buildRuntimeDispatchCatalog": "build_runtime_dispatch_catalog",
  "buildStagePlan": "build_stage_plan",
  "bytesOfText": "bytes_of_text",
  "clone_plain_object": "clone_plain_object",
  "createInitialUpdateScanReport": "create_initial_update_scan_report",
  "DEFAULT_WRAPPER_PREFLIGHT": "default_wrapper_preflight",
  "derivePlannedUpdates": "derive_planned_updates",
  "deriveProjectName": "derive_project_name",
  "deriveScopeSummary": "derive_scope_summary",
  "detectToolchains": "detect_toolchains",
  "emptyFunctionLanguagePlan": "empty_function_language_plan",
  "emptyWinnerMapping": "empty_winner_mapping",
  "ensureDir": "ensure_dir",
  "ensureOutputLayout": "ensure_output_layout",
  "ensureParentDir": "ensure_parent_dir",
  "extensionForLanguage": "extension_for_language",
  "fileExists": "file_exists",
  "finalizeUpdateScanReport": "finalize_update_scan_report",
  "hashText": "hash_text",
  "median": "median",
  "normalizeActionIdList": "normalize_action_id_list",
  "normalizeContractCatalog": "normalize_contract_catalog",
  "normalizeInstructionTemplateIndex": "normalize_instruction_template_index",
  "normalizeLanguageId": "normalize_language_id",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "parseJsonFromCommandOutput": "parse_json_from_command_output",
  "parseJsonObject": "parse_json_object",
  "pickBenchmarkRanking": "pick_benchmark_ranking",
  "pickBenchmarkTopLanguage": "pick_benchmark_top_language",
  "pickFunctionLanguagePlan": "pick_function_language_plan",
  "pickWinnerMapping": "pick_winner_mapping",
  "printHelpAndExit": "print_help_and_exit",
  "readBrief": "read_brief",
  "readJsonIfExists": "read_json_if_exists",
  "readTextIfExists": "read_text_if_exists",
  "renderCppContractDataHeader": "render_cpp_contract_data_header",
  "renderCppWrapperModule": "render_cpp_wrapper_module",
  "renderLanguageStub": "render_language_stub",
  "renderPythonContractDataModule": "render_python_contract_data_module",
  "renderPythonWrapperModule": "render_python_wrapper_module",
  "resolveFirstExistingPath": "resolve_first_existing_path",
  "resolveRunMode": "resolve_run_mode",
  "resolveRuntimeBenchmarkLanguages": "resolve_runtime_benchmark_languages",
  "runBenchmark": "run_benchmark",
  "runBuildChecks": "run_build_checks",
  "runPipeline": "run_pipeline",
  "runProbeBenchmark": "run_probe_benchmark",
  "runSecurityAudit": "run_security_audit",
  "runUpdateScan": "run_update_scan",
  "runWrapperPreflight": "run_wrapper_preflight",
  "scoreLanguages": "score_languages",
  "stageSkip": "stage_skip",
  "toCppStringLiteral": "to_cpp_string_literal",
  "toPascalCase": "to_pascal_case",
  "toPythonLiteral": "to_python_literal",
  "toSortedUniqueArray": "to_sorted_unique_array",
  "toUpdateScanOk": "to_update_scan_ok",
  "writeJson": "write_json",
  "writeText": "write_text",
  "writeUpdateScanReport": "write_update_scan_report"
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

def append_if_missing_marker(*args, **kwargs):
    return invoke_source_function("appendIfMissingMarker", *args, **kwargs)

def arrays_equal_as_set(*args, **kwargs):
    return invoke_source_function("arraysEqualAsSet", *args, **kwargs)

def artifact_paths(*args, **kwargs):
    return invoke_source_function("artifactPaths", *args, **kwargs)

def build_contract_runtime_index(*args, **kwargs):
    return invoke_source_function("buildContractRuntimeIndex", *args, **kwargs)

def build_english_blueprint(*args, **kwargs):
    return invoke_source_function("buildEnglishBlueprint", *args, **kwargs)

def build_final_recommendation(*args, **kwargs):
    return invoke_source_function("buildFinalRecommendation", *args, **kwargs)

def build_hierarchy_order_doc(*args, **kwargs):
    return invoke_source_function("buildHierarchyOrderDoc", *args, **kwargs)

def build_incremental_english_section(*args, **kwargs):
    return invoke_source_function("buildIncrementalEnglishSection", *args, **kwargs)

def build_incremental_pseudocode_section(*args, **kwargs):
    return invoke_source_function("buildIncrementalPseudocodeSection", *args, **kwargs)

def build_instruction_template_registry(*args, **kwargs):
    return invoke_source_function("buildInstructionTemplateRegistry", *args, **kwargs)

def build_language_support_files(*args, **kwargs):
    return invoke_source_function("buildLanguageSupportFiles", *args, **kwargs)

def build_output_summary(*args, **kwargs):
    return invoke_source_function("buildOutputSummary", *args, **kwargs)

def build_polyglot_implementation(*args, **kwargs):
    return invoke_source_function("buildPolyglotImplementation", *args, **kwargs)

def build_pseudocode_blueprint(*args, **kwargs):
    return invoke_source_function("buildPseudocodeBlueprint", *args, **kwargs)

def build_runtime_dispatch_catalog(*args, **kwargs):
    return invoke_source_function("buildRuntimeDispatchCatalog", *args, **kwargs)

def build_stage_plan(*args, **kwargs):
    return invoke_source_function("buildStagePlan", *args, **kwargs)

def bytes_of_text(*args, **kwargs):
    return invoke_source_function("bytesOfText", *args, **kwargs)

def clone_plain_object(*args, **kwargs):
    return invoke_source_function("clone_plain_object", *args, **kwargs)

def create_initial_update_scan_report(*args, **kwargs):
    return invoke_source_function("createInitialUpdateScanReport", *args, **kwargs)

def default_wrapper_preflight(*args, **kwargs):
    return invoke_source_function("DEFAULT_WRAPPER_PREFLIGHT", *args, **kwargs)

def derive_planned_updates(*args, **kwargs):
    return invoke_source_function("derivePlannedUpdates", *args, **kwargs)

def derive_project_name(*args, **kwargs):
    return invoke_source_function("deriveProjectName", *args, **kwargs)

def derive_scope_summary(*args, **kwargs):
    return invoke_source_function("deriveScopeSummary", *args, **kwargs)

def detect_toolchains(*args, **kwargs):
    return invoke_source_function("detectToolchains", *args, **kwargs)

def empty_function_language_plan(*args, **kwargs):
    return invoke_source_function("emptyFunctionLanguagePlan", *args, **kwargs)

def empty_winner_mapping(*args, **kwargs):
    return invoke_source_function("emptyWinnerMapping", *args, **kwargs)

def ensure_dir(*args, **kwargs):
    return invoke_source_function("ensureDir", *args, **kwargs)

def ensure_output_layout(*args, **kwargs):
    return invoke_source_function("ensureOutputLayout", *args, **kwargs)

def ensure_parent_dir(*args, **kwargs):
    return invoke_source_function("ensureParentDir", *args, **kwargs)

def extension_for_language(*args, **kwargs):
    return invoke_source_function("extensionForLanguage", *args, **kwargs)

def file_exists(*args, **kwargs):
    return invoke_source_function("fileExists", *args, **kwargs)

def finalize_update_scan_report(*args, **kwargs):
    return invoke_source_function("finalizeUpdateScanReport", *args, **kwargs)

def hash_text(*args, **kwargs):
    return invoke_source_function("hashText", *args, **kwargs)

def median(*args, **kwargs):
    return invoke_source_function("median", *args, **kwargs)

def normalize_action_id_list(*args, **kwargs):
    return invoke_source_function("normalizeActionIdList", *args, **kwargs)

def normalize_contract_catalog(*args, **kwargs):
    return invoke_source_function("normalizeContractCatalog", *args, **kwargs)

def normalize_instruction_template_index(*args, **kwargs):
    return invoke_source_function("normalizeInstructionTemplateIndex", *args, **kwargs)

def normalize_language_id(*args, **kwargs):
    return invoke_source_function("normalizeLanguageId", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("nowIso", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def parse_json_from_command_output(*args, **kwargs):
    return invoke_source_function("parseJsonFromCommandOutput", *args, **kwargs)

def parse_json_object(*args, **kwargs):
    return invoke_source_function("parseJsonObject", *args, **kwargs)

def pick_benchmark_ranking(*args, **kwargs):
    return invoke_source_function("pickBenchmarkRanking", *args, **kwargs)

def pick_benchmark_top_language(*args, **kwargs):
    return invoke_source_function("pickBenchmarkTopLanguage", *args, **kwargs)

def pick_function_language_plan(*args, **kwargs):
    return invoke_source_function("pickFunctionLanguagePlan", *args, **kwargs)

def pick_winner_mapping(*args, **kwargs):
    return invoke_source_function("pickWinnerMapping", *args, **kwargs)

def print_help_and_exit(*args, **kwargs):
    return invoke_source_function("printHelpAndExit", *args, **kwargs)

def read_brief(*args, **kwargs):
    return invoke_source_function("readBrief", *args, **kwargs)

def read_json_if_exists(*args, **kwargs):
    return invoke_source_function("readJsonIfExists", *args, **kwargs)

def read_text_if_exists(*args, **kwargs):
    return invoke_source_function("readTextIfExists", *args, **kwargs)

def render_cpp_contract_data_header(*args, **kwargs):
    return invoke_source_function("renderCppContractDataHeader", *args, **kwargs)

def render_cpp_wrapper_module(*args, **kwargs):
    return invoke_source_function("renderCppWrapperModule", *args, **kwargs)

def render_language_stub(*args, **kwargs):
    return invoke_source_function("renderLanguageStub", *args, **kwargs)

def render_python_contract_data_module(*args, **kwargs):
    return invoke_source_function("renderPythonContractDataModule", *args, **kwargs)

def render_python_wrapper_module(*args, **kwargs):
    return invoke_source_function("renderPythonWrapperModule", *args, **kwargs)

def resolve_first_existing_path(*args, **kwargs):
    return invoke_source_function("resolveFirstExistingPath", *args, **kwargs)

def resolve_run_mode(*args, **kwargs):
    return invoke_source_function("resolveRunMode", *args, **kwargs)

def resolve_runtime_benchmark_languages(*args, **kwargs):
    return invoke_source_function("resolveRuntimeBenchmarkLanguages", *args, **kwargs)

def run_benchmark(*args, **kwargs):
    return invoke_source_function("runBenchmark", *args, **kwargs)

def run_build_checks(*args, **kwargs):
    return invoke_source_function("runBuildChecks", *args, **kwargs)

def run_pipeline(*args, **kwargs):
    return invoke_source_function("runPipeline", *args, **kwargs)

def run_probe_benchmark(*args, **kwargs):
    return invoke_source_function("runProbeBenchmark", *args, **kwargs)

def run_security_audit(*args, **kwargs):
    return invoke_source_function("runSecurityAudit", *args, **kwargs)

def run_update_scan(*args, **kwargs):
    return invoke_source_function("runUpdateScan", *args, **kwargs)

def run_wrapper_preflight(*args, **kwargs):
    return invoke_source_function("runWrapperPreflight", *args, **kwargs)

def score_languages(*args, **kwargs):
    return invoke_source_function("scoreLanguages", *args, **kwargs)

def stage_skip(*args, **kwargs):
    return invoke_source_function("stageSkip", *args, **kwargs)

def to_cpp_string_literal(*args, **kwargs):
    return invoke_source_function("toCppStringLiteral", *args, **kwargs)

def to_pascal_case(*args, **kwargs):
    return invoke_source_function("toPascalCase", *args, **kwargs)

def to_python_literal(*args, **kwargs):
    return invoke_source_function("toPythonLiteral", *args, **kwargs)

def to_sorted_unique_array(*args, **kwargs):
    return invoke_source_function("toSortedUniqueArray", *args, **kwargs)

def to_update_scan_ok(*args, **kwargs):
    return invoke_source_function("toUpdateScanOk", *args, **kwargs)

def write_json(*args, **kwargs):
    return invoke_source_function("writeJson", *args, **kwargs)

def write_text(*args, **kwargs):
    return invoke_source_function("writeText", *args, **kwargs)

def write_update_scan_report(*args, **kwargs):
    return invoke_source_function("writeUpdateScanReport", *args, **kwargs)


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
