#!/usr/bin/env python3
"""Native Python implementation for scripts/data-separation-audit.js."""

from __future__ import annotations

import json
import pathlib
import re
import sys
from datetime import UTC, datetime
from typing import Any

from _common import find_repo_root, normalize_path, write_text_file_robust

ROOT = find_repo_root(pathlib.Path(__file__))
DEFAULT_REPORT_FILE = ROOT / "data" / "output" / "databases" / "polyglot-default" / "analysis" / "data_separation_audit_report.json"
DEFAULT_SCAN_DIRS = ("main", "app", "renderer", "brain", "scripts")
DEFAULT_IGNORE_DIRS = ("node_modules", ".git", "dist", "data/output", "to-do", "artifacts")
TOKEN_HINTS = ("GROUP", "LABEL", "ALIAS", "MAP", "REGISTRY", "SPEC", "KEY", "DEFAULT", "CONFIG", "PATTERN")
CONST_PATTERN = re.compile(r"^\s*const\s+([A-Z0-9_]+)\s*=\s*(?:Object\.freeze\()?(?:\{|\[)")


def now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def to_relative_path(file_path: pathlib.Path) -> str:
    return normalize_path(file_path.relative_to(ROOT))


def is_ignored_path(relative_path: str) -> bool:
    rel = normalize_path(relative_path)
    return any(rel == ignore_dir or rel.startswith(f"{ignore_dir}/") for ignore_dir in DEFAULT_IGNORE_DIRS)


def parse_args(argv: list[str]) -> dict[str, Any]:
    args: dict[str, Any] = {
        "report_file": DEFAULT_REPORT_FILE,
        "enforce": False,
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--report-file":
            if index + 1 >= len(argv):
                raise RuntimeError("--report-file requires a path")
            args["report_file"] = (pathlib.Path.cwd() / str(argv[index + 1] or "")).resolve()
            index += 2
            continue
        if token == "--enforce":
            args["enforce"] = True
            index += 1
            continue
        if token in {"--help", "-h"}:
            sys.stdout.write(
                "\n".join(
                    [
                        "data-separation-audit",
                        "",
                        "Usage:",
                        "  npm run audit:data-separation -- [options]",
                        "",
                        "Options:",
                        "  --report-file <path>   Output report path",
                        "  --enforce              Exit non-zero when required-separation candidates exist",
                        "  --help                 Show help",
                    ]
                )
                + "\n"
            )
            raise SystemExit(0)
        raise RuntimeError(f"unknown argument: {token}")
    return args


def collect_js_files() -> list[pathlib.Path]:
    files: list[pathlib.Path] = []
    stack = [ROOT / scan_dir for scan_dir in DEFAULT_SCAN_DIRS if (ROOT / scan_dir).is_dir()]
    while stack:
        current = stack.pop()
        rel_current = to_relative_path(current)
        if is_ignored_path(rel_current):
            continue
        for entry in sorted(current.iterdir(), key=lambda item: str(item)):
            relative = to_relative_path(entry)
            if is_ignored_path(relative):
                continue
            if entry.is_dir():
                stack.append(entry)
                continue
            if entry.is_file() and entry.suffix == ".js":
                files.append(entry)
    return sorted(files, key=lambda item: to_relative_path(item))


def classify_constant(name: str) -> dict[str, Any]:
    upper = str(name or "").upper()
    required_token = next((token for token in TOKEN_HINTS if token in upper), "")
    if required_token:
        return {
            "separation_required": True,
            "reason": f"name contains {required_token}",
        }
    return {
        "separation_required": False,
        "reason": "non-governed constant name",
    }


def detect_candidates_in_file(file_path: pathlib.Path) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for index, line in enumerate(file_path.read_text(encoding="utf8").splitlines(), start=1):
        match = CONST_PATTERN.match(line)
        if not match:
            continue
        constant_name = str(match.group(1) or "")
        classification = classify_constant(constant_name)
        candidates.append(
            {
                "file": to_relative_path(file_path),
                "line": index,
                "constant": constant_name,
                "separation_required": classification["separation_required"],
                "reason": classification["reason"],
            }
        )
    return candidates


def summarize_by_path(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[str, dict[str, Any]] = {}
    for candidate in candidates:
        file_name = str(candidate.get("file") or "")
        if file_name not in grouped:
            grouped[file_name] = {
                "file": file_name,
                "candidate_count": 0,
                "required_count": 0,
            }
        grouped[file_name]["candidate_count"] += 1
        if candidate.get("separation_required") is True:
            grouped[file_name]["required_count"] += 1
    return sorted(
        grouped.values(),
        key=lambda entry: (-int(entry.get("required_count") or 0), str(entry.get("file") or "")),
    )


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    files = collect_js_files()
    candidates = [candidate for file_path in files for candidate in detect_candidates_in_file(file_path)]
    required = [candidate for candidate in candidates if candidate.get("separation_required") is True]
    summary_by_file = summarize_by_path(candidates)

    report = {
        "generated_at": now_iso(),
        "project_root": str(ROOT),
        "scan_dirs": list(DEFAULT_SCAN_DIRS),
        "ignored_dirs": list(DEFAULT_IGNORE_DIRS),
        "counts": {
            "files_scanned": len(files),
            "candidate_total": len(candidates),
            "separation_required_total": len(required),
        },
        "highest_priority_files": summary_by_file[:25],
        "candidates": candidates,
    }
    write_text_file_robust(pathlib.Path(args["report_file"]), f"{json.dumps(report, indent=2)}\n")

    result = {
        "report_file": str(args["report_file"]),
        "files_scanned": len(files),
        "candidate_total": len(candidates),
        "separation_required_total": len(required),
        "enforce": bool(args["enforce"]),
    }
    sys.stdout.write(f"{json.dumps(result, indent=2)}\n")
    if args["enforce"] and required:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
