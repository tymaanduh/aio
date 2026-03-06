#!/usr/bin/env python3
"""Shared runtime for generated repository Python equivalents."""

from __future__ import annotations

import json
import os
import pathlib
import subprocess


def find_repo_root(start_path: pathlib.Path) -> pathlib.Path:
    current = start_path.resolve()
    if current.is_file():
        current = current.parent
    while True:
        if (current / "package.json").exists() and (current / "scripts").exists():
            return current
        parent = current.parent
        if parent == current:
            raise RuntimeError("repository root not found from generated module equivalent")
        current = parent


def _parse_bridge_output(raw_stdout: str) -> dict:
    lines = [line.strip() for line in str(raw_stdout or "").splitlines() if line.strip()]
    for line in reversed(lines):
        try:
            parsed = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(parsed, dict):
            return parsed
    return {}


def _run_bridge(payload: dict) -> dict:
    root = find_repo_root(pathlib.Path(__file__))
    bridge_path = root / "scripts" / "repo-polyglot-module-bridge.js"
    if not bridge_path.exists():
        raise RuntimeError(f"missing bridge script: {bridge_path}")

    node_exec = os.environ.get("AIO_NODE_EXEC", "node")
    completed = subprocess.run(
        [node_exec, str(bridge_path)],
        input=json.dumps(payload),
        capture_output=True,
        text=True,
        cwd=str(root)
    )
    parsed = _parse_bridge_output(completed.stdout)
    if completed.returncode != 0 or not bool(parsed.get("ok", False)):
        detail = str(parsed.get("error", "")).strip()
        stderr = str(completed.stderr or "").strip()
        message = detail or stderr or "bridge execution failed"
        raise RuntimeError(message)
    return parsed


def invoke_js_function(source_js_file: str, function_name: str, args=None, kwargs=None):
    payload = {
        "action": "invoke_function",
        "source_js_file": str(source_js_file),
        "function_name": str(function_name),
        "args": list(args or []),
        "kwargs": dict(kwargs or {})
    }
    response = _run_bridge(payload)
    return response.get("result")


def run_js_entrypoint(source_js_file: str, args=None):
    payload = {
        "action": "run_entrypoint",
        "source_js_file": str(source_js_file),
        "args": [str(item) for item in list(args or [])]
    }
    return _run_bridge(payload)
