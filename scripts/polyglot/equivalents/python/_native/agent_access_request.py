#!/usr/bin/env python3
"""Native Python implementation for scripts/agent-access-request.js."""

from __future__ import annotations

import json
import pathlib
import sys
import uuid
from datetime import UTC, datetime
from typing import Any

from project_source_resolver_native import resolve_agent_access_control, resolve_request_log_file

RUNTIME_CONTEXT = {
    "root": pathlib.Path.cwd(),
    "policy_path": pathlib.Path.cwd(),
}


def print_help_and_exit(code: int) -> int:
    help_text = "\n".join(
        [
            "agent-access-request",
            "",
            "Usage:",
            '  npm run agent:request-access -- --agent-id <id> --requested-tool <tool-id> --privilege-flag <flag-id> --reason "<why-needed>"',
            "",
            "Options:",
            "  --agent-id <id>                     Agent id in to-do/agents/agent_access_control.json",
            "  --requested-tool <tool-id>          Requested tool id (repeatable)",
            "  --requested-toolset <a,b,c>         Comma-separated requested tools",
            "  --requested-control <control-id>    Requested control scope entry (repeatable)",
            "  --privilege-flag <flag-id>          Privilege flag id (repeatable)",
            '  --reason "text"                    Required explanation for escalation',
            '  --explanation "text"               Alias for --reason',
            "  --help                              Show help",
        ]
    )
    sys.stdout.write(f"{help_text}\n")
    return code


def to_unique_sorted(values: Any) -> list[str]:
    return sorted({str(value or "").strip() for value in (values if isinstance(values, list) else []) if str(value or "").strip()})


def parse_args(argv: list[str]) -> dict[str, Any]:
    args = {
        "agent_id": "",
        "requested_tools": [],
        "requested_controls": [],
        "privilege_flags": [],
        "reason": "",
    }

    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--agent-id":
            args["agent_id"] = str(argv[index + 1] if index + 1 < len(argv) else "").strip()
            index += 2
            continue
        if token == "--requested-tool":
            value = str(argv[index + 1] if index + 1 < len(argv) else "").strip()
            if value:
                args["requested_tools"].append(value)
            index += 2
            continue
        if token == "--requested-toolset":
            value = str(argv[index + 1] if index + 1 < len(argv) else "").strip()
            if value:
                args["requested_tools"].extend(item.strip() for item in value.split(",") if item.strip())
            index += 2
            continue
        if token == "--requested-control":
            value = str(argv[index + 1] if index + 1 < len(argv) else "").strip()
            if value:
                args["requested_controls"].append(value)
            index += 2
            continue
        if token == "--privilege-flag":
            value = str(argv[index + 1] if index + 1 < len(argv) else "").strip()
            if value:
                args["privilege_flags"].append(value)
            index += 2
            continue
        if token in {"--reason", "--explanation"}:
            args["reason"] = str(argv[index + 1] if index + 1 < len(argv) else "").strip()
            index += 2
            continue
        if token in {"--help", "-h"}:
            raise SystemExit(print_help_and_exit(0))
        raise RuntimeError(f"unknown argument: {token}")

    args["requested_tools"] = to_unique_sorted(args["requested_tools"])
    args["requested_controls"] = to_unique_sorted(args["requested_controls"])
    args["privilege_flags"] = to_unique_sorted(args["privilege_flags"])

    if not args["agent_id"]:
        raise RuntimeError("--agent-id is required")
    if not args["requested_tools"]:
        raise RuntimeError("at least one --requested-tool (or --requested-toolset) is required")
    if not args["privilege_flags"]:
        raise RuntimeError("at least one --privilege-flag is required")
    if not args["reason"]:
        raise RuntimeError("--reason (or --explanation) is required")
    return args


def read_policy() -> dict[str, Any]:
    resolved = resolve_agent_access_control(pathlib.Path.cwd())
    RUNTIME_CONTEXT["root"] = pathlib.Path(resolved["root"]).resolve()
    RUNTIME_CONTEXT["policy_path"] = pathlib.Path(resolved["policy_path"]).resolve()
    return dict(resolved["policy"] or {})


def validate_request(args: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    errors: list[str] = []
    warnings: list[str] = []

    system = policy.get("system") if isinstance(policy.get("system"), dict) else {}
    request_contract = system.get("request_contract") if isinstance(system.get("request_contract"), dict) else {}
    privilege_flags = to_unique_sorted(policy.get("privilege_flags"))
    agents = policy.get("agents") if isinstance(policy.get("agents"), dict) else {}
    agent = agents.get(args["agent_id"]) if isinstance(agents.get(args["agent_id"]), dict) else None

    if not agent:
        errors.append(f"agent not registered in policy: {args['agent_id']}")
        return {"errors": errors, "warnings": warnings}

    startup_tools = to_unique_sorted(agent.get("startup_tools"))
    startup_tool_cap = int(agent.get("startup_tool_cap") or len(startup_tools))
    allowed_controls = to_unique_sorted(agent.get("allowed_controls"))
    non_startup_tools = [tool_id for tool_id in args["requested_tools"] if tool_id not in startup_tools]
    startup_only_tools = [tool_id for tool_id in args["requested_tools"] if tool_id in startup_tools]
    invalid_flags = [flag_id for flag_id in args["privilege_flags"] if flag_id not in privilege_flags]
    out_of_scope_controls = [control_id for control_id in args["requested_controls"] if control_id not in allowed_controls]
    reason_min_chars = int(request_contract.get("reason_min_chars") or 1)

    if startup_tool_cap > 0 and len(startup_tools) > startup_tool_cap:
        warnings.append(
            f"policy mismatch for {args['agent_id']}: startup_tools ({len(startup_tools)}) exceed startup_tool_cap ({startup_tool_cap})"
        )
    if system.get("request_required_for_non_startup_tools") is True and not non_startup_tools:
        errors.append("requested tools are already in startup_tools; escalation request is not required")
    if invalid_flags:
        errors.append(f"invalid privilege flags: {', '.join(invalid_flags)}")
    if len(args["reason"]) < reason_min_chars:
        errors.append(f"reason must be at least {reason_min_chars} characters")
    if out_of_scope_controls:
        warnings.append(f"requested controls are outside current allowed_controls: {', '.join(out_of_scope_controls)}")
    if startup_only_tools:
        warnings.append(f"startup tool IDs included and ignored for escalation: {', '.join(startup_only_tools)}")

    return {
        "errors": errors,
        "warnings": warnings,
        "agent": agent,
        "startup_tools": startup_tools,
        "startup_tool_cap": startup_tool_cap,
        "allowed_controls": allowed_controls,
        "non_startup_tools": non_startup_tools,
    }


def resolve_log_file(policy: dict[str, Any]) -> pathlib.Path:
    return pathlib.Path(
        resolve_request_log_file(
            pathlib.Path(RUNTIME_CONTEXT["root"]),
            pathlib.Path(RUNTIME_CONTEXT["policy_path"]),
            policy,
        )
    ).resolve()


def append_request_log(log_file_path: pathlib.Path, payload: dict[str, Any]) -> None:
    log_file_path.parent.mkdir(parents=True, exist_ok=True)
    with log_file_path.open("a", encoding="utf8") as handle:
        handle.write(f"{json.dumps(payload)}\n")


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    policy = read_policy()
    validation = validate_request(args, policy)
    request_contract = (
        policy.get("system", {}).get("request_contract", {})
        if isinstance(policy.get("system"), dict) and isinstance(policy.get("system", {}).get("request_contract"), dict)
        else {}
    )
    default_status = str(request_contract.get("default_status") or "pending").strip() or "pending"

    if validation["errors"]:
        sys.stderr.write(f"{json.dumps({'ok': False, 'errors': validation['errors'], 'warnings': validation['warnings']}, indent=2)}\n")
        return 1

    log_file_path = resolve_log_file(policy)
    root = pathlib.Path(RUNTIME_CONTEXT["root"])
    request_payload = {
        "request_id": f"req_{uuid.uuid4()}",
        "requested_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "agent_id": args["agent_id"],
        "role": str(validation["agent"].get("role") or ""),
        "policy_mode": str(policy.get("system", {}).get("policy_mode") or "") if isinstance(policy.get("system"), dict) else "",
        "startup_tool_cap": validation["startup_tool_cap"],
        "startup_tools": validation["startup_tools"],
        "allowed_controls": validation["allowed_controls"],
        "requested_tools": args["requested_tools"],
        "requested_non_startup_tools": validation["non_startup_tools"],
        "requested_controls": args["requested_controls"],
        "requested_privilege_flags": args["privilege_flags"],
        "reason": args["reason"],
        "status": default_status,
        "review": {
            "decided_at": None,
            "decision": "pending",
            "reviewer": None,
            "notes": "",
        },
        "warnings": validation["warnings"],
    }
    append_request_log(log_file_path, request_payload)

    sys.stdout.write(
        f"{json.dumps({'ok': True, 'request_id': request_payload['request_id'], 'log_file': log_file_path.relative_to(root).as_posix(), 'agent_id': args['agent_id'], 'requested_non_startup_tools': request_payload['requested_non_startup_tools'], 'requested_privilege_flags': args['privilege_flags'], 'status': request_payload['status'], 'warnings': validation['warnings']}, indent=2)}\n"
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except Exception as error:
        sys.stderr.write(f"agent-access-request failed: {error}\n")
        raise SystemExit(1)
