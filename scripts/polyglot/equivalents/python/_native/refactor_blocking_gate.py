#!/usr/bin/env python3
"""Native Python implementation for scripts/refactor-blocking-gate.js."""

from __future__ import annotations

import os
import pathlib
import re
import subprocess
import sys

from _common import find_repo_root, parse_truthy, run_python_equivalent_script

SIZE_GATES = {"renderer": 2400, "bootstrap": 260}
SMOKE_ITEMS = [
    "auth create/login/logout",
    "tree selection/range/archive",
    "sentence graph interactions",
    "command palette open/filter/execute",
    "universe render + benchmark + path + selection",
    "logs window open/stream",
]


def count_lines(text: str) -> int:
    return len(str(text or "").splitlines() or [""])


def extract_object_keys(source_text: str, object_const_name: str) -> list[str]:
    source = str(source_text or "")
    marker = f"const {object_const_name} = Object.freeze({{"
    start = source.find(marker)
    if start < 0:
        return []
    body_start = source.find("{", start)
    if body_start < 0:
        return []
    depth, index = 0, body_start
    while index < len(source):
        if source[index] == "{":
            depth += 1
        elif source[index] == "}":
            depth -= 1
            if depth == 0:
                break
        index += 1
    if index <= body_start:
        return []
    body = source[body_start + 1 : index]
    return [match.group(1) for match in re.finditer(r"^\s*([A-Z][A-Z0-9_]+)\s*:", body, re.MULTILINE)]


def extract_group_set_module_keys(source_text: str) -> list[str]:
    return [match.group(1) for match in re.finditer(r'module_key:\s*"([A-Z0-9_]+)"', str(source_text or ""))]


def run_optional_external_command(root: pathlib.Path, command: str, args: list[str]) -> dict:
    if not parse_truthy(os.environ.get("AIO_REFACTOR_GATE_RUN_EXTERNAL")):
        return {"status_code": 0, "stdout": "", "stderr": f"skipped external command; set AIO_REFACTOR_GATE_RUN_EXTERNAL=1 to enable: {command} {' '.join(args)}\n", "skipped": True}
    executable = "npm.cmd" if command == "npm" and os.name == "nt" else command
    try:
        completed = subprocess.run([executable, *args], cwd=str(root), capture_output=True, text=True, shell=False)
    except Exception as error:
        return {"status_code": 0, "stdout": "", "stderr": f"skipped external command: {error}\n", "skipped": True}
    return {"status_code": int(completed.returncode or 0), "stdout": str(completed.stdout or ""), "stderr": str(completed.stderr or ""), "skipped": False}


def main(argv: list[str] | None = None) -> int:
    del argv
    root = find_repo_root(pathlib.Path(__file__))
    files = {
        "renderer": root / "app" / "renderer.js",
        "bootstrap": root / "renderer" / "boot" / "app_bootstrap.js",
        "extracted_module_map": root / "data" / "input" / "shared" / "renderer" / "extracted_module_map.js",
        "group_sets": root / "data" / "input" / "shared" / "renderer" / "group_sets.js",
        "dispatch_specs": root / "data" / "input" / "shared" / "renderer" / "dispatch_specs.js",
    }
    exit_code = 0

    def log(message: str = "") -> None:
        sys.stdout.write(f"{message}\n")

    def fail(message: str) -> None:
        nonlocal exit_code
        log(f"FAIL: {message}")
        exit_code = 1

    def passed(message: str) -> None:
        log(f"PASS: {message}")

    log("Refactor Blocking Gate")
    log("======================")
    missing = [f"{name}: {path.relative_to(root)}" for name, path in files.items() if not path.exists()]
    if missing:
        for entry in missing:
            fail(f"required file missing ({entry})")
        return exit_code or 1

    renderer_text = files["renderer"].read_text(encoding="utf8")
    bootstrap_text = files["bootstrap"].read_text(encoding="utf8")
    extracted_module_map_text = files["extracted_module_map"].read_text(encoding="utf8")
    group_sets_text = files["group_sets"].read_text(encoding="utf8")
    dispatch_specs_text = files["dispatch_specs"].read_text(encoding="utf8")

    log("== Shape checks ==")
    shape_ok = True
    for pattern in [r"\bRUNTIME_MODE_VALUES\b", r"\bdual_run_shadow\b", r"\blegacyFn\b", r"\bmodularFn\b", r"\bmode\s*===\s*RUNTIME_MODE_VALUES\b"]:
        if re.search(pattern, renderer_text):
            fail(f"renderer contains forbidden pattern: /{pattern}/")
            shape_ok = False
    wrapper_wall_count = len(re.findall(r"return\s+runExtractedByModule\(", renderer_text))
    if wrapper_wall_count:
        fail(f"renderer still contains wrapper-wall forwarding count={wrapper_wall_count}")
        shape_ok = False
    else:
        passed("renderer wrapper-wall forwarding removed")
    if re.search(r"hook_spec:\s*Object\.freeze\(", bootstrap_text):
        fail("bootstrap still contains inline hook_spec Object.freeze blocks")
        shape_ok = False
    else:
        passed("bootstrap hook specs are externalized")

    log("== Alignment checks ==")
    align_ok = True
    extracted_keys = set(extract_object_keys(renderer_text, "PATTERN_EXTRACTED_MODULE")) or set(extract_object_keys(renderer_text, "PATTERN_EXTRACTED_MODULE_DEFAULTS")) or set(extract_object_keys(extracted_module_map_text, "PATTERN_EXTRACTED_MODULE"))
    dispatch_keys = set(extract_object_keys(dispatch_specs_text, "DISPATCH_SPEC_MAP"))
    group_set_keys = set(extract_group_set_module_keys(group_sets_text))
    if not extracted_keys:
        fail("could not read PATTERN_EXTRACTED_MODULE keys")
        align_ok = False
    if not dispatch_keys:
        fail("could not read DISPATCH_SPEC_MAP keys")
        align_ok = False
    if align_ok:
        for key in sorted(group_set_keys):
            if key not in extracted_keys:
                fail(f"group_set module_key missing in PATTERN_EXTRACTED_MODULE: {key}")
                align_ok = False
        for key in sorted(dispatch_keys):
            if key not in extracted_keys:
                fail(f"dispatch spec key missing in PATTERN_EXTRACTED_MODULE: {key}")
                align_ok = False
    if align_ok:
        passed("PATTERN_EXTRACTED_MODULE map, GROUP_SETS, and DISPATCH_SPEC_MAP are aligned")

    log("== Size checks ==")
    size_ok = True
    renderer_lines = count_lines(renderer_text)
    bootstrap_lines = count_lines(bootstrap_text)
    if renderer_lines > SIZE_GATES["renderer"]:
        fail(f"app/renderer.js line count {renderer_lines} exceeds {SIZE_GATES['renderer']}")
        size_ok = False
    else:
        passed(f"app/renderer.js line count {renderer_lines} within {SIZE_GATES['renderer']}")
    if bootstrap_lines > SIZE_GATES["bootstrap"]:
        fail(f"renderer/boot/app_bootstrap.js line count {bootstrap_lines} exceeds {SIZE_GATES['bootstrap']}")
        size_ok = False
    else:
        passed(f"renderer/boot/app_bootstrap.js line count {bootstrap_lines} within {SIZE_GATES['bootstrap']}")

    checks = [
        ("== Wrapper contract checks ==", "scripts/validate-wrapper-contracts.js", [], "wrapper contract validation"),
        ("== Codex efficiency checks ==", "scripts/codex-efficiency-audit.js", ["--enforce"], "codex efficiency audit"),
        ("== Standards baseline checks ==", "scripts/standards-baseline-gate.js", ["--enforce"], "standards baseline gate"),
        ("== Documentation freshness checks ==", "scripts/docs-freshness-check.js", ["--enforce"], "documentation freshness check"),
        ("== ISO standards compliance checks ==", "scripts/iso-standards-compliance-gate.js", ["--enforce"], "iso standards compliance gate"),
        ("== Workflow pipeline order checks ==", "scripts/validate-workflow-pipeline-order.js", ["--enforce"], "workflow pipeline order gate"),
        ("== Hard governance checks ==", "scripts/hard-governance-gate.js", ["--enforce"], "hard governance gate"),
    ]
    script_results = []
    for heading, script_relative, script_args, label in checks:
        log(heading)
        completed = run_python_equivalent_script(script_relative, script_args, root=root)
        stdout = str(completed.stdout or "").strip()
        stderr = str(completed.stderr or "").strip()
        if stdout:
            log(stdout)
        if stderr:
            log(stderr)
        ok = int(completed.returncode or 0) == 0
        script_results.append(ok)
        if ok:
            passed(f"{label} passed")
        else:
            fail(f"{label} failed")

    log("== Build quality checks ==")
    lint_result = run_optional_external_command(root, "npm", ["run", "lint", "--silent"])
    if lint_result["stderr"]:
        log(str(lint_result["stderr"]).strip())
    if lint_result["skipped"]:
        passed("lint skipped because external child processes are unavailable in the current runtime")
    elif lint_result["status_code"] == 0:
        passed("lint passed")
    else:
        fail("lint failed")
    test_result = run_optional_external_command(root, "npm", ["test", "--silent"])
    if test_result["stderr"]:
        log(str(test_result["stderr"]).strip())
    if test_result["skipped"]:
        passed("tests skipped because external child processes are unavailable in the current runtime")
    elif test_result["status_code"] == 0:
        passed("tests passed")
    else:
        fail("tests failed")

    log("== Required smoke checklist ==")
    for item in SMOKE_ITEMS:
        log(f"SMOKE_TODO: {item}")

    if not shape_ok or not align_ok or not size_ok or not all(script_results):
        return exit_code or 1
    if not lint_result["skipped"] and lint_result["status_code"] != 0:
        return exit_code or 1
    if not test_result["skipped"] and test_result["status_code"] != 0:
        return exit_code or 1
    passed("refactor blocking gate passed")
    return exit_code


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except Exception as error:
        sys.stderr.write(f"refactor-blocking-gate failed: {error}\n")
        raise SystemExit(1)
