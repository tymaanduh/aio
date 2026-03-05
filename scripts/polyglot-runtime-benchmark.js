#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { findProjectRoot } = require("./project-source-resolver");

const REGISTRY_PATH = path.join("data", "input", "shared", "wrapper", "wrapper_symbol_registry.json");
const BENCHMARK_CASES_PATH = path.join("data", "input", "shared", "wrapper", "runtime_benchmark_cases.json");
const JS_BINDINGS_PATH = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "generated",
  "javascript",
  "wrapper_symbols.js"
);
const PYTHON_BINDINGS_PATH = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "generated",
  "python",
  "wrapper_symbols.py"
);
const CPP_BINDINGS_DIR = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "generated",
  "cpp"
);
const CPP_BINDINGS_SOURCE = path.join(CPP_BINDINGS_DIR, "wrapper_symbols.cpp");
const DEFAULT_OUTPUT_PATH = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_benchmark_report.json"
);

const SUPPORTED_LANGUAGES = Object.freeze(["javascript", "python", "cpp"]);
const CASE_ID_PATTERN = /^[a-z][a-z0-9_]*$/;
const WINDOWS_CPP_FALLBACKS = Object.freeze([
  path.join("C:", "Program Files", "LLVM", "bin", "clang++.exe"),
  path.join("C:", "Program Files (x86)", "LLVM", "bin", "clang++.exe")
]);

const PYTHON_RUNNER_CODE = `
import importlib.util
import json
import time
import sys

def load_module(module_path: str):
    spec = importlib.util.spec_from_file_location("wrapper_symbols_module", module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError("unable to load wrapper symbols module")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

def main():
    payload = json.loads(sys.stdin.read())
    module = load_module(payload["module_path"])
    runner = getattr(module, "run_wrapper_function", None)
    if runner is None:
        raise RuntimeError("python wrapper module does not expose run_wrapper_function")
    warmup_iterations = int(payload.get("warmup_iterations", 0))
    cases = payload.get("cases", [])
    report_cases = []
    total_ns = 0
    for case in cases:
        case_id = str(case["case_id"])
        function_id = str(case["function_id"])
        iterations = int(case["iterations"])
        args = dict(case["args"])
        probe = runner(function_id, args)
        if not bool(probe.get("ok", False)):
            print(json.dumps({
                "ok": False,
                "language": "python",
                "error": "probe_failed",
                "case_id": case_id,
                "detail": probe
            }))
            return
        for _ in range(warmup_iterations):
            runner(function_id, args)
        start_ns = time.perf_counter_ns()
        for _ in range(iterations):
            runner(function_id, args)
        elapsed_ns = time.perf_counter_ns() - start_ns
        total_ns += elapsed_ns
        report_cases.append({
            "case_id": case_id,
            "function_id": function_id,
            "iterations": iterations,
            "elapsed_ns": elapsed_ns,
            "ns_per_iteration": elapsed_ns / iterations
        })
    print(json.dumps({
        "ok": True,
        "language": "python",
        "total_ns": total_ns,
        "cases": report_cases
    }))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({
            "ok": False,
            "language": "python",
            "error": "python_runner_exception",
            "detail": str(exc)
        }))
`;

function parseArgs(argv) {
  const args = {
    languages: [...SUPPORTED_LANGUAGES],
    iterationsOverride: 0,
    warmupOverride: 0,
    casesFile: "",
    outputFile: "",
    strict: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index] || "");
    if (token === "--languages") {
      const csv = String(argv[index + 1] || "");
      args.languages = csv
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
      index += 1;
      continue;
    }
    if (token === "--iterations") {
      args.iterationsOverride = Number(argv[index + 1] || 0);
      index += 1;
      continue;
    }
    if (token === "--warmup") {
      args.warmupOverride = Number(argv[index + 1] || 0);
      index += 1;
      continue;
    }
    if (token === "--cases-file") {
      args.casesFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--output-file") {
      args.outputFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--strict") {
      args.strict = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function printHelpAndExit(code) {
  const help = [
    "polyglot-runtime-benchmark",
    "",
    "Usage:",
    "  npm run benchmark:runtime -- [options]",
    "",
    "Options:",
    "  --languages <csv>        Language runtimes to benchmark (javascript,python,cpp).",
    "  --iterations <number>    Override iterations per case.",
    "  --warmup <number>        Override warmup iterations per case.",
    "  --cases-file <path>      Optional benchmark case catalog JSON path.",
    "  --output-file <path>     Optional report output path.",
    "  --strict                 Fail if any requested language cannot run.",
    "  --help                   Show this help."
  ].join("\n");
  process.stdout.write(`${help}\n`);
  process.exit(code);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizePathForOutput(root, absolutePath) {
  return path.relative(root, absolutePath).replace(/\\/g, "/");
}

function normalizeValueForRuntime(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

function commandExists(command, args = ["--version"]) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false
  });
  return !result.error && Number(result.status || 0) === 0;
}

function detectPythonRuntime() {
  if (commandExists("python")) {
    return {
      command: "python",
      argsPrefix: [],
      label: "python"
    };
  }
  if (commandExists("py", ["-3", "--version"])) {
    return {
      command: "py",
      argsPrefix: ["-3"],
      label: "py -3"
    };
  }
  return null;
}

function detectCppCompiler() {
  const envOverride = String(process.env.AIO_CPP_COMPILER || "").trim();
  if (envOverride && commandExists(envOverride)) {
    return envOverride;
  }
  if (commandExists("g++")) {
    return "g++";
  }
  if (commandExists("clang++")) {
    return "clang++";
  }
  for (const fallback of WINDOWS_CPP_FALLBACKS) {
    if (fs.existsSync(fallback) && commandExists(fallback)) {
      return fallback;
    }
  }
  return "";
}

function parseJsonFromText(rawText) {
  const text = String(rawText || "").trim();
  if (!text) {
    return null;
  }
  const candidates = [text];
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    candidates.push(text.slice(start, end + 1));
  }
  for (let index = 0; index < candidates.length; index += 1) {
    try {
      return JSON.parse(candidates[index]);
    } catch {
      // continue
    }
  }
  return null;
}

function resolveLanguages(languages) {
  const normalized = [...new Set((Array.isArray(languages) ? languages : []).map((item) => String(item).trim().toLowerCase()))];
  if (normalized.length === 0) {
    return [...SUPPORTED_LANGUAGES];
  }
  const unsupported = normalized.filter((language) => !SUPPORTED_LANGUAGES.includes(language));
  if (unsupported.length > 0) {
    throw new Error(`unsupported languages: ${unsupported.join(", ")}`);
  }
  return normalized;
}

function loadBenchmarkInput(root, options = {}) {
  const registryFile = path.resolve(root, REGISTRY_PATH);
  const casesFile = path.resolve(root, options.casesFile || BENCHMARK_CASES_PATH);
  if (!fs.existsSync(registryFile)) {
    throw new Error(`missing wrapper symbol registry: ${registryFile}`);
  }
  if (!fs.existsSync(casesFile)) {
    throw new Error(`missing benchmark cases file: ${casesFile}`);
  }

  const registry = readJson(registryFile);
  const benchmarkDoc = readJson(casesFile);
  const functionIndex = registry && typeof registry.function_index === "object" ? registry.function_index : {};
  const defaultIterations = Math.max(1, Number(benchmarkDoc.default_iterations || 10000));
  const warmupIterations = Math.max(0, Number(benchmarkDoc.warmup_iterations || 0));
  const rawCases = Array.isArray(benchmarkDoc.cases) ? benchmarkDoc.cases : [];
  const seenCaseIds = new Set();
  const issues = [];

  const cases = rawCases
    .map((rawCase, index) => {
      const entry = rawCase && typeof rawCase === "object" ? rawCase : {};
      const caseId = String(entry.case_id || "").trim();
      const functionId = String(entry.function_id || "").trim();
      const args = entry.args && typeof entry.args === "object" && !Array.isArray(entry.args) ? entry.args : {};
      const iterations = Math.max(
        1,
        Number(options.iterationsOverride > 0 ? options.iterationsOverride : entry.iterations || defaultIterations)
      );

      if (!caseId) {
        issues.push(`cases[${index}] missing case_id`);
      } else if (!CASE_ID_PATTERN.test(caseId)) {
        issues.push(`cases[${index}] case_id must match ${CASE_ID_PATTERN}`);
      } else if (seenCaseIds.has(caseId)) {
        issues.push(`duplicate case_id: ${caseId}`);
      } else {
        seenCaseIds.add(caseId);
      }

      if (!functionId || !functionIndex[functionId]) {
        issues.push(`case ${caseId || `index_${index}`} references unknown function_id: ${functionId}`);
      } else {
        const requiredArgs = (Array.isArray(functionIndex[functionId].inputs) ? functionIndex[functionId].inputs : [])
          .filter((input) => Boolean(input.required))
          .map((input) => String(input.arg || "").trim())
          .filter(Boolean);
        const missing = requiredArgs.filter((argName) => !Object.prototype.hasOwnProperty.call(args, argName));
        if (missing.length > 0) {
          issues.push(`case ${caseId} missing required args for ${functionId}: ${missing.join(", ")}`);
        }
      }

      return {
        case_id: caseId,
        function_id: functionId,
        args,
        iterations
      };
    })
    .filter((entry) => entry.case_id && entry.function_id);

  if (cases.length === 0) {
    issues.push("benchmark cases catalog resolved to zero runnable cases");
  }

  if (issues.length > 0) {
    throw new Error(`invalid benchmark catalog: ${issues.join("; ")}`);
  }

  return {
    registryFile,
    casesFile,
    registry,
    benchmarkDoc,
    cases,
    warmupIterations: Math.max(0, Number(options.warmupOverride > 0 ? options.warmupOverride : warmupIterations))
  };
}

function runJavascriptBenchmark(root, benchmarkInput) {
  const modulePath = path.resolve(root, JS_BINDINGS_PATH);
  if (!fs.existsSync(modulePath)) {
    return {
      ok: false,
      reason: `missing javascript bindings: ${normalizePathForOutput(root, modulePath)}`
    };
  }

  delete require.cache[require.resolve(modulePath)];
  const bindings = require(modulePath);
  if (typeof bindings.runWrapperFunction !== "function") {
    return {
      ok: false,
      reason: "javascript wrapper bindings missing runWrapperFunction export"
    };
  }

  const resultCases = [];
  let totalNs = 0n;
  benchmarkInput.cases.forEach((testCase) => {
    const probe = bindings.runWrapperFunction(testCase.function_id, testCase.args);
    if (!probe || probe.ok !== true) {
      throw new Error(`javascript probe failed for ${testCase.case_id}: ${JSON.stringify(probe || {})}`);
    }

    for (let index = 0; index < benchmarkInput.warmupIterations; index += 1) {
      bindings.runWrapperFunction(testCase.function_id, testCase.args);
    }

    const start = process.hrtime.bigint();
    for (let index = 0; index < testCase.iterations; index += 1) {
      bindings.runWrapperFunction(testCase.function_id, testCase.args);
    }
    const elapsed = process.hrtime.bigint() - start;
    totalNs += elapsed;
    resultCases.push({
      case_id: testCase.case_id,
      function_id: testCase.function_id,
      iterations: testCase.iterations,
      elapsed_ns: Number(elapsed),
      ns_per_iteration: Number(elapsed) / testCase.iterations
    });
  });

  return {
    ok: true,
    language: "javascript",
    total_ns: Number(totalNs),
    cases: resultCases
  };
}

function runPythonBenchmark(root, benchmarkInput) {
  const modulePath = path.resolve(root, PYTHON_BINDINGS_PATH);
  if (!fs.existsSync(modulePath)) {
    return {
      ok: false,
      reason: `missing python bindings: ${normalizePathForOutput(root, modulePath)}`
    };
  }
  const python = detectPythonRuntime();
  if (!python) {
    return {
      ok: false,
      reason: "python runtime not found (tried python, py -3)"
    };
  }

  const payload = {
    module_path: modulePath,
    warmup_iterations: benchmarkInput.warmupIterations,
    cases: benchmarkInput.cases.map((testCase) => ({
      case_id: testCase.case_id,
      function_id: testCase.function_id,
      args: testCase.args,
      iterations: testCase.iterations
    }))
  };

  const result = spawnSync(python.command, [...python.argsPrefix, "-c", PYTHON_RUNNER_CODE], {
    encoding: "utf8",
    shell: false,
    input: JSON.stringify(payload)
  });

  if (result.error || Number(result.status || 0) !== 0) {
    return {
      ok: false,
      reason: `python runner failed (${python.label})`,
      stderr: String(result.stderr || result.error?.message || "").trim()
    };
  }

  const parsed = parseJsonFromText(result.stdout);
  if (!parsed || parsed.ok !== true) {
    return {
      ok: false,
      reason: "python runner output was not valid success JSON",
      stdout: String(result.stdout || "").trim()
    };
  }

  return parsed;
}

function cStringLiteral(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

function buildCppRunnerSource(benchmarkInput) {
  const caseRows = benchmarkInput.cases
    .map((testCase) => {
      const argRows = Object.entries(testCase.args)
        .map(([argName, argValue]) => `{"${cStringLiteral(argName)}","${cStringLiteral(normalizeValueForRuntime(argValue))}"}`)
        .join(",");
      return `  {"${cStringLiteral(testCase.case_id)}","${cStringLiteral(testCase.function_id)}",{${argRows}},${testCase.iterations}}`;
    })
    .join(",\n");

  return [
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
    "  const int warmup_iterations = " + benchmarkInput.warmupIterations + ";",
    "  const std::vector<BenchCase> cases = {",
    caseRows,
    "  };",
    "  std::vector<BenchResult> results;",
    "  results.reserve(cases.size());",
    "  long long total_ns = 0;",
    "  for (const auto& test_case : cases) {",
    "    auto probe = aio::wrapper_symbols::run_wrapper_function(test_case.function_id, test_case.args);",
    "    if (!probe.ok) {",
    '      std::cout << "{\\"ok\\":false,\\"language\\":\\"cpp\\",\\"error\\":\\"probe_failed\\",\\"case_id\\":\\""',
    "                << test_case.case_id << \"\\\",\\\"detail\\\":\\\"\" << probe.error_code << \"\\\"}\";",
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
    "    if (index > 0) {",
    '      std::cout << ",";',
    "    }",
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
    ""
  ].join("\n");
}

function runCppBenchmark(root, benchmarkInput) {
  const compiler = detectCppCompiler();
  if (!compiler) {
    return {
      ok: false,
      reason: "no C++ compiler found (checked AIO_CPP_COMPILER, g++, clang++, and LLVM default path)"
    };
  }

  const cppSourcePath = path.resolve(root, CPP_BINDINGS_SOURCE);
  if (!fs.existsSync(cppSourcePath)) {
    return {
      ok: false,
      reason: `missing C++ bindings source: ${normalizePathForOutput(root, cppSourcePath)}`
    };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-polyglot-bench-"));
  const runnerPath = path.join(tmpDir, "runner.cpp");
  const exePath = path.join(tmpDir, process.platform === "win32" ? "runner.exe" : "runner");
  fs.writeFileSync(runnerPath, buildCppRunnerSource(benchmarkInput), "utf8");

  const compileArgs = [
    "-std=c++17",
    "-O2",
    "-I",
    path.resolve(root, CPP_BINDINGS_DIR),
    cppSourcePath,
    runnerPath,
    "-o",
    exePath
  ];

  const compile = spawnSync(compiler, compileArgs, {
    encoding: "utf8",
    shell: false
  });
  if (compile.error || Number(compile.status || 0) !== 0) {
    return {
      ok: false,
      reason: `C++ compile failed using ${compiler}`,
      stderr: String(compile.stderr || compile.error?.message || "").trim()
    };
  }

  const run = spawnSync(exePath, [], {
    encoding: "utf8",
    shell: false
  });
  if (run.error || Number(run.status || 0) !== 0) {
    return {
      ok: false,
      reason: "compiled C++ benchmark runner failed",
      stderr: String(run.stderr || run.error?.message || "").trim()
    };
  }

  const parsed = parseJsonFromText(run.stdout);
  if (!parsed || parsed.ok !== true) {
    return {
      ok: false,
      reason: "C++ benchmark output was not valid success JSON",
      stdout: String(run.stdout || "").trim()
    };
  }

  return parsed;
}

function runLanguageBenchmark(language, root, benchmarkInput) {
  if (language === "javascript") {
    return runJavascriptBenchmark(root, benchmarkInput);
  }
  if (language === "python") {
    return runPythonBenchmark(root, benchmarkInput);
  }
  if (language === "cpp") {
    return runCppBenchmark(root, benchmarkInput);
  }
  return {
    ok: false,
    reason: `unsupported language adapter: ${language}`
  };
}

function toFiniteNumber(value, fallback = Number.POSITIVE_INFINITY) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function buildWinnerMapping(results, ranking) {
  const languageKeys = Object.keys(results || {});
  if (languageKeys.length === 0) {
    return {
      method: "min_ns_per_iteration",
      compared_languages: [],
      overall_winner_language: "",
      case_count: 0,
      function_count: 0,
      per_case: [],
      per_function: []
    };
  }

  const caseMap = new Map();
  const functionMap = new Map();

  languageKeys.forEach((language) => {
    const payload = results[language] && typeof results[language] === "object" ? results[language] : {};
    const rows = Array.isArray(payload.cases) ? payload.cases : [];
    rows.forEach((row) => {
      const caseId = String((row && row.case_id) || "").trim();
      const functionId = String((row && row.function_id) || "").trim();
      if (!caseId || !functionId) {
        return;
      }

      const nsPerIteration = toFiniteNumber(row.ns_per_iteration);
      if (!caseMap.has(caseId)) {
        caseMap.set(caseId, {
          case_id: caseId,
          function_id: functionId,
          candidates: []
        });
      }
      caseMap.get(caseId).candidates.push({
        language,
        ns_per_iteration: nsPerIteration
      });

      const functionKey = functionId;
      if (!functionMap.has(functionKey)) {
        functionMap.set(functionKey, new Map());
      }
      const byLanguage = functionMap.get(functionKey);
      if (!byLanguage.has(language)) {
        byLanguage.set(language, {
          total_ns_per_iteration: 0,
          sample_count: 0
        });
      }
      const aggregate = byLanguage.get(language);
      aggregate.total_ns_per_iteration += nsPerIteration;
      aggregate.sample_count += 1;
    });
  });

  const perCase = [...caseMap.values()]
    .map((entry) => {
      const rankings = entry.candidates
        .slice()
        .sort((left, right) => left.ns_per_iteration - right.ns_per_iteration)
        .map((candidate) => ({
          language: candidate.language,
          ns_per_iteration: Number(candidate.ns_per_iteration.toFixed(6))
        }));
      const winner = rankings[0] || null;
      return {
        case_id: entry.case_id,
        function_id: entry.function_id,
        winner_language: winner ? winner.language : "",
        winner_ns_per_iteration: winner ? winner.ns_per_iteration : 0,
        language_rankings: rankings
      };
    })
    .sort((left, right) => left.case_id.localeCompare(right.case_id));

  const perFunction = [...functionMap.entries()]
    .map(([functionId, byLanguage]) => {
      const rankings = [...byLanguage.entries()]
        .map(([language, aggregate]) => {
          const average =
            aggregate.sample_count > 0 ? aggregate.total_ns_per_iteration / aggregate.sample_count : Number.POSITIVE_INFINITY;
          return {
            language,
            avg_ns_per_iteration: Number(average.toFixed(6)),
            sample_count: aggregate.sample_count
          };
        })
        .sort((left, right) => left.avg_ns_per_iteration - right.avg_ns_per_iteration);
      const winner = rankings[0] || null;
      return {
        function_id: functionId,
        winner_language: winner ? winner.language : "",
        winner_avg_ns_per_iteration: winner ? winner.avg_ns_per_iteration : 0,
        language_rankings: rankings
      };
    })
    .sort((left, right) => left.function_id.localeCompare(right.function_id));

  const topRank = Array.isArray(ranking) && ranking.length > 0 ? ranking[0] : null;
  const overallWinnerLanguage = topRank && typeof topRank === "object" ? String(topRank.language || "") : "";

  return {
    method: "min_ns_per_iteration",
    compared_languages: languageKeys.slice().sort((left, right) => left.localeCompare(right)),
    overall_winner_language: overallWinnerLanguage,
    case_count: perCase.length,
    function_count: perFunction.length,
    per_case: perCase,
    per_function: perFunction
  };
}

function buildRanking(results) {
  return Object.entries(results)
    .map(([language, payload]) => ({
      language,
      total_ns: Number(payload.total_ns || 0),
      total_ms: Number(payload.total_ns || 0) / 1_000_000
    }))
    .sort((left, right) => left.total_ns - right.total_ns);
}

function runPolyglotBenchmark(options = {}) {
  const root = findProjectRoot(options.root || process.cwd());
  const languages = resolveLanguages(options.languages || SUPPORTED_LANGUAGES);
  const benchmarkInput = loadBenchmarkInput(root, options);
  const outputFile = path.resolve(root, options.outputFile || DEFAULT_OUTPUT_PATH);

  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root,
    inputs: {
      registry_file: normalizePathForOutput(root, benchmarkInput.registryFile),
      benchmark_cases_file: normalizePathForOutput(root, benchmarkInput.casesFile),
      warmup_iterations: benchmarkInput.warmupIterations
    },
    output_file: normalizePathForOutput(root, outputFile),
    languages_requested: languages,
    languages_run: [],
    languages_skipped: [],
    benchmark_case_count: benchmarkInput.cases.length,
    results: {},
    ranking: []
  };

  languages.forEach((language) => {
    const result = runLanguageBenchmark(language, root, benchmarkInput);
    if (!result || result.ok !== true) {
      report.languages_skipped.push({
        language,
        reason: String((result && result.reason) || "language runner failed")
      });
      return;
    }
    report.languages_run.push(language);
    report.results[language] = result;
  });

  report.ranking = buildRanking(report.results);
  report.winner_mapping = buildWinnerMapping(report.results, report.ranking);
  if (report.languages_run.length === 0) {
    report.status = "fail";
  } else if (report.languages_skipped.length > 0) {
    report.status = options.strict ? "fail" : "warn";
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = runPolyglotBenchmark({
    root: process.cwd(),
    languages: args.languages,
    iterationsOverride: args.iterationsOverride,
    warmupOverride: args.warmupOverride,
    casesFile: args.casesFile,
    outputFile: args.outputFile,
    strict: args.strict
  });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.status === "fail") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`polyglot-runtime-benchmark failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  runPolyglotBenchmark,
  loadBenchmarkInput,
  resolveLanguages,
  buildWinnerMapping
};
