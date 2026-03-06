#!/usr/bin/env python3
"""Native Python implementation for scripts/repo-update-log.js."""

from __future__ import annotations

import hashlib
import json
import os
import pathlib
import signal
import sys
import time
import uuid
from datetime import UTC, datetime
from typing import Any

from _common import normalize_path, write_text_file_robust
from project_source_resolver_native import (
    DEFAULT_IGNORE_DIRS,
    find_project_root,
    resolve_agent_access_control,
    resolve_update_log_paths,
)

RUNTIME: dict[str, Any] = {
    "root": pathlib.Path(),
    "policy_path": pathlib.Path(),
    "events_log_file": pathlib.Path(),
    "session_log_file": pathlib.Path(),
    "state_file": pathlib.Path(),
    "ignored_paths": [],
}


def now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def create_event_id() -> str:
    return f"evt_{uuid.uuid4()}"


def print_help_and_exit(code: int) -> None:
    help_text = "\n".join(
        [
            "repo-update-log",
            "",
            "Usage:",
            "  npm run updates:scan -- [options]",
            "  npm run updates:watch -- [options]",
            "",
            "Commands:",
            "  scan   Compare current project state to previous snapshot and log file changes",
            "  watch  Watch project scope for real-time file update events",
            "",
            "Options:",
            "  --actor <id>             Actor tag for events (default: system)",
            "  --scope <text>           Scope/reason tag for scan mode",
            "  --session-id <id>        Explicit session id (watch mode)",
            "  --help                   Show help",
        ]
    )
    sys.stdout.write(f"{help_text}\n")
    raise SystemExit(code)


def parse_args(argv: list[str]) -> dict[str, str]:
    if not argv or "--help" in argv or "-h" in argv:
        print_help_and_exit(0)
    args = {"command": str(argv[0] or "").strip().lower(), "actor": "system", "scope": "", "session_id": ""}
    index = 1
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--actor":
            args["actor"] = str(argv[index + 1] or "").strip() or "system"
            index += 2
            continue
        if token == "--scope":
            args["scope"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--session-id":
            args["session_id"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        raise RuntimeError(f"unknown argument: {token}")
    if args["command"] not in {"scan", "watch"}:
        raise RuntimeError("first argument must be one of: scan, watch")
    return args


def ensure_dir(dir_path: pathlib.Path) -> None:
    dir_path.mkdir(parents=True, exist_ok=True)


def unique(values: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for value in values:
        key = str(value or "")
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(key)
    return out


def configure_runtime() -> None:
    root = find_project_root(pathlib.Path.cwd())
    policy_path = pathlib.Path()
    update_log_paths: dict[str, pathlib.Path]
    try:
        resolved = resolve_agent_access_control(root)
        root = resolved["root"]
        policy_path = resolved["policy_path"]
        update_log_paths = resolve_update_log_paths(root, policy_path, resolved["policy"])
    except Exception:
        fallback_dir = root / "data" / "logs" / "change-log"
        update_log_paths = {
            "events_file": fallback_dir / "update_events.ndjson",
            "sessions_file": fallback_dir / "sessions.ndjson",
            "state_file": fallback_dir / "state_snapshot.json",
        }

    RUNTIME["root"] = root
    RUNTIME["policy_path"] = policy_path
    RUNTIME["events_log_file"] = update_log_paths["events_file"]
    RUNTIME["session_log_file"] = update_log_paths["sessions_file"]
    RUNTIME["state_file"] = update_log_paths["state_file"]
    derived_ignored = [
        *DEFAULT_IGNORE_DIRS,
        normalize_path(update_log_paths["events_file"].parent.relative_to(root)),
        normalize_path(update_log_paths["sessions_file"].parent.relative_to(root)),
        normalize_path(update_log_paths["state_file"].parent.relative_to(root)),
    ]
    RUNTIME["ignored_paths"] = [entry for entry in unique(derived_ignored) if entry and entry != "."]


def ensure_log_paths() -> None:
    ensure_dir(RUNTIME["events_log_file"].parent)
    ensure_dir(RUNTIME["session_log_file"].parent)
    if not RUNTIME["events_log_file"].exists():
        RUNTIME["events_log_file"].write_text("", encoding="utf8")
    if not RUNTIME["session_log_file"].exists():
        RUNTIME["session_log_file"].write_text("", encoding="utf8")


def to_relative_path(file_path: pathlib.Path) -> str:
    return normalize_path(file_path.relative_to(RUNTIME["root"]))


def is_ignored(relative_path: str) -> bool:
    rel = normalize_path(relative_path or "")
    if not rel or rel == ".":
        return False
    return any(rel == ignore_path or rel.startswith(f"{ignore_path}/") for ignore_path in RUNTIME["ignored_paths"])


def create_file_hash(file_path: pathlib.Path) -> str:
    return hashlib.sha256(file_path.read_bytes()).hexdigest()


def file_snapshot(file_path: pathlib.Path) -> dict[str, Any] | None:
    if not file_path.exists() or not file_path.is_file():
        return None
    stat = file_path.stat()
    return {
        "size_bytes": stat.st_size,
        "mtime_ms": round(stat.st_mtime_ns / 1_000_000.0, 3),
        "hash": create_file_hash(file_path),
    }


def scan_file_state() -> dict[str, dict[str, Any]]:
    state: dict[str, dict[str, Any]] = {}
    stack = [RUNTIME["root"]]
    while stack:
        current_dir = stack.pop()
        try:
            entries = list(current_dir.iterdir())
        except PermissionError:
            continue
        for entry in entries:
            rel = to_relative_path(entry)
            if is_ignored(rel):
                continue
            if entry.is_dir():
                stack.append(entry)
                continue
            if not entry.is_file():
                continue
            snapshot = file_snapshot(entry)
            if snapshot is not None:
                state[rel] = snapshot
    return state


def read_state() -> dict[str, Any]:
    state_file = RUNTIME["state_file"]
    if not state_file.exists():
        return {"files": {}, "updated_at": None}
    try:
        parsed = json.loads(state_file.read_text(encoding="utf8"))
    except Exception:
        return {"files": {}, "updated_at": None}
    return {
        "files": parsed.get("files") if isinstance(parsed.get("files"), dict) else {},
        "updated_at": parsed.get("updated_at"),
    }


def write_state(file_map: dict[str, Any]) -> None:
    payload = {
        "updated_at": now_iso(),
        "file_count": len(file_map),
        "files": file_map,
    }
    write_text_file_robust(RUNTIME["state_file"], f"{json.dumps(payload, indent=2)}\n", atomic=False)


def append_ndjson(file_path: pathlib.Path, payload: dict[str, Any]) -> None:
    ensure_dir(file_path.parent)
    with file_path.open("a", encoding="utf8") as handle:
        handle.write(f"{json.dumps(payload)}\n")


def classify_diffs(previous_files: dict[str, Any], current_files: dict[str, Any]) -> list[dict[str, Any]]:
    all_paths = sorted(set(previous_files.keys()) | set(current_files.keys()))
    diffs: list[dict[str, Any]] = []
    for rel_path in all_paths:
        before = previous_files.get(rel_path)
        after = current_files.get(rel_path)
        if before is None and after is not None:
            diffs.append({"change_type": "file_created", "path": rel_path, "before": None, "after": after})
            continue
        if before is not None and after is None:
            diffs.append({"change_type": "file_deleted", "path": rel_path, "before": before, "after": None})
            continue
        if before != after:
            diffs.append({"change_type": "file_updated", "path": rel_path, "before": before, "after": after})
    return diffs


def run_scan_mode(args: dict[str, str]) -> int:
    ensure_log_paths()
    started_at_ms = int(time.time() * 1000)
    started_at = now_iso()
    previous_state = read_state()
    current_files = scan_file_state()
    diffs = classify_diffs(previous_state.get("files") or {}, current_files)
    event_rows = []
    for index, diff in enumerate(diffs, start=1):
        event_rows.append(
            {
                "event_id": create_event_id(),
                "event_at": now_iso(),
                "actor": args["actor"],
                "source": "scan",
                "scope": args["scope"] or "unspecified",
                "change_type": diff["change_type"],
                "path": diff["path"],
                "elapsed_ms_from_scan_start": int(time.time() * 1000) - started_at_ms,
                "before": diff["before"],
                "after": diff["after"],
                "diff_index": index,
            }
        )
    for row in event_rows:
        append_ndjson(RUNTIME["events_log_file"], row)
    write_state(current_files)
    finished_at = now_iso()
    duration_ms = int(time.time() * 1000) - started_at_ms
    summary = {
        "session_id": create_event_id().replace("evt_", "scan_"),
        "mode": "scan",
        "actor": args["actor"],
        "scope": args["scope"] or "unspecified",
        "started_at": started_at,
        "finished_at": finished_at,
        "duration_ms": duration_ms,
        "changes_total": len(event_rows),
        "changed_paths": [row["path"] for row in event_rows],
    }
    append_ndjson(RUNTIME["session_log_file"], summary)
    sys.stdout.write(f"{json.dumps(summary, indent=2)}\n")
    return 0


def run_watch_mode(args: dict[str, str]) -> int:
    ensure_log_paths()
    started_at_ms = int(time.time() * 1000)
    started_at = now_iso()
    session_id = args["session_id"] or create_event_id().replace("evt_", "watch_")
    known_state = scan_file_state()
    write_state(known_state)
    append_ndjson(
        RUNTIME["session_log_file"],
        {
            "session_id": session_id,
            "mode": "watch",
            "actor": args["actor"],
            "started_at": started_at,
            "status": "started",
            "watcher_count": 1,
        },
    )
    sys.stdout.write(
        f"{json.dumps({'ok': True, 'mode': 'watch', 'session_id': session_id, 'actor': args['actor'], 'project_root': str(RUNTIME['root']), 'policy_file': str(RUNTIME['policy_path']) if str(RUNTIME['policy_path']) else None, 'watcher_count': 1, 'events_file': normalize_path(RUNTIME['events_log_file'].relative_to(RUNTIME['root'])), 'sessions_file': normalize_path(RUNTIME['session_log_file'].relative_to(RUNTIME['root']))}, indent=2)}\n"
    )
    stop_requested = False

    def request_stop(*_: Any) -> None:
        nonlocal stop_requested
        stop_requested = True

    signal.signal(signal.SIGINT, request_stop)
    signal.signal(signal.SIGTERM, request_stop)
    try:
        while not stop_requested:
            time.sleep(0.25)
            current_state = scan_file_state()
            diffs = classify_diffs(known_state, current_state)
            if not diffs:
                continue
            for diff in diffs:
                append_ndjson(
                    RUNTIME["events_log_file"],
                    {
                        "event_id": create_event_id(),
                        "event_at": now_iso(),
                        "actor": args["actor"],
                        "source": "watch",
                        "session_id": session_id,
                        "change_type": diff["change_type"],
                        "path": diff["path"],
                        "elapsed_ms_from_session_start": int(time.time() * 1000) - started_at_ms,
                        "before": diff["before"],
                        "after": diff["after"],
                    },
                )
            known_state = current_state
            write_state(known_state)
    finally:
        write_state(known_state)
        append_ndjson(
            RUNTIME["session_log_file"],
            {
                "session_id": session_id,
                "mode": "watch",
                "actor": args["actor"],
                "started_at": started_at,
                "finished_at": now_iso(),
                "duration_ms": int(time.time() * 1000) - started_at_ms,
                "status": "stopped",
                "signal": "SIGINT" if stop_requested else "exit",
            },
        )
    return 0


def main(argv: list[str] | None = None) -> int:
    configure_runtime()
    args = parse_args(argv or [])
    if args["command"] == "scan":
        return run_scan_mode(args)
    return run_watch_mode(args)


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except Exception as error:
        sys.stderr.write(f"repo-update-log failed: {error}\n")
        raise SystemExit(1)
