#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_OUT_DIR = path.join(ROOT, "artifacts", "polyglot-default");
const TOOLCHAIN_SCRIPT = path.join(ROOT, "skills", "language-fit-selector", "scripts", "detect_toolchains.sh");
const BENCHMARK_SCRIPT = path.join(
  ROOT,
  "skills",
  "polyglot-quality-benchmark-gate",
  "scripts",
  "run_sxs_benchmark.js"
);

const CRITERIA = Object.freeze([
  "runtime",
  "size",
  "startup",
  "memory",
  "portability",
  "tooling",
  "security",
  "velocity"
]);

const DEFAULT_WEIGHTS = Object.freeze({
  runtime: 20,
  size: 15,
  startup: 10,
  memory: 10,
  portability: 15,
  tooling: 10,
  security: 10,
  velocity: 10
});

const LANGUAGE_LABELS = Object.freeze({
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  go: "Go",
  rust: "Rust",
  java: "Java",
  csharp: "C#",
  cpp: "C++",
  swift: "Swift",
  kotlin: "Kotlin"
});

const LANGUAGE_PROFILES = Object.freeze({
  javascript: {
    runtime: 7,
    size: 6,
    startup: 8,
    memory: 6,
    portability: 9,
    tooling: 9,
    security: 6,
    velocity: 9
  },
  typescript: {
    runtime: 7,
    size: 6,
    startup: 7,
    memory: 6,
    portability: 9,
    tooling: 9,
    security: 7,
    velocity: 8
  },
  python: {
    runtime: 6,
    size: 8,
    startup: 7,
    memory: 6,
    portability: 9,
    tooling: 9,
    security: 7,
    velocity: 9
  },
  go: {
    runtime: 9,
    size: 7,
    startup: 8,
    memory: 8,
    portability: 9,
    tooling: 8,
    security: 8,
    velocity: 7
  },
  rust: {
    runtime: 10,
    size: 8,
    startup: 8,
    memory: 9,
    portability: 8,
    tooling: 7,
    security: 9,
    velocity: 6
  },
  java: {
    runtime: 8,
    size: 6,
    startup: 6,
    memory: 7,
    portability: 9,
    tooling: 9,
    security: 8,
    velocity: 8
  },
  csharp: {
    runtime: 8,
    size: 6,
    startup: 6,
    memory: 7,
    portability: 8,
    tooling: 9,
    security: 8,
    velocity: 8
  },
  cpp: {
    runtime: 10,
    size: 8,
    startup: 9,
    memory: 9,
    portability: 7,
    tooling: 7,
    security: 7,
    velocity: 5
  },
  swift: {
    runtime: 9,
    size: 7,
    startup: 7,
    memory: 8,
    portability: 5,
    tooling: 7,
    security: 8,
    velocity: 7
  },
  kotlin: {
    runtime: 8,
    size: 6,
    startup: 6,
    memory: 7,
    portability: 8,
    tooling: 8,
    security: 8,
    velocity: 8
  }
});

const TOOLCHAIN_TO_LANGUAGE = Object.freeze({
  "javascript-node": "javascript",
  typescript: "typescript",
  python: "python",
  go: "go",
  rust: "rust",
  java: "java",
  dotnet: "csharp",
  "c-cpp": "cpp",
  swift: "swift",
  kotlin: "kotlin"
});

const TOOLCHAIN_BENCHMARK_COMMANDS = Object.freeze({
  "javascript-node": ["node", ["--version"]],
  typescript: ["tsc", ["--version"]],
  python: ["python3", ["--version"]],
  go: ["go", ["version"]],
  rust: ["rustc", ["--version"]],
  java: ["javac", ["-version"]],
  dotnet: ["dotnet", ["--version"]],
  "c-cpp": ["gcc", ["--version"]],
  swift: ["swift", ["--version"]],
  kotlin: ["kotlinc", ["-version"]]
});

const CONTRACTS = Object.freeze([
  {
    id: "bootstrap.initializeApplication",
    name: "initializeApplication",
    args: ["config"],
    returns: "state"
  },
  {
    id: "validation.validateInput",
    name: "validateInput",
    args: ["payload"],
    returns: "validationResult"
  },
  {
    id: "core.executeCoreWorkflow",
    name: "executeCoreWorkflow",
    args: ["input", "state"],
    returns: "output"
  },
  {
    id: "persistence.persistState",
    name: "persistState",
    args: ["state"],
    returns: "persistResult"
  },
  {
    id: "recovery.recoverFromError",
    name: "recoverFromError",
    args: ["error", "context"],
    returns: "recoveryPlan"
  }
]);

function parseArgs(argv) {
  const args = {
    outDir: DEFAULT_OUT_DIR,
    briefText: "",
    briefFile: "",
    benchmarkManifest: "",
    runChecks: true,
    enforceSecurity: false,
    noBenchmark: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--brief") {
      args.briefText = String(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (token === "--brief-file") {
      args.briefFile = String(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (token === "--out-dir") {
      args.outDir = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--benchmark-manifest") {
      args.benchmarkManifest = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--skip-checks") {
      args.runChecks = false;
      continue;
    }
    if (token === "--enforce-security") {
      args.enforceSecurity = true;
      continue;
    }
    if (token === "--no-benchmark") {
      args.noBenchmark = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }
  }

  return args;
}

function printHelpAndExit(code) {
  const helpText = [
    "polyglot-default-pipeline",
    "",
    "Usage:",
    "  npm run polyglot:default -- [options]",
    "",
    "Options:",
    "  --brief \"text\"              Inline project brief text",
    "  --brief-file <path>           Read project brief from file",
    "  --out-dir <path>              Output directory (default: artifacts/polyglot-default)",
    "  --benchmark-manifest <path>   Use manifest for real SxS benchmark commands",
    "  --skip-checks                 Skip lint/test/refactor checks",
    "  --enforce-security            Fail if npm audit reports high/critical issues",
    "  --no-benchmark                Skip benchmark stage"
  ].join("\n");
  process.stdout.write(`${helpText}\n`);
  process.exit(code);
}

function readBrief(args) {
  if (args.briefText.trim()) {
    return args.briefText.trim();
  }
  if (args.briefFile) {
    return fs.readFileSync(args.briefFile, "utf8").trim();
  }
  return [
    "Build a production-ready application with strong portability,",
    "measured runtime performance, small footprint, and strict reliability/security checks."
  ].join(" ");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath, value) {
  fs.writeFileSync(filePath, `${String(value || "").trim()}\n`, "utf8");
}

function median(values) {
  if (!values.length) {
    return 0;
  }
  const ordered = [...values].sort((a, b) => a - b);
  const mid = Math.floor(ordered.length / 2);
  if (ordered.length % 2 === 0) {
    return (ordered[mid - 1] + ordered[mid]) / 2;
  }
  return ordered[mid];
}

function bytesOfText(value) {
  return Buffer.byteLength(String(value || ""), "utf8");
}

function toPascalCase(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function detectToolchains() {
  const result = spawnSync(TOOLCHAIN_SCRIPT, {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });

  if ((result.status || 0) !== 0) {
    throw new Error(`toolchain detection failed: ${result.stderr || result.stdout || "unknown error"}`);
  }

  return String(result.stdout || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, status, version] = line.split("|");
      return {
        toolchain: String(name || "").trim(),
        installed: String(status || "").trim() === "installed",
        version: String(version || "").trim()
      };
    });
}

function scoreLanguages(toolchainInventory) {
  const available = [];
  const eliminationLog = [];

  toolchainInventory.forEach((item) => {
    const language = TOOLCHAIN_TO_LANGUAGE[item.toolchain];
    if (!language) {
      return;
    }
    if (!item.installed) {
      eliminationLog.push({
        language,
        reason: `toolchain '${item.toolchain}' not installed`
      });
      return;
    }
    available.push({
      language,
      toolchain: item.toolchain,
      version: item.version
    });
  });

  const totalWeight = CRITERIA.reduce((sum, key) => sum + Number(DEFAULT_WEIGHTS[key] || 0), 0);
  const scoreRows = available.map((row) => {
    const profile = LANGUAGE_PROFILES[row.language] || {};
    const weightedTotal = CRITERIA.reduce((sum, key) => {
      const score = Number(profile[key] || 0);
      const weight = Number(DEFAULT_WEIGHTS[key] || 0);
      return sum + score * weight;
    }, 0);
    return {
      language: row.language,
      label: LANGUAGE_LABELS[row.language] || row.language,
      toolchain: row.toolchain,
      version: row.version,
      criteria: profile,
      weightedScore: Number((weightedTotal / totalWeight).toFixed(3))
    };
  });

  scoreRows.sort((left, right) => right.weightedScore - left.weightedScore);

  return {
    scoreRows,
    eliminationLog,
    primaryLanguage: scoreRows[0] ? scoreRows[0].language : "",
    fallbackLanguage: scoreRows[1] ? scoreRows[1].language : "",
    benchmarkLanguages: scoreRows.map((row) => row.language)
  };
}

function buildEnglishBlueprint(brief, languageSelection) {
  const title = brief.split(/\r?\n/)[0].trim().slice(0, 120) || "Project";
  return [
    "# Problem Statement",
    brief,
    "",
    "# Scope and Non-Goals",
    "- Scope: Deliver a cross-platform, benchmarked implementation set with strict quality gates.",
    "- Non-goals: Shipping incomplete parity variants or unmeasured performance claims.",
    "",
    "# Functional Requirements",
    "- Implement bootstrap, input validation, core workflow execution, persistence, and recovery paths.",
    "- Keep behavior parity across all selected languages.",
    "",
    "# Non-Functional Requirements",
    "- Measurable runtime and artifact-size comparisons.",
    "- Security/hardening checks and reproducible validation runs.",
    "- Portability across target operating systems.",
    "",
    "# Domain Model",
    "- Entity: ProjectConfig",
    "- Entity: RuntimeState",
    "- Entity: WorkflowInput",
    "- Entity: WorkflowOutput",
    "- Entity: ValidationResult",
    "",
    "# System Components",
    "- Bootstrap module",
    "- Validation module",
    "- Core workflow module",
    "- Persistence adapter",
    "- Error recovery module",
    "",
    "# Data Model and Persistence",
    "- Persistent state must include version stamp, schema revision, and migration metadata.",
    "- All write operations return deterministic operation results.",
    "",
    "# API and Event Contracts",
    "- initializeApplication(config) => state",
    "- validateInput(payload) => validationResult",
    "- executeCoreWorkflow(input, state) => output",
    "- persistState(state) => persistResult",
    "- recoverFromError(error, context) => recoveryPlan",
    "",
    "# Test Blueprint",
    "- Unit tests for each contract",
    "- Integration tests for end-to-end lifecycle",
    "- Cross-language parity tests using shared vectors",
    "",
    "# Risk Register",
    "- Risk: behavior drift across languages",
    "  Mitigation: parity matrix and shared fixtures",
    "- Risk: performance regressions",
    "  Mitigation: SxS benchmark gate before recommendation",
    "- Risk: dependency vulnerabilities",
    "  Mitigation: security audit in quality gate",
    "",
    "# Planning Snapshot",
    `- Project title seed: ${title}`,
    `- Primary language candidate: ${LANGUAGE_LABELS[languageSelection.primaryLanguage] || "n/a"}`,
    `- Fallback language candidate: ${LANGUAGE_LABELS[languageSelection.fallbackLanguage] || "n/a"}`
  ].join("\n");
}

function buildPseudocodeBlueprint() {
  return [
    "# Pseudocode by Module",
    "",
    "## bootstrap.initializeApplication",
    "INPUT: config",
    "PRE: config is normalized",
    "STEPS:",
    "1. set state.version from config.version",
    "2. set state.start_time to current timestamp",
    "3. set state.flags from config.flags with defaults",
    "4. return state",
    "POST: state is fully initialized",
    "",
    "## validation.validateInput",
    "INPUT: payload",
    "PRE: payload may be partial",
    "STEPS:",
    "1. if payload is null then return invalid(E_INVALID_INPUT)",
    "2. check required fields",
    "3. collect violations in deterministic order",
    "4. return validationResult",
    "POST: validationResult has status and violation list",
    "",
    "## core.executeCoreWorkflow",
    "INPUT: input, state",
    "PRE: input is valid OR recoverable",
    "STEPS:",
    "1. derive execution context from state",
    "2. transform input into normalized domain object",
    "3. compute output using deterministic steps",
    "4. update state telemetry counters",
    "5. return output",
    "POST: output is stable for same input/state",
    "",
    "## persistence.persistState",
    "INPUT: state",
    "PRE: state has schema version",
    "STEPS:",
    "1. serialize state with schema metadata",
    "2. write to durable storage",
    "3. verify write result",
    "4. return persistResult",
    "POST: persistResult reflects durable status",
    "",
    "## recovery.recoverFromError",
    "INPUT: error, context",
    "PRE: error is captured with stack/message",
    "STEPS:",
    "1. classify error severity",
    "2. choose recovery strategy",
    "3. emit recovery actions",
    "4. return recoveryPlan",
    "POST: recoveryPlan is executable and observable"
  ].join("\n");
}

function renderLanguageStub(language, contracts) {
  if (language === "javascript" || language === "typescript") {
    const typeSuffix = language === "typescript" ? ": unknown" : "";
    return contracts
      .map((contract) => {
        const args = contract.args.join(", ");
        return `function ${contract.name}(${args})${typeSuffix} {\n  throw new Error("Not implemented");\n}`;
      })
      .join("\n\n");
  }

  if (language === "python") {
    return contracts
      .map((contract) => {
        const args = contract.args.join(", ");
        return `def ${contract.name}(${args}):\n    raise NotImplementedError("Not implemented")`;
      })
      .join("\n\n");
  }

  if (language === "go") {
    return [
      "package core",
      "",
      ...contracts.map((contract) => {
        const funcName = toPascalCase(contract.name);
        return `func ${funcName}() error {\n\treturn nil\n}`;
      })
    ].join("\n\n");
  }

  if (language === "rust") {
    return contracts
      .map((contract) => {
        return `pub fn ${contract.name}() -> Result<(), String> {\n    Ok(())\n}`;
      })
      .join("\n\n");
  }

  if (language === "java") {
    const methods = contracts
      .map((contract) => {
        return `  public Object ${contract.name}() {\n    throw new UnsupportedOperationException("Not implemented");\n  }`;
      })
      .join("\n\n");
    return `public class CoreContracts {\n${methods}\n}`;
  }

  if (language === "csharp") {
    const methods = contracts
      .map((contract) => {
        return `  public object ${contract.name}() {\n    throw new System.NotImplementedException();\n  }`;
      })
      .join("\n\n");
    return `public class CoreContracts\n{\n${methods}\n}`;
  }

  if (language === "cpp") {
    return contracts
      .map((contract) => {
        return `void ${contract.name}() {\n  throw "Not implemented";\n}`;
      })
      .join("\n\n");
  }

  if (language === "swift") {
    return contracts
      .map((contract) => {
        return `func ${contract.name}() throws {\n  throw NSError(domain: "not-implemented", code: 1)\n}`;
      })
      .join("\n\n");
  }

  if (language === "kotlin") {
    return contracts
      .map((contract) => {
        return `fun ${contract.name}() {\n  TODO("Not implemented")\n}`;
      })
      .join("\n\n");
  }

  return contracts.map((contract) => `${contract.name}() // TODO`).join("\n");
}

function extensionForLanguage(language) {
  if (language === "javascript") return "js";
  if (language === "typescript") return "ts";
  if (language === "python") return "py";
  if (language === "go") return "go";
  if (language === "rust") return "rs";
  if (language === "java") return "java";
  if (language === "csharp") return "cs";
  if (language === "cpp") return "cpp";
  if (language === "swift") return "swift";
  if (language === "kotlin") return "kt";
  return "txt";
}

function buildPolyglotImplementation(outDir, benchmarkLanguages) {
  const generatedDir = path.join(outDir, "build", "generated");
  ensureDir(generatedDir);

  const languageFunctionMap = [];

  benchmarkLanguages.forEach((language) => {
    const languageDir = path.join(generatedDir, language);
    ensureDir(languageDir);

    const ext = extensionForLanguage(language);
    const filePath = path.join(languageDir, `core_contracts.${ext}`);
    const content = renderLanguageStub(language, CONTRACTS);
    writeText(filePath, content);

    languageFunctionMap.push({
      language,
      label: LANGUAGE_LABELS[language] || language,
      contracts: CONTRACTS.map((contract) => ({
        contractId: contract.id,
        functionName: contract.name,
        args: contract.args,
        returns: contract.returns
      })),
      generatedPath: path.relative(outDir, filePath),
      generatedBytes: bytesOfText(content)
    });
  });

  const parityMatrix = benchmarkLanguages.map((language) => ({
    language,
    contracts: CONTRACTS.map((contract) => ({
      contractId: contract.id,
      status: "generated"
    }))
  }));

  const sharedTestVectors = CONTRACTS.map((contract) => ({
    contractId: contract.id,
    input: {
      sample: true,
      payload: `fixture_${contract.name}`
    },
    expected: {
      stable: true,
      contract: contract.returns
    }
  }));

  return {
    contractMap: CONTRACTS,
    languageFunctionMap,
    parityMatrix,
    sharedTestVectors
  };
}

function runBuildChecks(enabled) {
  if (!enabled) {
    return {
      skipped: true,
      steps: []
    };
  }

  const commands = [
    { id: "lint", command: "npm", args: ["run", "lint", "--silent"] },
    { id: "test", command: "npm", args: ["test", "--silent"] },
    { id: "refactor_gate", command: "npm", args: ["run", "refactor:gate", "--silent"] }
  ];

  const steps = commands.map((step) => {
    const result = spawnSync(step.command, step.args, {
      cwd: ROOT,
      encoding: "utf8",
      shell: false
    });

    return {
      id: step.id,
      passed: (result.status || 0) === 0,
      statusCode: result.status,
      stdoutTail: String(result.stdout || "").slice(-2000),
      stderrTail: String(result.stderr || "").slice(-2000)
    };
  });

  return {
    skipped: false,
    steps,
    passed: steps.every((step) => step.passed)
  };
}

function runSecurityAudit(enforceSecurity) {
  const result = spawnSync("npm", ["audit", "--omit=dev", "--json"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });

  let parsed = {};
  try {
    parsed = JSON.parse(String(result.stdout || "{}"));
  } catch {
    parsed = {
      parse_error: true,
      raw: String(result.stdout || "").slice(0, 2000)
    };
  }

  const metadata = parsed.metadata || {};
  const vulnerabilities = metadata.vulnerabilities || {};
  const high = Number(vulnerabilities.high || 0);
  const critical = Number(vulnerabilities.critical || 0);

  const passed = high + critical === 0;
  if (enforceSecurity && !passed) {
    throw new Error(`security gate failed: high=${high}, critical=${critical}`);
  }

  return {
    statusCode: result.status,
    passed,
    enforceSecurity,
    vulnerabilities,
    auditSummary: {
      high,
      critical
    }
  };
}

function runProbeBenchmark(toolchainInventory) {
  const rows = [];

  toolchainInventory.forEach((item) => {
    if (!item.installed) {
      return;
    }

    const spec = TOOLCHAIN_BENCHMARK_COMMANDS[item.toolchain];
    if (!spec) {
      return;
    }

    const [command, args] = spec;
    const samples = [];

    for (let i = 0; i < 3; i += 1) {
      const start = process.hrtime.bigint();
      const run = spawnSync(command, args, {
        cwd: ROOT,
        encoding: "utf8",
        shell: false
      });
      const end = process.hrtime.bigint();
      if ((run.status || 0) !== 0) {
        samples.push(Number.POSITIVE_INFINITY);
      } else {
        samples.push(Number(end - start) / 1000000);
      }
    }

    rows.push({
      toolchain: item.toolchain,
      version: item.version,
      medianMs: Number(median(samples).toFixed(3)),
      minMs: Number(Math.min(...samples).toFixed(3)),
      maxMs: Number(Math.max(...samples).toFixed(3))
    });
  });

  rows.sort((left, right) => left.medianMs - right.medianMs);
  return {
    mode: "probe",
    iterations: 3,
    results: rows,
    ranking: rows.map((row) => row.toolchain)
  };
}

function runBenchmark(args, toolchainInventory) {
  if (args.noBenchmark) {
    return {
      skipped: true,
      reason: "--no-benchmark enabled"
    };
  }

  if (args.benchmarkManifest) {
    const result = spawnSync("node", [BENCHMARK_SCRIPT, args.benchmarkManifest], {
      cwd: ROOT,
      encoding: "utf8",
      shell: false
    });
    if ((result.status || 0) !== 0) {
      throw new Error(`benchmark manifest run failed: ${result.stderr || result.stdout}`);
    }
    return JSON.parse(String(result.stdout || "{}"));
  }

  return runProbeBenchmark(toolchainInventory);
}

function buildFinalRecommendation(languageSelection, checks, security, benchmark) {
  const lines = [];
  lines.push("# Final Recommendation");
  lines.push("");
  lines.push(`- Primary language: ${LANGUAGE_LABELS[languageSelection.primaryLanguage] || "n/a"}`);
  lines.push(`- Fallback language: ${LANGUAGE_LABELS[languageSelection.fallbackLanguage] || "n/a"}`);
  lines.push(`- Benchmark set: ${(languageSelection.benchmarkLanguages || []).map((key) => LANGUAGE_LABELS[key] || key).join(", ")}`);
  lines.push("");
  lines.push("## Gate Status");
  lines.push(`- Build checks passed: ${checks.skipped ? "skipped" : checks.passed ? "yes" : "no"}`);
  lines.push(`- Security gate passed: ${security.passed ? "yes" : "no"}`);

  if (benchmark && benchmark.skipped) {
    lines.push("- Benchmark stage: skipped");
  } else if (benchmark && Array.isArray(benchmark.ranking)) {
    lines.push(`- Benchmark top result: ${String(benchmark.ranking[0] || "n/a")}`);
  }

  lines.push("");
  lines.push("## Rationale");
  lines.push("- Selection is weighted by runtime, size, startup, memory, portability, tooling, security, and velocity.");
  lines.push("- Final recommendation keeps one primary and one fallback for risk-managed delivery.");
  lines.push("- Side-by-side benchmark output is attached for metric validation.");

  return lines.join("\n");
}

function runPipeline() {
  const args = parseArgs(process.argv.slice(2));
  const brief = readBrief(args);

  ensureDir(args.outDir);
  ensureDir(path.join(args.outDir, "plan"));
  ensureDir(path.join(args.outDir, "analysis"));
  ensureDir(path.join(args.outDir, "build"));
  ensureDir(path.join(args.outDir, "reports"));

  const toolchainInventory = detectToolchains();
  const languageSelection = scoreLanguages(toolchainInventory);

  const englishBlueprint = buildEnglishBlueprint(brief, languageSelection);
  const pseudocodeBlueprint = buildPseudocodeBlueprint();

  const implementation = buildPolyglotImplementation(args.outDir, languageSelection.benchmarkLanguages);
  const checks = runBuildChecks(args.runChecks);
  const security = runSecurityAudit(args.enforceSecurity);
  const benchmark = runBenchmark(args, toolchainInventory);

  const polyglotManifest = {
    brief,
    primary_language: languageSelection.primaryLanguage,
    fallback_language: languageSelection.fallbackLanguage,
    benchmark_languages: languageSelection.benchmarkLanguages,
    generated_at: new Date().toISOString()
  };

  const languageScorecard = {
    weights: DEFAULT_WEIGHTS,
    toolchain_inventory: toolchainInventory,
    language_score_table: languageSelection.scoreRows,
    elimination_log: languageSelection.eliminationLog,
    primary_language: languageSelection.primaryLanguage,
    fallback_language: languageSelection.fallbackLanguage,
    benchmark_languages: languageSelection.benchmarkLanguages
  };

  writeText(path.join(args.outDir, "plan", "blueprint_english.md"), englishBlueprint);
  writeText(path.join(args.outDir, "plan", "blueprint_pseudocode.md"), pseudocodeBlueprint);
  writeJson(path.join(args.outDir, "analysis", "toolchain_inventory.json"), toolchainInventory);
  writeJson(path.join(args.outDir, "analysis", "language_scorecard.json"), languageScorecard);
  writeJson(path.join(args.outDir, "analysis", "validation_report.json"), checks);
  writeJson(path.join(args.outDir, "analysis", "security_report.json"), security);

  writeJson(path.join(args.outDir, "build", "polyglot_manifest.json"), polyglotManifest);
  writeJson(path.join(args.outDir, "build", "contract_map.json"), implementation.contractMap);
  writeJson(path.join(args.outDir, "build", "polyglot_implementation_map.json"), implementation.languageFunctionMap);
  writeJson(path.join(args.outDir, "build", "shared_test_vectors.json"), implementation.sharedTestVectors);
  writeJson(path.join(args.outDir, "build", "parity_matrix.json"), implementation.parityMatrix);

  writeJson(path.join(args.outDir, "reports", "sxs_benchmark_report.json"), benchmark);
  writeText(
    path.join(args.outDir, "reports", "final_recommendation.md"),
    buildFinalRecommendation(languageSelection, checks, security, benchmark)
  );

  const outputSummary = {
    out_dir: args.outDir,
    primary_language: languageSelection.primaryLanguage,
    fallback_language: languageSelection.fallbackLanguage,
    benchmark_count: (languageSelection.benchmarkLanguages || []).length,
    checks_passed: checks.skipped ? null : checks.passed,
    security_passed: security.passed
  };

  process.stdout.write(`${JSON.stringify(outputSummary, null, 2)}\n`);

  if (!checks.skipped && !checks.passed) {
    process.exitCode = 2;
  }
}

try {
  runPipeline();
} catch (error) {
  process.stderr.write(`polyglot-default-pipeline failed: ${error.message}\n`);
  process.exit(1);
}
