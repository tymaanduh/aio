#!/usr/bin/env python3
"""Native Python helpers for script runtime selection and swap execution."""

from __future__ import annotations

import json
import os
import pathlib
import shutil
import subprocess
import sys
import time
from typing import Any

from _common import find_repo_root, normalize_path

ROOT = find_repo_root(pathlib.Path(__file__))
DEFAULT_CATALOG_FILE = ROOT / "data" / "input" / "shared" / "main" / "polyglot_script_swap_catalog.json"
DEFAULT_BENCHMARK_WINNER_MAP_FILE = (
    ROOT / "data" / "output" / "databases" / "polyglot-default" / "reports" / "polyglot_runtime_winner_map.json"
)

BENCHMARK_WINNER_MAP_CACHE: dict[str, dict[str, Any]] = {}
EQUIVALENT_CATALOG_CACHE: dict[str, dict[str, Any]] = {}


def read_json_file(file_path: pathlib.Path, fallback: Any = None) -> Any:
    try:
        if not file_path.exists():
            return fallback
        return json.loads(file_path.read_text(encoding="utf8"))
    except Exception:
        return fallback


def load_equivalent_catalog(file_path: str | pathlib.Path) -> dict[str, Any]:
    absolute_path = resolve_path_from_root(file_path)
    cache_key = str(absolute_path).lower()
    if cache_key not in EQUIVALENT_CATALOG_CACHE:
        EQUIVALENT_CATALOG_CACHE[cache_key] = read_json_file(absolute_path, {}) or {}
    return EQUIVALENT_CATALOG_CACHE[cache_key]


def to_language_id(value: Any) -> str:
    return str(value or "").strip().lower()


def parse_truthy(value: Any) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


def to_unique_language_list(values: Any) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values if isinstance(values, list) else []:
        language = to_language_id(value)
        if not language or language in seen:
            continue
        seen.add(language)
        result.append(language)
    return result


def to_unique_string_list(values: Any) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values if isinstance(values, list) else []:
        text = str(value or "").strip()
        if not text or text in seen:
            continue
        seen.add(text)
        result.append(text)
    return result


def parse_language_order_csv(value: Any) -> list[str]:
    return to_unique_language_list(
        [entry.strip() for entry in str(value or "").split(",") if str(entry or "").strip()]
    )


def command_exists(command: Any) -> bool:
    candidate = str(command or "").strip()
    if not candidate:
        return False
    if os.path.isabs(candidate) and pathlib.Path(candidate).exists():
        return True
    return shutil.which(candidate) is not None


def detect_python_runtime() -> dict[str, Any] | None:
    explicit_python_exec = str(os.environ.get("AIO_PYTHON_EXEC", "") or "").strip()
    if explicit_python_exec:
        return {
            "command": explicit_python_exec,
            "args_prefix": [],
            "label": explicit_python_exec,
        }
    if sys.executable and command_exists(sys.executable):
        return {
            "command": sys.executable,
            "args_prefix": [],
            "label": sys.executable,
        }
    if command_exists("python"):
        return {"command": "python", "args_prefix": [], "label": "python"}
    if command_exists("py"):
        return {"command": "py", "args_prefix": ["-3"], "label": "py -3"}
    return None


def detect_node_runtime() -> dict[str, Any] | None:
    explicit_node_exec = str(os.environ.get("AIO_NODE_EXEC", "") or "").strip()
    if explicit_node_exec:
        return {"command": explicit_node_exec, "args_prefix": [], "label": explicit_node_exec}
    if command_exists("node"):
        return {"command": "node", "args_prefix": [], "label": "node"}
    return None


def resolve_path_from_root(value: str | pathlib.Path) -> pathlib.Path:
    candidate = pathlib.Path(str(value or ""))
    return candidate if candidate.is_absolute() else (ROOT / candidate).resolve()


def load_catalog(catalog_file: str | pathlib.Path = DEFAULT_CATALOG_FILE) -> dict[str, Any]:
    absolute_catalog_file = resolve_path_from_root(catalog_file)
    fallback = {
        "schema_version": 1,
        "catalog_id": "aio_polyglot_script_swap_catalog",
        "runtime_contract": {
            "baseline_language": "javascript",
            "default_language_order": ["javascript", "python", "cpp"],
            "fallback_language": "javascript",
            "benchmark_winner_map_file": normalize_path(
                os.path.relpath(DEFAULT_BENCHMARK_WINNER_MAP_FILE, ROOT)
            ),
            "env_overrides": {
                "preferred_language": "AIO_SCRIPT_RUNTIME_LANGUAGE",
                "ordered_languages": "AIO_SCRIPT_RUNTIME_ORDER",
                "disable_swaps": "AIO_SCRIPT_RUNTIME_DISABLE",
                "strict_runtime": "AIO_SCRIPT_RUNTIME_STRICT",
                "auto_select_best": "AIO_SCRIPT_RUNTIME_AUTO_BEST",
            },
        },
        "adapters": {},
        "stage_script_map": {},
    }
    return read_json_file(absolute_catalog_file, fallback) or fallback


def resolve_stage_policy(stage_id: str, catalog: dict[str, Any]) -> dict[str, Any]:
    stage_map = catalog.get("stage_script_map") if isinstance(catalog.get("stage_script_map"), dict) else {}
    policy = stage_map.get(stage_id) if isinstance(stage_map.get(stage_id), dict) else {}
    return {
        "script_file": str(policy.get("script_file") or ""),
        "preferred_language": to_language_id(policy.get("preferred_language")),
        "runtime_order": to_unique_language_list(policy.get("runtime_order")),
        "allow_swaps": policy.get("allow_swaps") if isinstance(policy.get("allow_swaps"), bool) else None,
        "strict_runtime": bool(policy.get("strict_runtime")) if isinstance(policy.get("strict_runtime"), bool) else False,
        "auto_select_from_benchmark": bool(policy.get("auto_select_from_benchmark"))
        if isinstance(policy.get("auto_select_from_benchmark"), bool)
        else False,
        "benchmark_function_ids": to_unique_string_list(policy.get("benchmark_function_ids")),
    }


def load_benchmark_winner_map(catalog: dict[str, Any]) -> dict[str, Any]:
    contract = catalog.get("runtime_contract") if isinstance(catalog.get("runtime_contract"), dict) else {}
    map_file_from_catalog = str(contract.get("benchmark_winner_map_file") or "").strip()
    winner_map_path = (
        resolve_path_from_root(map_file_from_catalog) if map_file_from_catalog else DEFAULT_BENCHMARK_WINNER_MAP_FILE
    )
    cache_key = str(winner_map_path).lower()
    if cache_key not in BENCHMARK_WINNER_MAP_CACHE:
        BENCHMARK_WINNER_MAP_CACHE[cache_key] = {
            "file_path": str(winner_map_path),
            "data": read_json_file(winner_map_path, {}) or {},
        }
    return BENCHMARK_WINNER_MAP_CACHE[cache_key]


def resolve_benchmark_preferred_language(input_data: dict[str, Any] | None = None) -> str:
    input_payload = input_data or {}
    stage_policy = input_payload.get("stagePolicy") if isinstance(input_payload.get("stagePolicy"), dict) else {}
    if stage_policy.get("auto_select_from_benchmark") is not True:
        return ""

    catalog = input_payload.get("catalog") if isinstance(input_payload.get("catalog"), dict) else load_catalog()
    adapters = catalog.get("adapters") if isinstance(catalog.get("adapters"), dict) else {}
    supported_languages = {
        to_language_id(entry)
        for entry in adapters.keys()
        if to_language_id(entry)
    }
    if not supported_languages:
        return ""

    winner_map_payload = load_benchmark_winner_map(catalog)
    winner_map = winner_map_payload.get("data") if isinstance(winner_map_payload.get("data"), dict) else {}
    function_ids = to_unique_string_list(stage_policy.get("benchmark_function_ids"))

    if function_ids:
        per_function = winner_map.get("per_function") if isinstance(winner_map.get("per_function"), list) else []
        score_by_language: dict[str, dict[str, float]] = {}

        def include_score(language_id: Any, score: Any) -> None:
            language = to_language_id(language_id)
            try:
                numeric_score = float(score)
            except Exception:
                return
            if not language or language not in supported_languages or numeric_score <= 0:
                return
            current = score_by_language.get(language, {"total": 0.0, "count": 0.0})
            current["total"] += numeric_score
            current["count"] += 1.0
            score_by_language[language] = current

        for function_id in function_ids:
            row = next(
                (
                    entry
                    for entry in per_function
                    if str(entry.get("function_id") if isinstance(entry, dict) else "") == function_id
                ),
                None,
            )
            if not isinstance(row, dict):
                continue
            rankings = row.get("language_rankings") if isinstance(row.get("language_rankings"), list) else []
            if rankings:
                for ranking in rankings:
                    if not isinstance(ranking, dict):
                        continue
                    include_score(ranking.get("language"), ranking.get("avg_ns_per_iteration"))
                continue
            include_score(row.get("winner_language"), row.get("winner_avg_ns_per_iteration"))

        ranked = sorted(
            [
                {
                    "language": language,
                    "count": int(score.get("count", 0)),
                    "avg": (score.get("total", 0.0) / score.get("count", 1.0))
                    if score.get("count", 0.0) > 0
                    else float("inf"),
                }
                for language, score in score_by_language.items()
            ],
            key=lambda row: (-int(row["count"]), float(row["avg"])),
        )
        if ranked:
            return str(ranked[0]["language"])

    overall_winner = to_language_id(winner_map.get("overall_winner_language"))
    return overall_winner if overall_winner in supported_languages else ""


def resolve_language_selection(input_data: dict[str, Any] | None = None) -> dict[str, Any]:
    input_payload = input_data or {}
    catalog = input_payload.get("catalog") if isinstance(input_payload.get("catalog"), dict) else load_catalog()
    contract = catalog.get("runtime_contract") if isinstance(catalog.get("runtime_contract"), dict) else {}
    env_overrides = contract.get("env_overrides") if isinstance(contract.get("env_overrides"), dict) else {}
    stage_policy = resolve_stage_policy(str(input_payload.get("stageId") or ""), catalog)

    disable_env_key = str(env_overrides.get("disable_swaps") or "AIO_SCRIPT_RUNTIME_DISABLE")
    preferred_env_key = str(env_overrides.get("preferred_language") or "AIO_SCRIPT_RUNTIME_LANGUAGE")
    order_env_key = str(env_overrides.get("ordered_languages") or "AIO_SCRIPT_RUNTIME_ORDER")
    auto_best_env_key = str(env_overrides.get("auto_select_best") or "AIO_SCRIPT_RUNTIME_AUTO_BEST")

    baseline_language = to_language_id(contract.get("baseline_language") or "javascript") or "javascript"
    fallback_language = to_language_id(contract.get("fallback_language") or baseline_language) or baseline_language
    allow_swaps_input = input_payload.get("allowSwaps") is not False
    allow_swaps_policy = stage_policy.get("allow_swaps")
    allow_swaps = allow_swaps_input if allow_swaps_policy is None else allow_swaps_input and bool(allow_swaps_policy)

    if not allow_swaps or parse_truthy(os.environ.get(disable_env_key)):
        return {
            "language_order": [baseline_language],
            "preferred_language_input": "",
            "preferred_language_env": "",
            "preferred_language_stage": stage_policy.get("preferred_language") or "",
            "auto_select_enabled": False,
            "auto_best_language": "",
            "auto_best_source": "disabled",
        }

    preferred_from_input = to_language_id(input_payload.get("preferredLanguage"))
    preferred_from_env = to_language_id(os.environ.get(preferred_env_key))
    preferred_from_stage = to_language_id(stage_policy.get("preferred_language"))
    auto_select_from_input = input_payload.get("autoSelectBest") is True
    auto_select_from_env = parse_truthy(os.environ.get(auto_best_env_key))
    auto_select_from_stage = stage_policy.get("auto_select_from_benchmark") is True
    auto_select_best = auto_select_from_input or auto_select_from_env or auto_select_from_stage
    auto_best_language_from_benchmark = (
        resolve_benchmark_preferred_language({"catalog": catalog, "stagePolicy": stage_policy}) if auto_select_best else ""
    )

    runtime_order_from_env = parse_language_order_csv(os.environ.get(order_env_key))
    runtime_order_from_input = to_unique_language_list(input_payload.get("runtimeOrder"))
    runtime_order_from_stage = to_unique_language_list(stage_policy.get("runtime_order"))
    runtime_order_from_catalog = to_unique_language_list(
        contract.get("default_language_order") or [baseline_language, "python", "cpp"]
    )

    merged: list[str] = []
    seen: set[str] = set()

    def append(value: Any) -> None:
        language = to_language_id(value)
        if not language or language in seen:
            return
        seen.add(language)
        merged.append(language)

    append(preferred_from_input)
    append(preferred_from_env)
    append(auto_best_language_from_benchmark)
    append(preferred_from_stage)
    for language in runtime_order_from_input:
        append(language)
    for language in runtime_order_from_stage:
        append(language)
    for language in runtime_order_from_env:
        append(language)
    for language in runtime_order_from_catalog:
        append(language)
    append(fallback_language)
    append(baseline_language)

    resolved_language_order = merged if merged else [baseline_language]
    auto_best_language = (
        to_language_id(auto_best_language_from_benchmark or resolved_language_order[0] or fallback_language or baseline_language)
        if auto_select_best
        else ""
    )
    auto_best_source = (
        "disabled"
        if not auto_select_best
        else "benchmark_winner_map"
        if auto_best_language_from_benchmark
        else "fallback_runtime_order"
    )

    return {
        "language_order": resolved_language_order,
        "preferred_language_input": preferred_from_input,
        "preferred_language_env": preferred_from_env,
        "preferred_language_stage": preferred_from_stage,
        "auto_select_enabled": auto_select_best,
        "auto_best_language": auto_best_language,
        "auto_best_source": auto_best_source,
    }


def resolve_language_order(input_data: dict[str, Any] | None = None) -> list[str]:
    return list(resolve_language_selection(input_data).get("language_order") or [])


def resolve_stage_script_path(stage_id: str, catalog: dict[str, Any]) -> pathlib.Path | None:
    stage_map = catalog.get("stage_script_map") if isinstance(catalog.get("stage_script_map"), dict) else {}
    stage_entry = stage_map.get(stage_id) if isinstance(stage_map.get(stage_id), dict) else {}
    script_file = str(stage_entry.get("script_file") or "")
    if not script_file:
        return None
    return resolve_path_from_root(script_file)


def to_path_from_root(value: Any) -> str:
    return normalize_path(os.path.relpath(str(value or ""), ROOT)).removeprefix("./")


def resolve_adapter(language: str, catalog: dict[str, Any]) -> dict[str, Any] | None:
    adapters = catalog.get("adapters") if isinstance(catalog.get("adapters"), dict) else {}
    adapter = adapters.get(language)
    return adapter if isinstance(adapter, dict) else None


def resolve_equivalent_entry(script_path: pathlib.Path, adapter: dict[str, Any]) -> dict[str, Any] | None:
    equivalent_catalog_file = str(adapter.get("equivalent_catalog_file") or "").strip()
    if not equivalent_catalog_file:
        return None
    source_js_file = to_path_from_root(script_path)
    if not source_js_file.startswith("scripts/"):
        return None
    catalog = load_equivalent_catalog(equivalent_catalog_file)
    entries = catalog.get("entries") if isinstance(catalog.get("entries"), list) else []
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        if str(entry.get("source_js_file") or "") == source_js_file:
            return entry
    return None


def resolve_execution_command(input_data: dict[str, Any] | None = None) -> dict[str, Any] | None:
    input_payload = input_data or {}
    catalog = input_payload.get("catalog") if isinstance(input_payload.get("catalog"), dict) else load_catalog()
    language = to_language_id(input_payload.get("language"))
    script_path = resolve_path_from_root(input_payload.get("scriptPath") or "")
    script_args = [str(value) for value in input_payload.get("scriptArgs") or []]
    adapter = resolve_adapter(language, catalog)
    if adapter is None:
        return None

    if adapter.get("kind") == "python_native_equivalent":
        python = detect_python_runtime()
        equivalent_entry = resolve_equivalent_entry(script_path, adapter)
        if python is None or equivalent_entry is None:
            return None
        equivalent_file = resolve_path_from_root(equivalent_entry.get("python_equivalent_file") or "")
        if not equivalent_file.exists():
            return None
        return {
            "language": language,
            "adapter_kind": str(adapter.get("kind")),
            "command": str(python["command"]),
            "command_args": [*list(python.get("args_prefix") or []), str(equivalent_file), *script_args],
            "env": {
                "AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK": "0"
                if adapter.get("allow_js_fallback") is False
                else "1"
            },
        }

    if adapter.get("kind") == "cpp_native_equivalent":
        python = detect_python_runtime()
        equivalent_entry = resolve_equivalent_entry(script_path, adapter)
        runner_script = resolve_path_from_root(adapter.get("runner_script") or "")
        if python is None or equivalent_entry is None or not runner_script.exists():
            return None
        equivalent_file = resolve_path_from_root(equivalent_entry.get("cpp_equivalent_file") or "")
        if not equivalent_file.exists():
            return None
        return {
            "language": language,
            "adapter_kind": str(adapter.get("kind")),
            "command": str(python["command"]),
            "command_args": [
                *list(python.get("args_prefix") or []),
                str(runner_script),
                str(equivalent_file),
                "--",
                *script_args,
            ],
            "env": {
                "AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK": "0"
                if adapter.get("allow_js_fallback") is False
                else "1"
            },
        }

    if adapter.get("kind") == "native_node":
        node = detect_node_runtime()
        if node is None:
            return None
        return {
            "language": language,
            "adapter_kind": str(adapter.get("kind")),
            "command": str(node["command"]),
            "command_args": [*list(node.get("args_prefix") or []), str(script_path), *script_args],
        }

    if adapter.get("kind") == "python_node_bridge":
        python = detect_python_runtime()
        node = detect_node_runtime()
        bridge_script = resolve_path_from_root(adapter.get("bridge_script") or "")
        if python is None or node is None or not bridge_script.exists():
            return None
        return {
            "language": language,
            "adapter_kind": str(adapter.get("kind")),
            "command": str(python["command"]),
            "command_args": [
                *list(python.get("args_prefix") or []),
                str(bridge_script),
                str(node["command"]),
                str(script_path),
                *script_args,
            ],
        }

    if adapter.get("kind") == "cpp_node_bridge":
        node = detect_node_runtime()
        bridge_script = resolve_path_from_root(adapter.get("bridge_script") or "")
        if node is None or not bridge_script.exists():
            return None
        return {
            "language": language,
            "adapter_kind": str(adapter.get("kind")),
            "command": str(node["command"]),
            "command_args": [
                *list(node.get("args_prefix") or []),
                str(bridge_script),
                "--node-exec",
                str(node["command"]),
                "--script",
                str(script_path),
                "--",
                *script_args,
            ],
        }

    return None


def run_execution_command(command_spec: dict[str, Any], cwd: pathlib.Path) -> dict[str, Any]:
    command = str(command_spec.get("command") or "")
    command_args = [str(value) for value in command_spec.get("command_args") or []]
    env = dict(os.environ)
    env.update(command_spec.get("env") or {})
    start = time.time()
    try:
        completed = subprocess.run(
            [command, *command_args],
            cwd=str(cwd),
            env=env,
            capture_output=True,
            text=True,
            shell=False,
        )
        status_code = int(completed.returncode or 0)
        stdout = str(completed.stdout or "")
        stderr = str(completed.stderr or "")
    except Exception as error:
        status_code = 1
        stdout = ""
        stderr = f"{error}\n"
    duration_ms = int(round((time.time() - start) * 1000))
    return {
        "status_code": status_code,
        "stdout": stdout,
        "stderr": stderr,
        "duration_ms": duration_ms,
        "command_text": " ".join([command, *command_args]),
    }


def build_runtime_payload(
    *,
    stage_id: str,
    script_path: pathlib.Path,
    language_order: list[str],
    selection: dict[str, Any],
    strict_runtime: bool,
    attempts: list[dict[str, Any]],
    selected_language: str,
    command_text: str,
    status_code: int,
    stdout: str,
    stderr: str,
    duration_ms: int,
) -> dict[str, Any]:
    return {
        "command": command_text,
        "statusCode": int(status_code),
        "stdout": stdout,
        "stderr": stderr,
        "runtime": {
            "stage_id": stage_id,
            "script_file": to_path_from_root(script_path),
            "selected_language": selected_language,
            "swapped": selected_language != "javascript",
            "strict_runtime": bool(strict_runtime),
            "selection": {
                "resolved_order": language_order,
                "preferred_language_input": str(selection.get("preferred_language_input") or ""),
                "preferred_language_env": str(selection.get("preferred_language_env") or ""),
                "preferred_language_stage": str(selection.get("preferred_language_stage") or ""),
                "auto_select_enabled": bool(selection.get("auto_select_enabled")),
                "auto_best_language": str(selection.get("auto_best_language") or ""),
                "auto_best_source": str(selection.get("auto_best_source") or ""),
            },
            "duration_ms": int(duration_ms),
            "attempt_count": len(attempts),
            "fallback_used": len(attempts) > 1,
            "attempts": attempts,
        },
    }


def has_authoritative_stage_output(stdout: Any) -> bool:
    return bool(str(stdout or "").strip())


def should_fallback_after_run(status_code: int, stdout: Any, stderr: Any) -> bool:
    if int(status_code) == 0:
        return False
    return not has_authoritative_stage_output(stdout)


def run_script_with_swaps(input_data: dict[str, Any] | None = None) -> dict[str, Any]:
    input_payload = input_data or {}
    catalog = load_catalog(input_payload.get("catalogFile") or DEFAULT_CATALOG_FILE)
    stage_id = str(input_payload.get("stageId") or "")
    stage_policy = resolve_stage_policy(stage_id, catalog)
    contract = catalog.get("runtime_contract") if isinstance(catalog.get("runtime_contract"), dict) else {}
    env_overrides = contract.get("env_overrides") if isinstance(contract.get("env_overrides"), dict) else {}
    strict_env_key = str(env_overrides.get("strict_runtime") or "AIO_SCRIPT_RUNTIME_STRICT")
    cwd = pathlib.Path(str(input_payload.get("cwd") or ROOT)).resolve()

    if input_payload.get("scriptPath"):
        script_path = resolve_path_from_root(input_payload.get("scriptPath") or "")
    else:
        script_path = resolve_stage_script_path(stage_id, catalog)
    if script_path is None or not script_path.exists():
        raise RuntimeError(f"script path not found for stage '{stage_id}'")

    script_args = [str(value) for value in input_payload.get("scriptArgs") or []]
    selection = resolve_language_selection(
        {
            "catalog": catalog,
            "stageId": stage_id,
            "preferredLanguage": input_payload.get("preferredLanguage") or "",
            "runtimeOrder": input_payload.get("runtimeOrder") or [],
            "autoSelectBest": input_payload.get("autoSelectBest") is True,
            "allowSwaps": input_payload.get("allowSwaps") is not False,
        }
    )
    resolved_language_order = list(selection.get("language_order") or [])
    strict_runtime = (
        input_payload.get("strictRuntime") is True
        or stage_policy.get("strict_runtime") is True
        or parse_truthy(os.environ.get(strict_env_key))
    )
    language_order = resolved_language_order[:1] if strict_runtime else resolved_language_order[:]

    attempts: list[dict[str, Any]] = []
    fallback_result: dict[str, Any] | None = None

    for language in language_order:
        command_spec = resolve_execution_command(
            {
                "catalog": catalog,
                "language": language,
                "scriptPath": script_path,
                "scriptArgs": script_args,
            }
        )
        if command_spec is None:
            attempts.append(
                {
                    "language": language,
                    "command": "",
                    "statusCode": -1,
                    "duration_ms": 0,
                    "skipped": True,
                    "reason": "adapter unavailable",
                }
            )
            if strict_runtime:
                break
            continue

        run = run_execution_command(command_spec, cwd)
        attempts.append(
            {
                "language": language,
                "command": run["command_text"],
                "statusCode": int(run["status_code"]),
                "duration_ms": int(run["duration_ms"]),
                "skipped": False,
            }
        )
        payload = build_runtime_payload(
            stage_id=stage_id,
            script_path=script_path,
            language_order=language_order,
            selection=selection,
            strict_runtime=strict_runtime,
            attempts=attempts,
            selected_language=language,
            command_text=str(run["command_text"]),
            status_code=int(run["status_code"]),
            stdout=str(run["stdout"]),
            stderr=str(run["stderr"]),
            duration_ms=int(run["duration_ms"]),
        )
        fallback_result = payload
        if not should_fallback_after_run(int(run["status_code"]), run["stdout"], run["stderr"]) or strict_runtime:
            return payload

    if fallback_result is not None:
        return fallback_result

    return {
        "command": "",
        "statusCode": 1,
        "stdout": "",
        "stderr": "no available script runtime adapter\n",
        "runtime": {
            "stage_id": stage_id,
            "script_file": to_path_from_root(script_path),
            "selected_language": "",
            "swapped": False,
            "strict_runtime": bool(strict_runtime),
            "selection": {
                "resolved_order": language_order,
                "preferred_language_input": str(selection.get("preferred_language_input") or ""),
                "preferred_language_env": str(selection.get("preferred_language_env") or ""),
                "preferred_language_stage": str(selection.get("preferred_language_stage") or ""),
                "auto_select_enabled": bool(selection.get("auto_select_enabled")),
                "auto_best_language": str(selection.get("auto_best_language") or ""),
                "auto_best_source": str(selection.get("auto_best_source") or ""),
            },
            "duration_ms": 0,
            "attempt_count": len(attempts),
            "fallback_used": False,
            "attempts": attempts,
        },
    }
