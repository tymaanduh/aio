#!/usr/bin/env python3
"""Native Python implementation for scripts/optimize-codex-automations.js."""

from __future__ import annotations

import json
import os
import pathlib
import shutil
import sys
from typing import Any

from _common import find_repo_root, write_text_file_robust


def parse_args(argv: list[str]) -> dict[str, Any]:
    args = {
        "apply": "--apply" in argv,
        "prune_duplicates": "--no-prune-duplicates" not in argv,
        "codex_home": "",
        "max_prompt_tokens": 36,
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--codex-home" and index + 1 < len(argv):
            args["codex_home"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--max-prompt-tokens" and index + 1 < len(argv):
            args["max_prompt_tokens"] = int(argv[index + 1])
            index += 2
            continue
        index += 1
    return args


def estimate_tokens(text: Any) -> int:
    return max(1, (len(str(text or "")) + 3) // 4)


def compact_whitespace(text: Any) -> str:
    return " ".join(str(text or "").split())


def normalize_prompt(prompt: Any) -> str:
    out = compact_whitespace(prompt)
    replacements = [
        ("Open an inbox item with", "Inbox<=120t:"),
        ("Inbox:", "Inbox<=120t:"),
        ("pass or fail", "pass/fail"),
        ("blocking issues", "blockers"),
        ("failing command lines", "failed commands"),
        ("command exit codes", "exit codes"),
        ("any collisions or failures", "collisions/failures"),
        ("whether immediate action is required", "action needed now"),
    ]
    for source, target in replacements:
        out = __import__("re").sub(source, target, out, flags=__import__("re").IGNORECASE)
    out = out.replace(" ,", ",").replace(" .", ".")
    return out


def mapped_prompt(automation_id: str, original: str) -> str:
    by_id = {
        "aio-9am-preflight": "Run npm run workflow:preflight && npm run agents:validate. Inbox<=120t: pass/fail, blockers, failed cmds.",
        "aio-10am-contract-gate": "Run npm run contracts:validate. Inbox<=120t: drift/mapping fails + file paths.",
        "aio-11am-test-lint": "Run npm test --silent && npm run lint --silent. Inbox<=120t: test/lint fails + top fixes.",
        "aio-12pm-wrapper-smoke": "Run wrapper smoke: pipeline_default_math + pipeline_clamp_x. Inbox<=120t: outputs, regressions, exit codes.",
        "aio-1pm-governance-gate": "Run npm run governance:hard:gate && npm run automations:audit. Inbox<=120t: pass/fail, gaps, dupes, drift.",
        "aio-2pm-separation-audit": "Run npm run audit:data-separation. Inbox<=120t: violation count, files, first fixes.",
        "aio-3pm-sync-dry-run": "Run npm run codex:desktop:sync:dry-run. Inbox<=120t: readiness, collisions, blockers.",
        "aio-4pm-sync-apply": "Run npm run codex:desktop:sync. Inbox<=120t: result, changed artifacts, collisions/fails.",
        "aio-5pm-daily-gate": "Run npm run codex:desktop:validate && npm run refactor:gate --silent. Inbox<=120t: gate summary, blockers first.",
        "aio-metadata-drift-check": "Run npm run agents:scope-sync && npm run agents:validate && npm run codex:desktop:validate. Inbox<=120t: drift + fails.",
        "aio-wrapper-mini-regression": "Run wrapper smoke: pipeline_default_math + pipeline_compare_bounds. Inbox<=120t: outputs, mismatches, regressions.",
        "aio-dependency-watch": "Run npm outdated && npm audit --omit=dev. Inbox<=120t: high-risk deps, upgrade order, action now.",
        "aio-dx12-doctor": "Run npm run dx12:doctor. Inbox<=120t: missing components + exact remediation cmds.",
        "aio-format-guard": "Run npm run format:check. Inbox<=120t: failing files + drift trend.",
        "aio-continuous-research-planner": "Run research + standards drift scan. Inbox<=120t: changed controls, evidence gaps, next actions.",
        "aio-continuous-backlog-executor": "Run backlog executor for top P0/P1 items. Inbox<=120t: completed, blockers, next fixes.",
        "iso-standards-watch": "Run ISO standards drift monitor + compliance refresh. Inbox<=120t: changed standards, failing mappings, updates.",
    }
    return by_id.get(automation_id, normalize_prompt(original))


def normalize_hourly_rrule(rrule: str) -> str:
    raw = str(rrule or "").strip()
    if not raw or not raw.upper().startswith("FREQ=HOURLY"):
        return raw
    match = __import__("re").search(r"INTERVAL=(\d+)", raw, flags=__import__("re").IGNORECASE)
    interval = max(1, int(match.group(1))) if match else 1
    return f"FREQ=HOURLY;INTERVAL={interval}"


def mapped_rrule(automation_id: str, original: str) -> str:
    by_id = {
        "aio-9am-preflight": "FREQ=HOURLY;INTERVAL=6",
        "aio-10am-contract-gate": "FREQ=HOURLY;INTERVAL=6",
        "aio-11am-test-lint": "FREQ=HOURLY;INTERVAL=4",
        "aio-12pm-wrapper-smoke": "FREQ=HOURLY;INTERVAL=4",
        "aio-1pm-governance-gate": "FREQ=HOURLY;INTERVAL=2",
        "aio-2pm-separation-audit": "FREQ=HOURLY;INTERVAL=6",
        "aio-3pm-sync-dry-run": "FREQ=HOURLY;INTERVAL=6",
        "aio-4pm-sync-apply": "FREQ=HOURLY;INTERVAL=6",
        "aio-5pm-daily-gate": "FREQ=HOURLY;INTERVAL=2",
        "aio-metadata-drift-check": "FREQ=HOURLY;INTERVAL=4",
        "aio-wrapper-mini-regression": "FREQ=HOURLY;INTERVAL=4",
        "aio-dependency-watch": "FREQ=HOURLY;INTERVAL=24",
        "aio-dx12-doctor": "FREQ=HOURLY;INTERVAL=24",
        "aio-format-guard": "FREQ=HOURLY;INTERVAL=24",
        "aio-continuous-research-planner": "FREQ=HOURLY;INTERVAL=6",
        "aio-continuous-backlog-executor": "FREQ=HOURLY;INTERVAL=6",
        "iso-standards-watch": "FREQ=HOURLY;INTERVAL=12",
    }
    return by_id.get(automation_id, normalize_hourly_rrule(original))


def update_prompt_in_toml(source: str, next_prompt: str) -> str:
    escaped = next_prompt.replace('"', '\\"')
    if __import__("re").search(r'^prompt\s*=\s*"', source, flags=__import__("re").MULTILINE):
        return __import__("re").sub(r'^prompt\s*=\s*"[^"]*"', f'prompt = "{escaped}"', source, flags=__import__("re").MULTILINE)
    return f'{source.rstrip()}\nprompt = "{escaped}"\n'


def update_rrule_in_toml(source: str, next_rrule: str) -> str:
    escaped = next_rrule.replace('"', '\\"')
    if __import__("re").search(r'^rrule\s*=\s*"', source, flags=__import__("re").MULTILINE):
        return __import__("re").sub(r'^rrule\s*=\s*"[^"]*"', f'rrule = "{escaped}"', source, flags=__import__("re").MULTILINE)
    return f'{source.rstrip()}\nrrule = "{escaped}"\n'


def analyze_and_maybe_apply(args: dict[str, Any]) -> dict[str, Any]:
    codex_home = pathlib.Path(args["codex_home"] or os.environ.get("CODEX_HOME") or (pathlib.Path.home() / ".codex")).resolve()
    automations_root = codex_home / "automations"
    report: dict[str, Any] = {
        "status": "pass",
        "mode": "apply" if args["apply"] else "dry-run",
        "prune_duplicates": args["prune_duplicates"],
        "codex_home": str(codex_home),
        "automations_root": str(automations_root),
        "max_prompt_tokens": args["max_prompt_tokens"],
        "scanned": 0,
        "changed": 0,
        "duplicate_groups": 0,
        "deleted": 0,
        "deleted_ids": [],
        "rows": [],
    }

    if not automations_root.exists():
        report["status"] = "fail"
        report["error"] = "automations root missing"
        return report

    for entry in sorted([path for path in automations_root.iterdir() if path.is_dir()], key=lambda item: item.name):
        automation_id = entry.name
        toml_path = entry / "automation.toml"
        if not toml_path.exists():
            continue
        report["scanned"] += 1
        before_text = toml_path.read_text(encoding="utf8")
        prompt_match = __import__("re").search(r'^prompt\s*=\s*"([^"]*)"', before_text, flags=__import__("re").MULTILINE)
        name_match = __import__("re").search(r'^name\s*=\s*"([^"]*)"', before_text, flags=__import__("re").MULTILINE)
        rrule_match = __import__("re").search(r'^rrule\s*=\s*"([^"]*)"', before_text, flags=__import__("re").MULTILINE)
        updated_at_match = __import__("re").search(r"^updated_at\s*=\s*(\d+)", before_text, flags=__import__("re").MULTILINE)
        status_match = __import__("re").search(r'^status\s*=\s*"([^"]*)"', before_text, flags=__import__("re").MULTILINE)
        name = name_match.group(1) if name_match else ""
        rrule = rrule_match.group(1) if rrule_match else ""
        prompt_before = prompt_match.group(1) if prompt_match else ""
        status = status_match.group(1) if status_match else ""
        updated_at = int(updated_at_match.group(1)) if updated_at_match else 0
        before_tokens = estimate_tokens(prompt_before)
        prompt_after = mapped_prompt(automation_id, prompt_before)
        rrule_after = mapped_rrule(automation_id, rrule)
        after_tokens = estimate_tokens(prompt_after)
        changed = False
        next_text = before_text

        if prompt_after != prompt_before and (status == "ACTIVE" or before_tokens > args["max_prompt_tokens"]):
            changed = True
            next_text = update_prompt_in_toml(next_text, prompt_after)
        if rrule_after != rrule and status == "ACTIVE":
            changed = True
            next_text = update_rrule_in_toml(next_text, rrule_after)
        if changed and args["apply"]:
            write_text_file_robust(toml_path, next_text, atomic=False)
        if changed:
            report["changed"] += 1

        report["rows"].append(
            {
                "id": automation_id,
                "name": name,
                "status": status,
                "rrule_before": rrule,
                "rrule_after": rrule_after,
                "updated_at": updated_at,
                "prompt": prompt_after,
                "folder": str(entry),
                "prompt_tokens_before": before_tokens,
                "prompt_tokens_after": after_tokens,
                "token_delta": after_tokens - before_tokens,
                "changed": changed,
            }
        )

    if args["prune_duplicates"]:
        signature_map: dict[str, list[dict[str, Any]]] = {}
        for row in report["rows"]:
            signature = f"{str(row.get('name') or '').lower()}|{str(row.get('rrule_after') or '')}|{str(row.get('prompt') or '')}"
            signature_map.setdefault(signature, []).append(row)

        for rows in signature_map.values():
            if len(rows) <= 1:
                continue
            report["duplicate_groups"] += 1
            sorted_rows = sorted(
                rows,
                key=lambda row: (
                    1 if str(row.get("status") or "").upper() == "ACTIVE" else 0,
                    int(row.get("updated_at") or 0),
                ),
                reverse=True,
            )
            keep = sorted_rows[0]
            for row in sorted_rows[1:]:
                row["duplicate_of"] = keep["id"]
                row["redundant"] = True
                if args["apply"] and str(row.get("status") or "").upper() != "ACTIVE":
                    shutil.rmtree(row["folder"], ignore_errors=True)
                    report["deleted"] += 1
                    report["deleted_ids"].append(row["id"])

    report["rows"] = [row for row in report["rows"] if not bool(row.get("redundant")) or str(row.get("id") or "") not in report["deleted_ids"]]
    report["rows"] = [{key: value for key, value in row.items() if key != "folder"} for row in report["rows"]]
    report["rows"].sort(key=lambda row: int(row.get("prompt_tokens_before") or 0), reverse=True)
    return report


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    report = analyze_and_maybe_apply(args)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if report["status"] != "pass" else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as error:
        sys.stderr.write(f"optimize-codex-automations failed: {error}\n")
        raise SystemExit(1)
