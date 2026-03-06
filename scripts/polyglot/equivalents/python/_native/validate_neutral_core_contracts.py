#!/usr/bin/env python3
"""Native Python implementation for scripts/validate-neutral-core-contracts.js."""

from __future__ import annotations

import json
import pathlib
import re
import sys
from datetime import UTC, datetime
from typing import Any

from _common import find_repo_root, normalize_path, write_text_file_robust
from generate_neutral_core_assets import OUTPUT_FILES, check_neutral_core_assets

CORE_CONTRACT_PATH = pathlib.PurePosixPath("data/input/shared/core/core_contract_catalog.json")
RUNTIME_SOURCES_PATH = pathlib.PurePosixPath("data/input/shared/core/runtime_implementation_sources.json")
STORAGE_CONTRACT_PATH = pathlib.PurePosixPath("data/input/shared/core/storage_provider_contract.json")
SHELL_CONTRACT_PATH = pathlib.PurePosixPath("data/input/shared/core/shell_adapter_contract.json")
ELECTRON_SHELL_CATALOG_PATH = pathlib.PurePosixPath("data/input/shared/core/electron_shell_adapter_catalog.json")
IPC_CHANNELS_PATH = pathlib.PurePosixPath("main/ipc/ipc_channels.js")
IPC_EVENTS_PATH = pathlib.PurePosixPath("main/ipc/ipc_events.js")
DEFAULT_REPORT_FILE = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/analysis/neutral_core_validation_report.json"
)

REQUIRED_SUBSYSTEMS = ("math_core", "shell_core", "storage_core")
REQUIRED_RUNTIMES = ("javascript", "python", "cpp", "ruby")
REQUIRED_STORAGE_BACKENDS = ("memory", "raw_file", "sqlite")
REQUIRED_SHELLS = ("electron", "winui", "winforms", "qt")
ELECTRON_ADAPTER_PATH = "main/shell/electron_shell_adapter.js"


def parse_args(argv: list[str]) -> dict[str, bool]:
    return {"strict": "--no-strict" not in argv}


def read_json(root: pathlib.Path, relative_path: pathlib.PurePosixPath) -> dict[str, Any]:
    return json.loads((root / relative_path).read_text(encoding="utf8"))


def issue(level: str, issue_type: str, detail: str, extra: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "level": level,
        "type": issue_type,
        "detail": detail,
        **(extra or {}),
    }


def normalize_binding_id(value: Any) -> str:
    return str(value or "").strip()


def split_method_path(method_path: Any) -> dict[str, str] | None:
    tokens = [token.strip() for token in str(method_path or "").split(".") if token.strip()]
    if len(tokens) < 2:
        return None
    return {"namespace": tokens[0], "method": ".".join(tokens[1:])}


def parse_ipc_domains(source_text: str) -> dict[str, str]:
    match = re.search(r"const PATTERN_IPC_DOMAIN = Object\.freeze\(\{(.*?)\}\);", source_text, re.DOTALL)
    body = match.group(1) if match else ""
    return {key: value for key, value in re.findall(r'([A-Z0-9_]+)\s*:\s*"([^"]+)"', body)}


def parse_ipc_channel_map(source_text: str, domains: dict[str, str], object_name: str) -> dict[str, str]:
    match = re.search(rf"const {re.escape(object_name)} = Object\.freeze\(\{{(.*?)\}}\);", source_text, re.DOTALL)
    body = match.group(1) if match else ""
    output: dict[str, str] = {}
    for key, domain_key, action in re.findall(
        r'([A-Z0-9_]+)\s*:\s*build_ipc_channel\(PATTERN_IPC_DOMAIN\.([A-Z0-9_]+),\s*"([^"]+)"\)',
        body,
    ):
        domain = domains.get(domain_key, "")
        if domain:
            output[key] = f"{domain}:{action}"
    return output


def resolve_bindings_by_id(rows: list[dict[str, Any]], key_name: str) -> dict[str, dict[str, Any]]:
    return {
        normalize_binding_id(row.get(key_name)): row
        for row in rows
        if normalize_binding_id(row.get(key_name))
    }


def validate_electron_shell_adapter(root: pathlib.Path) -> dict[str, Any]:
    shell_contract = read_json(root, SHELL_CONTRACT_PATH)
    catalog = read_json(root, ELECTRON_SHELL_CATALOG_PATH)
    ipc_channels_source = (root / IPC_CHANNELS_PATH).read_text(encoding="utf8")
    ipc_events_source = (root / IPC_EVENTS_PATH).read_text(encoding="utf8")
    domains = parse_ipc_domains(ipc_channels_source)
    ipc_channels = parse_ipc_channel_map(ipc_channels_source, domains, "IPC_CHANNELS")
    ipc_events = parse_ipc_channel_map(ipc_events_source, domains, "IPC_EVENTS")

    command_bindings_by_id = resolve_bindings_by_id(list(catalog.get("command_bindings") or []), "command_id")
    event_bindings_by_id = resolve_bindings_by_id(list(catalog.get("event_bindings") or []), "event_id")
    view_bindings_by_id = resolve_bindings_by_id(list(catalog.get("view_bindings") or []), "view_id")
    shells = shell_contract.get("shells") if isinstance(shell_contract.get("shells"), dict) else {}
    electron_shell = shells.get("electron") if isinstance(shells.get("electron"), dict) else None
    contract_commands = list(shell_contract.get("commands") or [])
    contract_events = list(shell_contract.get("events") or [])
    contract_views = list(shell_contract.get("views") or [])
    issues: list[dict[str, Any]] = []

    if electron_shell is None:
        issues.append(issue("error", "missing_electron_shell_contract", "shell adapter contract is missing electron shell definition"))
    elif normalize_path(electron_shell.get("adapter_path")) != ELECTRON_ADAPTER_PATH:
        issues.append(
            issue(
                "error",
                "electron_adapter_path_mismatch",
                "electron shell adapter path does not match contract",
                {
                    "expected": ELECTRON_ADAPTER_PATH,
                    "actual": normalize_path(electron_shell.get("adapter_path")),
                },
            )
        )

    for command_id in contract_commands:
        binding = command_bindings_by_id.get(command_id)
        if not binding:
            issues.append(issue("error", "missing_command_binding", "shell command is missing electron binding", {"command_id": command_id}))
            continue
        if not ipc_channels.get(normalize_binding_id(binding.get("channel_key"))):
            issues.append(
                issue(
                    "error",
                    "unknown_command_channel_key",
                    "electron shell command binding references unknown IPC channel key",
                    {"command_id": command_id, "channel_key": binding.get("channel_key")},
                )
            )
        if split_method_path(binding.get("preload_method_path")) is None:
            issues.append(
                issue(
                    "error",
                    "invalid_preload_method_path",
                    "electron shell command binding preload method path must be namespace.method",
                    {"command_id": command_id, "preload_method_path": str(binding.get("preload_method_path") or "")},
                )
            )

    for command_id in command_bindings_by_id:
        if command_id not in contract_commands:
            issues.append(issue("error", "orphan_command_binding", "electron shell adapter contains command binding not present in shell contract", {"command_id": command_id}))

    for event_id in contract_events:
        binding = event_bindings_by_id.get(event_id)
        if not binding:
            issues.append(issue("error", "missing_event_binding", "shell event is missing electron binding", {"event_id": event_id}))
            continue
        if not ipc_events.get(normalize_binding_id(binding.get("event_key"))):
            issues.append(
                issue(
                    "error",
                    "unknown_event_key",
                    "electron shell event binding references unknown IPC event key",
                    {"event_id": event_id, "event_key": binding.get("event_key")},
                )
            )

    for event_id in event_bindings_by_id:
        if event_id not in contract_events:
            issues.append(issue("error", "orphan_event_binding", "electron shell adapter contains event binding not present in shell contract", {"event_id": event_id}))

    for view_id in contract_views:
        binding = view_bindings_by_id.get(view_id)
        if not binding:
            issues.append(issue("error", "missing_view_binding", "shell view is missing electron binding", {"view_id": view_id}))
            continue
        window_html = str(binding.get("window_html") or "")
        if window_html:
            absolute_path = root / pathlib.PurePosixPath(normalize_path(window_html))
            if not absolute_path.exists():
                issues.append(
                    issue(
                        "error",
                        "missing_window_markup",
                        "electron window binding references missing markup file",
                        {"view_id": view_id, "window_html": normalize_path(absolute_path.relative_to(root))},
                    )
                )
            continue
        window_binding = view_bindings_by_id.get(normalize_binding_id(binding.get("window_view_id")))
        if not window_binding or not str(window_binding.get("window_html") or ""):
            issues.append(
                issue(
                    "error",
                    "missing_parent_window_binding",
                    "page/control binding references missing parent window binding",
                    {"view_id": view_id, "window_view_id": str(binding.get("window_view_id") or "")},
                )
            )
            continue
        html_path = root / pathlib.PurePosixPath(normalize_path(window_binding.get("window_html")))
        markup = html_path.read_text(encoding="utf8") if html_path.exists() else ""
        dom_id = str(binding.get("dom_id") or "")
        if f'id="{dom_id}"' not in markup:
            issues.append(
                issue(
                    "error",
                    "missing_view_dom_id",
                    "electron page/control binding dom id not found in window markup",
                    {
                        "view_id": view_id,
                        "dom_id": dom_id,
                        "window_html": normalize_path(html_path.relative_to(root)),
                    },
                )
            )

    for view_id in view_bindings_by_id:
        if view_id not in contract_views:
            issues.append(issue("error", "orphan_view_binding", "electron shell adapter contains view binding not present in shell contract", {"view_id": view_id}))

    error_count = sum(1 for row in issues if row.get("level") == "error")
    warning_count = sum(1 for row in issues if row.get("level") == "warn")
    return {
        "status": "fail" if error_count else "pass",
        "shell_id": "electron",
        "counts": {
            "commands": len(contract_commands),
            "events": len(contract_events),
            "views": len(contract_views),
            "errors": error_count,
            "warnings": warning_count,
        },
        "issues": issues,
    }


def validate_neutral_core(*, root: pathlib.Path | str | None = None) -> dict[str, Any]:
    workspace_root = find_repo_root(root or pathlib.Path(__file__))
    report: dict[str, Any] = {
        "status": "pass",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": ".",
        "report_file": normalize_path(DEFAULT_REPORT_FILE),
        "counts": {"errors": 0, "warnings": 0},
        "issues": [],
    }
    report_path = workspace_root / DEFAULT_REPORT_FILE

    generation = check_neutral_core_assets(root=workspace_root, quiet=True)
    if generation["status"] != "pass":
        report["status"] = "fail"
        report["issues"].extend(generation.get("issues") or [])

    core_doc = read_json(workspace_root, CORE_CONTRACT_PATH)
    runtime_sources = read_json(workspace_root, RUNTIME_SOURCES_PATH)
    storage_contract = read_json(workspace_root, STORAGE_CONTRACT_PATH)
    shell_contract = read_json(workspace_root, SHELL_CONTRACT_PATH)
    runtime_manifest = read_json(workspace_root, pathlib.PurePosixPath(OUTPUT_FILES["runtime_manifest"]))
    storage_manifest = read_json(workspace_root, pathlib.PurePosixPath(OUTPUT_FILES["storage_manifest"]))
    shell_manifest = read_json(workspace_root, pathlib.PurePosixPath(OUTPUT_FILES["shell_manifest"]))

    subsystems = core_doc.get("subsystems") if isinstance(core_doc.get("subsystems"), dict) else {}
    runtimes = runtime_sources.get("runtimes") if isinstance(runtime_sources.get("runtimes"), dict) else {}
    providers = storage_contract.get("providers") if isinstance(storage_contract.get("providers"), dict) else {}
    shells = shell_contract.get("shells") if isinstance(shell_contract.get("shells"), dict) else {}

    for subsystem_id in REQUIRED_SUBSYSTEMS:
        if subsystem_id not in subsystems:
            report["issues"].append(issue("error", "missing_subsystem_contract", "missing required subsystem contract", {"subsystem_id": subsystem_id}))

    for runtime_id in REQUIRED_RUNTIMES:
        if runtime_id not in runtimes:
            report["issues"].append(issue("error", "missing_runtime_source", "missing runtime implementation source", {"runtime_id": runtime_id}))

    for backend_id in REQUIRED_STORAGE_BACKENDS:
        if backend_id not in providers:
            report["issues"].append(issue("error", "missing_storage_backend", "missing storage backend contract", {"backend_id": backend_id}))

    for shell_id in REQUIRED_SHELLS:
        if shell_id not in shells:
            report["issues"].append(issue("error", "missing_shell_contract", "missing shell adapter contract", {"shell_id": shell_id}))

    if str(storage_contract.get("default_backend") or "") != "raw_file":
        report["issues"].append(
            issue(
                "warn",
                "unexpected_default_storage_backend",
                "default storage backend is not raw_file",
                {"actual": str(storage_contract.get("default_backend") or "")},
            )
        )

    if not list(shell_contract.get("commands") or []):
        report["issues"].append(issue("error", "missing_shell_commands", "shell adapter contract must define commands"))
    if not list(shell_contract.get("views") or []):
        report["issues"].append(issue("error", "missing_shell_views", "shell adapter contract must define views"))

    math_core_subsystem = ((runtime_manifest.get("subsystems") or {}).get("math_core")) or None
    if not math_core_subsystem or not math_core_subsystem.get("benchmark"):
        report["issues"].append(issue("error", "missing_math_core_benchmark", "runtime implementation manifest is missing math_core benchmark data"))

    runtime_manifest_runtimes = runtime_manifest.get("runtimes") if isinstance(runtime_manifest.get("runtimes"), dict) else {}
    for runtime_id in REQUIRED_RUNTIMES:
        runtime_row = runtime_manifest_runtimes.get(runtime_id)
        if not runtime_row:
            report["issues"].append(issue("error", "missing_runtime_manifest_row", "runtime implementation manifest missing runtime row", {"runtime_id": runtime_id}))
            continue
        subsystem = ((runtime_row.get("subsystems") or {}).get("math_core")) or None
        if not subsystem:
            report["issues"].append(issue("error", "missing_math_core_runtime", "runtime missing math_core implementation", {"runtime_id": runtime_id}))
            continue
        artifact = str(subsystem.get("artifact") or "")
        if str(subsystem.get("status") or "") != "implemented":
            report["issues"].append(issue("error", "math_core_not_implemented", "math_core must be implemented for all required runtimes", {"runtime_id": runtime_id}))
        if "repo_polyglot_equivalents" in artifact or "repo-polyglot-module-bridge" in artifact:
            report["issues"].append(issue("error", "proxy_backed_runtime_artifact", "math_core artifact may not use proxy-backed equivalents", {"runtime_id": runtime_id, "artifact": artifact}))
        if subsystem.get("production_ready") is not True:
            report["issues"].append(issue("error", "runtime_not_production_ready", "math_core implementation is not marked production_ready", {"runtime_id": runtime_id}))

    if len(list(storage_manifest.get("operations") or [])) < 5:
        report["issues"].append(issue("error", "storage_manifest_incomplete", "storage backend manifest is missing required operations"))
    if "electron" not in list(shell_manifest.get("implemented_shells") or []):
        report["issues"].append(issue("error", "electron_shell_not_implemented", "shell manifest must list electron as implemented"))

    electron_shell_validation = validate_electron_shell_adapter(workspace_root)
    if electron_shell_validation["status"] != "pass":
        for adapter_issue in electron_shell_validation.get("issues") or []:
            report["issues"].append(
                issue(
                    str(adapter_issue.get("level") or "error"),
                    str(adapter_issue.get("type") or "electron_shell_adapter_issue"),
                    str(adapter_issue.get("detail") or "electron shell adapter validation failed"),
                    adapter_issue,
                )
            )

    report["counts"]["errors"] = sum(1 for row in report["issues"] if row.get("level") == "error")
    report["counts"]["warnings"] = sum(1 for row in report["issues"] if row.get("level") == "warn")
    if report["counts"]["errors"] > 0:
        report["status"] = "fail"

    write_text_file_robust(report_path, f"{json.dumps(report, indent=2)}\n", atomic=False)
    return report


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    report = validate_neutral_core(root=pathlib.Path.cwd())
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    if args["strict"] and report["status"] != "pass":
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
