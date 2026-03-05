#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

function parseArgs(argv) {
  const args = {
    apply: argv.includes("--apply"),
    pruneDuplicates: !argv.includes("--no-prune-duplicates"),
    codexHome: "",
    maxPromptTokens: 72
  };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--codex-home" && argv[index + 1]) {
      args.codexHome = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--max-prompt-tokens" && argv[index + 1]) {
      args.maxPromptTokens = Number(argv[index + 1]);
      index += 1;
      continue;
    }
  }
  return args;
}

function estimateTokens(text) {
  return Math.max(1, Math.ceil(String(text || "").length / 4));
}

function compactWhitespace(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePrompt(prompt) {
  let out = compactWhitespace(prompt);
  out = out.replace(/Open an inbox item with/gi, "Inbox:");
  out = out.replace(/\bpass or fail\b/gi, "pass/fail");
  out = out.replace(/\bblocking issues\b/gi, "blockers");
  out = out.replace(/\bfailing command lines\b/gi, "failed commands");
  out = out.replace(/\bcommand exit codes\b/gi, "exit codes");
  out = out.replace(/\bany collisions or failures\b/gi, "collisions/failures");
  out = out.replace(/\bwhether immediate action is required\b/gi, "action needed now");
  out = out.replace(/\s+,/g, ",");
  out = out.replace(/\s+\./g, ".");
  return out;
}

function mappedPrompt(id, original) {
  const byId = {
    "aio-9am-preflight":
      "Run npm run workflow:preflight and npm run agents:validate. Inbox: pass/fail, blockers, failed commands.",
    "aio-10am-contract-gate":
      "Run npm run contracts:validate. Inbox: drift/mapping failures with file paths.",
    "aio-11am-test-lint":
      "Run npm test --silent and npm run lint --silent. Inbox: failed tests, lint errors, top fixes.",
    "aio-12pm-wrapper-smoke":
      "Run wrapper smoke for pipeline_default_math and pipeline_clamp_x. Inbox: outputs, regressions, exit codes.",
    "aio-1pm-governance-gate":
      "Run npm run governance:hard:gate and npm run automations:audit. Inbox: pass/fail, schedule gaps, duplicate or drifting automations.",
    "aio-2pm-separation-audit":
      "Run npm run audit:data-separation. Inbox: violation counts, files, first remediations.",
    "aio-3pm-sync-dry-run":
      "Run npm run codex:desktop:sync:dry-run. Inbox: readiness, collisions, blockers.",
    "aio-4pm-sync-apply":
      "Run npm run codex:desktop:sync. Inbox: result, changed artifacts, collisions/failures.",
    "aio-5pm-daily-gate":
      "Run npm run codex:desktop:validate and npm run refactor:gate --silent. Inbox: end-of-day gate summary, blockers first.",
    "aio-metadata-drift-check":
      "Run npm run agents:scope-sync, npm run agents:validate, npm run codex:desktop:validate. Inbox: drift + failures.",
    "aio-wrapper-mini-regression":
      "Run wrapper smoke for pipeline_default_math and pipeline_compare_bounds. Inbox: outputs, mismatches, regressions.",
    "aio-dependency-watch":
      "Run npm outdated and npm audit --omit=dev. Inbox: high-risk packages, upgrade order, action needed now.",
    "aio-dx12-doctor":
      "Run npm run dx12:doctor. Inbox: missing components and exact remediation commands.",
    "aio-format-guard":
      "Run npm run format:check. Inbox: failing files and drift trend."
  };
  if (byId[id]) {
    return byId[id];
  }
  return normalizePrompt(original);
}

function updatePromptInToml(source, nextPrompt) {
  if (/^prompt\s*=\s*"/m.test(source)) {
    return source.replace(/^prompt\s*=\s*"[^"]*"/m, `prompt = "${nextPrompt.replace(/"/g, '\\"')}"`);
  }
  return `${source.trimEnd()}\nprompt = "${nextPrompt.replace(/"/g, '\\"')}"\n`;
}

function analyzeAndMaybeApply(args) {
  const codexHome = path.resolve(args.codexHome || process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));
  const automationsRoot = path.join(codexHome, "automations");
  const report = {
    status: "pass",
    mode: args.apply ? "apply" : "dry-run",
    prune_duplicates: args.pruneDuplicates,
    codex_home: codexHome,
    automations_root: automationsRoot,
    max_prompt_tokens: args.maxPromptTokens,
    scanned: 0,
    changed: 0,
    duplicate_groups: 0,
    deleted: 0,
    deleted_ids: [],
    rows: []
  };

  if (!fs.existsSync(automationsRoot)) {
    report.status = "fail";
    report.error = "automations root missing";
    return report;
  }

  const dirs = fs.readdirSync(automationsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  dirs.forEach((entry) => {
    const id = entry.name;
    const tomlPath = path.join(automationsRoot, id, "automation.toml");
    if (!fs.existsSync(tomlPath)) {
      return;
    }
    report.scanned += 1;
    const beforeText = fs.readFileSync(tomlPath, "utf8");
    const promptMatch = beforeText.match(/^prompt\s*=\s*"([^"]*)"/m);
    const nameMatch = beforeText.match(/^name\s*=\s*"([^"]*)"/m);
    const rruleMatch = beforeText.match(/^rrule\s*=\s*"([^"]*)"/m);
    const updatedAtMatch = beforeText.match(/^updated_at\s*=\s*(\d+)/m);
    const statusMatch = beforeText.match(/^status\s*=\s*"([^"]*)"/m);
    const name = nameMatch ? nameMatch[1] : "";
    const rrule = rruleMatch ? rruleMatch[1] : "";
    const promptBefore = promptMatch ? promptMatch[1] : "";
    const status = statusMatch ? statusMatch[1] : "";
    const updatedAt = updatedAtMatch ? Number(updatedAtMatch[1]) : 0;
    const beforeTokens = estimateTokens(promptBefore);
    const promptAfter = mappedPrompt(id, promptBefore);
    const afterTokens = estimateTokens(promptAfter);
    let changed = false;

    if (promptAfter !== promptBefore && (status === "ACTIVE" || beforeTokens > args.maxPromptTokens)) {
      const nextText = updatePromptInToml(beforeText, promptAfter);
      if (args.apply) {
        fs.writeFileSync(tomlPath, nextText, "utf8");
      }
      changed = true;
      report.changed += 1;
    }

    report.rows.push({
      id,
      name,
      status,
      rrule,
      updated_at: updatedAt,
      prompt: promptAfter,
      folder: path.join(automationsRoot, id),
      prompt_tokens_before: beforeTokens,
      prompt_tokens_after: afterTokens,
      token_delta: afterTokens - beforeTokens,
      changed
    });
  });

  if (args.pruneDuplicates) {
    const signatureMap = new Map();
    report.rows.forEach((row) => {
      const signature = `${String(row.name || "").toLowerCase()}|${String(row.rrule || "")}|${String(row.prompt || "")}`;
      if (!signatureMap.has(signature)) {
        signatureMap.set(signature, []);
      }
      signatureMap.get(signature).push(row);
    });

    signatureMap.forEach((rows) => {
      if (rows.length <= 1) {
        return;
      }
      report.duplicate_groups += 1;
      const sorted = rows.slice().sort((left, right) => {
        const leftActive = String(left.status || "").toUpperCase() === "ACTIVE" ? 1 : 0;
        const rightActive = String(right.status || "").toUpperCase() === "ACTIVE" ? 1 : 0;
        if (leftActive !== rightActive) {
          return rightActive - leftActive;
        }
        return Number(right.updated_at || 0) - Number(left.updated_at || 0);
      });
      const keep = sorted[0];
      sorted.slice(1).forEach((row) => {
        row.duplicate_of = keep.id;
        row.redundant = true;
        if (args.apply && String(row.status || "").toUpperCase() !== "ACTIVE") {
          fs.rmSync(row.folder, { recursive: true, force: true });
          report.deleted += 1;
          report.deleted_ids.push(row.id);
        }
      });
    });
  }

  report.rows = report.rows.filter((row) => !row.redundant || !report.deleted_ids.includes(row.id));
  report.rows = report.rows.map((row) => {
    const { folder, ...rest } = row;
    return rest;
  });
  report.rows.sort((left, right) => right.prompt_tokens_before - left.prompt_tokens_before);
  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = analyzeAndMaybeApply(args);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`optimize-codex-automations failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  normalizePrompt,
  mappedPrompt,
  estimateTokens
};
