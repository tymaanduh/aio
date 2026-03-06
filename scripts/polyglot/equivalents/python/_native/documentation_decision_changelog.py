#!/usr/bin/env python3
"""Generate the decision changelog status snapshot used by docs freshness checks."""

from __future__ import annotations

import pathlib
import re
from datetime import UTC, datetime
from typing import Any

from _common import load_json, normalize_path, write_text_file_robust

DEFAULT_DECISION_CHANGELOG_FILE = pathlib.PurePosixPath("docs/changelog/decisions.md")
DEFAULT_MIGRATION_REPORT_FILE = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/analysis/script_runtime_migration_report.json"
)
DEFAULT_BENCHMARK_REPORT_FILE = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json"
)
DEFAULT_GOVERNANCE_REPORT_FILE = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/reports/local-governance/local_governance_report.json"
)
GENERATED_START_MARKER = "<!-- GENERATED STATUS SNAPSHOT START -->"
GENERATED_END_MARKER = "<!-- GENERATED STATUS SNAPSHOT END -->"


def _resolve_overall_winner(benchmark_doc: dict[str, Any]) -> str:
    winner_mapping = benchmark_doc.get("winner_mapping") if isinstance(benchmark_doc.get("winner_mapping"), dict) else {}
    winner = str(winner_mapping.get("overall_winner_language") or "").strip()
    if winner:
        return winner
    ranking = benchmark_doc.get("ranking") if isinstance(benchmark_doc.get("ranking"), list) else []
    for row in ranking:
        if not isinstance(row, dict):
            continue
        label = str(row.get("language") or row.get("label") or "").strip()
        if label:
            return label
    return ""


def _resolve_measured_languages(benchmark_doc: dict[str, Any]) -> list[str]:
    ranking = benchmark_doc.get("ranking") if isinstance(benchmark_doc.get("ranking"), list) else []
    labels = []
    for row in ranking:
        if not isinstance(row, dict):
            continue
        label = str(row.get("language") or row.get("label") or "").strip()
        if label:
            labels.append(label)
    if labels:
        return labels
    results = benchmark_doc.get("results") if isinstance(benchmark_doc.get("results"), dict) else {}
    return [str(key).strip() for key in results.keys() if str(key).strip()]


def _build_generated_block(report: dict[str, Any]) -> str:
    metrics = report.get("migration_metrics") if isinstance(report.get("migration_metrics"), dict) else {}
    governance_metrics = report.get("governance_metrics") if isinstance(report.get("governance_metrics"), dict) else {}
    measured_languages = report.get("measured_languages") if isinstance(report.get("measured_languages"), list) else []
    language_suffix = f" ({', '.join(measured_languages)})" if measured_languages else ""
    task_count = int(governance_metrics.get("task_count") or 0)
    passed_count = int(governance_metrics.get("passed") or 0)
    return "\n".join(
        [
            GENERATED_START_MARKER,
            "### Generated Status Snapshot",
            "",
            (
                f"- Script-runtime migration: {int(metrics.get('python_native_implementation_count') or 0)} "
                f"Python-native implementations, {int(metrics.get('cpp_native_dispatch_count') or 0)} "
                f"C++ direct dispatch entrypoints, {int(metrics.get('cpp_python_native_direct_count') or 0)} "
                f"C++ direct-native dispatches, {int(metrics.get('cpp_python_wrapper_delegate_count') or 0)} "
                f"C++ wrapper delegates, and {int(metrics.get('direct_node_package_script_count') or 0)} "
                "direct `node scripts/...` package scripts."
            ),
            (
                f"- Runtime benchmark winner: `{report.get('overall_winner_language') or 'unknown'}`"
                f"{language_suffix}."
            ),
            (
                f"- Local governance: `{str(report.get('governance_status') or 'unknown').upper()}` "
                f"({passed_count}/{task_count} tasks)."
            ),
            "- Documentation suite refresh keeps these artifacts in the governed docs lane:",
            "- `docs/reference/file_catalog.md`",
            "- `docs/reference/script_runtime_migration.md`",
            "- `docs/visuals/runtime_dashboard.md`",
            GENERATED_END_MARKER,
        ]
    )


def _strip_generated_block(section_body: str) -> str:
    pattern = re.compile(
        rf"{re.escape(GENERATED_START_MARKER)}[\s\S]*?{re.escape(GENERATED_END_MARKER)}\n?",
        re.MULTILINE,
    )
    return pattern.sub("", section_body).rstrip()


def _upsert_today_section(content: str, date_key: str, generated_block: str) -> str:
    section_pattern = re.compile(
        rf"(^## {re.escape(date_key)}\n)([\s\S]*?)(?=^## \d{{4}}-\d{{2}}-\d{{2}}\n|\Z)",
        re.MULTILINE,
    )
    match = section_pattern.search(content)
    if match:
        body = _strip_generated_block(match.group(2))
        rebuilt_body = f"{body}\n\n{generated_block}\n" if body else f"{generated_block}\n"
        return f"{content[:match.start(2)]}{rebuilt_body}{content[match.end(2):]}"

    if content.startswith("# Decision Changelog"):
        heading_match = re.match(r"^# Decision Changelog\s*\n\n?", content)
        if heading_match:
            insertion = f"## {date_key}\n\n{generated_block}\n\n"
            return f"{content[:heading_match.end()]}{insertion}{content[heading_match.end():]}"
    prefix = "# Decision Changelog\n\n"
    if content.strip():
        return f"{prefix}## {date_key}\n\n{generated_block}\n\n{content.strip()}\n"
    return f"{prefix}## {date_key}\n\n{generated_block}\n"


def generate(root: pathlib.Path, args: dict[str, Any] | None = None) -> dict[str, Any]:
    options = args or {}
    migration_report_file = root / pathlib.PurePosixPath(
        str(options.get("migration_report_file") or DEFAULT_MIGRATION_REPORT_FILE)
    )
    benchmark_report_file = root / pathlib.PurePosixPath(
        str(options.get("benchmark_report_file") or DEFAULT_BENCHMARK_REPORT_FILE)
    )
    governance_report_file = root / pathlib.PurePosixPath(
        str(options.get("governance_report_file") or DEFAULT_GOVERNANCE_REPORT_FILE)
    )
    decision_changelog_file = root / pathlib.PurePosixPath(
        str(options.get("decision_changelog_file") or DEFAULT_DECISION_CHANGELOG_FILE)
    )

    migration_doc = load_json(migration_report_file, {}) or {}
    benchmark_doc = load_json(benchmark_report_file, {}) or {}
    governance_doc = load_json(governance_report_file, {}) or {}

    report = {
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "migration_metrics": migration_doc.get("metrics") if isinstance(migration_doc.get("metrics"), dict) else {},
        "overall_winner_language": _resolve_overall_winner(benchmark_doc),
        "measured_languages": _resolve_measured_languages(benchmark_doc),
        "governance_status": str(governance_doc.get("status") or "").strip() or "unknown",
        "governance_metrics": governance_doc.get("metrics") if isinstance(governance_doc.get("metrics"), dict) else {},
    }

    content = decision_changelog_file.read_text(encoding="utf8") if decision_changelog_file.exists() else ""
    date_key = report["generated_at"][:10]
    next_content = _upsert_today_section(content, date_key, _build_generated_block(report))
    write_text_file_robust(decision_changelog_file, next_content.rstrip() + "\n")

    return {
        "status": "pass",
        "generated_at": report["generated_at"],
        "markdown_file": normalize_path(decision_changelog_file.relative_to(root)),
        "date": date_key,
        "overall_winner_language": report["overall_winner_language"],
        "governance_status": report["governance_status"],
    }


def main(argv: list[str] | None = None) -> int:
    del argv
    root = pathlib.Path(__file__).resolve()
    while root != root.parent and not (root / "package.json").exists():
        root = root.parent
    result = generate(root, {})
    __import__("sys").stdout.write(f"{__import__('json').dumps(result, indent=2)}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
