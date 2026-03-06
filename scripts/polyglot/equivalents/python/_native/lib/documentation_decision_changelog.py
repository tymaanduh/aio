#!/usr/bin/env python3
"""Native Python implementation for scripts/lib/documentation-decision-changelog.js."""

from __future__ import annotations

from documentation_decision_changelog import (
    DEFAULT_BENCHMARK_REPORT_FILE,
    DEFAULT_DECISION_CHANGELOG_FILE,
    DEFAULT_GOVERNANCE_REPORT_FILE,
    DEFAULT_MIGRATION_REPORT_FILE,
    GENERATED_END_MARKER,
    GENERATED_START_MARKER,
    generate,
    main as _main,
)

__all__ = [
    "DEFAULT_BENCHMARK_REPORT_FILE",
    "DEFAULT_DECISION_CHANGELOG_FILE",
    "DEFAULT_GOVERNANCE_REPORT_FILE",
    "DEFAULT_MIGRATION_REPORT_FILE",
    "GENERATED_END_MARKER",
    "GENERATED_START_MARKER",
    "generate",
    "main",
]


def main(argv: list[str] | None = None) -> int:
    return _main(argv)


if __name__ == "__main__":
    raise SystemExit(main())
