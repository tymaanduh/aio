"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

const files = Object.freeze({
  RENDERER: path.join(ROOT, "app", "renderer.js"),
  BOOTSTRAP: path.join(ROOT, "renderer", "boot", "app_bootstrap.js"),
  GROUP_SETS: path.join(ROOT, "data", "input", "shared", "renderer", "group_sets.js"),
  DISPATCH_SPECS: path.join(ROOT, "data", "input", "shared", "renderer", "dispatch_specs.js")
});
const SMOKE_REPORT_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "smoke_checklist_report.json"
);

const sizeGates = Object.freeze({
  RENDERER_MAX: 2400,
  BOOTSTRAP_MAX: 260
});

function logLine(message = "") {
  process.stdout.write(`${message}\n`);
}

function fail(message) {
  logLine(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  logLine(`PASS: ${message}`);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function countLines(text) {
  return String(text || "").split(/\r?\n/).length;
}

function runCommand(command, args) {
  return spawnSync(command, args, { cwd: ROOT, stdio: "inherit", shell: false });
}

function extractObjectKeys(sourceText, objectConstName) {
  const source = String(sourceText || "");
  const objectStart = source.indexOf(`const ${objectConstName} = Object.freeze({`);
  if (objectStart < 0) {
    return [];
  }
  const bodyStart = source.indexOf("{", objectStart);
  if (bodyStart < 0) {
    return [];
  }
  let depth = 0;
  let index = bodyStart;
  for (; index < source.length; index += 1) {
    const ch = source[index];
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        break;
      }
    }
  }
  if (index <= bodyStart) {
    return [];
  }
  const body = source.slice(bodyStart + 1, index);
  return [...body.matchAll(/^\s*([A-Z][A-Z0-9_]+)\s*:/gm)].map((match) => match[1]);
}

function extractGroupSetModuleKeys(sourceText) {
  return [...String(sourceText || "").matchAll(/module_key:\s*"([A-Z0-9_]+)"/g)].map((match) => match[1]);
}

function runShapeChecks(rendererText, bootstrapText) {
  logLine("== Shape checks ==");
  const forbiddenRendererPatterns = [
    /\bRUNTIME_MODE_VALUES\b/,
    /\bdual_run_shadow\b/,
    /\blegacyFn\b/,
    /\bmodularFn\b/,
    /\bmode\s*===\s*RUNTIME_MODE_VALUES\b/
  ];
  let ok = true;
  forbiddenRendererPatterns.forEach((pattern) => {
    if (pattern.test(rendererText)) {
      fail(`renderer contains forbidden pattern: ${pattern}`);
      ok = false;
    }
  });

  const wrapperWallCount = (rendererText.match(/return\s+runExtractedByModule\(/g) || []).length;
  if (wrapperWallCount > 0) {
    fail(`renderer still contains wrapper-wall forwarding count=${wrapperWallCount}`);
    ok = false;
  } else {
    pass("renderer wrapper-wall forwarding removed");
  }

  if (/hook_spec:\s*Object\.freeze\(/.test(bootstrapText)) {
    fail("bootstrap still contains inline hook_spec Object.freeze blocks");
    ok = false;
  } else {
    pass("bootstrap hook specs are externalized");
  }

  return ok;
}

function runAlignmentChecks(rendererText, groupSetsText, dispatchSpecsText) {
  logLine("== Alignment checks ==");
  const extractedKeys = new Set([
    ...extractObjectKeys(rendererText, "PATTERN_EXTRACTED_MODULE"),
    ...extractObjectKeys(rendererText, "patternExtractedModule")
  ]);
  const groupSetKeys = new Set(extractGroupSetModuleKeys(groupSetsText));
  const dispatchKeys = new Set(extractObjectKeys(dispatchSpecsText, "DISPATCH_SPEC_MAP"));

  let ok = true;

  if (extractedKeys.size === 0) {
    fail("could not read PATTERN_EXTRACTED_MODULE keys");
    return false;
  }
  if (dispatchKeys.size === 0) {
    fail("could not read DISPATCH_SPEC_MAP keys");
    return false;
  }

  groupSetKeys.forEach((key) => {
    if (!extractedKeys.has(key)) {
      fail(`group_set module_key missing in PATTERN_EXTRACTED_MODULE: ${key}`);
      ok = false;
    }
  });
  dispatchKeys.forEach((key) => {
    if (!extractedKeys.has(key)) {
      fail(`dispatch spec key missing in PATTERN_EXTRACTED_MODULE: ${key}`);
      ok = false;
    }
  });

  if (ok) {
    pass("PATTERN_EXTRACTED_MODULE, GROUP_SETS, and DISPATCH_SPEC_MAP are aligned");
  }
  return ok;
}

function runSizeChecks(rendererText, bootstrapText) {
  logLine("== Size checks ==");
  const rendererLines = countLines(rendererText);
  const bootstrapLines = countLines(bootstrapText);
  let ok = true;

  if (rendererLines > sizeGates.RENDERER_MAX) {
    fail(`app/renderer.js line count ${rendererLines} exceeds ${sizeGates.RENDERER_MAX}`);
    ok = false;
  } else {
    pass(`app/renderer.js line count ${rendererLines} within ${sizeGates.RENDERER_MAX}`);
  }

  if (bootstrapLines > sizeGates.BOOTSTRAP_MAX) {
    fail(`renderer/boot/app_bootstrap.js line count ${bootstrapLines} exceeds ${sizeGates.BOOTSTRAP_MAX}`);
    ok = false;
  } else {
    pass(`renderer/boot/app_bootstrap.js line count ${bootstrapLines} within ${sizeGates.BOOTSTRAP_MAX}`);
  }

  return ok;
}

function parse_max_age_hours(argv) {
  const index = argv.indexOf("--smoke-max-age-hours");
  if (index < 0) {
    return null;
  }
  const raw = Number(argv[index + 1]);
  if (!Number.isFinite(raw) || raw < 0) {
    throw new Error("--smoke-max-age-hours must be a non-negative number");
  }
  return raw;
}

function printSmokeChecklist(maxAgeHours = null) {
  logLine("== Required smoke checklist ==");
  const fallback_items = [
    { id: "auth_flow", label: "auth create/login/logout" },
    { id: "tree_flow", label: "tree selection/range/archive" },
    { id: "sentence_graph", label: "sentence graph interactions" },
    { id: "command_palette", label: "command palette open/filter/execute" },
    { id: "universe_flow", label: "universe render + benchmark + path + selection" },
    { id: "logs_stream", label: "logs window open/stream" }
  ];

  const smoke_report = loadSmokeReport(SMOKE_REPORT_FILE);
  const report_items = smoke_report && Array.isArray(smoke_report.items) ? smoke_report.items : fallback_items;
  const nowMs = Date.now();
  let all_passed = true;
  report_items.forEach((item) => {
    const status = String(item.status || "pending").toLowerCase();
    const label = String(item.label || item.id || "unknown");
    const id = String(item.id || label);
    const evidence = String(item.evidence_path || "").trim();
    const evidenceAbsPath = evidence ? path.resolve(ROOT, evidence) : "";
    const evidenceRootRelative = evidence ? path.relative(ROOT, evidenceAbsPath) : "";
    const evidenceInsideRoot = Boolean(
      evidence &&
        evidenceRootRelative &&
        !evidenceRootRelative.startsWith("..") &&
        !path.isAbsolute(evidenceRootRelative)
    );
    const evidenceExists = Boolean(
      evidenceInsideRoot &&
        fs.existsSync(evidenceAbsPath) &&
        fs.statSync(evidenceAbsPath).isFile()
    );
    if (!evidenceExists && status === "pass") {
      all_passed = false;
      logLine(`SMOKE_TODO: ${label} missing_evidence_file=${evidence || "none"}`);
      return;
    }

    if (status === "pass" && evidence && evidenceExists && Number.isFinite(maxAgeHours)) {
      const evidenceAgeHours =
        (nowMs - fs.statSync(evidenceAbsPath).mtimeMs) / (1000 * 60 * 60);
      if (evidenceAgeHours > maxAgeHours) {
        all_passed = false;
        logLine(
          `SMOKE_TODO: ${label} stale_evidence=${evidence} age_hours=${evidenceAgeHours.toFixed(
            2
          )} max_hours=${maxAgeHours}`
        );
        return;
      }
    }

    if (status === "pass" && evidence && evidenceExists) {
      logLine(`SMOKE_PASS: ${id} evidence=${evidence}`);
      return;
    }
    all_passed = false;
    logLine(`SMOKE_TODO: ${label}`);
  });
  return all_passed;
}

function loadSmokeReport(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function ensureFilesExist() {
  return Object.entries(files).every(([key, filePath]) => {
    if (!fs.existsSync(filePath)) {
      fail(`required file missing (${key}): ${path.relative(ROOT, filePath)}`);
      return false;
    }
    return true;
  });
}

function main() {
  logLine("Refactor Blocking Gate");
  logLine("======================");

  if (!ensureFilesExist()) {
    process.exit(process.exitCode || 1);
  }

  const rendererText = readText(files.RENDERER);
  const bootstrapText = readText(files.BOOTSTRAP);
  const groupSetsText = readText(files.GROUP_SETS);
  const dispatchSpecsText = readText(files.DISPATCH_SPECS);
  let smokeMaxAgeHours = null;
  try {
    smokeMaxAgeHours = parse_max_age_hours(process.argv);
  } catch (error) {
    fail(error.message);
    process.exit(process.exitCode || 1);
  }

  const shapeOk = runShapeChecks(rendererText, bootstrapText);
  const alignOk = runAlignmentChecks(rendererText, groupSetsText, dispatchSpecsText);
  const sizeOk = runSizeChecks(rendererText, bootstrapText);

  logLine("== Build quality checks ==");
  const lintResult = runCommand("npm", ["run", "lint", "--silent"]);
  if ((lintResult.status || 0) !== 0) {
    fail("lint failed");
  } else {
    pass("lint passed");
  }
  const testResult = runCommand("npm", ["test", "--silent"]);
  if ((testResult.status || 0) !== 0) {
    fail("tests failed");
  } else {
    pass("tests passed");
  }

  const smokeAllPassed = printSmokeChecklist(smokeMaxAgeHours);
  const enforceSmoke = process.argv.includes("--enforce-smoke");
  if (enforceSmoke && !smokeAllPassed) {
    fail("smoke checklist not fully passed while --enforce-smoke is enabled");
  }

  if (
    !shapeOk ||
    !alignOk ||
    !sizeOk ||
    (lintResult.status || 0) !== 0 ||
    (testResult.status || 0) !== 0 ||
    (enforceSmoke && !smokeAllPassed)
  ) {
    process.exit(process.exitCode || 1);
  }

  pass("refactor blocking gate passed");
}

main();
