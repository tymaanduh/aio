#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/general-workflow.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildOutputFormatSummary",
  "buildOutputFormatTargets",
  "buildPipelineArgs",
  "buildScriptRuntimeReport",
  "buildWorkflowSummary",
  "exitOnFailedStage",
  "main",
  "parseArgs",
  "parseCommandSummary",
  "parseJsonFromCommandOutput",
  "printHelpAndExit",
  "resolveMode",
  "resolveNpxCommand",
  "resolvePrettierCommand",
  "runAgentRegistryValidationStage",
  "runCommand",
  "runEfficiencyStage",
  "runHardGovernanceStage",
  "runOutputFormatStage",
  "runPipelineStage",
  "runPreflightStage",
  "runPruneStage",
  "runRuntimeOptimizationBacklogStage",
  "runSeparationAuditStage",
  "runSwappableScriptStage",
  "runUiuxBlueprintStage",
  "runWrapperContractStage",
  "skippedStage",
  "toRuntimeStageEntry",
  "writeJsonSummary",
  "writeScriptRuntimeReport"
]
AIO_SYMBOL_MAP = {
  "buildOutputFormatSummary": "build_output_format_summary",
  "buildOutputFormatTargets": "build_output_format_targets",
  "buildPipelineArgs": "build_pipeline_args",
  "buildScriptRuntimeReport": "build_script_runtime_report",
  "buildWorkflowSummary": "build_workflow_summary",
  "exitOnFailedStage": "exit_on_failed_stage",
  "main": "main",
  "parseArgs": "parse_args",
  "parseCommandSummary": "parse_command_summary",
  "parseJsonFromCommandOutput": "parse_json_from_command_output",
  "printHelpAndExit": "print_help_and_exit",
  "resolveMode": "resolve_mode",
  "resolveNpxCommand": "resolve_npx_command",
  "resolvePrettierCommand": "resolve_prettier_command",
  "runAgentRegistryValidationStage": "run_agent_registry_validation_stage",
  "runCommand": "run_command",
  "runEfficiencyStage": "run_efficiency_stage",
  "runHardGovernanceStage": "run_hard_governance_stage",
  "runOutputFormatStage": "run_output_format_stage",
  "runPipelineStage": "run_pipeline_stage",
  "runPreflightStage": "run_preflight_stage",
  "runPruneStage": "run_prune_stage",
  "runRuntimeOptimizationBacklogStage": "run_runtime_optimization_backlog_stage",
  "runSeparationAuditStage": "run_separation_audit_stage",
  "runSwappableScriptStage": "run_swappable_script_stage",
  "runUiuxBlueprintStage": "run_uiux_blueprint_stage",
  "runWrapperContractStage": "run_wrapper_contract_stage",
  "skippedStage": "skipped_stage",
  "toRuntimeStageEntry": "to_runtime_stage_entry",
  "writeJsonSummary": "write_json_summary",
  "writeScriptRuntimeReport": "write_script_runtime_report"
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

def build_output_format_summary(*args, **kwargs):
    return invoke_source_function("buildOutputFormatSummary", *args, **kwargs)

def build_output_format_targets(*args, **kwargs):
    return invoke_source_function("buildOutputFormatTargets", *args, **kwargs)

def build_pipeline_args(*args, **kwargs):
    return invoke_source_function("buildPipelineArgs", *args, **kwargs)

def build_script_runtime_report(*args, **kwargs):
    return invoke_source_function("buildScriptRuntimeReport", *args, **kwargs)

def build_workflow_summary(*args, **kwargs):
    return invoke_source_function("buildWorkflowSummary", *args, **kwargs)

def exit_on_failed_stage(*args, **kwargs):
    return invoke_source_function("exitOnFailedStage", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def parse_command_summary(*args, **kwargs):
    return invoke_source_function("parseCommandSummary", *args, **kwargs)

def parse_json_from_command_output(*args, **kwargs):
    return invoke_source_function("parseJsonFromCommandOutput", *args, **kwargs)

def print_help_and_exit(*args, **kwargs):
    return invoke_source_function("printHelpAndExit", *args, **kwargs)

def resolve_mode(*args, **kwargs):
    return invoke_source_function("resolveMode", *args, **kwargs)

def resolve_npx_command(*args, **kwargs):
    return invoke_source_function("resolveNpxCommand", *args, **kwargs)

def resolve_prettier_command(*args, **kwargs):
    return invoke_source_function("resolvePrettierCommand", *args, **kwargs)

def run_agent_registry_validation_stage(*args, **kwargs):
    return invoke_source_function("runAgentRegistryValidationStage", *args, **kwargs)

def run_command(*args, **kwargs):
    return invoke_source_function("runCommand", *args, **kwargs)

def run_efficiency_stage(*args, **kwargs):
    return invoke_source_function("runEfficiencyStage", *args, **kwargs)

def run_hard_governance_stage(*args, **kwargs):
    return invoke_source_function("runHardGovernanceStage", *args, **kwargs)

def run_output_format_stage(*args, **kwargs):
    return invoke_source_function("runOutputFormatStage", *args, **kwargs)

def run_pipeline_stage(*args, **kwargs):
    return invoke_source_function("runPipelineStage", *args, **kwargs)

def run_preflight_stage(*args, **kwargs):
    return invoke_source_function("runPreflightStage", *args, **kwargs)

def run_prune_stage(*args, **kwargs):
    return invoke_source_function("runPruneStage", *args, **kwargs)

def run_runtime_optimization_backlog_stage(*args, **kwargs):
    return invoke_source_function("runRuntimeOptimizationBacklogStage", *args, **kwargs)

def run_separation_audit_stage(*args, **kwargs):
    return invoke_source_function("runSeparationAuditStage", *args, **kwargs)

def run_swappable_script_stage(*args, **kwargs):
    return invoke_source_function("runSwappableScriptStage", *args, **kwargs)

def run_uiux_blueprint_stage(*args, **kwargs):
    return invoke_source_function("runUiuxBlueprintStage", *args, **kwargs)

def run_wrapper_contract_stage(*args, **kwargs):
    return invoke_source_function("runWrapperContractStage", *args, **kwargs)

def skipped_stage(*args, **kwargs):
    return invoke_source_function("skippedStage", *args, **kwargs)

def to_runtime_stage_entry(*args, **kwargs):
    return invoke_source_function("toRuntimeStageEntry", *args, **kwargs)

def write_json_summary(*args, **kwargs):
    return invoke_source_function("writeJsonSummary", *args, **kwargs)

def write_script_runtime_report(*args, **kwargs):
    return invoke_source_function("writeScriptRuntimeReport", *args, **kwargs)


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
