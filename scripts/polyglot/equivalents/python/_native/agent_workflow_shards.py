#!/usr/bin/env python3
"""Native module bridge for scripts/agent-workflow-shards.js."""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

from agent_workflow_shards_native import (
    CANONICAL_RELATIVE_PATH,
    SHARD_AGENTS_RELATIVE_PATH,
    SHARD_INDEX_RELATIVE_PATH,
    SHARD_ROOT_RELATIVE_PATH,
    build_shards,
    ensure_shards_current,
    is_shards_current,
    read_shard_index,
    read_workflow_doc,
)
from project_source_resolver_native import find_project_root


def parse_args(argv: list[str]) -> dict[str, Any]:
    return {
        "check": "--check" in argv,
        "build": "--build" in argv,
        "force": "--force" in argv,
        "canonical": "--canonical" in argv,
    }


def build_cli_report(root: pathlib.Path, args: dict[str, Any]) -> dict[str, Any]:
    if args["check"]:
        index = read_shard_index(root)
        current = is_shards_current(root)
        return {
            "status": "pass" if current else "fail",
            "mode": "check",
            "root": str(root),
            "canonical": str(CANONICAL_RELATIVE_PATH),
            "shard_root": str(SHARD_ROOT_RELATIVE_PATH),
            "shard_index": str(SHARD_INDEX_RELATIVE_PATH),
            "shard_agents_root": str(SHARD_AGENTS_RELATIVE_PATH),
            "shards_current": current,
            "shard_agent_count": len(index.get("agents") or []) if isinstance(index, dict) else 0,
        }
    if args["build"]:
        return {"mode": "build", **build_shards(root)}
    workflow = read_workflow_doc(root, prefer_shards=not args["canonical"], ensure_current=args["force"])
    return {
        "status": "pass",
        "mode": "load",
        "root": str(root),
        "source": workflow.get("source"),
        "agent_count": len((workflow.get("doc") or {}).get("agents") or []),
        "agent_ids": workflow.get("agent_ids") or [],
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    root = find_project_root(pathlib.Path.cwd())
    report = build_cli_report(root, args)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if report.get("status") != "pass" and args["check"] else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except Exception as error:
        sys.stderr.write(f"agent-workflow-shards failed: {error}\n")
        raise SystemExit(1)
