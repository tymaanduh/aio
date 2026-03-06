#!/usr/bin/env python3
"""Native Python implementation for scripts/generate-file-catalog-docs.js."""

from __future__ import annotations

import json
import os
import pathlib
import sys

from _common import find_repo_root, normalize_path, write_text_file_robust

DEFAULT_MARKDOWN_FILE = pathlib.PurePosixPath("docs/reference/file_catalog.md")
DEFAULT_JSON_FILE = pathlib.PurePosixPath("docs/reference/file_catalog.json")
DEFAULT_IGNORE_DIRS = [
    ".git",
    ".vs",
    ".vscode",
    "node_modules",
    "dist",
    "native/dx12/build",
    "data/output/logs/change-log",
    "data/output/databases/polyglot-default/build/tmp",
]


def parse_args(argv: list[str]) -> dict:
    args = {
        "markdown_file": str(DEFAULT_MARKDOWN_FILE),
        "json_file": str(DEFAULT_JSON_FILE),
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "").strip()
        if token == "--markdown-file" and index + 1 < len(argv):
            args["markdown_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--json-file" and index + 1 < len(argv):
            args["json_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        index += 1
    return args


def to_relative(root: pathlib.Path, file_path: pathlib.Path) -> str:
    return normalize_path(file_path.relative_to(root))


def should_ignore_dir(relative_dir: str) -> bool:
    normalized = normalize_path(relative_dir).rstrip("/")
    if not normalized:
      return False
    return any(normalized == entry or normalized.startswith(f"{entry}/") for entry in DEFAULT_IGNORE_DIRS)


def classify_file(relative_path: str) -> str:
    rel = normalize_path(relative_path)
    if rel.startswith(".github/"):
        return "github_automation"
    if rel.startswith("docs/"):
        return "documentation"
    if rel.startswith("app/"):
        return "desktop_ui"
    if rel.startswith("brain/"):
        return "runtime_brain"
    if rel.startswith("main/"):
        return "main_process"
    if rel.startswith("renderer/"):
        return "renderer_surface"
    if rel.startswith("scripts/"):
        return "automation_script"
    if rel.startswith("tests/"):
        return "test_asset"
    if rel.startswith("to-do/skills/"):
        return "skill_metadata"
    if rel.startswith("to-do/agents/"):
        return "agent_metadata"
    if rel.startswith("data/input/"):
        return "catalog_input"
    if rel.startswith("data/output/"):
        return "generated_output"
    if rel in {"package.json", "package-lock.json"}:
        return "package_config"
    if rel.startswith("native/"):
        return "native_runtime"
    return "workspace_misc"


def collect_file_rows(root: pathlib.Path) -> list[dict]:
    rows: list[dict] = []
    stack = [root]
    while stack:
        current = stack.pop()
        try:
            entries = list(os.scandir(current))
        except PermissionError:
            continue
        for entry in entries:
            absolute = pathlib.Path(entry.path)
            relative = to_relative(root, absolute)
            if entry.is_dir(follow_symlinks=False):
                if not should_ignore_dir(relative):
                    stack.append(absolute)
                continue
            if not entry.is_file(follow_symlinks=False):
                continue
            try:
                stat = absolute.stat()
            except PermissionError:
                continue
            ext = normalize_path(absolute.suffix).lower() or "(none)"
            rows.append(
                {
                    "path": relative,
                    "extension": ext,
                    "bytes": int(stat.st_size or 0),
                    "modified_utc": __import__("datetime").datetime.utcfromtimestamp(stat.st_mtime).isoformat() + "Z",
                    "category": classify_file(relative),
                }
            )
    rows.sort(key=lambda row: row["path"])
    return rows


def sum_bytes(rows: list[dict]) -> int:
    return sum(int(row.get("bytes", 0) or 0) for row in rows)


def to_bytes_label(bytes_value: int) -> str:
    value = int(bytes_value or 0)
    if value < 1024:
        return f"{value} B"
    kb = value / 1024.0
    if kb < 1024:
        return f"{kb:.2f} KB"
    mb = kb / 1024.0
    return f"{mb:.2f} MB"


def build_bucket_summary(rows: list[dict], selector) -> list[dict]:
    buckets: dict[str, dict] = {}
    for row in rows:
        key = str(selector(row) or "").strip() or "unknown"
        bucket = buckets.setdefault(key, {"key": key, "count": 0, "bytes": 0})
        bucket["count"] += 1
        bucket["bytes"] += int(row.get("bytes", 0) or 0)
    return sorted(buckets.values(), key=lambda row: (-int(row["count"]), str(row["key"])))


def escape_pipes(text: str) -> str:
    return str(text or "").replace("|", "\\|")


def build_markdown(root: pathlib.Path, rows: list[dict], generated_at: str) -> str:
    top_level_summary = build_bucket_summary(rows, lambda row: row["path"].split("/")[0] or ".")
    category_summary = build_bucket_summary(rows, lambda row: row["category"])
    extension_summary = build_bucket_summary(rows, lambda row: row["extension"])
    total_bytes = sum_bytes(rows)
    lines = [
        "# Repository File Catalog",
        "",
        f"- Generated at: {generated_at}",
        f"- Workspace root: `{normalize_path(root)}`",
        f"- Total files documented: {len(rows)}",
        f"- Total bytes: {total_bytes} ({to_bytes_label(total_bytes)})",
        "- Ignored directories: " + ", ".join(f"`{entry}`" for entry in DEFAULT_IGNORE_DIRS),
        "",
        "## Top-Level Summary",
        "",
        "| Root | Files | Bytes | Size |",
        "|---|---:|---:|---:|",
    ]
    for row in top_level_summary:
        lines.append(f"| {escape_pipes(row['key'])} | {row['count']} | {row['bytes']} | {to_bytes_label(row['bytes'])} |")
    lines.extend(
        [
            "",
            "## Category Summary",
            "",
            "| Category | Files | Bytes | Size |",
            "|---|---:|---:|---:|",
        ]
    )
    for row in category_summary:
        lines.append(f"| {escape_pipes(row['key'])} | {row['count']} | {row['bytes']} | {to_bytes_label(row['bytes'])} |")
    lines.extend(
        [
            "",
            "## Extension Summary",
            "",
            "| Extension | Files | Bytes | Size |",
            "|---|---:|---:|---:|",
        ]
    )
    for row in extension_summary:
        lines.append(f"| {escape_pipes(row['key'])} | {row['count']} | {row['bytes']} | {to_bytes_label(row['bytes'])} |")
    lines.extend(
        [
            "",
            "## Full File Index",
            "",
            "| # | File | Category | Ext | Bytes | Modified (UTC) |",
            "|---:|---|---|---|---:|---|",
        ]
    )
    for index, row in enumerate(rows, start=1):
        lines.append(
            f"| {index} | `{escape_pipes(row['path'])}` | {escape_pipes(row['category'])} | {escape_pipes(row['extension'])} | {row['bytes']} | {row['modified_utc']} |"
        )
    lines.extend(["", "_This file is generated by `npm run docs:catalog`._", ""])
    return "\n".join(lines)


def generate(root: pathlib.Path, args: dict) -> dict:
    markdown_file = root / pathlib.PurePosixPath(str(args.get("markdown_file") or DEFAULT_MARKDOWN_FILE))
    json_file = root / pathlib.PurePosixPath(str(args.get("json_file") or DEFAULT_JSON_FILE))
    rows = collect_file_rows(root)
    generated_at = __import__("datetime").datetime.utcnow().isoformat() + "Z"
    payload = {
        "schema_version": 1,
        "report_id": "aio_repository_file_catalog",
        "generated_at": generated_at,
        "root": normalize_path(root),
        "ignored_directories": list(DEFAULT_IGNORE_DIRS),
        "totals": {
            "files": len(rows),
            "bytes": sum_bytes(rows),
        },
        "files": rows,
    }
    write_text_file_robust(json_file, f"{json.dumps(payload, indent=2)}\n", atomic=False)
    write_text_file_robust(markdown_file, build_markdown(root, rows, generated_at), atomic=False)
    return {
        "status": "pass",
        "generated_at": generated_at,
        "root": normalize_path(root),
        "markdown_file": normalize_path(markdown_file.relative_to(root)),
        "json_file": normalize_path(json_file.relative_to(root)),
        "file_count": len(rows),
        "total_bytes": sum_bytes(rows),
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    root = find_repo_root(pathlib.Path(__file__))
    report = generate(root, args)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
