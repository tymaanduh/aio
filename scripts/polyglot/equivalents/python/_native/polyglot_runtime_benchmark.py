#!/usr/bin/env python3
"""Native Python implementation for scripts/polyglot-runtime-benchmark.js."""

from __future__ import annotations

import importlib.util
import json
import math
import os
import pathlib
import shutil
import subprocess
import sys
import tempfile
import time
from typing import Any

from _common import find_repo_root, normalize_path, write_text_file_robust

ROOT = find_repo_root(pathlib.Path(__file__))
REGISTRY_PATH = pathlib.PurePosixPath("data/input/shared/wrapper/wrapper_symbol_registry.json")
BENCHMARK_CASES_PATH = pathlib.PurePosixPath("data/input/shared/wrapper/runtime_benchmark_cases.json")
JS_BINDINGS_PATH = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/build/generated/javascript/wrapper_symbols.js"
)
PYTHON_BINDINGS_PATH = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/build/generated/python/wrapper_symbols.py"
)
CPP_BINDINGS_DIR = pathlib.PurePosixPath("data/output/databases/polyglot-default/build/generated/cpp")
CPP_BINDINGS_SOURCE = CPP_BINDINGS_DIR / "wrapper_symbols.cpp"
DEFAULT_OUTPUT_PATH = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json"
)
DEFAULT_WINNER_MAP_PATH = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/reports/polyglot_runtime_winner_map.json"
)

SUPPORTED_LANGUAGES = ("javascript", "python", "cpp")
CASE_ID_PATTERN = r"^[a-z][a-z0-9_]*$"
WINDOWS_CPP_FALLBACKS = (
    pathlib.Path(r"C:\Program Files\LLVM\bin\clang++.exe"),
    pathlib.Path(r"C:\Program Files (x86)\LLVM\bin\clang++.exe"),
)

JS_RUNNER_CODE = r"""
const fs = require("fs");

function main() {
  const payload = JSON.parse(fs.readFileSync(0, "utf8"));
  const bindings = require(payload.module_path);
  const runner = bindings.runWrapperFunction;
  if (typeof runner !== "function") {
    throw new Error("javascript wrapper bindings missing runWrapperFunction export");
  }
  const warmupIterations = Number(payload.warmup_iterations || 0);
  const cases = Array.isArray(payload.cases) ? payload.cases : [];
  const reportCases = [];
  let totalNs = 0n;
  for (const benchCase of cases) {
    const probe = runner(String(benchCase.function_id), benchCase.args || {});
    if (!probe || probe.ok !== true) {
      console.log(JSON.stringify({
        ok: false,
        language: "javascript",
        error: "probe_failed",
        case_id: String(benchCase.case_id || ""),
        detail: probe || {}
      }));
      return;
    }
    for (let index = 0; index < warmupIterations; index += 1) {
      runner(String(benchCase.function_id), benchCase.args || {});
    }
    const start = process.hrtime.bigint();
    for (let index = 0; index < Number(benchCase.iterations || 0); index += 1) {
      runner(String(benchCase.function_id), benchCase.args || {});
    }
    const elapsed = process.hrtime.bigint() - start;
    totalNs += elapsed;
    reportCases.push({
      case_id: String(benchCase.case_id || ""),
      function_id: String(benchCase.function_id || ""),
      iterations: Number(benchCase.iterations || 0),
      elapsed_ns: Number(elapsed),
      ns_per_iteration: Number(elapsed) / Number(benchCase.iterations || 1)
    });
  }
  console.log(JSON.stringify({
    ok: true,
    language: "javascript",
    total_ns: Number(totalNs),
    cases: reportCases
  }));
}

try {
  main();
} catch (error) {
  console.log(JSON.stringify({
    ok: false,
    language: "javascript",
    error: "javascript_runner_exception",
    detail: String(error && error.message ? error.message : error)
  }));
}
"""


def print_help_and_exit(code: int) -> None:
    help_text = "\n".join(
        [
            "polyglot-runtime-benchmark",
            "",
            "Usage:",
            "  npm run benchmark:runtime -- [options]",
            "",
            "Options:",
            "  --languages <csv>        Language runtimes to benchmark (javascript,python,cpp).",
            "  --function-ids <csv>     Optional function_id filter from wrapper registry.",
            "  --iterations <number>    Override iterations per case.",
            "  --warmup <number>        Override warmup iterations per case.",
            "  --cases-file <path>      Optional benchmark case catalog JSON path.",
            "  --output-file <path>     Optional report output path.",
            "  --strict                 Fail if any requested language cannot run.",
            "  --help                   Show this help.",
        ]
    )
    sys.stdout.write(f"{help_text}\n")
    raise SystemExit(code)


def parse_args(argv: list[str]) -> dict[str, Any]:
    args: dict[str, Any] = {
        "languages": list(SUPPORTED_LANGUAGES),
        "function_ids": [],
        "iterations_override": 0,
        "warmup_override": 0,
        "cases_file": "",
        "output_file": "",
        "strict": False,
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--languages" and index + 1 < len(argv):
            args["languages"] = [item.strip().lower() for item in str(argv[index + 1] or "").split(",") if item.strip()]
            index += 2
            continue
        if token == "--function-ids" and index + 1 < len(argv):
            args["function_ids"] = [item.strip() for item in str(argv[index + 1] or "").split(",") if item.strip()]
            index += 2
            continue
        if token == "--iterations" and index + 1 < len(argv):
            args["iterations_override"] = int(argv[index + 1] or 0)
            index += 2
            continue
        if token == "--warmup" and index + 1 < len(argv):
            args["warmup_override"] = int(argv[index + 1] or 0)
            index += 2
            continue
        if token == "--cases-file" and index + 1 < len(argv):
            args["cases_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--output-file" and index + 1 < len(argv):
            args["output_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--strict":
            args["strict"] = True
            index += 1
            continue
        if token in {"--help", "-h"}:
            print_help_and_exit(0)
        raise RuntimeError(f"unknown argument: {token}")
    return args


def read_json(file_path: pathlib.Path) -> Any:
    return json.loads(file_path.read_text(encoding="utf8"))


def normalize_path_for_output(root: pathlib.Path, absolute_path: pathlib.Path) -> str:
    return normalize_path(os.path.relpath(absolute_path, root))


def normalize_value_for_runtime(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, (int, float, bool)):
        return str(value)
    return json.dumps(value)


def command_exists(command: str, args: list[str] | None = None) -> bool:
    try:
        result = subprocess.run(
            [command, *(args or ["--version"])],
            capture_output=True,
            text=True,
            shell=False,
        )
        return int(result.returncode or 0) == 0
    except Exception:
        return False


def detect_node_runtime() -> dict[str, Any] | None:
    explicit = str(os.environ.get("AIO_NODE_EXEC", "") or "").strip()
    if explicit:
        return {"command": explicit, "args_prefix": [], "label": explicit}
    resolved = shutil.which("node")
    if resolved:
        return {"command": resolved, "args_prefix": [], "label": "node"}
    return None


def detect_python_runtime() -> dict[str, Any] | None:
    explicit = str(os.environ.get("AIO_PYTHON_EXEC", "") or "").strip()
    if explicit and command_exists(explicit):
        return {"command": explicit, "args_prefix": [], "label": explicit}
    if sys.executable and command_exists(sys.executable):
        return {"command": sys.executable, "args_prefix": [], "label": sys.executable}
    resolved = shutil.which("python")
    if resolved:
        return {"command": resolved, "args_prefix": [], "label": "python"}
    launcher = shutil.which("py")
    if launcher and command_exists(launcher, ["-3", "--version"]):
        return {"command": launcher, "args_prefix": ["-3"], "label": "py -3"}
    return None


def detect_cpp_compiler() -> dict[str, Any] | None:
    explicit = str(os.environ.get("AIO_CPP_COMPILER", "") or "").strip()
    if explicit and command_exists(explicit):
        kind = "msvc" if pathlib.Path(explicit).name.lower() in {"cl", "cl.exe"} else "gnu"
        return {"command": explicit, "args_prefix": [], "label": explicit, "kind": kind}
    for candidate in ("g++", "clang++", "c++"):
        resolved = shutil.which(candidate)
        if resolved and command_exists(resolved):
            return {"command": resolved, "args_prefix": [], "label": candidate, "kind": "gnu"}
    resolved_cl = shutil.which("cl")
    if resolved_cl and command_exists(resolved_cl):
        return {"command": resolved_cl, "args_prefix": [], "label": "cl", "kind": "msvc"}
    for fallback in WINDOWS_CPP_FALLBACKS:
        if fallback.exists() and command_exists(str(fallback)):
            return {"command": str(fallback), "args_prefix": [], "label": str(fallback), "kind": "gnu"}
    return None


def parse_json_from_text(raw_text: Any) -> Any:
    text = str(raw_text or "").strip()
    if not text:
        return None
    candidates = [text]
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        candidates.append(text[start : end + 1])
    for candidate in candidates:
        try:
            return json.loads(candidate)
        except Exception:
            continue
    return None


def resolve_languages(languages: list[str]) -> list[str]:
    normalized = []
    for item in languages or []:
        language = str(item or "").strip().lower()
        if language and language not in normalized:
            normalized.append(language)
    if not normalized:
        return list(SUPPORTED_LANGUAGES)
    unsupported = [language for language in normalized if language not in SUPPORTED_LANGUAGES]
    if unsupported:
        raise RuntimeError(f"unsupported languages: {', '.join(unsupported)}")
    return normalized


def resolve_function_ids(function_ids: list[str]) -> list[str]:
    result: list[str] = []
    for item in function_ids or []:
        function_id = str(item or "").strip()
        if function_id and function_id not in result:
            result.append(function_id)
    return result


def load_module_from_file(module_name: str, file_path: pathlib.Path):
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"unable to load module: {file_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_benchmark_input(root: pathlib.Path, options: dict[str, Any]) -> dict[str, Any]:
    registry_file = (root / REGISTRY_PATH).resolve()
    cases_file = (root / pathlib.PurePosixPath(options.get("cases_file") or str(BENCHMARK_CASES_PATH))).resolve()
    if not registry_file.exists():
        raise RuntimeError(f"missing wrapper symbol registry: {registry_file}")
    if not cases_file.exists():
        raise RuntimeError(f"missing benchmark cases file: {cases_file}")

    registry = read_json(registry_file)
    benchmark_doc = read_json(cases_file)
    function_index = registry.get("function_index") if isinstance(registry.get("function_index"), dict) else {}
    default_iterations = max(1, int(benchmark_doc.get("default_iterations") or 10000))
    warmup_iterations = max(0, int(benchmark_doc.get("warmup_iterations") or 0))
    raw_cases = benchmark_doc.get("cases") if isinstance(benchmark_doc.get("cases"), list) else []
    function_ids_filter = resolve_function_ids(options.get("function_ids") or [])
    function_filter_set = set(function_ids_filter)
    issues: list[str] = []
    for function_id in function_ids_filter:
        if function_id not in function_index:
            issues.append(f"unknown function_id in --function-ids filter: {function_id}")

    seen_case_ids: set[str] = set()
    seen_filtered_function_ids: set[str] = set()
    cases: list[dict[str, Any]] = []
    case_pattern = __import__("re").compile(CASE_ID_PATTERN)

    for index, raw_case in enumerate(raw_cases):
        entry = raw_case if isinstance(raw_case, dict) else {}
        function_id = str(entry.get("function_id") or "").strip()
        if function_filter_set and function_id not in function_filter_set:
            continue
        case_id = str(entry.get("case_id") or "").strip()
        args = entry.get("args") if isinstance(entry.get("args"), dict) else {}
        iterations = max(
            1,
            int(options.get("iterations_override") or 0) if int(options.get("iterations_override") or 0) > 0 else int(entry.get("iterations") or default_iterations),
        )

        if not case_id:
            issues.append(f"cases[{index}] missing case_id")
        elif not case_pattern.match(case_id):
            issues.append(f"cases[{index}] case_id must match {CASE_ID_PATTERN}")
        elif case_id in seen_case_ids:
            issues.append(f"duplicate case_id: {case_id}")
        else:
            seen_case_ids.add(case_id)

        if not function_id or function_id not in function_index:
            issues.append(f"case {case_id or f'index_{index}'} references unknown function_id: {function_id}")
        else:
            seen_filtered_function_ids.add(function_id)
            required_args = [
                str(input_row.get("arg") or "").strip()
                for input_row in (function_index[function_id].get("inputs") if isinstance(function_index[function_id].get("inputs"), list) else [])
                if isinstance(input_row, dict) and bool(input_row.get("required"))
            ]
            missing = [arg_name for arg_name in required_args if arg_name and arg_name not in args]
            if missing:
                issues.append(f"case {case_id} missing required args for {function_id}: {', '.join(missing)}")

        if case_id and function_id:
            cases.append(
                {
                    "case_id": case_id,
                    "function_id": function_id,
                    "args": args,
                    "iterations": iterations,
                }
            )

    if function_filter_set:
        for function_id in function_ids_filter:
            if function_id not in seen_filtered_function_ids:
                issues.append(f"no benchmark cases resolved for filtered function_id: {function_id}")
    if not cases:
        issues.append("benchmark cases catalog resolved to zero runnable cases")
    if issues:
        raise RuntimeError(f"invalid benchmark catalog: {'; '.join(issues)}")

    return {
        "registry_file": registry_file,
        "cases_file": cases_file,
        "registry": registry,
        "benchmark_doc": benchmark_doc,
        "function_ids_filter": function_ids_filter,
        "cases": cases,
        "warmup_iterations": max(
            0,
            int(options.get("warmup_override") or 0) if int(options.get("warmup_override") or 0) > 0 else warmup_iterations,
        ),
    }


def run_javascript_benchmark(root: pathlib.Path, benchmark_input: dict[str, Any]) -> dict[str, Any]:
    module_path = (root / JS_BINDINGS_PATH).resolve()
    if not module_path.exists():
        return {"ok": False, "reason": f"missing javascript bindings: {normalize_path_for_output(root, module_path)}"}
    node = detect_node_runtime()
    if node is None:
        return {"ok": False, "reason": "node runtime not found"}
    payload = {
        "module_path": str(module_path),
        "warmup_iterations": benchmark_input["warmup_iterations"],
        "cases": benchmark_input["cases"],
    }
    try:
        result = subprocess.run(
            [str(node["command"]), *list(node.get("args_prefix") or []), "-e", JS_RUNNER_CODE],
            input=json.dumps(payload),
            capture_output=True,
            text=True,
            shell=False,
            cwd=str(root),
        )
    except Exception as error:
        return {"ok": False, "reason": "javascript runner failed", "stderr": str(error)}
    if int(result.returncode or 0) != 0:
        return {"ok": False, "reason": f"javascript runner failed ({node['label']})", "stderr": str(result.stderr or "").strip()}
    parsed = parse_json_from_text(result.stdout)
    if not isinstance(parsed, dict) or parsed.get("ok") is not True:
        return {"ok": False, "reason": "javascript runner output was not valid success JSON", "stdout": str(result.stdout or "").strip()}
    return parsed


def run_python_benchmark(root: pathlib.Path, benchmark_input: dict[str, Any]) -> dict[str, Any]:
    module_path = (root / PYTHON_BINDINGS_PATH).resolve()
    if not module_path.exists():
        return {"ok": False, "reason": f"missing python bindings: {normalize_path_for_output(root, module_path)}"}
    module = load_module_from_file("aio_wrapper_symbols_benchmark", module_path)
    runner = getattr(module, "run_wrapper_function", None)
    if not callable(runner):
        return {"ok": False, "reason": "python wrapper module does not expose run_wrapper_function"}

    report_cases: list[dict[str, Any]] = []
    total_ns = 0
    for test_case in benchmark_input["cases"]:
        probe = runner(str(test_case["function_id"]), dict(test_case["args"]))
        if not isinstance(probe, dict) or probe.get("ok") is not True:
            return {
                "ok": False,
                "reason": "probe_failed",
                "case_id": str(test_case["case_id"]),
                "detail": probe,
            }
        for _ in range(int(benchmark_input["warmup_iterations"])):
            runner(str(test_case["function_id"]), dict(test_case["args"]))
        start_ns = time.perf_counter_ns()
        for _ in range(int(test_case["iterations"])):
            runner(str(test_case["function_id"]), dict(test_case["args"]))
        elapsed_ns = time.perf_counter_ns() - start_ns
        total_ns += elapsed_ns
        report_cases.append(
            {
                "case_id": str(test_case["case_id"]),
                "function_id": str(test_case["function_id"]),
                "iterations": int(test_case["iterations"]),
                "elapsed_ns": int(elapsed_ns),
                "ns_per_iteration": int(elapsed_ns) / int(test_case["iterations"]),
            }
        )
    return {"ok": True, "language": "python", "total_ns": total_ns, "cases": report_cases}


def c_string_literal(value: Any) -> str:
    return str(value or "").replace("\\", "\\\\").replace('"', '\\"')


def build_cpp_runner_source(benchmark_input: dict[str, Any]) -> str:
    case_rows = []
    for test_case in benchmark_input["cases"]:
        arg_rows = ",".join(
            f'{{"{c_string_literal(arg_name)}","{c_string_literal(normalize_value_for_runtime(arg_value))}"}}'
            for arg_name, arg_value in dict(test_case["args"]).items()
        )
        case_rows.append(
            f'  {{"{c_string_literal(test_case["case_id"])}","{c_string_literal(test_case["function_id"])}",{{{arg_rows}}},{int(test_case["iterations"])}}}'
        )
    return "\n".join(
        [
            '#include "wrapper_symbols.hpp"',
            "",
            "#include <chrono>",
            "#include <iomanip>",
            "#include <iostream>",
            "#include <map>",
            "#include <string>",
            "#include <vector>",
            "",
            "struct BenchCase {",
            "  std::string case_id;",
            "  std::string function_id;",
            "  std::map<std::string, std::string> args;",
            "  int iterations = 0;",
            "};",
            "",
            "struct BenchResult {",
            "  std::string case_id;",
            "  std::string function_id;",
            "  int iterations = 0;",
            "  long long elapsed_ns = 0;",
            "  double ns_per_iteration = 0.0;",
            "};",
            "",
            "int main() {",
            f"  const int warmup_iterations = {int(benchmark_input['warmup_iterations'])};",
            "  const std::vector<BenchCase> cases = {",
            ",\n".join(case_rows),
            "  };",
            "  std::vector<BenchResult> results;",
            "  results.reserve(cases.size());",
            "  long long total_ns = 0;",
            "  for (const auto& test_case : cases) {",
            "    auto probe = aio::wrapper_symbols::run_wrapper_function(test_case.function_id, test_case.args);",
            "    if (!probe.ok) {",
            '      std::cout << "{\\"ok\\":false,\\"language\\":\\"cpp\\",\\"error\\":\\"probe_failed\\",\\"case_id\\":\\""',
            '                << test_case.case_id << "\\",\\"detail\\":\\"" << probe.error_code << "\\"}";',
            "      return 0;",
            "    }",
            "    for (int index = 0; index < warmup_iterations; index += 1) {",
            "      aio::wrapper_symbols::run_wrapper_function(test_case.function_id, test_case.args);",
            "    }",
            "    const auto start = std::chrono::steady_clock::now();",
            "    for (int index = 0; index < test_case.iterations; index += 1) {",
            "      aio::wrapper_symbols::run_wrapper_function(test_case.function_id, test_case.args);",
            "    }",
            "    const auto stop = std::chrono::steady_clock::now();",
            "    const auto elapsed_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(stop - start).count();",
            "    total_ns += elapsed_ns;",
            "    BenchResult row;",
            "    row.case_id = test_case.case_id;",
            "    row.function_id = test_case.function_id;",
            "    row.iterations = test_case.iterations;",
            "    row.elapsed_ns = elapsed_ns;",
            "    row.ns_per_iteration = static_cast<double>(elapsed_ns) / static_cast<double>(test_case.iterations);",
            "    results.push_back(row);",
            "  }",
            '  std::cout << "{\\"ok\\":true,\\"language\\":\\"cpp\\",\\"total_ns\\":" << total_ns << ",\\"cases\\":[";',
            "  for (std::size_t index = 0; index < results.size(); index += 1) {",
            "    const auto& row = results[index];",
            '    if (index > 0) { std::cout << ","; }',
            '    std::cout << "{\\"case_id\\":\\"" << row.case_id',
            '              << "\\",\\"function_id\\":\\"" << row.function_id',
            '              << "\\",\\"iterations\\":" << row.iterations',
            '              << ",\\"elapsed_ns\\":" << row.elapsed_ns',
            '              << ",\\"ns_per_iteration\\":" << std::fixed << std::setprecision(6) << row.ns_per_iteration',
            '              << "}";',
            "  }",
            '  std::cout << "]}";',
            "  return 0;",
            "}",
            "",
        ]
    )


def run_cpp_benchmark(root: pathlib.Path, benchmark_input: dict[str, Any]) -> dict[str, Any]:
    compiler = detect_cpp_compiler()
    if compiler is None:
        return {
            "ok": False,
            "reason": "no C++ compiler found (checked AIO_CPP_COMPILER, g++, clang++, and LLVM default path)",
        }

    cpp_source_path = (root / CPP_BINDINGS_SOURCE).resolve()
    if not cpp_source_path.exists():
        return {"ok": False, "reason": f"missing C++ bindings source: {normalize_path_for_output(root, cpp_source_path)}"}

    include_dir = (root / CPP_BINDINGS_DIR).resolve()
    temp_root = (root / "data" / "output" / "databases" / "polyglot-default" / "build" / "tmp").resolve()
    temp_root.mkdir(parents=True, exist_ok=True)
    tmp_path = temp_root / f"aio-polyglot-bench-{os.getpid()}-{int(time.time() * 1000)}"
    tmp_path.mkdir(parents=True, exist_ok=True)
    runner_path = tmp_path / "runner.cpp"
    exe_path = tmp_path / ("runner.exe" if os.name == "nt" else "runner")
    try:
        runner_path.write_text(build_cpp_runner_source(benchmark_input), encoding="utf8")

        if compiler["kind"] == "msvc":
            compile_command = [
                str(compiler["command"]),
                "/nologo",
                "/std:c++17",
                "/O2",
                "/EHsc",
                f"/I{include_dir}",
                str(cpp_source_path),
                str(runner_path),
                f"/Fe:{exe_path}",
            ]
        else:
            compile_command = [
                str(compiler["command"]),
                "-std=c++17",
                "-O2",
                "-I",
                str(include_dir),
                str(cpp_source_path),
                str(runner_path),
                "-o",
                str(exe_path),
            ]

        try:
            compile_result = subprocess.run(
                compile_command,
                cwd=str(root),
                capture_output=True,
                text=True,
                shell=False,
            )
        except Exception as error:
            return {"ok": False, "reason": f"C++ compile failed using {compiler['label']}", "stderr": str(error)}

        if int(compile_result.returncode or 0) != 0:
            return {
                "ok": False,
                "reason": f"C++ compile failed using {compiler['label']}",
                "stderr": str(compile_result.stderr or compile_result.stdout or "").strip(),
            }

        try:
            run_result = subprocess.run(
                [str(exe_path)],
                cwd=str(root),
                capture_output=True,
                text=True,
                shell=False,
            )
        except Exception as error:
            return {"ok": False, "reason": "compiled C++ benchmark runner failed", "stderr": str(error)}

        if int(run_result.returncode or 0) != 0:
            return {
                "ok": False,
                "reason": "compiled C++ benchmark runner failed",
                "stderr": str(run_result.stderr or run_result.stdout or "").strip(),
            }

        parsed = parse_json_from_text(run_result.stdout)
        if not isinstance(parsed, dict) or parsed.get("ok") is not True:
            return {
                "ok": False,
                "reason": "C++ benchmark output was not valid success JSON",
                "stdout": str(run_result.stdout or "").strip(),
            }
        return parsed
    finally:
        shutil.rmtree(tmp_path, ignore_errors=True)


def run_language_benchmark(language: str, root: pathlib.Path, benchmark_input: dict[str, Any]) -> dict[str, Any]:
    if language == "javascript":
        return run_javascript_benchmark(root, benchmark_input)
    if language == "python":
        return run_python_benchmark(root, benchmark_input)
    if language == "cpp":
        return run_cpp_benchmark(root, benchmark_input)
    return {"ok": False, "reason": f"unsupported language adapter: {language}"}


def to_finite_number(value: Any, fallback: float = math.inf) -> float:
    try:
        numeric = float(value)
    except Exception:
        return fallback
    return numeric if math.isfinite(numeric) else fallback


def normalize_language(value: Any) -> str:
    return str(value or "").strip().lower()


def build_winner_mapping(results: dict[str, Any], ranking: list[dict[str, Any]]) -> dict[str, Any]:
    language_keys = list(results.keys())
    if not language_keys:
        return {
            "method": "min_ns_per_iteration",
            "compared_languages": [],
            "overall_winner_language": "",
            "case_count": 0,
            "function_count": 0,
            "per_case": [],
            "per_function": [],
        }

    case_map: dict[str, dict[str, Any]] = {}
    function_map: dict[str, dict[str, dict[str, float]]] = {}

    for language in language_keys:
        payload = results.get(language) if isinstance(results.get(language), dict) else {}
        rows = payload.get("cases") if isinstance(payload.get("cases"), list) else []
        for row in rows:
            row_payload = row if isinstance(row, dict) else {}
            case_id = str(row_payload.get("case_id") or "").strip()
            function_id = str(row_payload.get("function_id") or "").strip()
            if not case_id or not function_id:
                continue

            ns_per_iteration = to_finite_number(row_payload.get("ns_per_iteration"))
            case_entry = case_map.setdefault(
                case_id,
                {
                    "case_id": case_id,
                    "function_id": function_id,
                    "candidates": [],
                },
            )
            case_entry["candidates"].append({"language": language, "ns_per_iteration": ns_per_iteration})

            function_entry = function_map.setdefault(function_id, {})
            aggregate = function_entry.setdefault(language, {"total_ns_per_iteration": 0.0, "sample_count": 0})
            aggregate["total_ns_per_iteration"] += ns_per_iteration
            aggregate["sample_count"] += 1

    per_case = []
    for entry in case_map.values():
        rankings = sorted(entry["candidates"], key=lambda candidate: candidate["ns_per_iteration"])
        per_case.append(
            {
                "case_id": entry["case_id"],
                "function_id": entry["function_id"],
                "winner_language": rankings[0]["language"] if rankings else "",
                "winner_ns_per_iteration": round(rankings[0]["ns_per_iteration"], 6) if rankings else 0,
                "language_rankings": [
                    {
                        "language": candidate["language"],
                        "ns_per_iteration": round(candidate["ns_per_iteration"], 6),
                    }
                    for candidate in rankings
                ],
            }
        )
    per_case.sort(key=lambda row: row["case_id"])

    per_function = []
    for function_id, by_language in function_map.items():
        rankings = []
        for language, aggregate in by_language.items():
            sample_count = int(aggregate["sample_count"])
            average = aggregate["total_ns_per_iteration"] / sample_count if sample_count > 0 else math.inf
            rankings.append(
                {
                    "language": language,
                    "avg_ns_per_iteration": round(average, 6),
                    "sample_count": sample_count,
                }
            )
        rankings.sort(key=lambda row: row["avg_ns_per_iteration"])
        per_function.append(
            {
                "function_id": function_id,
                "winner_language": rankings[0]["language"] if rankings else "",
                "winner_avg_ns_per_iteration": rankings[0]["avg_ns_per_iteration"] if rankings else 0,
                "language_rankings": rankings,
            }
        )
    per_function.sort(key=lambda row: row["function_id"])

    overall_winner_language = ""
    if ranking and isinstance(ranking[0], dict):
        overall_winner_language = str(ranking[0].get("language") or "")

    return {
        "method": "min_ns_per_iteration",
        "compared_languages": sorted(language_keys),
        "overall_winner_language": overall_winner_language,
        "case_count": len(per_case),
        "function_count": len(per_function),
        "per_case": per_case,
        "per_function": per_function,
    }


def build_function_language_plan(winner_mapping: dict[str, Any], options: dict[str, Any] | None = None) -> dict[str, Any]:
    mapping = winner_mapping if isinstance(winner_mapping, dict) else {}
    opts = options if isinstance(options, dict) else {}
    default_primary_language = normalize_language(
        opts.get("defaultPrimaryLanguage") or opts.get("default_primary_language") or mapping.get("overall_winner_language")
    )
    default_fallback_language = normalize_language(
        opts.get("defaultFallbackLanguage") or opts.get("default_fallback_language")
    )

    compared_languages: set[str] = set()
    for value in mapping.get("compared_languages") if isinstance(mapping.get("compared_languages"), list) else []:
        language = normalize_language(value)
        if language:
            compared_languages.add(language)
    if default_primary_language:
        compared_languages.add(default_primary_language)
    if default_fallback_language:
        compared_languages.add(default_fallback_language)

    assignments = []
    for entry in mapping.get("per_function") if isinstance(mapping.get("per_function"), list) else []:
        if not isinstance(entry, dict):
            continue
        function_id = str(entry.get("function_id") or "").strip()
        if not function_id:
            continue

        normalized_rankings = []
        for item in entry.get("language_rankings") if isinstance(entry.get("language_rankings"), list) else []:
            if not isinstance(item, dict):
                continue
            language = normalize_language(item.get("language"))
            if not language:
                continue
            compared_languages.add(language)
            normalized_rankings.append(
                {
                    "language": language,
                    "avg_ns_per_iteration": to_finite_number(item.get("avg_ns_per_iteration"), 0),
                    "sample_count": int(item.get("sample_count") or 0),
                }
            )

        winner_language = normalize_language(entry.get("winner_language") or (normalized_rankings[0]["language"] if normalized_rankings else ""))
        selected_language = winner_language or default_primary_language or default_fallback_language

        selection_reason = "unassigned"
        if winner_language:
            selection_reason = "benchmark_winner"
        elif selected_language and selected_language == default_primary_language:
            selection_reason = "default_primary"
        elif selected_language and selected_language == default_fallback_language:
            selection_reason = "default_fallback"

        assignments.append(
            {
                "function_id": function_id,
                "selected_language": selected_language,
                "winner_language": winner_language,
                "fallback_language": default_fallback_language if default_fallback_language and selected_language != default_fallback_language else "",
                "selection_reason": selection_reason,
                "language_rankings": normalized_rankings,
            }
        )

    assignments.sort(key=lambda row: row["function_id"])
    selected_language_coverage: dict[str, int] = {}
    for entry in assignments:
        language = normalize_language(entry.get("selected_language"))
        if language:
            selected_language_coverage[language] = int(selected_language_coverage.get(language, 0)) + 1

    return {
        "method": "benchmark_winner_per_function_with_defaults",
        "default_primary_language": default_primary_language,
        "default_fallback_language": default_fallback_language,
        "compared_languages": sorted(compared_languages),
        "function_count": len(assignments),
        "selected_language_coverage": selected_language_coverage,
        "assignments": assignments,
    }


def build_ranking(results: dict[str, Any]) -> list[dict[str, Any]]:
    ranking = []
    for language, payload in results.items():
        total_ns = int((payload if isinstance(payload, dict) else {}).get("total_ns") or 0)
        ranking.append(
            {
                "language": language,
                "total_ns": total_ns,
                "total_ms": total_ns / 1_000_000,
            }
        )
    ranking.sort(key=lambda row: row["total_ns"])
    return ranking


def maybe_write_winner_map(root: pathlib.Path, report: dict[str, Any], options: dict[str, Any], output_file: pathlib.Path) -> None:
    winner_map_override = str(options.get("winner_map_file") or "").strip()
    if winner_map_override:
        winner_map_path = (root / pathlib.PurePosixPath(winner_map_override)).resolve()
    elif output_file == (root / DEFAULT_OUTPUT_PATH).resolve():
        winner_map_path = (root / DEFAULT_WINNER_MAP_PATH).resolve()
    else:
        return
    write_text_file_robust(winner_map_path, f"{json.dumps(report.get('winner_mapping') or {}, indent=2)}\n", atomic=False)


def run_polyglot_benchmark(options: dict[str, Any] | None = None) -> dict[str, Any]:
    opts = options if isinstance(options, dict) else {}
    root = find_repo_root(pathlib.Path(opts.get("root") or ROOT))
    languages = resolve_languages(opts.get("languages") or list(SUPPORTED_LANGUAGES))
    benchmark_input = load_benchmark_input(root, opts)
    output_file = (root / pathlib.PurePosixPath(opts.get("output_file") or str(DEFAULT_OUTPUT_PATH))).resolve()

    report = {
        "status": "pass",
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "root": normalize_path(root),
        "inputs": {
            "registry_file": normalize_path_for_output(root, benchmark_input["registry_file"]),
            "benchmark_cases_file": normalize_path_for_output(root, benchmark_input["cases_file"]),
            "function_ids_filter": benchmark_input["function_ids_filter"],
            "warmup_iterations": benchmark_input["warmup_iterations"],
        },
        "output_file": normalize_path_for_output(root, output_file),
        "languages_requested": languages,
        "languages_run": [],
        "languages_skipped": [],
        "benchmark_case_count": len(benchmark_input["cases"]),
        "results": {},
        "ranking": [],
    }

    for language in languages:
        result = run_language_benchmark(language, root, benchmark_input)
        if not isinstance(result, dict) or result.get("ok") is not True:
            report["languages_skipped"].append(
                {
                    "language": language,
                    "reason": str((result if isinstance(result, dict) else {}).get("reason") or "language runner failed"),
                }
            )
            continue
        report["languages_run"].append(language)
        report["results"][language] = result

    report["ranking"] = build_ranking(report["results"])
    report["winner_mapping"] = build_winner_mapping(report["results"], report["ranking"])
    report["function_language_plan"] = build_function_language_plan(
        report["winner_mapping"],
        {
            "defaultPrimaryLanguage": (report["winner_mapping"] or {}).get("overall_winner_language") or "",
            "defaultFallbackLanguage": "",
        },
    )

    if not report["languages_run"]:
        report["status"] = "fail"
    elif report["languages_skipped"]:
        report["status"] = "fail" if bool(opts.get("strict")) else "warn"

    write_text_file_robust(output_file, f"{json.dumps(report, indent=2)}\n", atomic=False)
    maybe_write_winner_map(root, report, opts, output_file)
    return report


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    report = run_polyglot_benchmark(
        {
            "root": ROOT,
            "languages": args["languages"],
            "function_ids": args["function_ids"],
            "iterations_override": args["iterations_override"],
            "warmup_override": args["warmup_override"],
            "cases_file": args["cases_file"],
            "output_file": args["output_file"],
            "strict": args["strict"],
        }
    )
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if report["status"] == "fail" else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
