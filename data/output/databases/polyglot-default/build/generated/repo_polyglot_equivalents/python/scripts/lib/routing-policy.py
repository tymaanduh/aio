#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/lib/routing-policy.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "compactRoutingDoc",
  "dedupeCaseInsensitive",
  "normalizeSkills",
  "normalizeSkillStacks",
  "normalizeText",
  "readRoutingPolicy",
  "resolveRoutingDoc",
  "resolveRuleSkills",
  "skillSignature",
  "stableStackId",
  "upsertSkillStack"
]
AIO_SYMBOL_MAP = {
  "compactRoutingDoc": "compact_routing_doc",
  "dedupeCaseInsensitive": "dedupe_case_insensitive",
  "normalizeSkills": "normalize_skills",
  "normalizeSkillStacks": "normalize_skill_stacks",
  "normalizeText": "normalize_text",
  "readRoutingPolicy": "read_routing_policy",
  "resolveRoutingDoc": "resolve_routing_doc",
  "resolveRuleSkills": "resolve_rule_skills",
  "skillSignature": "skill_signature",
  "stableStackId": "stable_stack_id",
  "upsertSkillStack": "upsert_skill_stack"
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

def compact_routing_doc(*args, **kwargs):
    return invoke_source_function("compactRoutingDoc", *args, **kwargs)

def dedupe_case_insensitive(*args, **kwargs):
    return invoke_source_function("dedupeCaseInsensitive", *args, **kwargs)

def normalize_skills(*args, **kwargs):
    return invoke_source_function("normalizeSkills", *args, **kwargs)

def normalize_skill_stacks(*args, **kwargs):
    return invoke_source_function("normalizeSkillStacks", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def read_routing_policy(*args, **kwargs):
    return invoke_source_function("readRoutingPolicy", *args, **kwargs)

def resolve_routing_doc(*args, **kwargs):
    return invoke_source_function("resolveRoutingDoc", *args, **kwargs)

def resolve_rule_skills(*args, **kwargs):
    return invoke_source_function("resolveRuleSkills", *args, **kwargs)

def skill_signature(*args, **kwargs):
    return invoke_source_function("skillSignature", *args, **kwargs)

def stable_stack_id(*args, **kwargs):
    return invoke_source_function("stableStackId", *args, **kwargs)

def upsert_skill_stack(*args, **kwargs):
    return invoke_source_function("upsertSkillStack", *args, **kwargs)


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
