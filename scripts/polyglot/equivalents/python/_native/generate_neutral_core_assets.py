#!/usr/bin/env python3
"""Native Python implementation for scripts/generate-neutral-core-assets.js."""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

from _common import find_repo_root, normalize_path, run_python_equivalent_script, write_text_file_robust

CORE_CONTRACT_PATH = pathlib.PurePosixPath("data/input/shared/core/core_contract_catalog.json")
RUNTIME_SOURCES_PATH = pathlib.PurePosixPath("data/input/shared/core/runtime_implementation_sources.json")
STORAGE_CONTRACT_PATH = pathlib.PurePosixPath("data/input/shared/core/storage_provider_contract.json")
SHELL_CONTRACT_PATH = pathlib.PurePosixPath("data/input/shared/core/shell_adapter_contract.json")
WRAPPER_REGISTRY_PATH = pathlib.PurePosixPath("data/input/shared/wrapper/wrapper_symbol_registry.json")
BENCHMARK_REPORT_PATH = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json"
)
WINNER_MAP_PATH = pathlib.PurePosixPath("data/output/databases/polyglot-default/reports/polyglot_runtime_winner_map.json")

OUTPUT_FILES = {
    "runtime_manifest": "data/output/databases/polyglot-default/build/runtime_implementation_manifest.json",
    "storage_manifest": "data/output/databases/polyglot-default/build/storage_backend_manifest.json",
    "shell_manifest": "data/output/databases/polyglot-default/build/shell_adapter_manifest.json",
    "javascript_core": "data/output/databases/polyglot-default/build/generated/javascript/neutral_core.js",
    "python_core": "data/output/databases/polyglot-default/build/generated/python/neutral_core.py",
    "cpp_header": "data/output/databases/polyglot-default/build/generated/cpp/neutral_core.hpp",
    "cpp_source": "data/output/databases/polyglot-default/build/generated/cpp/neutral_core.cpp",
    "ruby_core": "data/output/databases/polyglot-default/build/generated/ruby/neutral_core.rb",
}

REQUIRED_WRAPPER_SYMBOL_OUTPUTS = (
    pathlib.PurePosixPath("data/output/databases/polyglot-default/build/generated/javascript/wrapper_symbols.js"),
    pathlib.PurePosixPath("data/output/databases/polyglot-default/build/generated/python/wrapper_symbols.py"),
    pathlib.PurePosixPath("data/output/databases/polyglot-default/build/generated/cpp/wrapper_symbols.hpp"),
    pathlib.PurePosixPath("data/output/databases/polyglot-default/build/generated/cpp/wrapper_symbols.cpp"),
    pathlib.PurePosixPath("data/output/databases/polyglot-default/build/generated/ruby/wrapper_symbols.rb"),
)


def parse_args(argv: list[str]) -> dict[str, bool]:
    return {
        "check_only": "--check" in argv,
        "quiet": "--quiet" in argv,
    }


def load_json(root: pathlib.Path, relative_path: pathlib.PurePosixPath, fallback: Any = None) -> Any:
    file_path = root / relative_path
    if not file_path.exists():
        return fallback
    return json.loads(file_path.read_text(encoding="utf8"))


def stable_json(value: Any) -> str:
    return f"{json.dumps(value, indent=2)}\n"


def normalize_relative_path(path_value: str | pathlib.PurePosixPath) -> str:
    return normalize_path(path_value)


def ensure_wrapper_symbols_ready(root: pathlib.Path, report: dict[str, Any]) -> bool:
    missing = [normalize_relative_path(relative_path) for relative_path in REQUIRED_WRAPPER_SYMBOL_OUTPUTS if not (root / relative_path).exists()]
    if not missing:
        return True

    report["issues"].append(
        {
            "level": "warn",
            "type": "wrapper_symbols_missing",
            "detail": "wrapper symbol artifacts were missing and had to be refreshed through the generated equivalent",
            "files": missing,
        }
    )
    completed = run_python_equivalent_script(
        "scripts/generate-wrapper-polyglot-bindings.js",
        ["--check"] if report["check_only"] else [],
        root=root,
    )
    if int(completed.returncode or 0) != 0:
        report["issues"].append(
            {
                "level": "error",
                "type": "wrapper_generation_failed",
                "detail": "unable to refresh wrapper symbol artifacts required by neutral core generation",
                "stdout": str(completed.stdout or "").strip(),
                "stderr": str(completed.stderr or "").strip(),
            }
        )
        report["status"] = "fail"
        return False

    still_missing = [
        normalize_relative_path(relative_path) for relative_path in REQUIRED_WRAPPER_SYMBOL_OUTPUTS if not (root / relative_path).exists()
    ]
    if still_missing:
        report["issues"].append(
            {
                "level": "error",
                "type": "wrapper_symbols_unavailable",
                "detail": "wrapper symbol artifacts are still missing after refresh",
                "files": still_missing,
            }
        )
        report["status"] = "fail"
        return False
    return True


def ensure_output_file(
    root: pathlib.Path,
    relative_path: str,
    content: str,
    check_only: bool,
    report: dict[str, Any],
) -> None:
    absolute_path = root / pathlib.PurePosixPath(relative_path)
    normalized_path = normalize_relative_path(relative_path)
    exists = absolute_path.exists()
    current = absolute_path.read_text(encoding="utf8") if exists else ""
    matches = bool(exists and current == content)

    report["artifacts"].append(
        {
            "file": normalized_path,
            "exists": exists,
            "matches": matches,
        }
    )

    if check_only:
        if not matches:
            report["status"] = "fail"
            report["issues"].append(
                {
                    "level": "error",
                    "type": "artifact_out_of_date",
                    "detail": f"{normalized_path} is missing or out of date",
                    "file": normalized_path,
                }
            )
        return

    write_text_file_robust(absolute_path, content, atomic=False)


def to_const_key(function_id: str) -> str:
    normalized = []
    last_was_underscore = False
    for char in str(function_id or ""):
        if char.isalnum():
            normalized.append(char.upper())
            last_was_underscore = False
            continue
        if not last_was_underscore:
            normalized.append("_")
            last_was_underscore = True
    while normalized and normalized[0] == "_":
        normalized.pop(0)
    while normalized and normalized[-1] == "_":
        normalized.pop()
    return "".join(normalized)


def function_entries(wrapper_registry: dict[str, Any]) -> list[dict[str, Any]]:
    rows = list((wrapper_registry.get("function_index") or {}).values())
    rows.sort(key=lambda row: str((row or {}).get("function_id", "")))
    return rows


def build_subsystem_benchmark(function_ids: list[str], benchmark_report: dict[str, Any], winner_map: dict[str, Any]) -> dict[str, Any]:
    function_id_set = {str(function_id or "") for function_id in function_ids or []}
    per_function_rows = [row for row in (winner_map.get("per_function") or []) if str((row or {}).get("function_id", "")) in function_id_set]
    preferred_by_language: dict[str, dict[str, float]] = {}

    for row in per_function_rows:
        for ranking in row.get("language_rankings") or []:
            language = str((ranking or {}).get("language", "")).strip().lower()
            avg = float((ranking or {}).get("avg_ns_per_iteration") or (ranking or {}).get("ns_per_iteration") or 0)
            if not language or avg <= 0:
                continue
            current = preferred_by_language.setdefault(language, {"total": 0.0, "count": 0.0})
            current["total"] += avg
            current["count"] += 1

    ranked = [
        {
            "language": language,
            "sample_count": int(row["count"]),
            "avg_ns_per_iteration": row["total"] / row["count"] if row["count"] > 0 else float("inf"),
        }
        for language, row in preferred_by_language.items()
    ]
    ranked.sort(key=lambda row: float(row["avg_ns_per_iteration"]))

    return {
        "benchmark_identity": "polyglot_wrapper_math_core",
        "languages_run": list(benchmark_report.get("languages_run") or []),
        "benchmark_case_count": int(benchmark_report.get("benchmark_case_count") or 0),
        "overall_winner_language": str(winner_map.get("overall_winner_language") or ""),
        "preferred_runtime_order": [row["language"] for row in ranked],
        "per_function": per_function_rows,
        "ranked_languages": ranked,
    }


def build_runtime_manifest(
    core_doc: dict[str, Any],
    runtime_sources: dict[str, Any],
    storage_contract: dict[str, Any],
    shell_contract: dict[str, Any],
    wrapper_registry: dict[str, Any],
    benchmark_report: dict[str, Any],
    winner_map: dict[str, Any],
) -> dict[str, Any]:
    runtimes = runtime_sources.get("runtimes") if isinstance(runtime_sources.get("runtimes"), dict) else {}
    fallback_language_order = [
        str(item or "").strip().lower()
        for item in (runtime_sources.get("runtime_defaults") or {}).get("fallback_language_order") or []
        if str(item or "").strip()
    ]
    math_pure_functions = (((core_doc.get("subsystems") or {}).get("math_core") or {}).get("pure_function_ids")) or []
    subsystem_benchmarks = {
        "math_core": build_subsystem_benchmark(math_pure_functions, benchmark_report or {}, winner_map or {}),
    }
    shells = shell_contract.get("shells") if isinstance(shell_contract.get("shells"), dict) else {}
    runtime_manifest: dict[str, Any] = {
        "schema_version": 1,
        "manifest_id": "aio_runtime_implementation_manifest",
        "source_files": {
            "core_contract_catalog": normalize_relative_path(CORE_CONTRACT_PATH),
            "runtime_implementation_sources": normalize_relative_path(RUNTIME_SOURCES_PATH),
            "storage_provider_contract": normalize_relative_path(STORAGE_CONTRACT_PATH),
            "shell_adapter_contract": normalize_relative_path(SHELL_CONTRACT_PATH),
            "wrapper_symbol_registry": normalize_relative_path(WRAPPER_REGISTRY_PATH),
            "benchmark_report": normalize_relative_path(BENCHMARK_REPORT_PATH),
            "winner_map": normalize_relative_path(WINNER_MAP_PATH),
        },
        "fallback_language_order": fallback_language_order,
        "subsystems": {
            "math_core": {
                **(((core_doc.get("subsystems") or {}).get("math_core")) or {}),
                "benchmark": subsystem_benchmarks["math_core"],
            },
            "storage_core": {
                **(((core_doc.get("subsystems") or {}).get("storage_core")) or {}),
                "default_backend": storage_contract.get("default_backend"),
            },
            "shell_core": {
                **(((core_doc.get("subsystems") or {}).get("shell_core")) or {}),
                "implemented_shells": [
                    shell_id
                    for shell_id, shell in shells.items()
                    if str((shell or {}).get("status") or "") == "implemented"
                ],
            },
        },
        "runtimes": {},
    }

    for runtime_id in sorted(runtimes.keys()):
        runtime = runtimes.get(runtime_id) if isinstance(runtimes.get(runtime_id), dict) else {}
        subsystem_map = runtime.get("subsystems") if isinstance(runtime.get("subsystems"), dict) else {}
        next_runtime = {
            "runtime_id": str(runtime.get("runtime_id") or runtime_id),
            "implementation_kind": str(runtime.get("implementation_kind") or "direct_generated"),
            "subsystems": {},
        }
        for subsystem_id in sorted(subsystem_map.keys()):
            subsystem = subsystem_map.get(subsystem_id) if isinstance(subsystem_map.get(subsystem_id), dict) else {}
            artifact = normalize_relative_path(str(subsystem.get("artifact") or ""))
            production_ready = bool(
                artifact
                and "repo_polyglot_equivalents" not in artifact
                and "repo-polyglot-module-bridge" not in artifact
                and str(subsystem.get("status") or "") == "implemented"
            )
            next_runtime["subsystems"][subsystem_id] = {
                **subsystem,
                "artifact": artifact,
                "production_ready": production_ready,
            }
        runtime_manifest["runtimes"][runtime_id] = next_runtime

    return runtime_manifest


def build_storage_manifest(storage_contract: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "manifest_id": "aio_storage_backend_manifest",
        "contract_id": storage_contract.get("contract_id"),
        "storage_version": storage_contract.get("storage_version"),
        "default_backend": storage_contract.get("default_backend"),
        "operations": list(storage_contract.get("operations") or []),
        "providers": storage_contract.get("providers") or {},
        "compatibility": storage_contract.get("compatibility") or {},
        "raw_format": storage_contract.get("raw_format") or {},
    }


def build_shell_manifest(shell_contract: dict[str, Any]) -> dict[str, Any]:
    shells = shell_contract.get("shells") if isinstance(shell_contract.get("shells"), dict) else {}
    return {
        "schema_version": 1,
        "manifest_id": "aio_shell_adapter_manifest",
        "contract_id": shell_contract.get("contract_id"),
        "lifecycle": list(shell_contract.get("lifecycle") or []),
        "commands": list(shell_contract.get("commands") or []),
        "events": list(shell_contract.get("events") or []),
        "views": list(shell_contract.get("views") or []),
        "shells": shells,
        "implemented_shells": [shell_id for shell_id, shell in shells.items() if str((shell or {}).get("status") or "") == "implemented"],
    }


def render_javascript_neutral_core(core_doc: dict[str, Any], wrapper_registry: dict[str, Any]) -> str:
    entries = function_entries(wrapper_registry)
    contract_text = json.dumps(core_doc, indent=2)
    wrappers = "\n\n".join(
        f"function {entry['language_symbols']['javascript']}(boundArgs = {{}}) {{\n"
        f"  return runMathFunction(FUNCTION_IDS.{to_const_key(entry['function_id'])}, boundArgs);\n"
        "}"
        for entry in entries
    )
    exports_block = "\n".join(f"  {entry['language_symbols']['javascript']}," for entry in entries)
    pure_rows = "\n".join(
        f"  {json.dumps(function_id)},"
        for function_id in (((core_doc.get("subsystems") or {}).get("math_core") or {}).get("pure_function_ids") or [])
    )
    return "\n".join(
        [
            '"use strict";',
            "",
            'const wrapperSymbols = require("./wrapper_symbols.js");',
            "",
            f"const CORE_CONTRACT_CATALOG = Object.freeze({contract_text});",
            "const FUNCTION_IDS = Object.freeze({ ...wrapperSymbols.FUNCTION_IDS });",
            "const PURE_FUNCTION_IDS = Object.freeze([",
            pure_rows,
            "]);",
            "",
            "function getSubsystemContract(subsystemId) {",
            '  return CORE_CONTRACT_CATALOG.subsystems[String(subsystemId || "")] || null;',
            "}",
            "",
            "function runMathFunction(functionId, boundArgs = {}) {",
            "  return wrapperSymbols.runWrapperFunction(functionId, boundArgs);",
            "}",
            "",
            wrappers,
            "",
            "module.exports = {",
            "  CORE_CONTRACT_CATALOG,",
            "  FUNCTION_IDS,",
            "  PURE_FUNCTION_IDS,",
            "  getSubsystemContract,",
            "  runMathFunction,",
            exports_block,
            "  runWrapperFunction: runMathFunction",
            "};",
            "",
        ]
    )


def render_python_neutral_core(core_doc: dict[str, Any], wrapper_registry: dict[str, Any]) -> str:
    entries = function_entries(wrapper_registry)
    wrapper_blocks = []
    for entry in entries:
        wrapper_blocks.append(
            "\n".join(
                [
                    f"def {entry['language_symbols']['python']}(bound_args=None):",
                    f'    return run_math_function(FUNCTION_IDS["{to_const_key(entry["function_id"])}"], bound_args or {{}})',
                ]
            )
        )
    wrappers = "\n\n".join(wrapper_blocks)
    return "\n".join(
        [
            '"""Generated neutral core bindings for Python."""',
            "",
            "from __future__ import annotations",
            "",
            "import importlib.util",
            "import json",
            "import pathlib",
            "",
            "",
            "def _load_wrapper_symbols():",
            '    module_path = pathlib.Path(__file__).resolve().with_name("wrapper_symbols.py")',
            '    spec = importlib.util.spec_from_file_location("aio_wrapper_symbols", module_path)',
            "    if spec is None or spec.loader is None:",
            '        raise RuntimeError("unable to load wrapper_symbols.py")',
            "    module = importlib.util.module_from_spec(spec)",
            "    spec.loader.exec_module(module)",
            "    return module",
            "",
            "",
            "_WRAPPER_SYMBOLS = _load_wrapper_symbols()",
            f"CORE_CONTRACT_CATALOG = json.loads(r'''{json.dumps(core_doc, indent=2)}''')",
            'FUNCTION_IDS = dict(getattr(_WRAPPER_SYMBOLS, "FUNCTION_IDS", {}))',
            f"PURE_FUNCTION_IDS = tuple({json.dumps((((core_doc.get('subsystems') or {}).get('math_core') or {}).get('pure_function_ids') or []))})",
            "",
            "",
            "def get_subsystem_contract(subsystem_id: str):",
            '    return CORE_CONTRACT_CATALOG.get("subsystems", {}).get(str(subsystem_id or ""))',
            "",
            "",
            "def run_math_function(function_id: str, bound_args=None):",
            "    return _WRAPPER_SYMBOLS.run_wrapper_function(function_id, bound_args or {})",
            "",
            "",
            wrappers,
            "",
            "run_wrapper_function = run_math_function",
            "",
        ]
    )


def render_cpp_neutral_core_header(core_doc: dict[str, Any], wrapper_registry: dict[str, Any]) -> str:
    del core_doc
    entries = function_entries(wrapper_registry)
    declarations = "\n".join(
        f"aio::wrapper_symbols::WrapperResult {''.join(char if char.isalnum() or char == '_' else '_' for char in entry['language_symbols']['python'])}(const std::map<std::string, std::string>& bound_args);"
        for entry in entries
    )
    return "\n".join(
        [
            "#pragma once",
            "",
            "#include <map>",
            "#include <string>",
            "#include <vector>",
            "",
            '#include "wrapper_symbols.hpp"',
            "",
            "namespace aio::neutral_core {",
            "const std::vector<std::string>& pure_function_ids();",
            "const char* contract_id();",
            "aio::wrapper_symbols::WrapperResult run_math_function(",
            "    const std::string& function_id,",
            "    const std::map<std::string, std::string>& bound_args);",
            declarations,
            "}  // namespace aio::neutral_core",
            "",
        ]
    )


def render_cpp_neutral_core_source(core_doc: dict[str, Any], wrapper_registry: dict[str, Any]) -> str:
    entries = function_entries(wrapper_registry)
    pure_rows = ",\n".join(
        f"      {json.dumps(function_id)}"
        for function_id in (((core_doc.get("subsystems") or {}).get("math_core") or {}).get("pure_function_ids") or [])
    )
    wrappers = "\n\n".join(
        "\n".join(
            [
                f"aio::wrapper_symbols::WrapperResult {''.join(char if char.isalnum() or char == '_' else '_' for char in entry['language_symbols']['python'])}(",
                "    const std::map<std::string, std::string>& bound_args) {",
                f"  return run_math_function(aio::wrapper_symbols::function_ids::{to_const_key(entry['function_id'])}, bound_args);",
                "}",
            ]
        )
        for entry in entries
    )
    return "\n".join(
        [
            '#include "neutral_core.hpp"',
            "",
            "namespace aio::neutral_core {",
            "const std::vector<std::string>& pure_function_ids() {",
            "  static const std::vector<std::string> kPureFunctionIds = {",
            pure_rows,
            "  };",
            "  return kPureFunctionIds;",
            "}",
            "",
            "const char* contract_id() {",
            f"  return {json.dumps(core_doc.get('catalog_id'))};",
            "}",
            "",
            "aio::wrapper_symbols::WrapperResult run_math_function(",
            "    const std::string& function_id,",
            "    const std::map<std::string, std::string>& bound_args) {",
            "  return aio::wrapper_symbols::run_wrapper_function(function_id, bound_args);",
            "}",
            "",
            wrappers,
            "}  // namespace aio::neutral_core",
            "",
        ]
    )


def render_ruby_neutral_core(core_doc: dict[str, Any], wrapper_registry: dict[str, Any]) -> str:
    entries = function_entries(wrapper_registry)
    wrappers = "\n\n".join(
        "\n".join(
            [
                f"    def self.{str(entry['language_symbols']['ruby']).split('.')[-1]}(bound_args = {{}})",
                f"      run_math_function(FUNCTION_IDS[{json.dumps(to_const_key(entry['function_id']))}], bound_args || {{}})",
                "    end",
            ]
        )
        for entry in entries
    )
    ruby_pure_function_ids = json.dumps(
        (((core_doc.get("subsystems") or {}).get("math_core") or {}).get("pure_function_ids") or [])
    )
    return "\n".join(
        [
            "# frozen_string_literal: true",
            "",
            'require "json"',
            'require_relative "wrapper_symbols"',
            "",
            "module Aio",
            "  module NeutralCore",
            "    CORE_CONTRACT_CATALOG = JSON.parse(<<~'JSON')",
            json.dumps(core_doc, indent=2),
            "    JSON",
            "",
            "    FUNCTION_IDS = Aio::WrapperSymbols::FUNCTION_IDS.dup.freeze",
            f"    PURE_FUNCTION_IDS = {ruby_pure_function_ids}.freeze",
            "",
            "    def self.get_subsystem_contract(subsystem_id)",
            '      CORE_CONTRACT_CATALOG.fetch("subsystems", {})[String(subsystem_id || "")]',
            "    end",
            "",
            "    def self.run_math_function(function_id, bound_args = {})",
            "      Aio::WrapperSymbols.run_wrapper_function(function_id, bound_args || {})",
            "    end",
            "",
            wrappers,
            "",
            "    class << self",
            "      alias run_wrapper_function run_math_function",
            "    end",
            "  end",
            "end",
            "",
        ]
    )


def generate_neutral_core_assets(
    *,
    root: pathlib.Path | str | None = None,
    check_only: bool = False,
    quiet: bool = False,
) -> dict[str, Any]:
    workspace_root = find_repo_root(root or pathlib.Path(__file__))
    report: dict[str, Any] = {
        "status": "pass",
        "root": normalize_path(workspace_root),
        "check_only": bool(check_only),
        "artifacts": [],
        "issues": [],
    }

    if not ensure_wrapper_symbols_ready(workspace_root, report):
        if not quiet:
            sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
        return report

    core_doc = load_json(workspace_root, CORE_CONTRACT_PATH, {})
    runtime_sources = load_json(workspace_root, RUNTIME_SOURCES_PATH, {})
    storage_contract = load_json(workspace_root, STORAGE_CONTRACT_PATH, {})
    shell_contract = load_json(workspace_root, SHELL_CONTRACT_PATH, {})
    wrapper_registry = load_json(workspace_root, WRAPPER_REGISTRY_PATH, {})
    benchmark_report = load_json(workspace_root, BENCHMARK_REPORT_PATH, {}) or {}
    winner_map = load_json(workspace_root, WINNER_MAP_PATH, {}) or {}

    runtime_manifest = build_runtime_manifest(
        core_doc or {},
        runtime_sources or {},
        storage_contract or {},
        shell_contract or {},
        wrapper_registry or {},
        benchmark_report,
        winner_map,
    )
    storage_manifest = build_storage_manifest(storage_contract or {})
    shell_manifest = build_shell_manifest(shell_contract or {})
    outputs = {
        OUTPUT_FILES["runtime_manifest"]: stable_json(runtime_manifest),
        OUTPUT_FILES["storage_manifest"]: stable_json(storage_manifest),
        OUTPUT_FILES["shell_manifest"]: stable_json(shell_manifest),
        OUTPUT_FILES["javascript_core"]: render_javascript_neutral_core(core_doc or {}, wrapper_registry or {}),
        OUTPUT_FILES["python_core"]: render_python_neutral_core(core_doc or {}, wrapper_registry or {}),
        OUTPUT_FILES["cpp_header"]: render_cpp_neutral_core_header(core_doc or {}, wrapper_registry or {}),
        OUTPUT_FILES["cpp_source"]: render_cpp_neutral_core_source(core_doc or {}, wrapper_registry or {}),
        OUTPUT_FILES["ruby_core"]: render_ruby_neutral_core(core_doc or {}, wrapper_registry or {}),
    }

    for relative_path, content in outputs.items():
        ensure_output_file(workspace_root, relative_path, content, bool(check_only), report)

    if not quiet:
        sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return report


def check_neutral_core_assets(*, root: pathlib.Path | str | None = None, quiet: bool = False) -> dict[str, Any]:
    return generate_neutral_core_assets(root=root, check_only=True, quiet=quiet)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    report = generate_neutral_core_assets(
        root=pathlib.Path.cwd(),
        check_only=args["check_only"],
        quiet=args["quiet"],
    )
    return 0 if report["status"] == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
