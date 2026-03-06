#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "main/auth.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "append_auth_runtime_log",
  "can_attempt_login",
  "create_auth_error",
  "create_auth_ok",
  "create_login_error_response",
  "createAccount",
  "ensureAuthenticated",
  "format_quoted_message",
  "getAuthStatus",
  "hashPassword",
  "injectDataIo",
  "isQuickLoginEnabled",
  "load_auth_state",
  "login",
  "logout",
  "lookupDefinitionOnline",
  "now_iso",
  "parseOnlineDefinitionResponse",
  "prune_login_attempts",
  "record_failed_login_attempt",
  "resolve_builtin_account_username",
  "safeCompareHex",
  "save_auth_state",
  "try_quick_login",
  "validate_new_account_credentials"
]
AIO_SYMBOL_MAP = {
  "append_auth_runtime_log": "append_auth_runtime_log",
  "can_attempt_login": "can_attempt_login",
  "create_auth_error": "create_auth_error",
  "create_auth_ok": "create_auth_ok",
  "create_login_error_response": "create_login_error_response",
  "createAccount": "create_account",
  "ensureAuthenticated": "ensure_authenticated",
  "format_quoted_message": "format_quoted_message",
  "getAuthStatus": "get_auth_status",
  "hashPassword": "hash_password",
  "injectDataIo": "inject_data_io",
  "isQuickLoginEnabled": "is_quick_login_enabled",
  "load_auth_state": "load_auth_state",
  "login": "login",
  "logout": "logout",
  "lookupDefinitionOnline": "lookup_definition_online",
  "now_iso": "now_iso",
  "parseOnlineDefinitionResponse": "parse_online_definition_response",
  "prune_login_attempts": "prune_login_attempts",
  "record_failed_login_attempt": "record_failed_login_attempt",
  "resolve_builtin_account_username": "resolve_builtin_account_username",
  "safeCompareHex": "safe_compare_hex",
  "save_auth_state": "save_auth_state",
  "try_quick_login": "try_quick_login",
  "validate_new_account_credentials": "validate_new_account_credentials"
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

def append_auth_runtime_log(*args, **kwargs):
    return invoke_source_function("append_auth_runtime_log", *args, **kwargs)

def can_attempt_login(*args, **kwargs):
    return invoke_source_function("can_attempt_login", *args, **kwargs)

def create_auth_error(*args, **kwargs):
    return invoke_source_function("create_auth_error", *args, **kwargs)

def create_auth_ok(*args, **kwargs):
    return invoke_source_function("create_auth_ok", *args, **kwargs)

def create_login_error_response(*args, **kwargs):
    return invoke_source_function("create_login_error_response", *args, **kwargs)

def create_account(*args, **kwargs):
    return invoke_source_function("createAccount", *args, **kwargs)

def ensure_authenticated(*args, **kwargs):
    return invoke_source_function("ensureAuthenticated", *args, **kwargs)

def format_quoted_message(*args, **kwargs):
    return invoke_source_function("format_quoted_message", *args, **kwargs)

def get_auth_status(*args, **kwargs):
    return invoke_source_function("getAuthStatus", *args, **kwargs)

def hash_password(*args, **kwargs):
    return invoke_source_function("hashPassword", *args, **kwargs)

def inject_data_io(*args, **kwargs):
    return invoke_source_function("injectDataIo", *args, **kwargs)

def is_quick_login_enabled(*args, **kwargs):
    return invoke_source_function("isQuickLoginEnabled", *args, **kwargs)

def load_auth_state(*args, **kwargs):
    return invoke_source_function("load_auth_state", *args, **kwargs)

def login(*args, **kwargs):
    return invoke_source_function("login", *args, **kwargs)

def logout(*args, **kwargs):
    return invoke_source_function("logout", *args, **kwargs)

def lookup_definition_online(*args, **kwargs):
    return invoke_source_function("lookupDefinitionOnline", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("now_iso", *args, **kwargs)

def parse_online_definition_response(*args, **kwargs):
    return invoke_source_function("parseOnlineDefinitionResponse", *args, **kwargs)

def prune_login_attempts(*args, **kwargs):
    return invoke_source_function("prune_login_attempts", *args, **kwargs)

def record_failed_login_attempt(*args, **kwargs):
    return invoke_source_function("record_failed_login_attempt", *args, **kwargs)

def resolve_builtin_account_username(*args, **kwargs):
    return invoke_source_function("resolve_builtin_account_username", *args, **kwargs)

def safe_compare_hex(*args, **kwargs):
    return invoke_source_function("safeCompareHex", *args, **kwargs)

def save_auth_state(*args, **kwargs):
    return invoke_source_function("save_auth_state", *args, **kwargs)

def try_quick_login(*args, **kwargs):
    return invoke_source_function("try_quick_login", *args, **kwargs)

def validate_new_account_credentials(*args, **kwargs):
    return invoke_source_function("validate_new_account_credentials", *args, **kwargs)


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
