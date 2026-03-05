#!/usr/bin/env python3
"""Shared runtime for generated Python equivalents of Node script entrypoints."""

from __future__ import annotations

import os
import pathlib
import subprocess
import sys


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


def run_node_script(script_relative_path: str, argv: list[str] | None = None) -> int:
    args = list(argv or [])
    root = find_repo_root(pathlib.Path(__file__))
    script_path = root / pathlib.PurePosixPath(script_relative_path)
    if not script_path.exists():
        sys.stderr.write(f"missing script target: {script_path}\\n")
        return 1
    node_exec = os.environ.get("AIO_NODE_EXEC", "node")
    completed = subprocess.run([node_exec, str(script_path), *args], cwd=str(root))
    return int(completed.returncode)
