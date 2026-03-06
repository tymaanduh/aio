#!/usr/bin/env python3
"""Native module bridge for scripts/project-source-resolver.js."""

from __future__ import annotations

import json
import pathlib
import sys

from project_source_resolver_native import (
    DEFAULT_IGNORE_DIRS,
    find_project_root,
    list_matching_files,
    resolve_agent_access_control,
    resolve_request_log_file,
    resolve_update_log_paths,
)


def parse_args(argv: list[str]) -> dict[str, object]:
    return {
        "start_dir": str(argv[argv.index("--start-dir") + 1]).strip() if "--start-dir" in argv and argv.index("--start-dir") + 1 < len(argv) else "",
        "agent_access_control": "--agent-access-control" in argv,
        "request_log": "--request-log" in argv,
        "update_logs": "--update-logs" in argv,
        "match_file": str(argv[argv.index("--match-file") + 1]).strip() if "--match-file" in argv and argv.index("--match-file") + 1 < len(argv) else "",
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    root = find_project_root(pathlib.Path(args["start_dir"] or pathlib.Path.cwd()))
    payload: dict[str, object] = {
        "status": "pass",
        "root": str(root),
        "default_ignore_dirs": list(DEFAULT_IGNORE_DIRS),
    }

    if args["agent_access_control"] or args["request_log"] or args["update_logs"]:
        resolved = resolve_agent_access_control(root)
        payload["agent_access_control"] = {
            "policy_path": str(pathlib.Path(resolved["policy_path"]).relative_to(root)).replace("\\", "/"),
            "agent_count": len((resolved.get("policy") or {}).get("agents") or []),
        }
        if args["request_log"]:
            request_log = resolve_request_log_file(pathlib.Path(resolved["root"]), pathlib.Path(resolved["policy_path"]), dict(resolved["policy"] or {}))
            payload["request_log_file"] = str(pathlib.Path(request_log).relative_to(root)).replace("\\", "/")
        if args["update_logs"]:
            update_logs = resolve_update_log_paths(pathlib.Path(resolved["root"]), pathlib.Path(resolved["policy_path"]), dict(resolved["policy"] or {}))
            payload["update_logs"] = {key: str(pathlib.Path(value).relative_to(root)).replace("\\", "/") for key, value in update_logs.items()}
    if args["match_file"]:
        payload["matches"] = [str(path.relative_to(root)).replace("\\", "/") for path in list_matching_files(root, str(args["match_file"]))]

    sys.stdout.write(f"{json.dumps(payload, indent=2)}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
