#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { create_unified_wrapper } = require("../brain/wrappers/unified_io_wrapper.js");
const POLYGLOT_DEFAULT_CATALOG = require("../data/input/shared/main/polyglot_default_catalog.json");
const POLYGLOT_CONTRACT_CATALOG = require("../data/input/shared/main/polyglot_contract_catalog.json");

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

const stageOrder = Object.freeze([
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

function clone_plain_object(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : fallback;
  return JSON.parse(JSON.stringify(source && typeof source === "object" ? source : {}));
}

const DEFAULT_WRAPPER_PREFLIGHT = (() => {
  const source = clone_plain_object(POLYGLOT_DEFAULT_CATALOG.default_wrapper_preflight, {
    pipelineId: "pipeline_default_math",
    input: { x: 1, y: 1 }
  });
  const pipeline_id =
    typeof source.pipelineId === "string" && source.pipelineId.trim()
      ? source.pipelineId.trim()
      : "pipeline_default_math";
  const input = source.input && typeof source.input === "object" ? source.input : { x: 1, y: 1 };
  return Object.freeze({
    pipelineId: pipeline_id,
    input: Object.freeze({ ...input })
  });
})();

const criteriaKeys = Object.freeze([
  "runtime",
  "size",
  "startup",
  "memory",
  "portability",
  "tooling",
  "security",
  "velocity"
]);

const defaultWeightsFallback = Object.freeze({
  runtime: 20,
  size: 15,
  startup: 10,
  memory: 10,
  portability: 15,
  tooling: 10,
  security: 10,
  velocity: 10
});

const DEFAULT_WEIGHTS = Object.freeze(
  clone_plain_object(POLYGLOT_DEFAULT_CATALOG.default_weights, defaultWeightsFallback)
);

const languageLabelsFallback = Object.freeze({
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

const LANGUAGE_LABELS = Object.freeze(
  clone_plain_object(POLYGLOT_DEFAULT_CATALOG.language_labels, languageLabelsFallback)
);

const languageProfiles = Object.freeze({
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

const toolchainToLanguage = Object.freeze({
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

const toolchainBenchmarkCommands = Object.freeze({
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

const fallbackContractCatalog = Object.freeze({
  instruction_template_index: {
    template_wrapper_default: {
      template_id: "template_wrapper_default",
      passes: {
        identify_arguments: {
          action_ids: ["identify_required_arguments"]
        },
        execute_pipeline: {
          action_ids: ["emit_contract_metadata", "copy_bound_arguments", "emit_return_slot"]
        }
      }
    }
  },
  contract_index: [
    {
      contract_id: "bootstrap.initializeApplication",
      function_name: "initializeApplication",
      input: [{ name: "config", type: "object", required: true }],
      output: { type: "object", slot: "state" },
      preconditions: ["config has required runtime keys"],
      postconditions: ["state is initialized deterministically"],
      error_contract: [{ code: "E_INVALID_CONFIG", condition: "config is missing required keys" }],
      complexity_target: "O(n)",
      source_pseudocode_id: "PS-001",
      instruction_template_ref: "template_wrapper_default"
    },
    {
      contract_id: "validation.validateInput",
      function_name: "validateInput",
      input: [{ name: "payload", type: "object", required: true }],
      output: { type: "object", slot: "validationResult" },
      preconditions: ["payload is present"],
      postconditions: ["validationResult contains deterministic status"],
      error_contract: [{ code: "E_INVALID_INPUT", condition: "payload is missing or malformed" }],
      complexity_target: "O(n)",
      source_pseudocode_id: "PS-002",
      instruction_template_ref: "template_wrapper_default"
    },
    {
      contract_id: "core.executeCoreWorkflow",
      function_name: "executeCoreWorkflow",
      input: [
        { name: "input", type: "object", required: true },
        { name: "state", type: "object", required: true }
      ],
      output: { type: "object", slot: "output" },
      preconditions: ["input and state are normalized"],
      postconditions: ["output is stable for equivalent input and state"],
      error_contract: [{ code: "E_WORKFLOW_INPUT", condition: "input or state is missing" }],
      complexity_target: "O(n)",
      source_pseudocode_id: "PS-003",
      instruction_template_ref: "template_wrapper_default"
    },
    {
      contract_id: "persistence.persistState",
      function_name: "persistState",
      input: [{ name: "state", type: "object", required: true }],
      output: { type: "object", slot: "persistResult" },
      preconditions: ["state has schema version"],
      postconditions: ["persistResult reflects durable write status"],
      error_contract: [{ code: "E_PERSISTENCE_FAILURE", condition: "state write fails" }],
      complexity_target: "O(n)",
      source_pseudocode_id: "PS-004",
      instruction_template_ref: "template_wrapper_default"
    },
    {
      contract_id: "recovery.recoverFromError",
      function_name: "recoverFromError",
      input: [
        { name: "error", type: "object", required: true },
        { name: "context", type: "object", required: true }
      ],
      output: { type: "object", slot: "recoveryPlan" },
      preconditions: ["error and context are captured"],
      postconditions: ["recoveryPlan is explicit and executable"],
      error_contract: [{ code: "E_RECOVERY_CONTEXT", condition: "error or context is missing" }],
      complexity_target: "O(n)",
      source_pseudocode_id: "PS-005",
      instruction_template_ref: "template_wrapper_default"
    }
  ],
  known_deviations: []
});

function normalizeActionIdList(rawActionIds) {
  const source = Array.isArray(rawActionIds) ? rawActionIds : [];
  const dedupe = [];
  const seen = new Set();
  source.forEach((value) => {
    const actionId = String(value || "").trim();
    if (!actionId || seen.has(actionId)) {
      return;
    }
    seen.add(actionId);
    dedupe.push(actionId);
  });
  return dedupe;
}

function normalizeInstructionTemplateIndex(rawTemplateIndex) {
  const source = rawTemplateIndex && typeof rawTemplateIndex === "object" ? rawTemplateIndex : {};
  const normalized = {};

  Object.entries(source).forEach(([rawTemplateId, rawTemplate]) => {
    const template = rawTemplate && typeof rawTemplate === "object" ? rawTemplate : {};
    const templateId = String(template.template_id || rawTemplateId || "").trim();
    if (!templateId) {
      return;
    }

    const rawPasses = template.passes && typeof template.passes === "object" ? template.passes : {};
    const identifyPass =
      rawPasses.identify_arguments && typeof rawPasses.identify_arguments === "object"
        ? rawPasses.identify_arguments
        : {};
    const executePass =
      rawPasses.execute_pipeline && typeof rawPasses.execute_pipeline === "object" ? rawPasses.execute_pipeline : {};

    normalized[templateId] = {
      template_id: templateId,
      passes: {
        identify_arguments: {
          action_ids: normalizeActionIdList(identifyPass.action_ids)
        },
        execute_pipeline: {
          action_ids: normalizeActionIdList(executePass.action_ids)
        }
      }
    };
  });

  if (Object.keys(normalized).length > 0) {
    return normalized;
  }

  return clone_plain_object(fallbackContractCatalog.instruction_template_index);
}

function normalizeContractCatalog(rawCatalog) {
  const source = clone_plain_object(rawCatalog, fallbackContractCatalog);
  const instructionTemplateIndex = normalizeInstructionTemplateIndex(source.instruction_template_index);
  const availableTemplateIds = new Set(Object.keys(instructionTemplateIndex));
  const fallbackTemplateId = availableTemplateIds.values().next().value || "template_wrapper_default";
  const sourceContracts = Array.isArray(source.contract_index) ? source.contract_index : [];

  const normalizedContracts = sourceContracts
    .map((rawContract, index) => {
      const contract = rawContract && typeof rawContract === "object" ? rawContract : {};
      const contractId = String(contract.contract_id || `contract_${index + 1}`).trim();
      const functionName = String(contract.function_name || contractId.split(".").slice(-1)[0] || "").trim();
      const input = Array.isArray(contract.input) ? contract.input : [];
      const args = input
        .map((entry) => (entry && typeof entry === "object" ? String(entry.name || "").trim() : ""))
        .filter(Boolean);
      const output = contract.output && typeof contract.output === "object" ? contract.output : {};
      const returnSlot = String(output.slot || contract.returns || "result").trim() || "result";
      const instructionTemplateRef = String(contract.instruction_template_ref || fallbackTemplateId).trim();

      if (!contractId || !functionName || args.length === 0) {
        return null;
      }

      return {
        id: contractId,
        name: functionName,
        args,
        returns: returnSlot,
        input: input.map((entry) => ({
          name: String((entry && entry.name) || "").trim(),
          type: String((entry && entry.type) || "object").trim(),
          required: Boolean(entry && entry.required !== false)
        })),
        output: {
          type: String(output.type || "object").trim(),
          slot: returnSlot
        },
        preconditions: toSortedUniqueArray(
          (Array.isArray(contract.preconditions) ? contract.preconditions : [])
            .map((entry) => String(entry || "").trim())
            .filter(Boolean)
        ),
        postconditions: toSortedUniqueArray(
          (Array.isArray(contract.postconditions) ? contract.postconditions : [])
            .map((entry) => String(entry || "").trim())
            .filter(Boolean)
        ),
        error_contract: (Array.isArray(contract.error_contract) ? contract.error_contract : [])
          .map((entry) => (entry && typeof entry === "object" ? entry : null))
          .filter(Boolean)
          .map((entry) => ({
            code: String(entry.code || "E_UNKNOWN").trim(),
            condition: String(entry.condition || "unspecified error condition").trim()
          })),
        complexity_target: String(contract.complexity_target || "O(n)").trim(),
        source_pseudocode_id: String(contract.source_pseudocode_id || "").trim(),
        instruction_template_ref: availableTemplateIds.has(instructionTemplateRef)
          ? instructionTemplateRef
          : fallbackTemplateId
      };
    })
    .filter(Boolean);

  const contracts =
    normalizedContracts.length > 0
      ? normalizedContracts
      : clone_plain_object(fallbackContractCatalog.contract_index).map((contract) => ({
          id: contract.contract_id,
          name: contract.function_name,
          args: contract.input.map((entry) => entry.name),
          returns: contract.output.slot,
          input: contract.input,
          output: contract.output,
          preconditions: contract.preconditions,
          postconditions: contract.postconditions,
          error_contract: contract.error_contract,
          complexity_target: contract.complexity_target,
          source_pseudocode_id: contract.source_pseudocode_id,
          instruction_template_ref: contract.instruction_template_ref
        }));

  return {
    contracts: Object.freeze(contracts),
    instructionTemplateIndex: Object.freeze(instructionTemplateIndex),
    knownDeviations: Object.freeze(
      (Array.isArray(source.known_deviations) ? source.known_deviations : [])
        .map((entry) => (entry && typeof entry === "object" ? entry : null))
        .filter(Boolean)
    )
  };
}

const CONTRACT_TRANSLATION_CATALOG = Object.freeze(normalizeContractCatalog(POLYGLOT_CONTRACT_CATALOG));

const coreContracts = Object.freeze(
  CONTRACT_TRANSLATION_CATALOG.contracts.map((contract) => ({
    ...contract,
    args: [...contract.args]
  }))
);

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
      args.mode = String(argv[index + 1] || "")
        .trim()
        .toLowerCase();
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
    '  --brief "text"                Inline project brief text',
    "  --brief-file <path>           Read project brief from file",
    "  --project <name>              Project display name",
    "  --scope <summary>             Scope summary for run context",
    '  --planned-update "text"      Planned update item (repeatable)',
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
  return crypto
    .createHash("sha256")
    .update(String(value || ""))
    .digest("hex");
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
  return String(brief || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
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
    instructionTemplateRegistry: path.join(outDir, "build", "instruction_template_registry.json"),
    implementationMap: path.join(outDir, "build", "polyglot_implementation_map.json"),
    sharedTestVectors: path.join(outDir, "build", "shared_test_vectors.json"),
    parityMatrix: path.join(outDir, "build", "parity_matrix.json"),
    knownDeviations: path.join(outDir, "build", "known_deviations.json"),
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
    const language = toolchainToLanguage[item.toolchain];
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

  const totalWeight = criteriaKeys.reduce((sum, key) => sum + Number(DEFAULT_WEIGHTS[key] || 0), 0);
  const scoreRows = available.map((row) => {
    const profile = languageProfiles[row.language] || {};
    const weightedTotal = criteriaKeys.reduce((sum, key) => {
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

function buildInstructionTemplateRegistry() {
  const source = CONTRACT_TRANSLATION_CATALOG.instructionTemplateIndex;
  const registry = {};
  Object.keys(source).forEach((templateId) => {
    const template = source[templateId];
    registry[templateId] = {
      identify_arguments: normalizeActionIdList(
        template && template.passes && template.passes.identify_arguments
          ? template.passes.identify_arguments.action_ids
          : []
      ),
      execute_pipeline: normalizeActionIdList(
        template && template.passes && template.passes.execute_pipeline
          ? template.passes.execute_pipeline.action_ids
          : []
      )
    };
  });
  return registry;
}

function buildContractRuntimeIndex(contracts) {
  return contracts.map((contract) => ({
    contract_id: String(contract.id || "").trim(),
    function_name: String(contract.name || "").trim(),
    required_args: (Array.isArray(contract.args) ? contract.args : []).map((arg) => String(arg || "").trim()),
    returns: String(contract.returns || "result").trim(),
    instruction_template_ref: String(contract.instruction_template_ref || "template_wrapper_default").trim()
  }));
}

function toPythonLiteral(value, indentLevel = 0) {
  const indent = "  ".repeat(indentLevel);
  const childIndent = "  ".repeat(indentLevel + 1);

  if (value === null || typeof value === "undefined") {
    return "None";
  }
  if (typeof value === "boolean") {
    return value ? "True" : "False";
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "None";
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    const rows = value.map((entry) => `${childIndent}${toPythonLiteral(entry, indentLevel + 1)}`);
    return `[\n${rows.join(",\n")}\n${indent}]`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    if (keys.length === 0) {
      return "{}";
    }
    const rows = keys.map((key) => {
      return `${childIndent}${JSON.stringify(key)}: ${toPythonLiteral(value[key], indentLevel + 1)}`;
    });
    return `{\n${rows.join(",\n")}\n${indent}}`;
  }
  return "None";
}

function toCppStringLiteral(value) {
  return JSON.stringify(String(value || ""));
}

function renderPythonContractDataModule(contractRuntimeIndex, instructionTemplateRegistry) {
  const contractWrapperIndex = {};
  contractRuntimeIndex.forEach((entry) => {
    contractWrapperIndex[entry.contract_id] = {
      function_name: entry.function_name,
      required_args: entry.required_args,
      returns: entry.returns,
      instruction_template_ref: entry.instruction_template_ref
    };
  });

  return [
    '"""Generated contract data for Python wrapper execution."""',
    "",
    `CONTRACT_WRAPPER_INDEX = ${toPythonLiteral(contractWrapperIndex)}`,
    "",
    `INSTRUCTION_TEMPLATE_REGISTRY = ${toPythonLiteral(instructionTemplateRegistry)}`,
    ""
  ].join("\n");
}

function renderCppContractDataHeader(contractRuntimeIndex, instructionTemplateRegistry) {
  const templateRows = Object.entries(instructionTemplateRegistry).map(([templateId, template]) => {
    const identifyCsv = (
      template && Array.isArray(template.identify_arguments) ? template.identify_arguments : []
    ).join(",");
    const executeCsv = (template && Array.isArray(template.execute_pipeline) ? template.execute_pipeline : []).join(
      ","
    );
    return `  {${toCppStringLiteral(templateId)}, ${toCppStringLiteral(identifyCsv)}, ${toCppStringLiteral(executeCsv)}}`;
  });

  const contractRows = contractRuntimeIndex.map((entry) => {
    const requiredCsv = entry.required_args.join(",");
    return [
      "  {",
      `${toCppStringLiteral(entry.contract_id)}, `,
      `${toCppStringLiteral(entry.function_name)}, `,
      `${toCppStringLiteral(entry.returns)}, `,
      `${toCppStringLiteral(requiredCsv)}, `,
      `${toCppStringLiteral(entry.instruction_template_ref)}`,
      "}"
    ].join("");
  });

  return [
    "#pragma once",
    "",
    "#include <array>",
    "#include <string_view>",
    "",
    "namespace polyglot::generated::core_contracts_data {",
    "",
    "struct ContractSpec {",
    "  std::string_view contract_id;",
    "  std::string_view function_name;",
    "  std::string_view return_slot;",
    "  std::string_view required_args_csv;",
    "  std::string_view instruction_template_ref;",
    "};",
    "",
    "struct InstructionTemplateSpec {",
    "  std::string_view template_id;",
    "  std::string_view identify_actions_csv;",
    "  std::string_view execute_actions_csv;",
    "};",
    "",
    `inline constexpr std::array<ContractSpec, ${contractRows.length}> CONTRACT_SPECS = {{`,
    contractRows.join(",\n"),
    "}};",
    "",
    `inline constexpr std::array<InstructionTemplateSpec, ${templateRows.length}> INSTRUCTION_TEMPLATE_SPECS = {{`,
    templateRows.join(",\n"),
    "}};",
    "",
    "}  // namespace polyglot::generated::core_contracts_data"
  ].join("\n");
}

function renderPythonWrapperModule() {
  return [
    '"""Generated Python core contracts with two-pass wrapper execution."""',
    "",
    "from __future__ import annotations",
    "",
    "from typing import Any, Dict, List, Mapping",
    "",
    "try:",
    "    from .core_contracts_data import CONTRACT_WRAPPER_INDEX, INSTRUCTION_TEMPLATE_REGISTRY",
    "except ImportError:",
    "    from core_contracts_data import CONTRACT_WRAPPER_INDEX, INSTRUCTION_TEMPLATE_REGISTRY",
    "",
    "WrapperResult = Dict[str, Any]",
    "",
    "",
    "def _identify_required_arguments(contract_id: str, bound_args: Mapping[str, Any]) -> List[str]:",
    "    contract_meta = CONTRACT_WRAPPER_INDEX.get(contract_id, {})",
    '    required_args = contract_meta.get("required_args", [])',
    "    missing = []",
    "    for arg_name in required_args:",
    "        if arg_name not in bound_args or bound_args[arg_name] is None:",
    "            missing.append(arg_name)",
    "    return missing",
    "",
    "",
    "def _execute_pipeline(contract_id: str, bound_args: Mapping[str, Any]) -> WrapperResult:",
    "    contract_meta = CONTRACT_WRAPPER_INDEX.get(contract_id, {})",
    '    return_slot = str(contract_meta.get("returns", "result"))',
    '    template_id = str(contract_meta.get("instruction_template_ref", ""))',
    "    template = INSTRUCTION_TEMPLATE_REGISTRY.get(template_id, {})",
    '    action_ids = template.get("execute_pipeline", [])',
    "    ordered_bound_args = {key: bound_args[key] for key in sorted(bound_args.keys())}",
    "    output: Dict[str, Any] = {}",
    "    trace: List[str] = []",
    "    for action_id in action_ids:",
    "        trace.append(action_id)",
    '        if action_id == "emit_contract_metadata":',
    '            output["contract_id"] = contract_id',
    "            continue",
    '        if action_id == "copy_bound_arguments":',
    "            for key, value in ordered_bound_args.items():",
    '                output[f"arg.{key}"] = value',
    "            continue",
    '        if action_id == "emit_return_slot":',
    "            output[return_slot] = {",
    '                "contract_id": contract_id,',
    '                "inputs": ordered_bound_args,',
    '                "template_id": template_id,',
    "            }",
    "    return {",
    '        "ok": True,',
    '        "contract_id": contract_id,',
    '        "return_slot": return_slot,',
    '        "result": output,',
    '        "trace": ["execute_pipeline", *trace],',
    '        "missing_args": [],',
    '        "error_code": "",',
    "    }",
    "",
    "",
    "def _run_two_pass_wrapper(contract_id: str, bound_args: Mapping[str, Any]) -> WrapperResult:",
    "    if contract_id not in CONTRACT_WRAPPER_INDEX:",
    "        return {",
    '            "ok": False,',
    '            "contract_id": contract_id,',
    '            "return_slot": "",',
    '            "result": {},',
    '            "trace": ["identify_arguments"],',
    '            "missing_args": [],',
    '            "error_code": "E_UNKNOWN_CONTRACT",',
    "        }",
    "    missing = _identify_required_arguments(contract_id, bound_args)",
    "    if missing:",
    "        return {",
    '            "ok": False,',
    '            "contract_id": contract_id,',
    '            "return_slot": "",',
    '            "result": {},',
    '            "trace": ["identify_arguments"],',
    '            "missing_args": missing,',
    '            "error_code": "E_MISSING_ARG",',
    "        }",
    "    return _execute_pipeline(contract_id, bound_args)",
    "",
    "",
    "def initializeApplication(config: Mapping[str, Any]) -> WrapperResult:",
    '    return _run_two_pass_wrapper("bootstrap.initializeApplication", {"config": config})',
    "",
    "",
    "def validateInput(payload: Mapping[str, Any]) -> WrapperResult:",
    '    return _run_two_pass_wrapper("validation.validateInput", {"payload": payload})',
    "",
    "",
    "def executeCoreWorkflow(input: Mapping[str, Any], state: Mapping[str, Any]) -> WrapperResult:",
    '    return _run_two_pass_wrapper("core.executeCoreWorkflow", {"input": input, "state": state})',
    "",
    "",
    "def persistState(state: Mapping[str, Any]) -> WrapperResult:",
    '    return _run_two_pass_wrapper("persistence.persistState", {"state": state})',
    "",
    "",
    "def recoverFromError(error: Mapping[str, Any], context: Mapping[str, Any]) -> WrapperResult:",
    '    return _run_two_pass_wrapper("recovery.recoverFromError", {"error": error, "context": context})',
    "",
    "",
    "__all__ = [",
    '    "initializeApplication",',
    '    "validateInput",',
    '    "executeCoreWorkflow",',
    '    "persistState",',
    '    "recoverFromError",',
    "]"
  ].join("\n");
}

function renderCppWrapperModule() {
  return [
    '#include "core_contracts_data.hpp"',
    "",
    "#include <algorithm>",
    "#include <cctype>",
    "#include <initializer_list>",
    "#include <map>",
    "#include <sstream>",
    "#include <string>",
    "#include <string_view>",
    "#include <unordered_map>",
    "#include <utility>",
    "#include <vector>",
    "",
    "namespace polyglot::generated {",
    "",
    "using WrapperValueMap = std::map<std::string, std::string>;",
    "",
    "struct WrapperResponse {",
    "  bool ok = false;",
    "  std::string contract_id;",
    "  std::string return_slot;",
    "  WrapperValueMap result;",
    "  std::vector<std::string> trace;",
    "  std::vector<std::string> missing_args;",
    "  std::string error_code;",
    "};",
    "",
    "namespace {",
    "",
    "struct ContractRuntimeSpec {",
    "  std::string function_name;",
    "  std::string return_slot;",
    "  std::vector<std::string> required_args;",
    "  std::string instruction_template_ref;",
    "};",
    "",
    "std::string trimCopy(std::string_view raw) {",
    "  std::size_t start = 0;",
    "  while (start < raw.size() && std::isspace(static_cast<unsigned char>(raw[start])) != 0) {",
    "    start += 1;",
    "  }",
    "  std::size_t end = raw.size();",
    "  while (end > start && std::isspace(static_cast<unsigned char>(raw[end - 1])) != 0) {",
    "    end -= 1;",
    "  }",
    "  return std::string(raw.substr(start, end - start));",
    "}",
    "",
    "std::vector<std::string> splitCsv(std::string_view csv) {",
    "  std::vector<std::string> values;",
    "  std::string token;",
    "  for (char character : csv) {",
    "    if (character == ',') {",
    "      const std::string normalized = trimCopy(token);",
    "      if (!normalized.empty()) {",
    "        values.push_back(normalized);",
    "      }",
    "      token.clear();",
    "      continue;",
    "    }",
    "    token.push_back(character);",
    "  }",
    "  const std::string normalized = trimCopy(token);",
    "  if (!normalized.empty()) {",
    "    values.push_back(normalized);",
    "  }",
    "  return values;",
    "}",
    "",
    "std::string serializeValueMap(const WrapperValueMap& value_map) {",
    "  if (value_map.empty()) {",
    '    return "{}";',
    "  }",
    "  std::ostringstream stream;",
    '  stream << "{";',
    "  bool first = true;",
    "  for (const auto& [key, value] : value_map) {",
    "    if (!first) {",
    '      stream << ",";',
    "    }",
    '    stream << key << "=" << value;',
    "    first = false;",
    "  }",
    '  stream << "}";',
    "  return stream.str();",
    "}",
    "",
    "WrapperValueMap makeBindings(std::initializer_list<std::pair<std::string, std::string>> entries) {",
    "  WrapperValueMap bindings;",
    "  for (const auto& [key, value] : entries) {",
    "    bindings[key] = value;",
    "  }",
    "  return bindings;",
    "}",
    "",
    "const std::unordered_map<std::string, ContractRuntimeSpec>& contractRuntimeIndex() {",
    "  static const std::unordered_map<std::string, ContractRuntimeSpec> runtime_index = [] {",
    "    std::unordered_map<std::string, ContractRuntimeSpec> index;",
    "    for (const auto& spec : core_contracts_data::CONTRACT_SPECS) {",
    "      index.emplace(std::string(spec.contract_id), ContractRuntimeSpec{",
    "                                                std::string(spec.function_name),",
    "                                                std::string(spec.return_slot),",
    "                                                splitCsv(spec.required_args_csv),",
    "                                                std::string(spec.instruction_template_ref)});",
    "    }",
    "    return index;",
    "  }();",
    "  return runtime_index;",
    "}",
    "",
    "const std::unordered_map<std::string, std::vector<std::string>>& executeActionIndex() {",
    "  static const std::unordered_map<std::string, std::vector<std::string>> action_index = [] {",
    "    std::unordered_map<std::string, std::vector<std::string>> index;",
    "    for (const auto& spec : core_contracts_data::INSTRUCTION_TEMPLATE_SPECS) {",
    "      index.emplace(std::string(spec.template_id), splitCsv(spec.execute_actions_csv));",
    "    }",
    "    return index;",
    "  }();",
    "  return action_index;",
    "}",
    "",
    "std::vector<std::string> identifyMissingArgs(",
    "    const std::vector<std::string>& required_args,",
    "    const WrapperValueMap& bound_args) {",
    "  std::vector<std::string> missing;",
    "  for (const std::string& arg_name : required_args) {",
    "    if (bound_args.find(arg_name) == bound_args.end()) {",
    "      missing.push_back(arg_name);",
    "    }",
    "  }",
    "  return missing;",
    "}",
    "",
    "WrapperResponse executePipeline(const std::string& contract_id, const ContractRuntimeSpec& spec, const WrapperValueMap& bound_args) {",
    "  const auto& actions_by_template = executeActionIndex();",
    "  const auto template_it = actions_by_template.find(spec.instruction_template_ref);",
    "  const std::vector<std::string> action_ids =",
    "      template_it == actions_by_template.end() ? std::vector<std::string>{} : template_it->second;",
    "",
    "  WrapperResponse response;",
    "  response.ok = true;",
    "  response.contract_id = contract_id;",
    "  response.return_slot = spec.return_slot;",
    '  response.trace.push_back("execute_pipeline");',
    "",
    "  for (const std::string& action_id : action_ids) {",
    "    response.trace.push_back(action_id);",
    '    if (action_id == "emit_contract_metadata") {',
    '      response.result["contract_id"] = contract_id;',
    "      continue;",
    "    }",
    '    if (action_id == "copy_bound_arguments") {',
    "      for (const auto& [key, value] : bound_args) {",
    '        response.result["arg." + key] = value;',
    "      }",
    "      continue;",
    "    }",
    '    if (action_id == "emit_return_slot") {',
    "      response.result[spec.return_slot] = serializeValueMap(bound_args);",
    "    }",
    "  }",
    "",
    "  return response;",
    "}",
    "",
    "WrapperResponse runTwoPassWrapper(const std::string& contract_id, const WrapperValueMap& bound_args) {",
    "  const auto& runtime_index = contractRuntimeIndex();",
    "  const auto contract_it = runtime_index.find(contract_id);",
    "",
    "  if (contract_it == runtime_index.end()) {",
    "    WrapperResponse response;",
    "    response.ok = false;",
    "    response.contract_id = contract_id;",
    '    response.error_code = "E_UNKNOWN_CONTRACT";',
    '    response.trace.push_back("identify_arguments");',
    "    return response;",
    "  }",
    "",
    "  const ContractRuntimeSpec& spec = contract_it->second;",
    "  const std::vector<std::string> missing_args = identifyMissingArgs(spec.required_args, bound_args);",
    "  if (!missing_args.empty()) {",
    "    WrapperResponse response;",
    "    response.ok = false;",
    "    response.contract_id = contract_id;",
    '    response.error_code = "E_MISSING_ARG";',
    '    response.trace.push_back("identify_arguments");',
    "    response.missing_args = missing_args;",
    "    return response;",
    "  }",
    "",
    "  return executePipeline(contract_id, spec, bound_args);",
    "}",
    "",
    "}  // namespace",
    "",
    "WrapperResponse initializeApplication(const WrapperValueMap& config) {",
    '  return runTwoPassWrapper("bootstrap.initializeApplication", makeBindings({{"config", serializeValueMap(config)}}));',
    "}",
    "",
    "WrapperResponse validateInput(const WrapperValueMap& payload) {",
    '  return runTwoPassWrapper("validation.validateInput", makeBindings({{"payload", serializeValueMap(payload)}}));',
    "}",
    "",
    "WrapperResponse executeCoreWorkflow(const WrapperValueMap& input, const WrapperValueMap& state) {",
    "  return runTwoPassWrapper(",
    '      "core.executeCoreWorkflow",',
    '      makeBindings({{"input", serializeValueMap(input)}, {"state", serializeValueMap(state)}}));',
    "}",
    "",
    "WrapperResponse persistState(const WrapperValueMap& state) {",
    '  return runTwoPassWrapper("persistence.persistState", makeBindings({{"state", serializeValueMap(state)}}));',
    "}",
    "",
    "WrapperResponse recoverFromError(const WrapperValueMap& error, const WrapperValueMap& context) {",
    "  return runTwoPassWrapper(",
    '      "recovery.recoverFromError",',
    '      makeBindings({{"error", serializeValueMap(error)}, {"context", serializeValueMap(context)}}));',
    "}",
    "",
    "}  // namespace polyglot::generated"
  ].join("\n");
}

function buildLanguageSupportFiles(language, contractRuntimeIndex, instructionTemplateRegistry) {
  if (language === "python") {
    return [
      {
        name: "core_contracts_data.py",
        content: renderPythonContractDataModule(contractRuntimeIndex, instructionTemplateRegistry)
      }
    ];
  }

  if (language === "cpp") {
    return [
      {
        name: "core_contracts_data.hpp",
        content: renderCppContractDataHeader(contractRuntimeIndex, instructionTemplateRegistry)
      }
    ];
  }

  return [];
}

function renderLanguageStub(language, contracts) {
  if (language === "javascript") {
    const body = contracts
      .map((contract) => {
        const args = contract.args.join(", ");
        return `function ${contract.name}(${args}) {\n  throw new Error("Not implemented");\n}`;
      })
      .join("\n\n");
    return `/* eslint-disable no-unused-vars */\n\n${body}`;
  }

  if (language === "typescript") {
    return contracts
      .map((contract) => {
        const args = contract.args.join(", ");
        return `function ${contract.name}(${args}): unknown {\n  throw new Error("Not implemented");\n}`;
      })
      .join("\n\n");
  }

  if (language === "python") {
    return renderPythonWrapperModule();
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
    return renderCppWrapperModule();
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

  const contractRuntimeIndex = buildContractRuntimeIndex(coreContracts);
  const instructionTemplateRegistry = buildInstructionTemplateRegistry();
  const languageFunctionMap = [];

  benchmarkLanguages.forEach((language) => {
    const languageDir = path.join(generatedDir, language);
    ensureDir(languageDir);

    const supportFiles = buildLanguageSupportFiles(language, contractRuntimeIndex, instructionTemplateRegistry);
    const supportingPaths = [];
    supportFiles.forEach((supportFile) => {
      const supportPath = path.join(languageDir, supportFile.name);
      writeText(supportPath, supportFile.content);
      supportingPaths.push(path.relative(outDir, supportPath));
    });

    const ext = extensionForLanguage(language);
    const filePath = path.join(languageDir, `core_contracts.${ext}`);
    const content = renderLanguageStub(language, coreContracts);
    writeText(filePath, content);

    languageFunctionMap.push({
      language,
      label: LANGUAGE_LABELS[language] || language,
      contracts: coreContracts.map((contract) => ({
        contractId: contract.id,
        functionName: contract.name,
        args: contract.args,
        returns: contract.returns,
        sourcePseudocodeId: contract.source_pseudocode_id || "",
        complexityTarget: contract.complexity_target || "O(n)",
        instructionTemplateRef: contract.instruction_template_ref || "template_wrapper_default"
      })),
      generatedPath: path.relative(outDir, filePath),
      generatedBytes: bytesOfText(content),
      supportingFiles: supportingPaths
    });
  });

  const parityMatrix = benchmarkLanguages.map((language) => ({
    language,
    contracts: coreContracts.map((contract) => ({
      contractId: contract.id,
      status: "generated"
    }))
  }));

  const sharedTestVectors = coreContracts.map((contract) => ({
    contractId: contract.id,
    input: {
      sample: true,
      payload: `fixture_${contract.name}`
    },
    expected: {
      stable: true,
      contract: contract.returns
    },
    source_pseudocode_id: contract.source_pseudocode_id || ""
  }));

  return {
    contractMap: coreContracts.map((contract) => ({
      contract_id: contract.id,
      function_name: contract.name,
      input: contract.input,
      output: contract.output,
      preconditions: contract.preconditions,
      postconditions: contract.postconditions,
      error_contract: contract.error_contract,
      complexity_target: contract.complexity_target,
      source_pseudocode_id: contract.source_pseudocode_id,
      instruction_template_ref: contract.instruction_template_ref,
      args: contract.args,
      returns: contract.returns,
      id: contract.id,
      name: contract.name
    })),
    instructionTemplateRegistry,
    languageFunctionMap,
    parityMatrix,
    sharedTestVectors,
    knownDeviations: CONTRACT_TRANSLATION_CATALOG.knownDeviations
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

    const spec = toolchainBenchmarkCommands[item.toolchain];
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
  const missing =
    result && result.pass_identify && Array.isArray(result.pass_identify.missing) ? result.pass_identify.missing : [];

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
    isCreate || !hasEnglishBlueprint || !hasPseudocodeBlueprint || briefChanged || args.forcePseudocode;

  const blueprintStrategy = args.forcePseudocode || isCreate || !hasPseudocodeBlueprint ? "full" : "incremental";

  const translationRun =
    isCreate ||
    args.forceTranslation ||
    !hasImplementationMap ||
    languageSelectionChanged ||
    (blueprintRun && (blueprintStrategy === "full" || args.syncTranslation));

  const checksRun = args.runChecks && (isCreate || args.rerunGates || translationRun);
  const securityRun = isCreate || args.rerunGates || translationRun || args.enforceSecurity;
  const benchmarkRun =
    !args.noBenchmark && (isCreate || args.rerunGates || translationRun || Boolean(args.benchmarkManifest));
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
      reason: checksRun
        ? "run strict checks for active build changes"
        : "skip to reduce runtime; use --rerun-gates to force"
    },
    security: {
      run: securityRun,
      reason: securityRun
        ? "run security audit for current state"
        : "skip to reduce runtime; use --rerun-gates to force"
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

  stageOrder.forEach((stageKey, index) => {
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
  lines.push(
    `- Benchmark set: ${(languageSelection.benchmarkLanguages || []).map((key) => LANGUAGE_LABELS[key] || key).join(", ")}`
  );
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
  lines.push(
    `- Security gate passed: ${security && security.passed === true ? "yes" : security && security.skipped ? "skipped" : "no"}`
  );

  if (benchmark && benchmark.skipped) {
    lines.push("- Benchmark stage: skipped");
  } else if (benchmark && Array.isArray(benchmark.ranking)) {
    lines.push(`- Benchmark top result: ${String(benchmark.ranking[0] || "n/a")}`);
  }

  lines.push("");
  lines.push("## Rationale");
  lines.push(
    "- Selection is weighted by runtime, size, startup, memory, portability, tooling, security, and velocity."
  );
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
      throw new Error(
        `wrapper preflight failed: ${wrapperPreflight.error || "missing input arguments or execution failure"}`
      );
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
    contractMap: readJsonIfExists(paths.contractMap, coreContracts),
    instructionTemplateRegistry: readJsonIfExists(
      paths.instructionTemplateRegistry,
      buildInstructionTemplateRegistry()
    ),
    languageFunctionMap: readJsonIfExists(paths.implementationMap, []),
    sharedTestVectors: readJsonIfExists(paths.sharedTestVectors, []),
    parityMatrix: readJsonIfExists(paths.parityMatrix, []),
    knownDeviations: readJsonIfExists(paths.knownDeviations, [])
  };

  if (stagePlan.translation.run) {
    const stageStart = Date.now();
    implementation = buildPolyglotImplementation(args.outDir, languageSelection.benchmarkLanguages);
    writeJson(paths.contractMap, implementation.contractMap);
    writeJson(paths.instructionTemplateRegistry, implementation.instructionTemplateRegistry);
    writeJson(paths.implementationMap, implementation.languageFunctionMap);
    writeJson(paths.sharedTestVectors, implementation.sharedTestVectors);
    writeJson(paths.parityMatrix, implementation.parityMatrix);
    writeJson(paths.knownDeviations, implementation.knownDeviations);
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
      created_at:
        existingContext.project && existingContext.project.created_at ? existingContext.project.created_at : runAt
    },
    brief_hash: briefHash,
    brief_excerpt: brief.slice(0, 300),
    mode_last_run: mode,
    current_stage: "completed",
    stage_order: stageOrder,
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
      contract_map: path.relative(args.outDir, paths.contractMap),
      instruction_template_registry: path.relative(args.outDir, paths.instructionTemplateRegistry),
      implementation_map: path.relative(args.outDir, paths.implementationMap),
      shared_test_vectors: path.relative(args.outDir, paths.sharedTestVectors),
      parity_matrix: path.relative(args.outDir, paths.parityMatrix),
      known_deviations: path.relative(args.outDir, paths.knownDeviations),
      benchmark_report: path.relative(args.outDir, paths.benchmarkReport),
      final_recommendation: path.relative(args.outDir, paths.finalRecommendation)
    },
    run_count: Number(existingContext.run_count || 0) + 1,
    last_run_at: nowIso(),
    run_history: [
      ...(Array.isArray(existingContext.run_history) ? existingContext.run_history : []).slice(-19),
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
      updateScan && updateScan.start && updateScan.start.skipped
        ? null
        : updateScan && updateScan.start && updateScan.start.ok,
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
