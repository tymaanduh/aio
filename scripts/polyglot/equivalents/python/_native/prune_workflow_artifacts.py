#!/usr/bin/env python3
"""Native Python implementation for scripts/prune-workflow-artifacts.js."""

from __future__ import annotations

import json
import pathlib
import shutil
import sys
from typing import Any

from _common import find_repo_root, normalize_path
from project_source_resolver_native import resolve_agent_access_control, resolve_update_log_paths

DEFAULT_OUT_DIR = pathlib.PurePosixPath("data/output/databases/polyglot-default")
PYTHON_CACHE_DIR_NAME = "__pycache__"
TEMP_FILE_SUFFIXES = (".tmp", ".temp", ".bak", ".old", ".orig", ".rej")
BENCHMARK_TEMP_DIR_PREFIX = "aio-polyglot-bench-"


def parse_args(argv: list[str]) -> dict[str, Any]:
    args = {
        "strict": "--no-strict" not in argv,
        "dry_run": "--dry-run" in argv,
        "out_dir": str(DEFAULT_OUT_DIR),
        "skip_log_prune": "--skip-log-prune" in argv,
        "skip_cache_prune": "--skip-cache-prune" in argv,
        "sessions_max_lines": 2000,
        "events_max_lines": 5000,
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--out-dir" and index + 1 < len(argv):
            args["out_dir"] = str(argv[index + 1] or "").strip() or str(DEFAULT_OUT_DIR)
            index += 2
            continue
        if token == "--sessions-max-lines" and index + 1 < len(argv):
            args["sessions_max_lines"] = int(argv[index + 1] or 2000)
            index += 2
            continue
        if token == "--events-max-lines" and index + 1 < len(argv):
            args["events_max_lines"] = int(argv[index + 1] or 5000)
            index += 2
            continue
        index += 1
    return args


def to_rel(root: pathlib.Path, absolute_path: pathlib.Path) -> str:
    return normalize_path(absolute_path.relative_to(root))


def collect_directories_by_name(start_dir: pathlib.Path, folder_name: str) -> list[pathlib.Path]:
    if not start_dir.exists():
        return []
    out: list[pathlib.Path] = []
    stack = [start_dir]
    while stack:
        current = stack.pop()
        try:
            entries = list(current.iterdir())
        except PermissionError:
            continue
        for entry in entries:
            if not entry.is_dir():
                continue
            if entry.name == folder_name:
                out.append(entry)
                continue
            stack.append(entry)
    return out


def collect_directories_by_prefix(start_dir: pathlib.Path, prefix: str) -> list[pathlib.Path]:
    if not start_dir.exists():
        return []
    out: list[pathlib.Path] = []
    stack = [start_dir]
    while stack:
        current = stack.pop()
        try:
            entries = list(current.iterdir())
        except PermissionError:
            continue
        for entry in entries:
            if not entry.is_dir():
                continue
            if entry.name.startswith(prefix):
                out.append(entry)
                continue
            stack.append(entry)
    return out


def collect_files_by_predicate(start_dir: pathlib.Path, predicate) -> list[pathlib.Path]:
    if not start_dir.exists():
        return []
    out: list[pathlib.Path] = []
    stack = [start_dir]
    while stack:
        current = stack.pop()
        try:
            entries = list(current.iterdir())
        except PermissionError:
            continue
        for entry in entries:
            if entry.is_dir():
                stack.append(entry)
                continue
            if entry.is_file() and predicate(entry):
                out.append(entry)
    return out


def is_descendant_path(parent_path: pathlib.Path, candidate_path: pathlib.Path) -> bool:
    parent = parent_path.resolve()
    candidate = candidate_path.resolve()
    if parent == candidate:
        return True
    try:
        candidate.relative_to(parent)
        return True
    except Exception:
        return False


def exclude_descendants(paths: list[pathlib.Path], ancestor_paths: list[pathlib.Path]) -> list[pathlib.Path]:
    ancestors = [path.resolve() for path in ancestor_paths]
    return [candidate for candidate in paths if not any(is_descendant_path(ancestor, candidate) for ancestor in ancestors)]


def remove_paths(paths: list[pathlib.Path], dry_run: bool) -> dict[str, Any]:
    removed: list[pathlib.Path] = []
    errors: list[dict[str, Any]] = []
    for absolute_path in paths:
        try:
            if not dry_run:
                if absolute_path.is_dir():
                    shutil.rmtree(absolute_path)
                else:
                    absolute_path.unlink()
            removed.append(absolute_path)
        except Exception as error:
            errors.append({"path": absolute_path, "error": str(error)})
    return {"removed": removed, "errors": errors}


def is_retryable_cache_prune_error(error_text: Any) -> bool:
    text = str(error_text or "").lower()
    return (
        "access is denied" in text
        or "permission denied" in text
        or "eperm" in text
        or "eacces" in text
        or "winerror 5" in text
    )


def build_cache_prune_issues(root: pathlib.Path, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    for row in rows:
        error_detail = str(row.get("error") or "")
        deferred = is_retryable_cache_prune_error(error_detail)
        issues.append(
            {
                "level": "warn" if deferred else "error",
                "type": "cache_prune_deferred" if deferred else "cache_prune_failed",
                "path": to_rel(root, pathlib.Path(row["path"])),
                "detail": error_detail,
            }
        )
    return issues


def trim_ndjson(file_path: pathlib.Path, max_lines: int, dry_run: bool) -> dict[str, Any]:
    if not file_path.exists():
        return {
            "file": file_path,
            "exists": False,
            "line_count_before": 0,
            "line_count_after": 0,
            "removed_lines": 0,
            "changed": False,
        }
    safe_max = max(1, int(max_lines or 1))
    lines = [line.strip() for line in file_path.read_text(encoding="utf8").splitlines() if line.strip()]
    if len(lines) <= safe_max:
        return {
            "file": file_path,
            "exists": True,
            "line_count_before": len(lines),
            "line_count_after": len(lines),
            "removed_lines": 0,
            "changed": False,
        }
    next_lines = lines[-safe_max:]
    if not dry_run:
        file_path.write_text("\n".join(next_lines) + "\n", encoding="utf8")
    return {
        "file": file_path,
        "exists": True,
        "line_count_before": len(lines),
        "line_count_after": len(next_lines),
        "removed_lines": len(lines) - len(next_lines),
        "changed": True,
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    root = find_repo_root(pathlib.Path(__file__))
    output_root = root / pathlib.PurePosixPath(str(args["out_dir"]).replace("\\", "/"))
    issues: list[dict[str, Any]] = []

    report = {
        "status": "pass",
        "root": str(root),
        "dry_run": args["dry_run"],
        "targets": {"output_root": to_rel(root, output_root)},
        "cache_prune": {
            "skipped": args["skip_cache_prune"],
            "cache_dirs_removed": [],
            "benchmark_temp_dirs_removed": [],
            "pyc_files_removed": [],
            "temp_files_removed": [],
        },
        "log_prune": {
            "skipped": args["skip_log_prune"],
            "sessions": None,
            "events": None,
        },
        "issues": issues,
    }

    if not args["skip_cache_prune"]:
        pycache_dirs = collect_directories_by_name(output_root, PYTHON_CACHE_DIR_NAME)
        benchmark_temp_dirs = collect_directories_by_prefix(output_root / "build" / "tmp", BENCHMARK_TEMP_DIR_PREFIX)
        pyc_files = exclude_descendants(
            collect_files_by_predicate(output_root, lambda file_path: file_path.suffix.lower() == ".pyc"),
            [*pycache_dirs, *benchmark_temp_dirs],
        )
        temp_files = exclude_descendants(
            collect_files_by_predicate(output_root, lambda file_path: file_path.name.lower().endswith(TEMP_FILE_SUFFIXES)),
            [*pycache_dirs, *benchmark_temp_dirs],
        )

        removed_cache_dirs = remove_paths(pycache_dirs, args["dry_run"])
        removed_benchmark_temp_dirs = remove_paths(benchmark_temp_dirs, args["dry_run"])
        removed_pyc_files = remove_paths(pyc_files, args["dry_run"])
        removed_temp_files = remove_paths(temp_files, args["dry_run"])

        report["cache_prune"]["cache_dirs_removed"] = [to_rel(root, item) for item in removed_cache_dirs["removed"]]
        report["cache_prune"]["benchmark_temp_dirs_removed"] = [
            to_rel(root, item) for item in removed_benchmark_temp_dirs["removed"]
        ]
        report["cache_prune"]["pyc_files_removed"] = [to_rel(root, item) for item in removed_pyc_files["removed"]]
        report["cache_prune"]["temp_files_removed"] = [to_rel(root, item) for item in removed_temp_files["removed"]]

        issues.extend(
            build_cache_prune_issues(
                root,
                [
                    *removed_cache_dirs["errors"],
                    *removed_benchmark_temp_dirs["errors"],
                    *removed_pyc_files["errors"],
                    *removed_temp_files["errors"],
                ],
            )
        )

    if not args["skip_log_prune"]:
        try:
            resolved = resolve_agent_access_control(root)
            logs = resolve_update_log_paths(pathlib.Path(resolved["root"]), pathlib.Path(resolved["policy_path"]), dict(resolved["policy"] or {}))
            session_trim = trim_ndjson(pathlib.Path(logs["sessions_file"]), args["sessions_max_lines"], args["dry_run"])
            event_trim = trim_ndjson(pathlib.Path(logs["events_file"]), args["events_max_lines"], args["dry_run"])
            report["log_prune"]["sessions"] = {**session_trim, "file": to_rel(root, pathlib.Path(session_trim["file"]))}
            report["log_prune"]["events"] = {**event_trim, "file": to_rel(root, pathlib.Path(event_trim["file"]))}
        except Exception as error:
            issues.append({"level": "warn", "type": "log_prune_skipped", "detail": str(error)})

    if any(issue.get("level") == "error" for issue in issues):
        report["status"] = "fail"

    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args["strict"] and report["status"] != "pass" else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except Exception as error:
        sys.stderr.write(f"prune-workflow-artifacts failed: {error}\n")
        raise SystemExit(1)
