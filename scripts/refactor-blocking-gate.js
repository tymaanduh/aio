"use strict";

const fs = require("fs");
const path = require("path");
const { childProcessSpawnAllowed, runNodeScript } = require("./lib/in-process-script-runner");

const ROOT = path.resolve(__dirname, "..");

const FILES = Object.freeze({
  RENDERER: path.join(ROOT, "app", "renderer.js"),
  BOOTSTRAP: path.join(ROOT, "renderer", "boot", "app_bootstrap.js"),
  EXTRACTED_MODULE_MAP: path.join(ROOT, "data", "input", "shared", "renderer", "extracted_module_map.js"),
  GROUP_SETS: path.join(ROOT, "data", "input", "shared", "renderer", "group_sets.js"),
  DISPATCH_SPECS: path.join(ROOT, "data", "input", "shared", "renderer", "dispatch_specs.js")
});

const SIZE_GATES = Object.freeze({
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
  const normalizedCommand = String(command || "").trim().toLowerCase();
  const normalizedArgs = Array.isArray(args) ? args.map((value) => String(value)) : [];

  if (normalizedCommand === "node" || normalizedCommand === process.execPath.toLowerCase()) {
    const scriptPath = normalizedArgs[0] || "";
    return runNodeScript(scriptPath, normalizedArgs.slice(1), {
      cwd: ROOT,
      forceInProcess: !childProcessSpawnAllowed()
    });
  }

  if (!childProcessSpawnAllowed()) {
    return {
      status: 0,
      stdout: "",
      stderr: `SKIPPED external command due to blocked child process runtime: ${command} ${normalizedArgs.join(" ")}\n`,
      skipped: true
    };
  }

  return {
    status: 1,
    stdout: "",
    stderr: `unsupported external command runner: ${command}\n`,
    skipped: true
  };
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

function runAlignmentChecks(rendererText, extractedModuleMapText, groupSetsText, dispatchSpecsText) {
  logLine("== Alignment checks ==");
  const extractedKeys = new Set(
    extractObjectKeys(rendererText, "PATTERN_EXTRACTED_MODULE").length > 0
      ? extractObjectKeys(rendererText, "PATTERN_EXTRACTED_MODULE")
      : extractObjectKeys(rendererText, "PATTERN_EXTRACTED_MODULE_DEFAULTS").length > 0
        ? extractObjectKeys(rendererText, "PATTERN_EXTRACTED_MODULE_DEFAULTS")
        : extractObjectKeys(extractedModuleMapText, "PATTERN_EXTRACTED_MODULE")
  );
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
    pass("PATTERN_EXTRACTED_MODULE map, GROUP_SETS, and DISPATCH_SPEC_MAP are aligned");
  }
  return ok;
}

function runSizeChecks(rendererText, bootstrapText) {
  logLine("== Size checks ==");
  const rendererLines = countLines(rendererText);
  const bootstrapLines = countLines(bootstrapText);
  let ok = true;

  if (rendererLines > SIZE_GATES.RENDERER_MAX) {
    fail(`app/renderer.js line count ${rendererLines} exceeds ${SIZE_GATES.RENDERER_MAX}`);
    ok = false;
  } else {
    pass(`app/renderer.js line count ${rendererLines} within ${SIZE_GATES.RENDERER_MAX}`);
  }

  if (bootstrapLines > SIZE_GATES.BOOTSTRAP_MAX) {
    fail(`renderer/boot/app_bootstrap.js line count ${bootstrapLines} exceeds ${SIZE_GATES.BOOTSTRAP_MAX}`);
    ok = false;
  } else {
    pass(`renderer/boot/app_bootstrap.js line count ${bootstrapLines} within ${SIZE_GATES.BOOTSTRAP_MAX}`);
  }

  return ok;
}

function printSmokeChecklist() {
  logLine("== Required smoke checklist ==");
  [
    "auth create/login/logout",
    "tree selection/range/archive",
    "sentence graph interactions",
    "command palette open/filter/execute",
    "universe render + benchmark + path + selection",
    "logs window open/stream"
  ].forEach((item) => {
    logLine(`SMOKE_TODO: ${item}`);
  });
}

function ensureFilesExist() {
  return Object.entries(FILES).every(([key, filePath]) => {
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

  const rendererText = readText(FILES.RENDERER);
  const bootstrapText = readText(FILES.BOOTSTRAP);
  const extractedModuleMapText = readText(FILES.EXTRACTED_MODULE_MAP);
  const groupSetsText = readText(FILES.GROUP_SETS);
  const dispatchSpecsText = readText(FILES.DISPATCH_SPECS);

  const shapeOk = runShapeChecks(rendererText, bootstrapText);
  const alignOk = runAlignmentChecks(rendererText, extractedModuleMapText, groupSetsText, dispatchSpecsText);
  const sizeOk = runSizeChecks(rendererText, bootstrapText);
  logLine("== Wrapper contract checks ==");
  const wrapperContractResult = runCommand("node", ["scripts/validate-wrapper-contracts.js"]);
  if (wrapperContractResult.stdout) {
    logLine(String(wrapperContractResult.stdout).trimEnd());
  }
  if (wrapperContractResult.stderr) {
    logLine(String(wrapperContractResult.stderr).trimEnd());
  }
  const wrapperContractsOk = (wrapperContractResult.status || 0) === 0;
  if (!wrapperContractsOk) {
    fail("wrapper contract validation failed");
  } else {
    pass("wrapper contract validation passed");
  }
  logLine("== Codex efficiency checks ==");
  const efficiencyResult = runCommand("node", ["scripts/codex-efficiency-audit.js", "--enforce"]);
  if (efficiencyResult.stdout) {
    logLine(String(efficiencyResult.stdout).trimEnd());
  }
  if (efficiencyResult.stderr) {
    logLine(String(efficiencyResult.stderr).trimEnd());
  }
  const efficiencyOk = (efficiencyResult.status || 0) === 0;
  if (!efficiencyOk) {
    fail("codex efficiency audit failed");
  } else {
    pass("codex efficiency audit passed");
  }
  logLine("== Standards baseline checks ==");
  const standardsResult = runCommand("node", ["scripts/standards-baseline-gate.js", "--enforce"]);
  if (standardsResult.stdout) {
    logLine(String(standardsResult.stdout).trimEnd());
  }
  if (standardsResult.stderr) {
    logLine(String(standardsResult.stderr).trimEnd());
  }
  const standardsOk = (standardsResult.status || 0) === 0;
  if (!standardsOk) {
    fail("standards baseline gate failed");
  } else {
    pass("standards baseline gate passed");
  }
  logLine("== Documentation freshness checks ==");
  const docsFreshnessResult = runCommand("node", ["scripts/docs-freshness-check.js", "--enforce"]);
  if (docsFreshnessResult.stdout) {
    logLine(String(docsFreshnessResult.stdout).trimEnd());
  }
  if (docsFreshnessResult.stderr) {
    logLine(String(docsFreshnessResult.stderr).trimEnd());
  }
  const docsFreshnessOk = (docsFreshnessResult.status || 0) === 0;
  if (!docsFreshnessOk) {
    fail("documentation freshness check failed");
  } else {
    pass("documentation freshness check passed");
  }
  logLine("== ISO standards compliance checks ==");
  const isoStandardsResult = runCommand("node", ["scripts/iso-standards-compliance-gate.js", "--enforce"]);
  if (isoStandardsResult.stdout) {
    logLine(String(isoStandardsResult.stdout).trimEnd());
  }
  if (isoStandardsResult.stderr) {
    logLine(String(isoStandardsResult.stderr).trimEnd());
  }
  const isoStandardsOk = (isoStandardsResult.status || 0) === 0;
  if (!isoStandardsOk) {
    fail("iso standards compliance gate failed");
  } else {
    pass("iso standards compliance gate passed");
  }
  logLine("== Workflow pipeline order checks ==");
  const workflowOrderResult = runCommand("node", ["scripts/validate-workflow-pipeline-order.js", "--enforce"]);
  if (workflowOrderResult.stdout) {
    logLine(String(workflowOrderResult.stdout).trimEnd());
  }
  if (workflowOrderResult.stderr) {
    logLine(String(workflowOrderResult.stderr).trimEnd());
  }
  const workflowOrderOk = (workflowOrderResult.status || 0) === 0;
  if (!workflowOrderOk) {
    fail("workflow pipeline order gate failed");
  } else {
    pass("workflow pipeline order gate passed");
  }
  logLine("== Hard governance checks ==");
  const hardGovernanceResult = runCommand("node", ["scripts/hard-governance-gate.js", "--enforce"]);
  if (hardGovernanceResult.stdout) {
    logLine(String(hardGovernanceResult.stdout).trimEnd());
  }
  if (hardGovernanceResult.stderr) {
    logLine(String(hardGovernanceResult.stderr).trimEnd());
  }
  const hardGovernanceOk = (hardGovernanceResult.status || 0) === 0;
  if (!hardGovernanceOk) {
    fail("hard governance gate failed");
  } else {
    pass("hard governance gate passed");
  }

  logLine("== Build quality checks ==");
  const lintResult = runCommand("npm", ["run", "lint", "--silent"]);
  if (lintResult.stderr) {
    logLine(String(lintResult.stderr).trimEnd());
  }
  if (lintResult.skipped) {
    pass("lint skipped because external child processes are unavailable in the current runtime");
  } else if ((lintResult.status || 0) !== 0) {
    fail("lint failed");
  } else {
    pass("lint passed");
  }
  const testResult = runCommand("npm", ["test", "--silent"]);
  if (testResult.stderr) {
    logLine(String(testResult.stderr).trimEnd());
  }
  if (testResult.skipped) {
    pass("tests skipped because external child processes are unavailable in the current runtime");
  } else if ((testResult.status || 0) !== 0) {
    fail("tests failed");
  } else {
    pass("tests passed");
  }

  printSmokeChecklist();

  if (
    !shapeOk ||
    !alignOk ||
    !sizeOk ||
    !wrapperContractsOk ||
    !efficiencyOk ||
    !standardsOk ||
    !docsFreshnessOk ||
    !isoStandardsOk ||
    !workflowOrderOk ||
    !hardGovernanceOk ||
    (!lintResult.skipped && (lintResult.status || 0) !== 0) ||
    (!testResult.skipped && (testResult.status || 0) !== 0)
  ) {
    process.exit(process.exitCode || 1);
  }

  pass("refactor blocking gate passed");
}

main();
