#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/modules/function_templates_utils.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "add",
  "assertReturnType",
  "cloneValue",
  "createControlTemplate",
  "createIoTemplate",
  "createTemplateFunction",
  "createTemplateRegistry",
  "fn",
  "get",
  "has",
  "isPlainObject",
  "isTypeMatch",
  "list",
  "materializeInputs",
  "normalizeArgs",
  "normalizeArgSpec",
  "normalizeReturnSpec",
  "normalizeStep",
  "normalizeText",
  "run",
  "templateExecutor",
  "typeOfValue"
]
AIO_SYMBOL_MAP = {
  "add": "add",
  "assertReturnType": "assert_return_type",
  "cloneValue": "clone_value",
  "createControlTemplate": "create_control_template",
  "createIoTemplate": "create_io_template",
  "createTemplateFunction": "create_template_function",
  "createTemplateRegistry": "create_template_registry",
  "fn": "fn",
  "get": "get",
  "has": "has",
  "isPlainObject": "is_plain_object",
  "isTypeMatch": "is_type_match",
  "list": "list",
  "materializeInputs": "materialize_inputs",
  "normalizeArgs": "normalize_args",
  "normalizeArgSpec": "normalize_arg_spec",
  "normalizeReturnSpec": "normalize_return_spec",
  "normalizeStep": "normalize_step",
  "normalizeText": "normalize_text",
  "run": "run",
  "templateExecutor": "template_executor",
  "typeOfValue": "type_of_value"
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

def add(*args, **kwargs):
    return invoke_source_function("add", *args, **kwargs)

def assert_return_type(*args, **kwargs):
    return invoke_source_function("assertReturnType", *args, **kwargs)

def clone_value(*args, **kwargs):
    return invoke_source_function("cloneValue", *args, **kwargs)

def create_control_template(*args, **kwargs):
    return invoke_source_function("createControlTemplate", *args, **kwargs)

def create_io_template(*args, **kwargs):
    return invoke_source_function("createIoTemplate", *args, **kwargs)

def create_template_function(*args, **kwargs):
    return invoke_source_function("createTemplateFunction", *args, **kwargs)

def create_template_registry(*args, **kwargs):
    return invoke_source_function("createTemplateRegistry", *args, **kwargs)

def fn(*args, **kwargs):
    return invoke_source_function("fn", *args, **kwargs)

def get(*args, **kwargs):
    return invoke_source_function("get", *args, **kwargs)

def has(*args, **kwargs):
    return invoke_source_function("has", *args, **kwargs)

def is_plain_object(*args, **kwargs):
    return invoke_source_function("isPlainObject", *args, **kwargs)

def is_type_match(*args, **kwargs):
    return invoke_source_function("isTypeMatch", *args, **kwargs)

def list(*args, **kwargs):
    return invoke_source_function("list", *args, **kwargs)

def materialize_inputs(*args, **kwargs):
    return invoke_source_function("materializeInputs", *args, **kwargs)

def normalize_args(*args, **kwargs):
    return invoke_source_function("normalizeArgs", *args, **kwargs)

def normalize_arg_spec(*args, **kwargs):
    return invoke_source_function("normalizeArgSpec", *args, **kwargs)

def normalize_return_spec(*args, **kwargs):
    return invoke_source_function("normalizeReturnSpec", *args, **kwargs)

def normalize_step(*args, **kwargs):
    return invoke_source_function("normalizeStep", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def run(*args, **kwargs):
    return invoke_source_function("run", *args, **kwargs)

def template_executor(*args, **kwargs):
    return invoke_source_function("templateExecutor", *args, **kwargs)

def type_of_value(*args, **kwargs):
    return invoke_source_function("typeOfValue", *args, **kwargs)


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
