#!/usr/bin/env python3
"""Native Python implementation for scripts/generate-documentation-suite.js."""

from __future__ import annotations

import json
import pathlib
import sys

from _common import find_repo_root, normalize_path
from documentation_decision_changelog import generate as generate_decision_changelog
from generate_file_catalog_docs import generate as generate_file_catalog
from generate_runtime_visuals import generate as generate_runtime_visuals
from generate_script_runtime_migration_report import generate as generate_script_runtime_migration_report


def main(argv: list[str] | None = None) -> int:
    root = find_repo_root(pathlib.Path(__file__))
    file_catalog = generate_file_catalog(root, {})
    runtime_visuals = generate_runtime_visuals(root, {})
    script_runtime_migration = generate_script_runtime_migration_report(root)
    decision_changelog = generate_decision_changelog(root, {})
    report = {
        "status": "pass",
        "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "root": normalize_path(root),
        "outputs": {
            "file_catalog": file_catalog,
            "runtime_visuals": runtime_visuals,
            "script_runtime_migration": script_runtime_migration,
            "decision_changelog": decision_changelog,
        },
    }
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
