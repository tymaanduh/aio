#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { create_unified_wrapper } = require("../brain/wrappers/unified_io_wrapper.js");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_OUT_DIR = path.join(ROOT, "data", "output", "databases", "polyglot-default");

function resolveFirstExistingPath(candidates) {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

const TOOLCHAIN_SCRIPT = resolveFirstExistingPath([
  path.join(ROOT, "to-do", "skills", "language-fit-selector", "scripts", "detect_toolchains.sh"),
  path.join(ROOT, "skills", "language-fit-selector", "scripts", "detect_toolchains.sh")
]);

const BENCHMARK_SCRIPT = resolveFirstExistingPath([
  path.join(ROOT, "to-do", "skills", "polyglot-quality-benchmark-gate", "scripts", "run_sxs_benchmark.js"),
  path.join(ROOT, "skills", "polyglot-quality-benchmark-gate", "scripts", "run_sxs_benchmark.js")
]);

const STAGE_ORDER = Object.freeze([
  "context_intake",
  "wrapper_preflight",
  "blueprint",
  "language_selection",
  "translation",
  "quality_checks",
  "security",
  "benchmark",
  "recommendation"
]);

const DEFAULT_WRAPPER_PREFLIGHT = Object.freeze({
  pipelineId: "pipeline_default_math",
  input: {
    x: 1,
    y: 1
  }
});

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
    mode: "auto",
    projectName: "",
    scopeSummary: "",
    plannedUpdates: [],
    runChecks: true,
    enforceSecurity: false,
    noBenchmark: false,
    skipWrapperPreflight: false,
    wrapperPipelineId: DEFAULT_WRAPPER_PREFLIGHT.pipelineId,
    wrapperInput: { ...DEFAULT_WRAPPER_PREFLIGHT.input },
    wrapperSpecFile: "",
    skipUpdateScans: false,
    forcePseudocode: false,
    forceTranslation: false,
    rerunGates: false,
    syncTranslation: false
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

    if (token === "--mode") {
      args.mode = String(argv[index + 1] || "").trim().toLowerCase();
      index += 1;
      continue;
    }

    if (token === "--create") {
      args.mode = "create";
      continue;
    }

    if (token === "--maintain") {
      args.mode = "maintain";
      continue;
    }

    if (token === "--project") {
      args.projectName = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (token === "--scope") {
      args.scopeSummary = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (token === "--planned-update") {
      const value = String(argv[index + 1] || "").trim();
      if (value) {
        args.plannedUpdates.push(value);
      }
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

    if (token === "--skip-wrapper-preflight") {
      args.skipWrapperPreflight = true;
      continue;
    }

    if (token === "--wrapper-pipeline-id") {
      args.wrapperPipelineId = String(argv[index + 1] || "").trim() || DEFAULT_WRAPPER_PREFLIGHT.pipelineId;
      index += 1;
      continue;
    }

    if (token === "--wrapper-input-json") {
      args.wrapperInput = parseJsonObject(argv[index + 1], { ...DEFAULT_WRAPPER_PREFLIGHT.input });
      index += 1;
      continue;
    }

    if (token === "--wrapper-spec-file") {
      args.wrapperSpecFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }

    if (token === "--skip-update-scans") {
      args.skipUpdateScans = true;
      continue;
    }

    if (token === "--force-pseudocode") {
      args.forcePseudocode = true;
      continue;
    }

    if (token === "--force-translation") {
      args.forceTranslation = true;
      continue;
    }

    if (token === "--rerun-gates") {
      args.rerunGates = true;
      continue;
    }

    if (token === "--sync-translation") {
      args.syncTranslation = true;
      continue;
    }

    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }

    throw new Error(`unknown argument: ${token}`);
  }

  if (!["auto", "create", "maintain"].includes(args.mode)) {
    throw new Error("--mode must be one of: auto, create, maintain");
  }

  return args;
}

function printHelpAndExit(code) {
  const helpText = [
    "polyglot-default-pipeline",
    "",
    "Usage:",
    "  npm run polyglot:default -- [options]",
    "  npm run polyglot:create -- [options]",
    "  npm run polyglot:maintain -- [options]",
    "",
    "Options:",
    "  --mode <auto|create|maintain>  Run mode (default: auto)",
    "  --brief \"text\"                Inline project brief text",
    "  --brief-file <path>           Read project brief from file",
    "  --project <name>              Project display name",
    "  --scope <summary>             Scope summary for run context",
    "  --planned-update \"text\"      Planned update item (repeatable)",
    "  --out-dir <path>              Output directory (default: data/output/databases/polyglot-default)",
    "  --benchmark-manifest <path>   Use manifest for full SxS benchmark commands",
    "  --skip-checks                 Skip lint/test/refactor checks",
    "  --enforce-security            Fail if npm audit has high/critical vulnerabilities",
    "  --no-benchmark                Skip benchmark stage",
    "  --skip-wrapper-preflight      Skip two-pass wrapper preflight stage",
    "  --wrapper-pipeline-id <id>    Wrapper pipeline id for preflight (default: pipeline_default_math)",
    "  --wrapper-input-json <json>   Wrapper input payload JSON for preflight",
    "  --wrapper-spec-file <path>    Override wrapper spec file for preflight",
    "  --skip-update-scans           Skip update-scan commands at run start/end",
    "  --force-pseudocode            Regenerate full pseudocode in maintain mode",
    "  --force-translation           Force translation stage in maintain mode",
    "  --sync-translation            Run translation when blueprint changes",
    "  --rerun-gates                 Force checks/security/benchmark stages in maintain mode"
  ].join("\n");
  process.stdout.write(`${helpText}\n`);
  process.exit(code);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function ensureParentDir(filePath) {
  ensureDir(path.dirname(filePath));
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readJsonIfExists(filePath, fallbackValue) {
  if (!fileExists(filePath)) {
    return fallbackValue;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallbackValue;
  }
}

function readTextIfExists(filePath, fallbackValue) {
  if (!fileExists(filePath)) {
    return fallbackValue;
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJsonObject(value, fallbackValue = {}) {
  if (!value) {
    return fallbackValue;
  }
  const parsed = JSON.parse(String(value));
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed;
  }
  return fallbackValue;
}

function parseJsonFromCommandOutput(rawText, fallbackValue = {}) {
  const text = String(rawText || "").trim();
  if (!text) {
    return fallbackValue;
  }

  const candidates = [];
  candidates.push(text);

  const newlineObjectStart = text.lastIndexOf("\n{");
  if (newlineObjectStart >= 0) {
    candidates.push(text.slice(newlineObjectStart + 1).trim());
  }

  const braceStart = text.indexOf("{");
  const braceEnd = text.lastIndexOf("}");
  if (braceStart >= 0 && braceEnd >= braceStart) {
    candidates.push(text.slice(braceStart, braceEnd + 1));
  }

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    try {
      return JSON.parse(candidate);
    } catch {
      // continue
    }
  }

  return fallbackValue;
}

function writeJson(filePath, value) {
  ensureParentDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath, value) {
  ensureParentDir(filePath);
  fs.writeFileSync(filePath, `${String(value || "").trim()}\n`, "utf8");
}

function nowIso() {
  return new Date().toISOString();
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

function hashText(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function toSortedUniqueArray(values) {
  return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value || "")))].sort();
}

function arraysEqualAsSet(leftValues, rightValues) {
  const left = toSortedUniqueArray(leftValues);
  const right = toSortedUniqueArray(rightValues);
  if (left.length !== right.length) {
    return false;
  }
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }
  return true;
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

function deriveProjectName(args, existingContext, brief) {
  if (args.projectName) {
    return args.projectName;
  }
  const existingName = existingContext && existingContext.project ? existingContext.project.name : "";
  if (existingName) {
    return existingName;
  }
  const firstLine = String(brief || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
  if (!firstLine) {
    return "Polyglot Project";
  }
  const words = firstLine
    .replace(/[^a-zA-Z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  if (!words.length) {
    return "Polyglot Project";
  }
  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

function deriveScopeSummary(args, existingContext, brief) {
  if (args.scopeSummary) {
    return args.scopeSummary;
  }
  const existingScope = existingContext && existingContext.project ? existingContext.project.scope_summary : "";
  if (existingScope) {
    return existingScope;
  }
  return String(brief || "").replace(/\s+/g, " ").trim().slice(0, 240);
}

function derivePlannedUpdates(args, brief) {
  if (args.plannedUpdates.length > 0) {
    return toSortedUniqueArray(args.plannedUpdates);
  }
  const sentences = String(brief || "")
    .split(/[\n.?!]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 12)
    .slice(0, 6);
  return toSortedUniqueArray(sentences.length ? sentences : [brief]);
}

function resolveRunMode(args, contextFilePath) {
  if (args.mode === "create" || args.mode === "maintain") {
    return args.mode;
  }
  return fileExists(contextFilePath) ? "maintain" : "create";
}

function artifactPaths(outDir) {
  return {
    planEnglish: path.join(outDir, "plan", "blueprint_english.md"),
    planPseudocode: path.join(outDir, "plan", "blueprint_pseudocode.md"),
    hierarchyOrder: path.join(outDir, "plan", "hierarchy_order.md"),
    toolchainInventory: path.join(outDir, "analysis", "toolchain_inventory.json"),
    languageScorecard: path.join(outDir, "analysis", "language_scorecard.json"),
    wrapperPreflightReport: path.join(outDir, "analysis", "wrapper_preflight_report.json"),
    updateScanReport: path.join(outDir, "analysis", "update_scan_report.json"),
    validationReport: path.join(outDir, "analysis", "validation_report.json"),
    securityReport: path.join(outDir, "analysis", "security_report.json"),
    polyglotManifest: path.join(outDir, "build", "polyglot_manifest.json"),
    contractMap: path.join(outDir, "build", "contract_map.json"),
    implementationMap: path.join(outDir, "build", "polyglot_implementation_map.json"),
    sharedTestVectors: path.join(outDir, "build", "shared_test_vectors.json"),
    parityMatrix: path.join(outDir, "build", "parity_matrix.json"),
    benchmarkReport: path.join(outDir, "reports", "sxs_benchmark_report.json"),
    finalRecommendation: path.join(outDir, "reports", "final_recommendation.md"),
    contextFile: path.join(outDir, "context", "run_state.json")
  };
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

function buildEnglishBlueprint(brief, languageSelection, projectName, scopeSummary) {
  const title = projectName || brief.split(/\r?\n/)[0].trim().slice(0, 120) || "Project";
  return [
    "# Problem Statement",
    brief,
    "",
    "# Scope and Non-Goals",
    `- Scope: ${scopeSummary || "Deliver a cross-platform benchmarked implementation set."}`,
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

function buildIncrementalEnglishSection(plannedUpdates, briefHash) {
  const timestamp = nowIso();
  const updateLines = (plannedUpdates || []).map((item) => `- ${item}`);
  return [
    `## Incremental Update ${timestamp}`,
    `<!-- brief-hash:${briefHash} -->`,
    "",
    "### Planned Updates",
    ...updateLines
  ].join("\n");
}

function buildIncrementalPseudocodeSection(plannedUpdates, briefHash) {
  const timestamp = nowIso();
  const updateLines = (plannedUpdates || []).map((item, index) => `${index + 1}. ${item}`);
  return [
    `## incremental.update.${timestamp.replace(/[^0-9]/g, "")}`,
    `<!-- brief-hash:${briefHash} -->`,
    "INPUT: existing pseudocode and planned changes",
    "STEPS:",
    ...updateLines,
    "POST: extend existing module-level pseudocode without replacing full baseline"
  ].join("\n");
}

function appendIfMissingMarker(existingText, marker, sectionText) {
  const text = String(existingText || "").trim();
  if (!text) {
    return {
      changed: true,
      value: sectionText
    };
  }
  if (text.includes(marker)) {
    return {
      changed: false,
      value: text
    };
  }
  return {
    changed: true,
    value: `${text}\n\n${sectionText}`
  };
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
      reason: "stage disabled for current run",
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

    for (let index = 0; index < 3; index += 1) {
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

function runUpdateScan(args, scope) {
  if (args.skipUpdateScans) {
    return {
      skipped: true,
      scope,
      reason: "--skip-update-scans enabled"
    };
  }

  const result = spawnSync(
    "npm",
    ["run", "updates:scan", "--", "--actor", "polyglot-default-director-agent", "--scope", scope],
    {
      cwd: ROOT,
      encoding: "utf8",
      shell: false
    }
  );

  if ((result.status || 0) !== 0) {
    return {
      skipped: false,
      ok: false,
      scope,
      statusCode: result.status,
      error: String(result.stderr || result.stdout || "update scan failed").trim()
    };
  }

  const summary = parseJsonFromCommandOutput(String(result.stdout || ""), {
    parse_error: true,
    raw_output_tail: String(result.stdout || "").slice(-2000)
  });

  return {
    skipped: false,
    ok: true,
    scope,
    statusCode: result.status,
    summary
  };
}

function runWrapperPreflight(args) {
  const wrapperSpec = args.wrapperSpecFile ? readJsonIfExists(args.wrapperSpecFile, {}) : {};
  const wrapper = create_unified_wrapper(wrapperSpec, {});
  const result = wrapper.run_pipeline_by_id(args.wrapperPipelineId, args.wrapperInput);
  const missing = result && result.pass_identify && Array.isArray(result.pass_identify.missing) ? result.pass_identify.missing : [];

  return {
    ok: Boolean(result && result.ok),
    pipeline_id: args.wrapperPipelineId,
    input: args.wrapperInput,
    spec_file: args.wrapperSpecFile || "",
    pass_identify: {
      ok: Boolean(result && result.pass_identify && result.pass_identify.ok),
      missing_count: missing.length,
      missing
    },
    pass_execute: {
      stage_count:
        result && result.pass_execute && Number.isFinite(Number(result.pass_execute.stage_count))
          ? Number(result.pass_execute.stage_count)
          : 0
    },
    final_output: result && Object.prototype.hasOwnProperty.call(result, "final_output") ? result.final_output : null,
    final_symbol: result && result.final_symbol ? String(result.final_symbol) : "",
    error: result && result.error ? String(result.error) : ""
  };
}

function stageSkip(stageId, reason) {
  return {
    stage: stageId,
    status: "skipped",
    reason,
    started_at: nowIso(),
    completed_at: nowIso(),
    duration_ms: 0
  };
}

function buildStagePlan(input) {
  const {
    mode,
    args,
    briefChanged,
    hasEnglishBlueprint,
    hasPseudocodeBlueprint,
    hasImplementationMap,
    languageSelectionChanged
  } = input;

  const isCreate = mode === "create";

  const blueprintRun =
    isCreate ||
    !hasEnglishBlueprint ||
    !hasPseudocodeBlueprint ||
    briefChanged ||
    args.forcePseudocode;

  const blueprintStrategy = args.forcePseudocode || isCreate || !hasPseudocodeBlueprint ? "full" : "incremental";

  const translationRun =
    isCreate ||
    args.forceTranslation ||
    !hasImplementationMap ||
    languageSelectionChanged ||
    (blueprintRun && (blueprintStrategy === "full" || args.syncTranslation));

  const checksRun = args.runChecks && (isCreate || args.rerunGates || translationRun);
  const securityRun = isCreate || args.rerunGates || translationRun || args.enforceSecurity;
  const benchmarkRun = !args.noBenchmark && (isCreate || args.rerunGates || translationRun || Boolean(args.benchmarkManifest));
  const wrapperPreflightRun = !args.skipWrapperPreflight;

  return {
    context_intake: {
      run: true,
      reason: "always refresh project context snapshot"
    },
    wrapper_preflight: {
      run: wrapperPreflightRun,
      reason: wrapperPreflightRun
        ? "verify two-pass wrapper argument identification and pipeline execution"
        : "skip to reduce runtime; use default behavior to enforce wrapper preflight"
    },
    blueprint: {
      run: blueprintRun,
      strategy: blueprintRun ? blueprintStrategy : "none",
      reason: blueprintRun
        ? blueprintStrategy === "full"
          ? "create baseline blueprint"
          : "extend existing blueprint incrementally"
        : "no blueprint delta detected"
    },
    language_selection: {
      run: true,
      reason: "always refresh toolchain + language scorecard"
    },
    translation: {
      run: translationRun,
      reason: translationRun
        ? languageSelectionChanged
          ? "language set changed"
          : "translation required by stage plan"
        : "reuse previous generated language files"
    },
    quality_checks: {
      run: checksRun,
      reason: checksRun ? "run strict checks for active build changes" : "skip to reduce runtime; use --rerun-gates to force"
    },
    security: {
      run: securityRun,
      reason: securityRun ? "run security audit for current state" : "skip to reduce runtime; use --rerun-gates to force"
    },
    benchmark: {
      run: benchmarkRun,
      reason: benchmarkRun ? "run side-by-side benchmark stage" : "skip to reduce runtime; use --rerun-gates to force"
    },
    recommendation: {
      run: true,
      reason: "always publish recommendation and stage summary"
    }
  };
}

function buildHierarchyOrderDoc(payload) {
  const {
    projectName,
    scopeSummary,
    mode,
    currentStage,
    stagePlan,
    stageStatus,
    plannedUpdates,
    briefHash,
    outDir,
    runAt
  } = payload;

  const lines = [];
  lines.push("# Hierarchy Order (Run First)");
  lines.push("");
  lines.push("Use this order before any build/edit pass:");
  lines.push("1. Context Intake and Snapshot Load");
  lines.push("2. Stage Planning (create vs maintain)");
  lines.push("3. Wrapper Preflight Stage (two-pass argument and execution validation)");
  lines.push("4. Blueprint Stage (full create or incremental grow)");
  lines.push("5. Language Selection Stage");
  lines.push("6. Translation Stage");
  lines.push("7. Quality/Security/Benchmark Gates");
  lines.push("8. Final Recommendation + Context Save");
  lines.push("");
  lines.push("## Run Snapshot");
  lines.push(`- Project: ${projectName}`);
  lines.push(`- Scope: ${scopeSummary}`);
  lines.push(`- Mode: ${mode}`);
  lines.push(`- Current stage: ${currentStage}`);
  lines.push(`- Run at: ${runAt}`);
  lines.push(`- Out dir: ${outDir}`);
  lines.push(`- Brief hash: ${briefHash}`);
  lines.push("");
  lines.push("## Planned Updates");
  (plannedUpdates || []).forEach((update) => {
    lines.push(`- ${update}`);
  });
  lines.push("");
  lines.push("## Stage Decisions");

  STAGE_ORDER.forEach((stageKey, index) => {
    const decision = stagePlan[stageKey] || { run: false, reason: "not planned" };
    const status = stageStatus[stageKey] || null;
    const statusLabel = status ? status.status : "pending";
    const reason = status && status.reason ? status.reason : decision.reason;
    const action = decision.run ? "run" : "skip";
    lines.push(`${index + 1}. ${stageKey}`);
    lines.push(`   - planned_action: ${action}`);
    lines.push(`   - status: ${statusLabel}`);
    lines.push(`   - reason: ${reason}`);
  });

  return lines.join("\n");
}

function buildFinalRecommendation(languageSelection, wrapperPreflight, checks, security, benchmark, mode, stagePlan) {
  const lines = [];
  lines.push("# Final Recommendation");
  lines.push("");
  lines.push(`- Run mode: ${mode}`);
  lines.push(`- Primary language: ${LANGUAGE_LABELS[languageSelection.primaryLanguage] || "n/a"}`);
  lines.push(`- Fallback language: ${LANGUAGE_LABELS[languageSelection.fallbackLanguage] || "n/a"}`);
  lines.push(`- Benchmark set: ${(languageSelection.benchmarkLanguages || []).map((key) => LANGUAGE_LABELS[key] || key).join(", ")}`);
  lines.push("");
  lines.push("## Gate Status");
  lines.push(`- Wrapper preflight stage planned: ${stagePlan.wrapper_preflight.run ? "yes" : "no"}`);
  lines.push(
    `- Wrapper preflight passed: ${
      wrapperPreflight && wrapperPreflight.skipped
        ? "skipped"
        : wrapperPreflight && wrapperPreflight.ok === true
        ? "yes"
        : "no"
    }`
  );
  lines.push(`- Build checks stage planned: ${stagePlan.quality_checks.run ? "yes" : "no"}`);
  lines.push(`- Build checks passed: ${checks.skipped ? "skipped" : checks.passed ? "yes" : "no"}`);
  lines.push(`- Security stage planned: ${stagePlan.security.run ? "yes" : "no"}`);
  lines.push(`- Security gate passed: ${security && security.passed === true ? "yes" : security && security.skipped ? "skipped" : "no"}`);

  if (benchmark && benchmark.skipped) {
    lines.push("- Benchmark stage: skipped");
  } else if (benchmark && Array.isArray(benchmark.ranking)) {
    lines.push(`- Benchmark top result: ${String(benchmark.ranking[0] || "n/a")}`);
  }

  lines.push("");
  lines.push("## Rationale");
  lines.push("- Selection is weighted by runtime, size, startup, memory, portability, tooling, security, and velocity.");
  lines.push("- Maintain mode reuses existing artifacts and only runs stale stages unless forced.");
  lines.push("- Recommendation keeps one primary and one fallback for risk-managed delivery.");

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
  ensureDir(path.join(args.outDir, "context"));

  const paths = artifactPaths(args.outDir);
  const updateScan = {
    start: runUpdateScan(args, "pipeline-start"),
    complete: {
      skipped: true,
      reason: "run not completed yet"
    }
  };
  writeJson(paths.updateScanReport, updateScan);
  const existingContext = readJsonIfExists(paths.contextFile, {});
  const mode = resolveRunMode(args, paths.contextFile);

  if (mode === "maintain" && !fileExists(paths.contextFile)) {
    throw new Error("maintain mode requires an existing context file; run create mode first");
  }

  const runAt = nowIso();
  const briefHash = hashText(brief);
  const previousBriefHash = String(existingContext.brief_hash || "");
  const briefChanged = mode === "create" || previousBriefHash !== briefHash;

  const projectName = deriveProjectName(args, existingContext, brief);
  const scopeSummary = deriveScopeSummary(args, existingContext, brief);
  const plannedUpdates = derivePlannedUpdates(args, brief);

  const hasEnglishBlueprint = fileExists(paths.planEnglish);
  const hasPseudocodeBlueprint = fileExists(paths.planPseudocode);
  const hasImplementationMap = fileExists(paths.implementationMap);

  const toolchainInventory = detectToolchains();
  const languageSelection = scoreLanguages(toolchainInventory);

  const previousBenchmarkLanguages =
    existingContext.language_selection && Array.isArray(existingContext.language_selection.benchmark_languages)
      ? existingContext.language_selection.benchmark_languages
      : [];
  const languageSelectionChanged = !arraysEqualAsSet(previousBenchmarkLanguages, languageSelection.benchmarkLanguages);

  const stagePlan = buildStagePlan({
    mode,
    args,
    briefChanged,
    hasEnglishBlueprint,
    hasPseudocodeBlueprint,
    hasImplementationMap,
    languageSelectionChanged
  });

  const stageStatus = {};

  stageStatus.context_intake = {
    stage: "context_intake",
    status: "completed",
    reason: stagePlan.context_intake.reason,
    started_at: runAt,
    completed_at: nowIso(),
    duration_ms: 0
  };

  writeText(
    paths.hierarchyOrder,
    buildHierarchyOrderDoc({
      projectName,
      scopeSummary,
      mode,
      currentStage: "wrapper_preflight",
      stagePlan,
      stageStatus,
      plannedUpdates,
      briefHash,
      outDir: args.outDir,
      runAt
    })
  );

  let wrapperPreflight = {
    skipped: true,
    reason: "not executed",
    ok: null
  };

  if (stagePlan.wrapper_preflight.run) {
    const stageStart = Date.now();
    wrapperPreflight = runWrapperPreflight(args);
    writeJson(paths.wrapperPreflightReport, wrapperPreflight);
    stageStatus.wrapper_preflight = {
      stage: "wrapper_preflight",
      status: wrapperPreflight.ok ? "completed" : "failed",
      reason: stagePlan.wrapper_preflight.reason,
      started_at: new Date(stageStart).toISOString(),
      completed_at: nowIso(),
      duration_ms: Date.now() - stageStart,
      pipeline_id: wrapperPreflight.pipeline_id,
      missing_count:
        wrapperPreflight &&
        wrapperPreflight.pass_identify &&
        Number.isFinite(Number(wrapperPreflight.pass_identify.missing_count))
          ? Number(wrapperPreflight.pass_identify.missing_count)
          : 0
    };

    if (!wrapperPreflight.ok) {
      throw new Error(`wrapper preflight failed: ${wrapperPreflight.error || "missing input arguments or execution failure"}`);
    }
  } else {
    stageStatus.wrapper_preflight = stageSkip("wrapper_preflight", stagePlan.wrapper_preflight.reason);
    writeJson(paths.wrapperPreflightReport, wrapperPreflight);
  }

  let englishBlueprintText = readTextIfExists(paths.planEnglish, "");
  let pseudocodeBlueprintText = readTextIfExists(paths.planPseudocode, "");

  if (stagePlan.blueprint.run) {
    const stageStart = Date.now();
    const marker = `<!-- brief-hash:${briefHash} -->`;

    if (stagePlan.blueprint.strategy === "full") {
      englishBlueprintText = buildEnglishBlueprint(brief, languageSelection, projectName, scopeSummary);
      pseudocodeBlueprintText = buildPseudocodeBlueprint();
      writeText(paths.planEnglish, englishBlueprintText);
      writeText(paths.planPseudocode, pseudocodeBlueprintText);
      stageStatus.blueprint = {
        stage: "blueprint",
        status: "completed",
        reason: stagePlan.blueprint.reason,
        strategy: "full",
        changed: true,
        started_at: new Date(stageStart).toISOString(),
        completed_at: nowIso(),
        duration_ms: Date.now() - stageStart
      };
    } else {
      const englishDelta = buildIncrementalEnglishSection(plannedUpdates, briefHash);
      const pseudoDelta = buildIncrementalPseudocodeSection(plannedUpdates, briefHash);
      const englishAppend = appendIfMissingMarker(englishBlueprintText, marker, englishDelta);
      const pseudoAppend = appendIfMissingMarker(pseudocodeBlueprintText, marker, pseudoDelta);
      englishBlueprintText = englishAppend.value;
      pseudocodeBlueprintText = pseudoAppend.value;
      writeText(paths.planEnglish, englishBlueprintText);
      writeText(paths.planPseudocode, pseudocodeBlueprintText);
      stageStatus.blueprint = {
        stage: "blueprint",
        status: "completed",
        reason: stagePlan.blueprint.reason,
        strategy: "incremental",
        changed: englishAppend.changed || pseudoAppend.changed,
        started_at: new Date(stageStart).toISOString(),
        completed_at: nowIso(),
        duration_ms: Date.now() - stageStart
      };
    }
  } else {
    stageStatus.blueprint = stageSkip("blueprint", stagePlan.blueprint.reason);
  }

  const stageLanguageStart = Date.now();
  const languageScorecard = {
    weights: DEFAULT_WEIGHTS,
    toolchain_inventory: toolchainInventory,
    language_score_table: languageSelection.scoreRows,
    elimination_log: languageSelection.eliminationLog,
    primary_language: languageSelection.primaryLanguage,
    fallback_language: languageSelection.fallbackLanguage,
    benchmark_languages: languageSelection.benchmarkLanguages
  };
  writeJson(paths.toolchainInventory, toolchainInventory);
  writeJson(paths.languageScorecard, languageScorecard);

  stageStatus.language_selection = {
    stage: "language_selection",
    status: "completed",
    reason: stagePlan.language_selection.reason,
    started_at: new Date(stageLanguageStart).toISOString(),
    completed_at: nowIso(),
    duration_ms: Date.now() - stageLanguageStart,
    primary_language: languageSelection.primaryLanguage,
    fallback_language: languageSelection.fallbackLanguage,
    language_set_changed: languageSelectionChanged
  };

  let implementation = {
    contractMap: readJsonIfExists(paths.contractMap, CONTRACTS),
    languageFunctionMap: readJsonIfExists(paths.implementationMap, []),
    sharedTestVectors: readJsonIfExists(paths.sharedTestVectors, []),
    parityMatrix: readJsonIfExists(paths.parityMatrix, [])
  };

  if (stagePlan.translation.run) {
    const stageStart = Date.now();
    implementation = buildPolyglotImplementation(args.outDir, languageSelection.benchmarkLanguages);
    writeJson(paths.contractMap, implementation.contractMap);
    writeJson(paths.implementationMap, implementation.languageFunctionMap);
    writeJson(paths.sharedTestVectors, implementation.sharedTestVectors);
    writeJson(paths.parityMatrix, implementation.parityMatrix);
    stageStatus.translation = {
      stage: "translation",
      status: "completed",
      reason: stagePlan.translation.reason,
      started_at: new Date(stageStart).toISOString(),
      completed_at: nowIso(),
      duration_ms: Date.now() - stageStart,
      generated_languages: implementation.languageFunctionMap.map((row) => row.language)
    };
  } else {
    stageStatus.translation = stageSkip("translation", stagePlan.translation.reason);
  }

  let checks = {
    skipped: true,
    reason: "not executed"
  };
  if (stagePlan.quality_checks.run) {
    const stageStart = Date.now();
    checks = runBuildChecks(true);
    stageStatus.quality_checks = {
      stage: "quality_checks",
      status: checks.passed ? "completed" : "failed",
      reason: stagePlan.quality_checks.reason,
      started_at: new Date(stageStart).toISOString(),
      completed_at: nowIso(),
      duration_ms: Date.now() - stageStart,
      passed: checks.passed
    };
  } else {
    checks = runBuildChecks(false);
    stageStatus.quality_checks = stageSkip("quality_checks", stagePlan.quality_checks.reason);
  }
  writeJson(paths.validationReport, checks);

  let security = {
    skipped: true,
    reason: "not executed",
    passed: null
  };
  if (stagePlan.security.run) {
    const stageStart = Date.now();
    security = runSecurityAudit(args.enforceSecurity);
    stageStatus.security = {
      stage: "security",
      status: security.passed ? "completed" : "failed",
      reason: stagePlan.security.reason,
      started_at: new Date(stageStart).toISOString(),
      completed_at: nowIso(),
      duration_ms: Date.now() - stageStart,
      passed: security.passed
    };
  } else {
    stageStatus.security = stageSkip("security", stagePlan.security.reason);
  }
  writeJson(paths.securityReport, security);

  let benchmark = {
    skipped: true,
    reason: "not executed"
  };
  if (stagePlan.benchmark.run) {
    const stageStart = Date.now();
    benchmark = runBenchmark(args, toolchainInventory);
    stageStatus.benchmark = {
      stage: "benchmark",
      status: "completed",
      reason: stagePlan.benchmark.reason,
      started_at: new Date(stageStart).toISOString(),
      completed_at: nowIso(),
      duration_ms: Date.now() - stageStart,
      ranking: Array.isArray(benchmark.ranking) ? benchmark.ranking : []
    };
  } else {
    stageStatus.benchmark = stageSkip("benchmark", stagePlan.benchmark.reason);
  }
  writeJson(paths.benchmarkReport, benchmark);

  const stageRecommendationStart = Date.now();
  const polyglotManifest = {
    mode,
    project_name: projectName,
    scope_summary: scopeSummary,
    brief,
    brief_hash: briefHash,
    primary_language: languageSelection.primaryLanguage,
    fallback_language: languageSelection.fallbackLanguage,
    benchmark_languages: languageSelection.benchmarkLanguages,
    planned_updates: plannedUpdates,
    generated_at: nowIso()
  };

  writeJson(paths.polyglotManifest, polyglotManifest);
  writeText(
    paths.finalRecommendation,
    buildFinalRecommendation(languageSelection, wrapperPreflight, checks, security, benchmark, mode, stagePlan)
  );

  stageStatus.recommendation = {
    stage: "recommendation",
    status: "completed",
    reason: stagePlan.recommendation.reason,
    started_at: new Date(stageRecommendationStart).toISOString(),
    completed_at: nowIso(),
    duration_ms: Date.now() - stageRecommendationStart
  };

  const contextPayload = {
    schema_version: 1,
    project: {
      name: projectName,
      scope_summary: scopeSummary,
      out_dir: args.outDir,
      created_at: existingContext.project && existingContext.project.created_at ? existingContext.project.created_at : runAt
    },
    brief_hash: briefHash,
    brief_excerpt: brief.slice(0, 300),
    mode_last_run: mode,
    current_stage: "completed",
    stage_order: STAGE_ORDER,
    stage_plan: stagePlan,
    stage_status: stageStatus,
    planned_updates: plannedUpdates,
    language_selection: {
      primary_language: languageSelection.primaryLanguage,
      fallback_language: languageSelection.fallbackLanguage,
      benchmark_languages: languageSelection.benchmarkLanguages
    },
    artifacts: {
      hierarchy_order: path.relative(args.outDir, paths.hierarchyOrder),
      plan_english: path.relative(args.outDir, paths.planEnglish),
      plan_pseudocode: path.relative(args.outDir, paths.planPseudocode),
      wrapper_preflight_report: path.relative(args.outDir, paths.wrapperPreflightReport),
      language_scorecard: path.relative(args.outDir, paths.languageScorecard),
      update_scan_report: path.relative(args.outDir, paths.updateScanReport),
      implementation_map: path.relative(args.outDir, paths.implementationMap),
      benchmark_report: path.relative(args.outDir, paths.benchmarkReport),
      final_recommendation: path.relative(args.outDir, paths.finalRecommendation)
    },
    run_count: Number(existingContext.run_count || 0) + 1,
    last_run_at: nowIso(),
    run_history: [
      ...((Array.isArray(existingContext.run_history) ? existingContext.run_history : []).slice(-19)),
      {
        run_at: nowIso(),
        mode,
        brief_hash: briefHash,
        planned_updates_count: plannedUpdates.length,
        wrapper_preflight_passed:
          wrapperPreflight && wrapperPreflight.skipped ? null : wrapperPreflight && wrapperPreflight.ok === true,
        checks_passed: checks.skipped ? null : Boolean(checks.passed),
        security_passed: security && security.skipped ? null : security && security.passed === true,
        benchmark_skipped: Boolean(benchmark && benchmark.skipped)
      }
    ]
  };

  writeJson(paths.contextFile, contextPayload);

  writeText(
    paths.hierarchyOrder,
    buildHierarchyOrderDoc({
      projectName,
      scopeSummary,
      mode,
      currentStage: "completed",
      stagePlan,
      stageStatus,
      plannedUpdates,
      briefHash,
      outDir: args.outDir,
      runAt
    })
  );

  updateScan.complete = runUpdateScan(args, "pipeline-complete");
  writeJson(paths.updateScanReport, updateScan);

  const outputSummary = {
    out_dir: args.outDir,
    mode,
    project_name: projectName,
    scope_summary: scopeSummary,
    current_stage: "completed",
    update_scan_start_ok:
      updateScan && updateScan.start && updateScan.start.skipped ? null : updateScan && updateScan.start && updateScan.start.ok,
    update_scan_complete_ok:
      updateScan && updateScan.complete && updateScan.complete.skipped
        ? null
        : updateScan && updateScan.complete && updateScan.complete.ok,
    primary_language: languageSelection.primaryLanguage,
    fallback_language: languageSelection.fallbackLanguage,
    benchmark_count: (languageSelection.benchmarkLanguages || []).length,
    wrapper_preflight_passed:
      wrapperPreflight && wrapperPreflight.skipped ? null : wrapperPreflight && wrapperPreflight.ok === true,
    checks_passed: checks.skipped ? null : checks.passed,
    security_passed: security && security.skipped ? null : security && security.passed === true,
    benchmark_skipped: Boolean(benchmark && benchmark.skipped),
    context_file: paths.contextFile,
    hierarchy_file: paths.hierarchyOrder
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
