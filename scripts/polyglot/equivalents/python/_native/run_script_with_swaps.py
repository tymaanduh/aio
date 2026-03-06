#!/usr/bin/env python3
"""Native Python implementation for scripts/run-script-with-swaps.js."""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

from lib.polyglot_script_swap_runner import run_script_with_swaps


def parse_args(argv: list[str]) -> dict[str, Any]:
    args: dict[str, Any] = {
        "stage_id": "",
        "script": "",
        "preferred_language": "",
        "runtime_order": [],
        "strict_runtime": False,
        "auto_select_best": False,
        "allow_swaps": True,
        "cwd": "",
        "script_args": [],
    }

    passthrough = False
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if passthrough:
            args["script_args"].append(token)
            index += 1
            continue
        if token == "--":
            passthrough = True
            index += 1
            continue
        if token == "--stage-id" and index + 1 < len(argv):
            args["stage_id"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--script" and index + 1 < len(argv):
            args["script"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--preferred-language" and index + 1 < len(argv):
            args["preferred_language"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--runtime-order" and index + 1 < len(argv):
            args["runtime_order"] = [
                str(entry or "").strip()
                for entry in str(argv[index + 1] or "").split(",")
                if str(entry or "").strip()
            ]
            index += 2
            continue
        if token == "--cwd" and index + 1 < len(argv):
            args["cwd"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--strict-runtime":
            args["strict_runtime"] = True
            index += 1
            continue
        if token == "--auto-select-best":
            args["auto_select_best"] = True
            index += 1
            continue
        if token == "--no-swaps":
            args["allow_swaps"] = False
            index += 1
            continue
        index += 1

    return args


def main(argv: list[str] | None = None) -> int:
    try:
        args = parse_args(list(argv or []))
        if not args["script"] and not args["stage_id"]:
            raise RuntimeError("run-script-with-swaps requires --script or --stage-id")

        result = run_script_with_swaps(
            {
                "stageId": args["stage_id"],
                "scriptPath": str(pathlib.Path(args["script"]).resolve()) if args["script"] else "",
                "scriptArgs": args["script_args"],
                "preferredLanguage": args["preferred_language"],
                "runtimeOrder": args["runtime_order"],
                "strictRuntime": args["strict_runtime"],
                "autoSelectBest": args["auto_select_best"],
                "allowSwaps": args["allow_swaps"],
                "cwd": str(pathlib.Path(args["cwd"]).resolve()) if args["cwd"] else str(pathlib.Path.cwd()),
            }
        )

        if result.get("stdout"):
            sys.stdout.write(str(result["stdout"]))
        if result.get("stderr"):
            sys.stderr.write(str(result["stderr"]))
        return int(result.get("statusCode") or 0)
    except Exception as error:
        sys.stderr.write(f"run-script-with-swaps failed: {error}\n")
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
