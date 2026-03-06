#!/usr/bin/env python3
"""Native bridge for scripts/lib/routing-policy.js."""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

from project_source_resolver_native import find_project_root
from routing_policy_native import (
    DEFAULT_ROUTING_FILE,
    compact_routing_doc,
    dedupe_case_insensitive,
    normalize_skill_stacks,
    normalize_skills,
    resolve_routing_doc,
    resolve_rule_skills,
    skill_signature,
    upsert_skill_stack,
)


def read_routing_policy(start_dir: pathlib.Path | str | None = None, options: dict[str, Any] | None = None) -> dict[str, Any]:
    opts = dict(options or {})
    root = find_project_root(start_dir or pathlib.Path.cwd())
    rel_path = str(opts.get("routing_file") or DEFAULT_ROUTING_FILE).strip() or DEFAULT_ROUTING_FILE
    routing_path = (root / pathlib.PurePosixPath(rel_path.replace("\\", "/"))).resolve()
    if not routing_path.exists():
        raise RuntimeError(f"missing routing file: {rel_path.replace('\\', '/')}")
    raw_doc = json.loads(routing_path.read_text(encoding="utf8"))
    return {
        "root": root,
        "routing_path": routing_path,
        "doc": resolve_routing_doc(raw_doc),
        "raw_doc": raw_doc,
    }


def main(argv: list[str] | None = None) -> int:
    del argv
    sys.stdout.write(
        json.dumps(
            {
                "status": "pass",
                "module": "routing_policy",
                "exports": [
                    "DEFAULT_ROUTING_FILE",
                    "compact_routing_doc",
                    "dedupe_case_insensitive",
                    "normalize_skill_stacks",
                    "normalize_skills",
                    "read_routing_policy",
                    "resolve_routing_doc",
                    "resolve_rule_skills",
                    "skill_signature",
                    "upsert_skill_stack",
                ],
            },
            indent=2,
        )
        + "\n"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
