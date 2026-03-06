#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/dx12-tools.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "detectVisualStudioInstallPath",
  "existsExecutable",
  "firstExisting",
  "getMakePath",
  "getMingwCompilers",
  "getNativeLinuxCmakePath",
  "getWindowsPowershellPath",
  "isWsl",
  "runCommand"
]
AIO_SYMBOL_MAP = {
  "detectVisualStudioInstallPath": "detect_visual_studio_install_path",
  "existsExecutable": "exists_executable",
  "firstExisting": "first_existing",
  "getMakePath": "get_make_path",
  "getMingwCompilers": "get_mingw_compilers",
  "getNativeLinuxCmakePath": "get_native_linux_cmake_path",
  "getWindowsPowershellPath": "get_windows_powershell_path",
  "isWsl": "is_wsl",
  "runCommand": "run_command"
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

def detect_visual_studio_install_path(*args, **kwargs):
    return invoke_source_function("detectVisualStudioInstallPath", *args, **kwargs)

def exists_executable(*args, **kwargs):
    return invoke_source_function("existsExecutable", *args, **kwargs)

def first_existing(*args, **kwargs):
    return invoke_source_function("firstExisting", *args, **kwargs)

def get_make_path(*args, **kwargs):
    return invoke_source_function("getMakePath", *args, **kwargs)

def get_mingw_compilers(*args, **kwargs):
    return invoke_source_function("getMingwCompilers", *args, **kwargs)

def get_native_linux_cmake_path(*args, **kwargs):
    return invoke_source_function("getNativeLinuxCmakePath", *args, **kwargs)

def get_windows_powershell_path(*args, **kwargs):
    return invoke_source_function("getWindowsPowershellPath", *args, **kwargs)

def is_wsl(*args, **kwargs):
    return invoke_source_function("isWsl", *args, **kwargs)

def run_command(*args, **kwargs):
    return invoke_source_function("runCommand", *args, **kwargs)


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
