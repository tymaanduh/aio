#!/usr/bin/env python3
"""Generate script runtime migration coverage docs from the equivalents catalog."""

from __future__ import annotations

import json
import pathlib
import sys
from datetime import UTC, datetime
from typing import Any

from _common import find_repo_root, normalize_path, write_text_file_robust

CATALOG_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/build/script_polyglot_equivalents_catalog.json")
PACKAGE_FILE = pathlib.PurePosixPath("package.json")
REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/analysis/script_runtime_migration_report.json")
MARKDOWN_FILE = pathlib.PurePosixPath("docs/reference/script_runtime_migration.md")


def build_report(root: pathlib.Path) -> dict[str, Any]:
    catalog = json.loads((root / CATALOG_FILE).read_text(encoding="utf8"))
    package_doc = json.loads((root / PACKAGE_FILE).read_text(encoding="utf8"))
    entries = list(catalog.get("entries") or [])
    scripts = dict(package_doc.get("scripts") or {})
    native_python_entries = [entry for entry in entries if entry.get("python_native_implemented") is True]
    non_native_python_entries = [entry for entry in entries if entry.get("python_native_implemented") is not True]
    cpp_native_direct_entries = [entry for entry in entries if entry.get("cpp_dispatch_strategy") == "python_native_direct"]
    cpp_wrapper_delegate_entries = [
        entry for entry in entries if entry.get("cpp_dispatch_strategy") == "python_wrapper_delegate"
    ]

    python_entrypoint_scripts: list[dict[str, str]] = []
    node_script_entrypoints: list[dict[str, str]] = []
    external_entrypoints: list[dict[str, str]] = []
    for script_name in sorted(scripts.keys()):
        command = str(scripts.get(script_name) or "").strip()
        row = {"name": script_name, "command": command}
        if command.startswith("python scripts/polyglot/equivalents/python/"):
            python_entrypoint_scripts.append(row)
        elif "node scripts/" in command:
            node_script_entrypoints.append(row)
        else:
            external_entrypoints.append(row)

    return {
        "schema_version": 1,
        "report_id": "aio_script_runtime_migration_report",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": normalize_path(root),
        "files": {
            "catalog_file": normalize_path(CATALOG_FILE),
            "package_file": normalize_path(PACKAGE_FILE),
            "report_file": normalize_path(REPORT_FILE),
            "markdown_file": normalize_path(MARKDOWN_FILE),
        },
        "metrics": {
            "script_count": int((catalog.get("metrics") or {}).get("script_count") or len(entries)),
            "python_equivalent_count": int((catalog.get("metrics") or {}).get("python_equivalent_count") or 0),
            "cpp_equivalent_count": int((catalog.get("metrics") or {}).get("cpp_equivalent_count") or 0),
            "python_native_implementation_count": int((catalog.get("metrics") or {}).get("python_native_implementation_count") or len(native_python_entries)),
            "cpp_native_dispatch_count": int((catalog.get("metrics") or {}).get("cpp_native_dispatch_count") or 0),
            "cpp_python_native_direct_count": int((catalog.get("metrics") or {}).get("cpp_python_native_direct_count") or len(cpp_native_direct_entries)),
            "cpp_python_wrapper_delegate_count": int(
                (catalog.get("metrics") or {}).get("cpp_python_wrapper_delegate_count") or len(cpp_wrapper_delegate_entries)
            ),
            "package_script_count": len(scripts),
            "python_entrypoint_package_script_count": len(python_entrypoint_scripts),
            "direct_node_package_script_count": len(node_script_entrypoints),
            "external_package_script_count": len(external_entrypoints),
            "remaining_python_native_gap_count": len(non_native_python_entries),
        },
        "native_python_script_ids": [str(entry.get("script_id") or "") for entry in native_python_entries],
        "remaining_python_native_script_ids": [str(entry.get("script_id") or "") for entry in non_native_python_entries],
        "cpp_python_native_direct_script_ids": [str(entry.get("script_id") or "") for entry in cpp_native_direct_entries],
        "cpp_python_wrapper_delegate_script_ids": [str(entry.get("script_id") or "") for entry in cpp_wrapper_delegate_entries],
        "package_scripts": {
            "python_equivalent_entrypoints": python_entrypoint_scripts,
            "direct_node_entrypoints": node_script_entrypoints,
            "external_entrypoints": external_entrypoints,
        },
    }


def build_markdown(report: dict[str, Any]) -> str:
    metrics = report.get("metrics") or {}
    lines = [
        "# Script Runtime Migration",
        "",
        f"- Generated at: {report.get('generated_at')}",
        f"- Script equivalents catalog: `{(report.get('files') or {}).get('catalog_file')}`",
        f"- Package manifest: `{(report.get('files') or {}).get('package_file')}`",
        f"- Generated script entries: {metrics.get('script_count', 0)}",
        f"- Python equivalents: {metrics.get('python_equivalent_count', 0)}",
        f"- C++ equivalents: {metrics.get('cpp_equivalent_count', 0)}",
        f"- Native Python implementations: {metrics.get('python_native_implementation_count', 0)}",
        f"- C++ native dispatch entrypoints: {metrics.get('cpp_native_dispatch_count', 0)}",
        f"- C++ entrypoints dispatching straight to Python-native implementations: {metrics.get('cpp_python_native_direct_count', 0)}",
        f"- C++ entrypoints still delegating to generated Python wrappers: {metrics.get('cpp_python_wrapper_delegate_count', 0)}",
        f"- Package scripts using Python equivalents: {metrics.get('python_entrypoint_package_script_count', 0)}",
        f"- Package scripts still invoking `node scripts/...`: {metrics.get('direct_node_package_script_count', 0)}",
        "",
        "## Current Runtime Model",
        "",
        "- Python entrypoints are the default CLI lane for generated script equivalents.",
        "- C++ entrypoints compile to a native launcher and dispatch straight to the Python-native implementation when one exists.",
        "- Remaining C++ entrypoints delegate to the generated Python equivalent, which can still use governed JS fallback when no native Python implementation exists.",
        "- JS fallback remains explicit and governed through `AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK`.",
        "",
        "## Native Python Implementations",
        "",
    ]
    for script_id in report.get("native_python_script_ids") or []:
        lines.append(f"- `{script_id}`")

    lines.extend(["", "## Remaining Python Native Gaps", ""])
    for script_id in report.get("remaining_python_native_script_ids") or []:
        lines.append(f"- `{script_id}`")

    lines.extend(["", "## C++ Direct Native Dispatch", ""])
    for script_id in report.get("cpp_python_native_direct_script_ids") or []:
        lines.append(f"- `{script_id}`")

    lines.extend(["", "## Package Entry Points Using Python Equivalents", ""])
    for row in (report.get("package_scripts") or {}).get("python_equivalent_entrypoints") or []:
        lines.append(f"- `{row['name']}` -> `{row['command']}`")

    lines.extend(["", "## Package Entry Points Still Direct Node", ""])
    for row in (report.get("package_scripts") or {}).get("direct_node_entrypoints") or []:
        lines.append(f"- `{row['name']}` -> `{row['command']}`")

    lines.extend(["", "_This file is generated by the Python-native documentation suite._", ""])
    return "\n".join(lines)


def generate(root: pathlib.Path) -> dict[str, Any]:
    report = build_report(root)
    write_text_file_robust(root / REPORT_FILE, f"{json.dumps(report, indent=2)}\n", atomic=False)
    write_text_file_robust(root / MARKDOWN_FILE, build_markdown(report), atomic=False)
    return {
        "status": "pass",
        "generated_at": report["generated_at"],
        "root": normalize_path(root),
        "report_file": normalize_path(REPORT_FILE),
        "markdown_file": normalize_path(MARKDOWN_FILE),
        "metrics": report["metrics"],
    }


def main(argv: list[str] | None = None) -> int:
    del argv
    root = find_repo_root(pathlib.Path(__file__))
    result = generate(root)
    sys.stdout.write(f"{json.dumps(result, indent=2)}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
