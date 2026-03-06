#!/usr/bin/env python3
"""Auto-generated Python equivalent for scripts/repo-polyglot-module-bridge.js."""

from __future__ import annotations

import importlib.util
import pathlib
import sys


def _load_runtime():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "_shared/native_script_runtime.py").resolve()
    spec = importlib.util.spec_from_file_location("aio_native_script_runtime", shared_runner_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load shared runtime: {shared_runner_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.run_native_script


if __name__ == "__main__":
    run_native_script = _load_runtime()
    raise SystemExit(run_native_script("scripts/repo-polyglot-module-bridge.js", sys.argv[1:]))
