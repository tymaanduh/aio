#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "main/gpu_config.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "append_gpu_switch",
  "apply_gpu_disabled_state",
  "configure_gpu_performance_switches",
  "configure_non_windows_gpu_switches",
  "configure_windows_gpu_switches",
  "configureGpuMode",
  "disable_hardware_acceleration",
  "getGpuDiagnostics",
  "getGpuState",
  "incrementGpuCrashCount",
  "normalize_gpu_token",
  "normalizeOptionalToken"
]
AIO_SYMBOL_MAP = {
  "append_gpu_switch": "append_gpu_switch",
  "apply_gpu_disabled_state": "apply_gpu_disabled_state",
  "configure_gpu_performance_switches": "configure_gpu_performance_switches",
  "configure_non_windows_gpu_switches": "configure_non_windows_gpu_switches",
  "configure_windows_gpu_switches": "configure_windows_gpu_switches",
  "configureGpuMode": "configure_gpu_mode",
  "disable_hardware_acceleration": "disable_hardware_acceleration",
  "getGpuDiagnostics": "get_gpu_diagnostics",
  "getGpuState": "get_gpu_state",
  "incrementGpuCrashCount": "increment_gpu_crash_count",
  "normalize_gpu_token": "normalize_gpu_token",
  "normalizeOptionalToken": "normalize_optional_token"
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

def append_gpu_switch(*args, **kwargs):
    return invoke_source_function("append_gpu_switch", *args, **kwargs)

def apply_gpu_disabled_state(*args, **kwargs):
    return invoke_source_function("apply_gpu_disabled_state", *args, **kwargs)

def configure_gpu_performance_switches(*args, **kwargs):
    return invoke_source_function("configure_gpu_performance_switches", *args, **kwargs)

def configure_non_windows_gpu_switches(*args, **kwargs):
    return invoke_source_function("configure_non_windows_gpu_switches", *args, **kwargs)

def configure_windows_gpu_switches(*args, **kwargs):
    return invoke_source_function("configure_windows_gpu_switches", *args, **kwargs)

def configure_gpu_mode(*args, **kwargs):
    return invoke_source_function("configureGpuMode", *args, **kwargs)

def disable_hardware_acceleration(*args, **kwargs):
    return invoke_source_function("disable_hardware_acceleration", *args, **kwargs)

def get_gpu_diagnostics(*args, **kwargs):
    return invoke_source_function("getGpuDiagnostics", *args, **kwargs)

def get_gpu_state(*args, **kwargs):
    return invoke_source_function("getGpuState", *args, **kwargs)

def increment_gpu_crash_count(*args, **kwargs):
    return invoke_source_function("incrementGpuCrashCount", *args, **kwargs)

def normalize_gpu_token(*args, **kwargs):
    return invoke_source_function("normalize_gpu_token", *args, **kwargs)

def normalize_optional_token(*args, **kwargs):
    return invoke_source_function("normalizeOptionalToken", *args, **kwargs)


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
