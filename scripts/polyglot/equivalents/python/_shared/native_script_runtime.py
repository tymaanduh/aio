#!/usr/bin/env python3
"""Shared runtime for generated Python script equivalents."""

from __future__ import annotations

import importlib.util
import os
import pathlib
import subprocess
import sys

ALLOW_JS_FALLBACK_ENV = "AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK"


def normalize_path(value: str) -> str:
    return str(value or "").replace('\\', '/')


def parse_truthy(value: str) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


def to_snake_case_base_name(file_name: str) -> str:
    return str(file_name or "").replace('.js', '').replace('-', '_')


def find_repo_root(start_path: pathlib.Path) -> pathlib.Path:
    current = start_path.resolve()
    if current.is_file():
        current = current.parent
    while True:
        if (current / "package.json").exists() and (current / "scripts").exists():
            return current
        parent = current.parent
        if parent == current:
            raise RuntimeError("repository root not found from generated script equivalent")
        current = parent


def script_relative_to_native_impl_relative(script_relative_path: str) -> pathlib.PurePosixPath:
    source = pathlib.PurePosixPath(normalize_path(script_relative_path))
    parts = list(source.parts)
    if parts and parts[0] == "scripts":
        parts = parts[1:]
    if not parts:
        raise RuntimeError("script_relative_path is required")
    file_name = parts.pop()
    return pathlib.PurePosixPath("_native", *parts, f"{to_snake_case_base_name(file_name)}.py")


def run_node_compat(script_relative_path: str, argv: list[str] | None = None) -> int:
    args = list(argv or [])
    root = find_repo_root(pathlib.Path(__file__))
    script_path = root / pathlib.PurePosixPath(script_relative_path)
    if not script_path.exists():
        sys.stderr.write(f"missing script target: {script_path}\\n")
        return 1
    node_exec = os.environ.get("AIO_NODE_EXEC", "node")
    env = {**os.environ, "AIO_PYTHON_EXEC": os.environ.get("AIO_PYTHON_EXEC", sys.executable)}
    completed = subprocess.run([node_exec, str(script_path), *args], cwd=str(root), env=env)
    return int(completed.returncode)


def load_native_module(script_relative_path: str):
    root = find_repo_root(pathlib.Path(__file__))
    equivalents_root = root / pathlib.PurePosixPath("scripts/polyglot/equivalents/python")
    native_root = equivalents_root / "_native"
    native_impl_path = equivalents_root / script_relative_to_native_impl_relative(script_relative_path)
    if not native_impl_path.exists():
        return None
    native_root_text = str(native_root)
    if native_root_text not in sys.path:
        sys.path.insert(0, native_root_text)
    module_name = "aio_native_script_" + normalize_path(script_relative_path).replace('/', '_').replace('.', '_').replace('-', '_')
    spec = importlib.util.spec_from_file_location(module_name, native_impl_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load native script implementation: {native_impl_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run_native_script(script_relative_path: str, argv: list[str] | None = None) -> int:
    module = load_native_module(script_relative_path)
    if module is not None:
        entrypoint = getattr(module, "main", None) or getattr(module, "run", None) or getattr(module, "run_native", None)
        if not callable(entrypoint):
            raise RuntimeError(f"native implementation missing main()/run() entrypoint for {script_relative_path}")
        result = entrypoint(list(argv or []))
        return int(result or 0)
    allow_fallback = ALLOW_JS_FALLBACK_ENV not in os.environ or parse_truthy(os.environ.get(ALLOW_JS_FALLBACK_ENV, "1"))
    if allow_fallback:
        return run_node_compat(script_relative_path, argv)
    sys.stderr.write(f"native Python equivalent not implemented for {script_relative_path} and JS fallback is disabled\\n")
    return 1
