#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/sync-agent-skill-scope.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildDefaultPrompt",
  "dedupeCaseInsensitive",
  "ensureAgentYamlScope",
  "ensureHardGovernanceAgentContract",
  "ensureKeywordRule",
  "ensureOpenAiYamlScope",
  "ensurePathRule",
  "ensureSkillMarkdownScope",
  "main",
  "normalizeRuleValue",
  "normalizeSkills",
  "normalizeString",
  "readJson",
  "readText",
  "skillSignature",
  "titleCaseSkillName",
  "updateAgentAccessControlJson",
  "updateAgentsRegistryYaml",
  "updateAgentWorkflowsJson",
  "updateRepeatActionRoutingJson",
  "writeJson",
  "writeText"
]
AIO_SYMBOL_MAP = {
  "buildDefaultPrompt": "build_default_prompt",
  "dedupeCaseInsensitive": "dedupe_case_insensitive",
  "ensureAgentYamlScope": "ensure_agent_yaml_scope",
  "ensureHardGovernanceAgentContract": "ensure_hard_governance_agent_contract",
  "ensureKeywordRule": "ensure_keyword_rule",
  "ensureOpenAiYamlScope": "ensure_open_ai_yaml_scope",
  "ensurePathRule": "ensure_path_rule",
  "ensureSkillMarkdownScope": "ensure_skill_markdown_scope",
  "main": "main",
  "normalizeRuleValue": "normalize_rule_value",
  "normalizeSkills": "normalize_skills",
  "normalizeString": "normalize_string",
  "readJson": "read_json",
  "readText": "read_text",
  "skillSignature": "skill_signature",
  "titleCaseSkillName": "title_case_skill_name",
  "updateAgentAccessControlJson": "update_agent_access_control_json",
  "updateAgentsRegistryYaml": "update_agents_registry_yaml",
  "updateAgentWorkflowsJson": "update_agent_workflows_json",
  "updateRepeatActionRoutingJson": "update_repeat_action_routing_json",
  "writeJson": "write_json",
  "writeText": "write_text"
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

def build_default_prompt(*args, **kwargs):
    return invoke_source_function("buildDefaultPrompt", *args, **kwargs)

def dedupe_case_insensitive(*args, **kwargs):
    return invoke_source_function("dedupeCaseInsensitive", *args, **kwargs)

def ensure_agent_yaml_scope(*args, **kwargs):
    return invoke_source_function("ensureAgentYamlScope", *args, **kwargs)

def ensure_hard_governance_agent_contract(*args, **kwargs):
    return invoke_source_function("ensureHardGovernanceAgentContract", *args, **kwargs)

def ensure_keyword_rule(*args, **kwargs):
    return invoke_source_function("ensureKeywordRule", *args, **kwargs)

def ensure_open_ai_yaml_scope(*args, **kwargs):
    return invoke_source_function("ensureOpenAiYamlScope", *args, **kwargs)

def ensure_path_rule(*args, **kwargs):
    return invoke_source_function("ensurePathRule", *args, **kwargs)

def ensure_skill_markdown_scope(*args, **kwargs):
    return invoke_source_function("ensureSkillMarkdownScope", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_rule_value(*args, **kwargs):
    return invoke_source_function("normalizeRuleValue", *args, **kwargs)

def normalize_skills(*args, **kwargs):
    return invoke_source_function("normalizeSkills", *args, **kwargs)

def normalize_string(*args, **kwargs):
    return invoke_source_function("normalizeString", *args, **kwargs)

def read_json(*args, **kwargs):
    return invoke_source_function("readJson", *args, **kwargs)

def read_text(*args, **kwargs):
    return invoke_source_function("readText", *args, **kwargs)

def skill_signature(*args, **kwargs):
    return invoke_source_function("skillSignature", *args, **kwargs)

def title_case_skill_name(*args, **kwargs):
    return invoke_source_function("titleCaseSkillName", *args, **kwargs)

def update_agent_access_control_json(*args, **kwargs):
    return invoke_source_function("updateAgentAccessControlJson", *args, **kwargs)

def update_agents_registry_yaml(*args, **kwargs):
    return invoke_source_function("updateAgentsRegistryYaml", *args, **kwargs)

def update_agent_workflows_json(*args, **kwargs):
    return invoke_source_function("updateAgentWorkflowsJson", *args, **kwargs)

def update_repeat_action_routing_json(*args, **kwargs):
    return invoke_source_function("updateRepeatActionRoutingJson", *args, **kwargs)

def write_json(*args, **kwargs):
    return invoke_source_function("writeJson", *args, **kwargs)

def write_text(*args, **kwargs):
    return invoke_source_function("writeText", *args, **kwargs)


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
