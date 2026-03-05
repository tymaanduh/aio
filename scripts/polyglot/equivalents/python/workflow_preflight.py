#!/usr/bin/env python3
"""Auto-generated Python equivalent for scripts/workflow-preflight.js."""

from __future__ import annotations

import importlib.util
import pathlib
import sys


def _load_runner():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "_shared/node_script_proxy.py").resolve()
    spec = importlib.util.spec_from_file_location("aio_node_script_proxy", shared_runner_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load shared runner: {shared_runner_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.run_node_script


if __name__ == "__main__":
    run_node_script = _load_runner()
    raise SystemExit(run_node_script("scripts/workflow-preflight.js", sys.argv[1:]))
