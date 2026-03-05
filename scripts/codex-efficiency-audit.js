#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const yaml = require("js-yaml");
const { findProjectRoot } = require("./project-source-resolver");
const { isShardsCurrent, readWorkflowDoc } = require("./agent-workflow-shards");

const DEFAULT_REPORT_PATH = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "codex_efficiency_report.json"
);

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    enforce: argv.includes("--enforce"),
    skipAutomations: argv.includes("--skip-automations"),
    reportFile: "",
    codexHome: "",
    maxFileTokens: 16000,
    maxSkillPromptTokens: 72,
    maxAutomationPromptTokens: 72
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--report-file" && argv[index + 1]) {
      args.reportFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--codex-home" && argv[index + 1]) {
      args.codexHome = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--max-file-tokens" && argv[index + 1]) {
      args.maxFileTokens = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--max-skill-prompt-tokens" && argv[index + 1]) {
      args.maxSkillPromptTokens = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--max-automation-prompt-tokens" && argv[index + 1]) {
      args.maxAutomationPromptTokens = Number(argv[index + 1]);
      index += 1;
      continue;
    }
  }

  return args;
}

function estimateTokens(text) {
  return Math.max(1, Math.ceil(String(text || "").length / 4));
}

function countWords(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function collectFilesRecursively(startDir, matcher, out = []) {
  if (!fs.existsSync(startDir)) {
    return out;
  }
  const stack = [startDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
        return;
      }
      if (entry.isFile() && matcher(absolute)) {
        out.push(absolute);
      }
    });
  }
  return out;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function parseOpenAiPrompt(filePath) {
  try {
    const parsed = yaml.load(readText(filePath));
    if (!parsed || typeof parsed !== "object") {
      return "";
    }
    const iface = parsed.interface && typeof parsed.interface === "object" ? parsed.interface : {};
    return normalizeText(iface.default_prompt);
  } catch {
    return "";
  }
}

function analyzeAutomationDir(codexHome) {
  const automationsRoot = path.join(codexHome, "automations");
  if (!fs.existsSync(automationsRoot)) {
    return {
      root: automationsRoot,
      total: 0,
      active: 0,
      prompts: [],
      duplicates: []
    };
  }

  const entries = fs.readdirSync(automationsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const prompts = [];
  const dedupeKeyMap = new Map();

  entries.forEach((entry) => {
    const id = entry.name;
    const tomlPath = path.join(automationsRoot, id, "automation.toml");
    if (!fs.existsSync(tomlPath)) {
      return;
    }
    const text = readText(tomlPath);
    const promptMatch = text.match(/^prompt\s*=\s*"([^"]*)"/m);
    const statusMatch = text.match(/^status\s*=\s*"([^"]*)"/m);
    const rruleMatch = text.match(/^rrule\s*=\s*"([^"]*)"/m);
    const nameMatch = text.match(/^name\s*=\s*"([^"]*)"/m);
    const prompt = promptMatch ? promptMatch[1] : "";
    const status = statusMatch ? statusMatch[1] : "";
    const rrule = rruleMatch ? rruleMatch[1] : "";
    const name = nameMatch ? nameMatch[1] : "";
    const promptTokens = estimateTokens(prompt);

    const row = {
      id,
      name,
      status,
      rrule,
      prompt_tokens_estimate: promptTokens,
      prompt_chars: prompt.length
    };
    prompts.push(row);

    const dedupeKey = `${normalizeText(name).toLowerCase()}|${normalizeText(rrule)}|${normalizeText(prompt)}`;
    if (!dedupeKeyMap.has(dedupeKey)) {
      dedupeKeyMap.set(dedupeKey, []);
    }
    dedupeKeyMap.get(dedupeKey).push(id);
  });

  const duplicates = [];
  dedupeKeyMap.forEach((ids) => {
    if (ids.length > 1) {
      duplicates.push(ids);
    }
  });

  return {
    root: automationsRoot,
    total: prompts.length,
    active: prompts.filter((item) => item.status === "ACTIVE").length,
    prompts: prompts.sort((left, right) => right.prompt_tokens_estimate - left.prompt_tokens_estimate),
    duplicates
  };
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function analyze(root, args) {
  const skillsRoot = path.join(root, "to-do", "skills");
  const agentsRoot = path.join(root, "to-do", "agents");
  const canonicalWorkflowPath = path.join(skillsRoot, "agent_workflows.json");
  const shardWorkflowIndexPath = path.join(agentsRoot, "agent_workflow_shards", "index.json");
  const workflowMetadataMode =
    fs.existsSync(shardWorkflowIndexPath) && isShardsCurrent(root) ? "sharded_lazy" : "canonical";

  const files = [];
  files.push(workflowMetadataMode === "sharded_lazy" ? shardWorkflowIndexPath : canonicalWorkflowPath);
  files.push(path.join(skillsRoot, "repeat_action_routing.json"));

  collectFilesRecursively(
    skillsRoot,
    (filePath) => filePath.endsWith("SKILL.md") || filePath.endsWith(path.join("agents", "openai.yaml")),
    files
  );
  collectFilesRecursively(
    agentsRoot,
    (filePath) =>
      filePath.endsWith(".yaml") || filePath.endsWith("agent_access_control.json") || filePath.endsWith("agents_registry.yaml"),
    files
  );

  const uniqueFiles = [...new Set(files.filter((filePath) => fs.existsSync(filePath)))].sort((left, right) =>
    left.localeCompare(right)
  );

  const fileMetrics = uniqueFiles.map((filePath) => {
    const text = readText(filePath);
    return {
      file: path.relative(root, filePath).replace(/\\/g, "/"),
      chars: text.length,
      words: countWords(text),
      tokens_estimate: estimateTokens(text),
      lines: text.split(/\r?\n/).length
    };
  });

  const totalEstimatedTokens = fileMetrics.reduce((sum, row) => sum + row.tokens_estimate, 0);
  const topHeavyFiles = [...fileMetrics]
    .sort((left, right) => right.tokens_estimate - left.tokens_estimate)
    .slice(0, 20);

  const promptFiles = uniqueFiles.filter((filePath) => filePath.endsWith(path.join("agents", "openai.yaml")));
  const skillPromptMetrics = promptFiles
    .map((filePath) => {
      const prompt = parseOpenAiPrompt(filePath);
      return {
        file: path.relative(root, filePath).replace(/\\/g, "/"),
        prompt_chars: prompt.length,
        prompt_tokens_estimate: estimateTokens(prompt),
        prompt
      };
    })
    .sort((left, right) => right.prompt_tokens_estimate - left.prompt_tokens_estimate);

  let guardrailDuplicates = [];
  try {
    const workflowLoad = readWorkflowDoc(root, {
      preferShards: true,
      ensureCurrent: workflowMetadataMode === "sharded_lazy"
    });
    const guardrailCount = new Map();
    const workflowDoc = workflowLoad.doc && typeof workflowLoad.doc === "object" ? workflowLoad.doc : {};
    const agents = Array.isArray(workflowDoc.agents) ? workflowDoc.agents : [];
    agents.forEach((agent) => {
      const guardrails = Array.isArray(agent.scope_guardrails) ? agent.scope_guardrails : [];
      guardrails.forEach((guardrail) => {
        const key = normalizeText(guardrail);
        if (!key) {
          return;
        }
        guardrailCount.set(key, Number(guardrailCount.get(key) || 0) + 1);
      });
    });
    guardrailDuplicates = [...guardrailCount.entries()]
      .filter(([, count]) => count > 1)
      .map(([text, count]) => ({ text, count }))
      .sort((left, right) => right.count - left.count);
  } catch {
    guardrailDuplicates = [];
  }

  const codexHome = path.resolve(args.codexHome || process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));
  const automationAnalysis = args.skipAutomations
    ? {
        root: path.join(codexHome, "automations"),
        total: 0,
        active: 0,
        prompts: [],
        duplicates: [],
        skipped: true
      }
    : analyzeAutomationDir(codexHome);

  const issues = [];
  fileMetrics.forEach((row) => {
    if (row.tokens_estimate > args.maxFileTokens) {
      issues.push({
        level: "error",
        type: "file_token_budget_exceeded",
        file: row.file,
        tokens_estimate: row.tokens_estimate,
        max_tokens: args.maxFileTokens
      });
    }
  });

  skillPromptMetrics.forEach((row) => {
    if (row.prompt_tokens_estimate > args.maxSkillPromptTokens) {
      issues.push({
        level: "error",
        type: "skill_prompt_budget_exceeded",
        file: row.file,
        prompt_tokens_estimate: row.prompt_tokens_estimate,
        max_tokens: args.maxSkillPromptTokens
      });
    }
  });

  automationAnalysis.prompts
    .filter((row) => row.status === "ACTIVE")
    .forEach((row) => {
      if (row.prompt_tokens_estimate > args.maxAutomationPromptTokens) {
        issues.push({
          level: "error",
          type: "automation_prompt_budget_exceeded",
          id: row.id,
          prompt_tokens_estimate: row.prompt_tokens_estimate,
          max_tokens: args.maxAutomationPromptTokens
        });
      }
    });

  automationAnalysis.duplicates.forEach((duplicateGroup) => {
    issues.push({
      level: "warn",
      type: "duplicate_automation_signature",
      ids: duplicateGroup
    });
  });

  const recommendations = [
    "Prefer one shared compact scope phrase per skill prompt: 'Stay in aio project scope only.'",
    "Keep automation prompts command-first and under ~72 estimated tokens.",
    "Use workflow fast mode for iterative runs: --fast --skip-preflight --skip-output-format.",
    "Keep repeated guardrail text centralized in sync-agent-skill-scope.js constants.",
    "Keep agent workflow shards current for lazy metadata reads: npm run workflow:shards."
  ];

  return {
    status: issues.some((entry) => entry.level === "error") ? "fail" : "pass",
    generated_at: new Date().toISOString(),
    root,
    thresholds: {
      max_file_tokens: args.maxFileTokens,
      max_skill_prompt_tokens: args.maxSkillPromptTokens,
      max_automation_prompt_tokens: args.maxAutomationPromptTokens
    },
    counts: {
      files_scanned: fileMetrics.length,
      total_tokens_estimate: totalEstimatedTokens,
      skill_prompts_scanned: skillPromptMetrics.length,
      automation_prompts_scanned: automationAnalysis.prompts.length,
      automation_active: automationAnalysis.active,
      workflow_metadata_mode: workflowMetadataMode
    },
    top_heavy_files: topHeavyFiles,
    skill_prompt_metrics: skillPromptMetrics,
    duplicated_scope_guardrails: guardrailDuplicates,
    automation: automationAnalysis,
    issues,
    recommendations
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = findProjectRoot(process.cwd());
  const report = analyze(root, args);

  const reportFile = path.resolve(root, args.reportFile || DEFAULT_REPORT_PATH);
  ensureDirForFile(reportFile);
  fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (args.strict && args.enforce && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`codex-efficiency-audit failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  analyze,
  estimateTokens
};
