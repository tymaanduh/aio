#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/hard-governance-gate.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "analyze",
  "analyzeAgents",
  "analyzeAutomations",
  "analyzeRouting",
  "buildFutureBlueprintMarkdown",
  "buildRoadmapMarkdown",
  "buildSuggestions",
  "checkRequiredStandardsCatalogs",
  "checkRequiredWorkflowScripts",
  "estimateTokens",
  "issue",
  "main",
  "normalizePathForOutput",
  "normalizeText",
  "parseArgs",
  "parseRRule",
  "readAutomations",
  "readJson",
  "readYaml",
  "runIsoStandardsComplianceSubcheck",
  "runStandardsBaselineSubcheck",
  "runUiuxBlueprintSubcheck",
  "runWorkflowPipelineOrderSubcheck",
  "writeOutputs"
]
AIO_SYMBOL_MAP = {
  "analyze": "analyze",
  "analyzeAgents": "analyze_agents",
  "analyzeAutomations": "analyze_automations",
  "analyzeRouting": "analyze_routing",
  "buildFutureBlueprintMarkdown": "build_future_blueprint_markdown",
  "buildRoadmapMarkdown": "build_roadmap_markdown",
  "buildSuggestions": "build_suggestions",
  "checkRequiredStandardsCatalogs": "check_required_standards_catalogs",
  "checkRequiredWorkflowScripts": "check_required_workflow_scripts",
  "estimateTokens": "estimate_tokens",
  "issue": "issue",
  "main": "main",
  "normalizePathForOutput": "normalize_path_for_output",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "parseRRule": "parse_rrule",
  "readAutomations": "read_automations",
  "readJson": "read_json",
  "readYaml": "read_yaml",
  "runIsoStandardsComplianceSubcheck": "run_iso_standards_compliance_subcheck",
  "runStandardsBaselineSubcheck": "run_standards_baseline_subcheck",
  "runUiuxBlueprintSubcheck": "run_uiux_blueprint_subcheck",
  "runWorkflowPipelineOrderSubcheck": "run_workflow_pipeline_order_subcheck",
  "writeOutputs": "write_outputs"
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

def analyze(*args, **kwargs):
    return invoke_source_function("analyze", *args, **kwargs)

def analyze_agents(*args, **kwargs):
    return invoke_source_function("analyzeAgents", *args, **kwargs)

def analyze_automations(*args, **kwargs):
    return invoke_source_function("analyzeAutomations", *args, **kwargs)

def analyze_routing(*args, **kwargs):
    return invoke_source_function("analyzeRouting", *args, **kwargs)

def build_future_blueprint_markdown(*args, **kwargs):
    return invoke_source_function("buildFutureBlueprintMarkdown", *args, **kwargs)

def build_roadmap_markdown(*args, **kwargs):
    return invoke_source_function("buildRoadmapMarkdown", *args, **kwargs)

def build_suggestions(*args, **kwargs):
    return invoke_source_function("buildSuggestions", *args, **kwargs)

def check_required_standards_catalogs(*args, **kwargs):
    return invoke_source_function("checkRequiredStandardsCatalogs", *args, **kwargs)

def check_required_workflow_scripts(*args, **kwargs):
    return invoke_source_function("checkRequiredWorkflowScripts", *args, **kwargs)

def estimate_tokens(*args, **kwargs):
    return invoke_source_function("estimateTokens", *args, **kwargs)

def issue(*args, **kwargs):
    return invoke_source_function("issue", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_path_for_output(*args, **kwargs):
    return invoke_source_function("normalizePathForOutput", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def parse_rrule(*args, **kwargs):
    return invoke_source_function("parseRRule", *args, **kwargs)

def read_automations(*args, **kwargs):
    return invoke_source_function("readAutomations", *args, **kwargs)

def read_json(*args, **kwargs):
    return invoke_source_function("readJson", *args, **kwargs)

def read_yaml(*args, **kwargs):
    return invoke_source_function("readYaml", *args, **kwargs)

def run_iso_standards_compliance_subcheck(*args, **kwargs):
    return invoke_source_function("runIsoStandardsComplianceSubcheck", *args, **kwargs)

def run_standards_baseline_subcheck(*args, **kwargs):
    return invoke_source_function("runStandardsBaselineSubcheck", *args, **kwargs)

def run_uiux_blueprint_subcheck(*args, **kwargs):
    return invoke_source_function("runUiuxBlueprintSubcheck", *args, **kwargs)

def run_workflow_pipeline_order_subcheck(*args, **kwargs):
    return invoke_source_function("runWorkflowPipelineOrderSubcheck", *args, **kwargs)

def write_outputs(*args, **kwargs):
    return invoke_source_function("writeOutputs", *args, **kwargs)


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
