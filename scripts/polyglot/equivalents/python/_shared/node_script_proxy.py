#!/usr/bin/env python3
"""Retired compatibility shim for the old Node-backed script proxy."""

from __future__ import annotations


def run_node_script(script_relative_path: str, argv: list[str] | None = None) -> int:
    raise RuntimeError(
        "node_script_proxy.py is retired; regenerate wrappers or use _shared/native_script_runtime.py instead"
    )
