#!/usr/bin/env python3
"""Native Python implementation for scripts/validate-script-swap-catalog.js."""

from __future__ import annotations

import json
import pathlib
import sys

from _common import find_repo_root, normalize_path

SUPPORTED_ADAPTER_KINDS = {
    "native_node",
    "python_native_equivalent",
    "cpp_native_equivalent",
    "python_node_bridge",
    "cpp_node_bridge",
}
SUPPORTED_LANGUAGE_IDS = {"javascript", "python", "cpp"}


def issue(level: str, code: str, message: str, details: dict | None = None) -> dict:
    return {
        "level": level,
        "code": code,
        "message": message,
        "details": details or {},
    }


def to_language_id(value: str) -> str:
    return str(value or "").strip().lower()


def run_validation(root: pathlib.Path) -> dict:
    catalog_file = root / "data" / "input" / "shared" / "main" / "polyglot_script_swap_catalog.json"
    issues: list[dict] = []
    if not catalog_file.exists():
        issues.append(issue("error", "missing_catalog", "polyglot script swap catalog file is missing"))
        return {
            "status": "fail",
            "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
            "root": normalize_path(root),
            "files": {"catalog_file": normalize_path(catalog_file.relative_to(root))},
            "metrics": {"stage_count": 0, "adapter_count": 0},
            "issues": issues,
        }

    try:
        catalog = json.loads(catalog_file.read_text(encoding="utf8"))
    except Exception as error:
        issues.append(issue("error", "invalid_catalog_json", "catalog JSON parsing failed", {"error": str(error)}))
        return {
            "status": "fail",
            "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
            "root": normalize_path(root),
            "files": {"catalog_file": normalize_path(catalog_file.relative_to(root))},
            "metrics": {"stage_count": 0, "adapter_count": 0},
            "issues": issues,
        }

    schema_version = catalog.get("schema_version")
    if not isinstance(schema_version, (int, float)) or float(schema_version) <= 0:
        issues.append(issue("error", "invalid_schema_version", "schema_version must be a positive number"))

    runtime_contract = catalog.get("runtime_contract") if isinstance(catalog.get("runtime_contract"), dict) else {}
    env_overrides = runtime_contract.get("env_overrides") if isinstance(runtime_contract.get("env_overrides"), dict) else {}
    for key in ["preferred_language", "ordered_languages", "disable_swaps", "strict_runtime", "auto_select_best"]:
        if not str(env_overrides.get(key, "")).strip():
            issues.append(issue("error", "missing_runtime_env_override", f"runtime_contract.env_overrides is missing '{key}'", {"key": key}))

    baseline_language = to_language_id(runtime_contract.get("baseline_language", ""))
    if baseline_language not in SUPPORTED_LANGUAGE_IDS:
        issues.append(issue("error", "invalid_baseline_language", "runtime_contract.baseline_language is not supported", {"baseline_language": runtime_contract.get("baseline_language")}))

    winner_map_file_raw = str(runtime_contract.get("benchmark_winner_map_file", "")).strip()
    if not winner_map_file_raw:
        issues.append(issue("error", "missing_benchmark_winner_map_file", "runtime_contract.benchmark_winner_map_file is required for benchmark-driven runtime selection"))
    else:
        winner_map_file = root / pathlib.PurePosixPath(winner_map_file_raw.replace("\\", "/"))
        if not winner_map_file.exists():
            issues.append(issue("warn", "missing_benchmark_winner_map_report", "benchmark winner map file is missing", {"benchmark_winner_map_file": normalize_path(winner_map_file.relative_to(root))}))

    adapters = catalog.get("adapters") if isinstance(catalog.get("adapters"), dict) else {}
    for language, adapter in adapters.items():
        language_id = to_language_id(language)
        if language_id not in SUPPORTED_LANGUAGE_IDS:
            issues.append(issue("error", "unsupported_language_id", "adapter language id is unsupported", {"language": language}))
            continue
        kind = str((adapter or {}).get("kind", ""))
        if kind not in SUPPORTED_ADAPTER_KINDS:
            issues.append(issue("error", "unsupported_adapter_kind", f"unsupported adapter kind for {language}", {"language": language, "kind": kind}))
            continue

        if kind in {"python_node_bridge", "cpp_node_bridge"}:
            bridge_script = root / pathlib.PurePosixPath(str((adapter or {}).get("bridge_script", "")).replace("\\", "/"))
            if not bridge_script.exists():
                issues.append(issue("error", "missing_bridge_script", "adapter bridge script file is missing", {"language": language, "bridge_script": normalize_path(bridge_script.relative_to(root))}))

        if kind in {"python_native_equivalent", "cpp_native_equivalent"}:
            equivalent_catalog_file = root / pathlib.PurePosixPath(str((adapter or {}).get("equivalent_catalog_file", "")).replace("\\", "/"))
            if not str((adapter or {}).get("equivalent_catalog_file", "")).strip():
                issues.append(issue("error", "missing_equivalent_catalog_file", "native equivalent adapter requires equivalent_catalog_file", {"language": language}))
            elif not equivalent_catalog_file.exists():
                issues.append(issue("error", "missing_equivalent_catalog", "native equivalent catalog file is missing", {"language": language, "equivalent_catalog_file": normalize_path(equivalent_catalog_file.relative_to(root))}))

        if kind == "cpp_native_equivalent":
            runner_script = root / pathlib.PurePosixPath(str((adapter or {}).get("runner_script", "")).replace("\\", "/"))
            if not str((adapter or {}).get("runner_script", "")).strip():
                issues.append(issue("error", "missing_cpp_runner_script", "cpp native equivalent adapter requires runner_script", {"language": language}))
            elif not runner_script.exists():
                issues.append(issue("error", "missing_cpp_runner_script_file", "cpp native equivalent runner script file is missing", {"language": language, "runner_script": normalize_path(runner_script.relative_to(root))}))

        if "allow_js_fallback" in (adapter or {}) and not isinstance((adapter or {}).get("allow_js_fallback"), bool):
            issues.append(issue("error", "invalid_allow_js_fallback_type", "adapter allow_js_fallback must be boolean when present", {"language": language, "allow_js_fallback": (adapter or {}).get("allow_js_fallback")}))

    stage_map = catalog.get("stage_script_map") if isinstance(catalog.get("stage_script_map"), dict) else {}
    for stage_id, entry in stage_map.items():
        source = entry if isinstance(entry, dict) else {}
        script_value = str(source.get("script_file", "")).strip()
        if not script_value:
            issues.append(issue("error", "missing_stage_script_file", f"stage '{stage_id}' is missing script_file"))
            continue
        script_file = root / pathlib.PurePosixPath(script_value.replace("\\", "/"))
        if not script_file.exists():
            issues.append(issue("error", "missing_stage_script_target", f"script target for stage '{stage_id}' does not exist", {"stage_id": stage_id, "script_file": normalize_path(script_file.relative_to(root))}))

        preferred_language = to_language_id(source.get("preferred_language", ""))
        if preferred_language and preferred_language not in SUPPORTED_LANGUAGE_IDS:
            issues.append(issue("error", "unsupported_stage_preferred_language", "stage preferred_language is unsupported", {"stage_id": stage_id, "preferred_language": source.get("preferred_language")}))

        runtime_order = source.get("runtime_order") if isinstance(source.get("runtime_order"), list) else []
        for value in runtime_order:
            language_id = to_language_id(value)
            if language_id not in SUPPORTED_LANGUAGE_IDS:
                issues.append(issue("error", "unsupported_stage_runtime_order_language", "stage runtime_order includes unsupported language", {"stage_id": stage_id, "language": value}))

        for flag_name in ["allow_swaps", "strict_runtime", "auto_select_from_benchmark"]:
            if flag_name in source and not isinstance(source.get(flag_name), bool):
                issues.append(issue("error", f"invalid_{flag_name}_type", f"stage {flag_name} must be boolean when present", {"stage_id": stage_id, flag_name: source.get(flag_name)}))

        if "benchmark_function_ids" in source:
            benchmark_function_ids = source.get("benchmark_function_ids")
            if not isinstance(benchmark_function_ids, list):
                issues.append(issue("error", "invalid_benchmark_function_ids_type", "stage benchmark_function_ids must be an array when present", {"stage_id": stage_id, "benchmark_function_ids": benchmark_function_ids}))
            else:
                for index, function_id in enumerate(benchmark_function_ids):
                    if not str(function_id or "").strip():
                        issues.append(issue("error", "invalid_benchmark_function_id_value", "stage benchmark_function_ids entries must be non-empty strings", {"stage_id": stage_id, "index": index}))

    errors = [entry for entry in issues if entry.get("level") == "error"]
    return {
        "status": "fail" if errors else "pass",
        "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "root": normalize_path(root),
        "files": {"catalog_file": normalize_path(catalog_file.relative_to(root))},
        "metrics": {"stage_count": len(stage_map), "adapter_count": len(adapters)},
        "issues": issues,
    }


def main(argv: list[str] | None = None) -> int:
    root = find_repo_root(pathlib.Path(__file__))
    report = run_validation(root)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 0 if report["status"] == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
