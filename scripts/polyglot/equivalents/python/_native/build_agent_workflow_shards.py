#!/usr/bin/env python3
"""Native Python implementation for scripts/build-agent-workflow-shards.js."""

from __future__ import annotations

import json
import pathlib
import sys

from agent_workflow_shards_native import build_shards, ensure_shards_current, is_shards_current, read_shard_index
from project_source_resolver_native import find_project_root


def parse_args(argv: list[str]) -> dict[str, bool]:
    return {
        "check_only": "--check" in argv,
        "force": "--force" in argv,
        "strict": "--no-strict" not in argv,
    }


def build_check_report(root: pathlib.Path) -> dict[str, object]:
    current = is_shards_current(root)
    index = read_shard_index(root)
    return {
        "status": "pass" if current else "fail",
        "mode": "check",
        "root": str(root),
        "shards_current": current,
        "shard_agent_count": len(index.get("agents") or []) if isinstance(index, dict) else 0,
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    root = find_project_root(pathlib.Path.cwd())
    if args["check_only"]:
        report = build_check_report(root)
    elif args["force"]:
        report = {"mode": "build", **build_shards(root)}
    else:
        report = {"mode": "ensure", **ensure_shards_current(root)}
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args["strict"] and report.get("status") != "pass" else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as error:
        sys.stderr.write(f"build-agent-workflow-shards failed: {error}\n")
        raise SystemExit(1)
