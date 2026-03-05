#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { writeTextFileRobust } = require("./lib/robust-file-write");

function parseArgs(argv) {
  const args = {
    apply: argv.includes("--apply"),
    pruneDuplicates: !argv.includes("--no-prune-duplicates"),
    codexHome: "",
    maxPromptTokens: 36
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
  out = out.replace(/Open an inbox item with/gi, "Inbox<=120t:");
  out = out.replace(/\bInbox:\b/gi, "Inbox<=120t:");
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
      "Run npm run workflow:preflight && npm run agents:validate. Inbox<=120t: pass/fail, blockers, failed cmds.",
    "aio-10am-contract-gate": "Run npm run contracts:validate. Inbox<=120t: drift/mapping fails + file paths.",
    "aio-11am-test-lint": "Run npm test --silent && npm run lint --silent. Inbox<=120t: test/lint fails + top fixes.",
    "aio-12pm-wrapper-smoke":
      "Run wrapper smoke: pipeline_default_math + pipeline_clamp_x. Inbox<=120t: outputs, regressions, exit codes.",
    "aio-1pm-governance-gate":
      "Run npm run governance:hard:gate && npm run automations:audit. Inbox<=120t: pass/fail, gaps, dupes, drift.",
    "aio-2pm-separation-audit": "Run npm run audit:data-separation. Inbox<=120t: violation count, files, first fixes.",
    "aio-3pm-sync-dry-run": "Run npm run codex:desktop:sync:dry-run. Inbox<=120t: readiness, collisions, blockers.",
    "aio-4pm-sync-apply": "Run npm run codex:desktop:sync. Inbox<=120t: result, changed artifacts, collisions/fails.",
    "aio-5pm-daily-gate":
      "Run npm run codex:desktop:validate && npm run refactor:gate --silent. Inbox<=120t: gate summary, blockers first.",
    "aio-metadata-drift-check":
      "Run npm run agents:scope-sync && npm run agents:validate && npm run codex:desktop:validate. Inbox<=120t: drift + fails.",
    "aio-wrapper-mini-regression":
      "Run wrapper smoke: pipeline_default_math + pipeline_compare_bounds. Inbox<=120t: outputs, mismatches, regressions.",
    "aio-dependency-watch":
      "Run npm outdated && npm audit --omit=dev. Inbox<=120t: high-risk deps, upgrade order, action now.",
    "aio-dx12-doctor": "Run npm run dx12:doctor. Inbox<=120t: missing components + exact remediation cmds.",
    "aio-format-guard": "Run npm run format:check. Inbox<=120t: failing files + drift trend.",
    "aio-continuous-research-planner":
      "Run research + standards drift scan. Inbox<=120t: changed controls, evidence gaps, next actions.",
    "aio-continuous-backlog-executor":
      "Run backlog executor for top P0/P1 items. Inbox<=120t: completed, blockers, next fixes.",
    "iso-standards-watch":
      "Run ISO standards drift monitor + compliance refresh. Inbox<=120t: changed standards, failing mappings, updates."
  };
  if (byId[id]) {
    return byId[id];
  }
  return normalizePrompt(original);
}

function normalizeHourlyRRule(rrule) {
  const raw = String(rrule || "").trim();
  if (!raw) {
    return "";
  }
  if (!/^FREQ=HOURLY/i.test(raw)) {
    return raw;
  }
  const intervalMatch = raw.match(/INTERVAL=(\d+)/i);
  const interval = intervalMatch ? Math.max(1, Number(intervalMatch[1]) || 1) : 1;
  return `FREQ=HOURLY;INTERVAL=${interval}`;
}

function mappedRRule(id, original) {
  const byId = {
    "aio-9am-preflight": "FREQ=HOURLY;INTERVAL=6",
    "aio-10am-contract-gate": "FREQ=HOURLY;INTERVAL=6",
    "aio-11am-test-lint": "FREQ=HOURLY;INTERVAL=4",
    "aio-12pm-wrapper-smoke": "FREQ=HOURLY;INTERVAL=4",
    "aio-1pm-governance-gate": "FREQ=HOURLY;INTERVAL=2",
    "aio-2pm-separation-audit": "FREQ=HOURLY;INTERVAL=6",
    "aio-3pm-sync-dry-run": "FREQ=HOURLY;INTERVAL=6",
    "aio-4pm-sync-apply": "FREQ=HOURLY;INTERVAL=6",
    "aio-5pm-daily-gate": "FREQ=HOURLY;INTERVAL=2",
    "aio-metadata-drift-check": "FREQ=HOURLY;INTERVAL=4",
    "aio-wrapper-mini-regression": "FREQ=HOURLY;INTERVAL=4",
    "aio-dependency-watch": "FREQ=HOURLY;INTERVAL=24",
    "aio-dx12-doctor": "FREQ=HOURLY;INTERVAL=24",
    "aio-format-guard": "FREQ=HOURLY;INTERVAL=24",
    "aio-continuous-research-planner": "FREQ=HOURLY;INTERVAL=6",
    "aio-continuous-backlog-executor": "FREQ=HOURLY;INTERVAL=6",
    "iso-standards-watch": "FREQ=HOURLY;INTERVAL=12"
  };
  return byId[id] || normalizeHourlyRRule(original);
}

function updatePromptInToml(source, nextPrompt) {
  if (/^prompt\s*=\s*"/m.test(source)) {
    return source.replace(/^prompt\s*=\s*"[^"]*"/m, `prompt = "${nextPrompt.replace(/"/g, '\\"')}"`);
  }
  return `${source.trimEnd()}\nprompt = "${nextPrompt.replace(/"/g, '\\"')}"\n`;
}

function updateRRuleInToml(source, nextRRule) {
  if (/^rrule\s*=\s*"/m.test(source)) {
    return source.replace(/^rrule\s*=\s*"[^"]*"/m, `rrule = "${nextRRule.replace(/"/g, '\\"')}"`);
  }
  return `${source.trimEnd()}\nrrule = "${nextRRule.replace(/"/g, '\\"')}"\n`;
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
    const rruleAfter = mappedRRule(id, rrule);
    const afterTokens = estimateTokens(promptAfter);
    let changed = false;
    let nextText = beforeText;

    if (promptAfter !== promptBefore && (status === "ACTIVE" || beforeTokens > args.maxPromptTokens)) {
      changed = true;
      nextText = updatePromptInToml(nextText, promptAfter);
    }

    if (rruleAfter !== rrule && status === "ACTIVE") {
      changed = true;
      nextText = updateRRuleInToml(nextText, rruleAfter);
    }

    if (changed && args.apply) {
      writeTextFileRobust(tomlPath, nextText);
    }
    if (changed) {
      report.changed += 1;
    }

    report.rows.push({
      id,
      name,
      status,
      rrule_before: rrule,
      rrule_after: rruleAfter,
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
      const signature = `${String(row.name || "").toLowerCase()}|${String(row.rrule_after || "")}|${String(row.prompt || "")}`;
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
    const next = { ...row };
    delete next.folder;
    return next;
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
  mappedRRule,
  estimateTokens
};
