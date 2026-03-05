#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const yaml = require("js-yaml");
const { findProjectRoot } = require("./project-source-resolver");
const { writeTextFileRobust } = require("./lib/robust-file-write");
const { isShardsCurrent, readWorkflowDoc } = require("./agent-workflow-shards");

const DEFAULT_REPORT_PATH = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "codex_efficiency_report.json"
);
const DEFAULT_BASELINE_PATH = path.join("data", "input", "shared", "main", "executive_engineering_baseline.json");
const DEFAULT_TOKEN_POLICY_PATH = path.join(
  "data",
  "input",
  "shared",
  "main",
  "token_usage_optimization_policy_catalog.json"
);
const SKILL_PROMPT_TEMPLATE = /^Use \$[a-z0-9][a-z0-9-]* for this task\. Stay in aio project scope only\.$/i;

function toFiniteNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function resolveNumber(...candidates) {
  for (let index = 0; index < candidates.length; index += 1) {
    const value = toFiniteNumber(candidates[index]);
    if (value !== null) {
      return value;
    }
  }
  return null;
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    enforce: argv.includes("--enforce"),
    skipAutomations: argv.includes("--skip-automations"),
    reportFile: "",
    previousReportFile: "",
    baselineFile: "",
    tokenPolicyFile: "",
    codexHome: "",
    maxFileTokens: null,
    maxSkillPromptTokens: null,
    maxAutomationPromptTokens: null,
    maxTotalTokensEstimate: null,
    maxScopeGuardrailDuplicateCount: null,
    maxTotalTokenIncrease: null,
    maxTotalTokenIncreasePercent: null,
    maxPerFileTokenIncrease: null,
    enforceSkillPromptTemplate: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--report-file" && argv[index + 1]) {
      args.reportFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--previous-report-file" && argv[index + 1]) {
      args.previousReportFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--baseline-file" && argv[index + 1]) {
      args.baselineFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--token-policy-file" && argv[index + 1]) {
      args.tokenPolicyFile = String(argv[index + 1]).trim();
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
    if (token === "--max-total-tokens-estimate" && argv[index + 1]) {
      args.maxTotalTokensEstimate = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--max-scope-guardrail-duplicate-count" && argv[index + 1]) {
      args.maxScopeGuardrailDuplicateCount = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--max-total-token-increase" && argv[index + 1]) {
      args.maxTotalTokenIncrease = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--max-total-token-increase-percent" && argv[index + 1]) {
      args.maxTotalTokenIncreasePercent = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--max-per-file-token-increase" && argv[index + 1]) {
      args.maxPerFileTokenIncrease = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--enforce-skill-prompt-template") {
      args.enforceSkillPromptTemplate = true;
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
      prompt,
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

function resolveThresholds(root, args) {
  const baselinePath = path.resolve(root, args.baselineFile || DEFAULT_BASELINE_PATH);
  const tokenPolicyPath = path.resolve(root, args.tokenPolicyFile || DEFAULT_TOKEN_POLICY_PATH);
  const baselineDoc = readJsonIfExists(baselinePath);
  const tokenPolicyDoc = readJsonIfExists(tokenPolicyPath);

  const baselineThresholds =
    baselineDoc &&
    baselineDoc.optimization_policy &&
    baselineDoc.optimization_policy.thresholds &&
    typeof baselineDoc.optimization_policy.thresholds === "object"
      ? baselineDoc.optimization_policy.thresholds
      : {};
  const tokenBudgets =
    tokenPolicyDoc && tokenPolicyDoc.token_budgets && typeof tokenPolicyDoc.token_budgets === "object"
      ? tokenPolicyDoc.token_budgets
      : {};
  const tokenRegressions =
    tokenPolicyDoc && tokenPolicyDoc.regression_limits && typeof tokenPolicyDoc.regression_limits === "object"
      ? tokenPolicyDoc.regression_limits
      : {};
  const promptTemplatePolicy =
    tokenPolicyDoc && tokenPolicyDoc.prompt_template_policy && typeof tokenPolicyDoc.prompt_template_policy === "object"
      ? tokenPolicyDoc.prompt_template_policy
      : {};
  const automationPolicy =
    tokenPolicyDoc &&
    tokenPolicyDoc.automation_prompt_policy &&
    typeof tokenPolicyDoc.automation_prompt_policy === "object"
      ? tokenPolicyDoc.automation_prompt_policy
      : {};

  const thresholds = {
    max_file_tokens: resolveNumber(
      args.maxFileTokens,
      tokenBudgets.max_file_tokens,
      baselineThresholds.max_file_tokens,
      16000
    ),
    max_skill_prompt_tokens: resolveNumber(
      args.maxSkillPromptTokens,
      tokenBudgets.max_skill_prompt_tokens,
      baselineThresholds.max_skill_prompt_tokens,
      72
    ),
    max_automation_prompt_tokens: resolveNumber(
      args.maxAutomationPromptTokens,
      tokenBudgets.max_automation_prompt_tokens,
      baselineThresholds.max_automation_prompt_tokens,
      72
    ),
    max_total_tokens_estimate: resolveNumber(
      args.maxTotalTokensEstimate,
      tokenBudgets.max_total_tokens_estimate,
      baselineThresholds.max_total_tokens_estimate
    ),
    max_scope_guardrail_duplicate_count: resolveNumber(
      args.maxScopeGuardrailDuplicateCount,
      tokenBudgets.max_scope_guardrail_duplicate_count
    ),
    max_total_token_increase: resolveNumber(args.maxTotalTokenIncrease, tokenRegressions.max_total_token_increase),
    max_total_token_increase_percent: resolveNumber(
      args.maxTotalTokenIncreasePercent,
      tokenRegressions.max_total_token_increase_percent
    ),
    max_per_file_token_increase: resolveNumber(
      args.maxPerFileTokenIncrease,
      tokenRegressions.max_per_file_token_increase
    ),
    enforce_skill_prompt_template:
      args.enforceSkillPromptTemplate === true || promptTemplatePolicy.enforce_compact_default_prompt === true,
    require_command_first_automation_prompt: automationPolicy.require_command_first_prompt === true,
    required_automation_output_cap_marker: String(automationPolicy.required_output_cap_marker || "").trim(),
    max_expected_automation_output_tokens: resolveNumber(automationPolicy.max_expected_output_tokens)
  };

  return {
    baseline_file: path.relative(root, baselinePath).replace(/\\/g, "/"),
    token_policy_file: path.relative(root, tokenPolicyPath).replace(/\\/g, "/"),
    baseline_loaded: baselineDoc !== null,
    token_policy_loaded: tokenPolicyDoc !== null,
    thresholds
  };
}

function compareAgainstPreviousReport(currentReport, previousReport, thresholds) {
  const issues = [];
  if (!previousReport || typeof previousReport !== "object") {
    return {
      previous_generated_at: "",
      total_tokens_previous: 0,
      total_tokens_current:
        Number(currentReport && currentReport.counts && currentReport.counts.total_tokens_estimate) || 0,
      total_tokens_delta: 0,
      total_tokens_delta_percent: 0,
      top_heavy_file_deltas: [],
      issues
    };
  }

  const previousTotal = Number(previousReport.counts && previousReport.counts.total_tokens_estimate) || 0;
  const currentTotal = Number(currentReport && currentReport.counts && currentReport.counts.total_tokens_estimate) || 0;
  const totalDelta = currentTotal - previousTotal;
  const totalDeltaPercent = previousTotal > 0 ? (totalDelta / previousTotal) * 100 : 0;

  if (
    toFiniteNumber(thresholds.max_total_token_increase) !== null &&
    totalDelta > thresholds.max_total_token_increase
  ) {
    issues.push({
      level: "error",
      type: "total_tokens_regression_exceeded",
      total_tokens_previous: previousTotal,
      total_tokens_current: currentTotal,
      total_tokens_delta: totalDelta,
      max_total_token_increase: thresholds.max_total_token_increase
    });
  }
  if (
    toFiniteNumber(thresholds.max_total_token_increase_percent) !== null &&
    totalDeltaPercent > thresholds.max_total_token_increase_percent
  ) {
    issues.push({
      level: "error",
      type: "total_tokens_percent_regression_exceeded",
      total_tokens_previous: previousTotal,
      total_tokens_current: currentTotal,
      total_tokens_delta_percent: Number(totalDeltaPercent.toFixed(4)),
      max_total_token_increase_percent: thresholds.max_total_token_increase_percent
    });
  }

  const previousTopMap = new Map();
  const previousTop = Array.isArray(previousReport.top_heavy_files) ? previousReport.top_heavy_files : [];
  previousTop.forEach((row) => {
    const file = String(row && row.file ? row.file : "").trim();
    if (!file) {
      return;
    }
    previousTopMap.set(file, Number(row.tokens_estimate || 0));
  });

  const topHeavyFileDeltas = [];
  const currentTop = Array.isArray(currentReport.top_heavy_files) ? currentReport.top_heavy_files : [];
  currentTop.forEach((row) => {
    const file = String(row && row.file ? row.file : "").trim();
    if (!file || !previousTopMap.has(file)) {
      return;
    }
    const previousTokens = Number(previousTopMap.get(file) || 0);
    const currentTokens = Number(row.tokens_estimate || 0);
    const delta = currentTokens - previousTokens;
    if (delta === 0) {
      return;
    }
    topHeavyFileDeltas.push({
      file,
      previous_tokens_estimate: previousTokens,
      current_tokens_estimate: currentTokens,
      delta_tokens_estimate: delta
    });
  });

  topHeavyFileDeltas
    .filter((entry) => entry.delta_tokens_estimate > 0)
    .forEach((entry) => {
      const maxPerFileIncrease = toFiniteNumber(thresholds.max_per_file_token_increase);
      if (maxPerFileIncrease !== null && entry.delta_tokens_estimate > maxPerFileIncrease) {
        issues.push({
          level: "error",
          type: "top_heavy_file_token_regression_exceeded",
          file: entry.file,
          delta_tokens_estimate: entry.delta_tokens_estimate,
          max_per_file_token_increase: maxPerFileIncrease
        });
      }
    });

  return {
    previous_generated_at: String(previousReport.generated_at || ""),
    total_tokens_previous: previousTotal,
    total_tokens_current: currentTotal,
    total_tokens_delta: totalDelta,
    total_tokens_delta_percent: Number(totalDeltaPercent.toFixed(4)),
    top_heavy_file_deltas: topHeavyFileDeltas
      .sort((left, right) => right.delta_tokens_estimate - left.delta_tokens_estimate)
      .slice(0, 20),
    issues
  };
}

function analyze(root, args = {}) {
  const policy = resolveThresholds(root, args);
  const thresholds = policy.thresholds;
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
      filePath.endsWith(".yaml") ||
      filePath.endsWith("agent_access_control.json") ||
      filePath.endsWith("agents_registry.yaml"),
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

  const reportPath = path.resolve(root, args.reportFile || DEFAULT_REPORT_PATH);
  const previousReportPath = path.resolve(root, args.previousReportFile || args.reportFile || DEFAULT_REPORT_PATH);
  const previousReport = readJsonIfExists(previousReportPath);
  const issues = [];

  if (
    toFiniteNumber(thresholds.max_total_tokens_estimate) !== null &&
    totalEstimatedTokens > thresholds.max_total_tokens_estimate
  ) {
    issues.push({
      level: "error",
      type: "total_token_budget_exceeded",
      total_tokens_estimate: totalEstimatedTokens,
      max_total_tokens_estimate: thresholds.max_total_tokens_estimate
    });
  }

  fileMetrics.forEach((row) => {
    if (row.tokens_estimate > thresholds.max_file_tokens) {
      issues.push({
        level: "error",
        type: "file_token_budget_exceeded",
        file: row.file,
        tokens_estimate: row.tokens_estimate,
        max_tokens: thresholds.max_file_tokens
      });
    }
  });

  skillPromptMetrics.forEach((row) => {
    if (row.prompt_tokens_estimate > thresholds.max_skill_prompt_tokens) {
      issues.push({
        level: "error",
        type: "skill_prompt_budget_exceeded",
        file: row.file,
        prompt_tokens_estimate: row.prompt_tokens_estimate,
        max_tokens: thresholds.max_skill_prompt_tokens
      });
    }
    if (thresholds.enforce_skill_prompt_template && !SKILL_PROMPT_TEMPLATE.test(String(row.prompt || "").trim())) {
      issues.push({
        level: "error",
        type: "skill_prompt_template_non_compliant",
        file: row.file
      });
    }
  });

  automationAnalysis.prompts
    .filter((row) => row.status === "ACTIVE")
    .forEach((row) => {
      if (row.prompt_tokens_estimate > thresholds.max_automation_prompt_tokens) {
        issues.push({
          level: "error",
          type: "automation_prompt_budget_exceeded",
          id: row.id,
          prompt_tokens_estimate: row.prompt_tokens_estimate,
          max_tokens: thresholds.max_automation_prompt_tokens
        });
      }
      if (thresholds.require_command_first_automation_prompt === true && !/^Run\s+/i.test(String(row.prompt || ""))) {
        issues.push({
          level: "error",
          type: "automation_prompt_not_command_first",
          id: row.id
        });
      }
      if (thresholds.required_automation_output_cap_marker) {
        const promptText = String(row.prompt || "");
        if (!promptText.includes(thresholds.required_automation_output_cap_marker)) {
          issues.push({
            level: "error",
            type: "automation_prompt_output_cap_marker_missing",
            id: row.id,
            required_marker: thresholds.required_automation_output_cap_marker
          });
        }
      }
    });

  automationAnalysis.duplicates.forEach((duplicateGroup) => {
    issues.push({
      level: "warn",
      type: "duplicate_automation_signature",
      ids: duplicateGroup
    });
  });

  if (toFiniteNumber(thresholds.max_scope_guardrail_duplicate_count) !== null) {
    guardrailDuplicates.forEach((entry) => {
      if (Number(entry.count || 0) > thresholds.max_scope_guardrail_duplicate_count) {
        issues.push({
          level: "error",
          type: "scope_guardrail_duplicate_budget_exceeded",
          text: entry.text,
          count: entry.count,
          max_scope_guardrail_duplicate_count: thresholds.max_scope_guardrail_duplicate_count
        });
      }
    });
  }

  const trend = compareAgainstPreviousReport(
    {
      counts: {
        total_tokens_estimate: totalEstimatedTokens
      },
      top_heavy_files: topHeavyFiles
    },
    previousReport,
    thresholds
  );
  trend.issues.forEach((entry) => {
    issues.push(entry);
  });

  const recommendations = [
    "Keep skill defaults on one canonical line: 'Use $skill for this task. Stay in aio project scope only.'",
    "Keep active automation prompts command-first, include 'Inbox<=120t:', and stay under policy token caps.",
    "Track token deltas against the previous report and fail on positive drift above budget.",
    "Use Responses API prompt caching for shared prefixes and stable prompt_cache_key values.",
    "Use Responses API max_output_tokens and low verbosity defaults for routine automation runs.",
    "Use conversation compaction checkpoints; previous_response_id still bills prior tokens.",
    "Use workflow fast mode for iterative runs: --fast --skip-preflight --skip-output-format."
  ];

  return {
    status: issues.some((entry) => entry.level === "error") ? "fail" : "pass",
    generated_at: new Date().toISOString(),
    root,
    policy_inputs: {
      baseline_file: policy.baseline_file,
      token_policy_file: policy.token_policy_file,
      baseline_loaded: policy.baseline_loaded,
      token_policy_loaded: policy.token_policy_loaded
    },
    thresholds: {
      max_file_tokens: thresholds.max_file_tokens,
      max_skill_prompt_tokens: thresholds.max_skill_prompt_tokens,
      max_automation_prompt_tokens: thresholds.max_automation_prompt_tokens,
      max_total_tokens_estimate: thresholds.max_total_tokens_estimate,
      max_scope_guardrail_duplicate_count: thresholds.max_scope_guardrail_duplicate_count,
      max_total_token_increase: thresholds.max_total_token_increase,
      max_total_token_increase_percent: thresholds.max_total_token_increase_percent,
      max_per_file_token_increase: thresholds.max_per_file_token_increase,
      enforce_skill_prompt_template: thresholds.enforce_skill_prompt_template,
      require_command_first_automation_prompt: thresholds.require_command_first_automation_prompt,
      required_automation_output_cap_marker: thresholds.required_automation_output_cap_marker,
      max_expected_automation_output_tokens: thresholds.max_expected_automation_output_tokens
    },
    counts: {
      files_scanned: fileMetrics.length,
      total_tokens_estimate: totalEstimatedTokens,
      skill_prompts_scanned: skillPromptMetrics.length,
      automation_prompts_scanned: automationAnalysis.prompts.length,
      automation_active: automationAnalysis.active,
      workflow_metadata_mode: workflowMetadataMode
    },
    trend: {
      previous_report_file: path.relative(root, previousReportPath).replace(/\\/g, "/"),
      previous_report_found: Boolean(previousReport),
      previous_generated_at: trend.previous_generated_at,
      total_tokens_previous: trend.total_tokens_previous,
      total_tokens_current: trend.total_tokens_current,
      total_tokens_delta: trend.total_tokens_delta,
      total_tokens_delta_percent: trend.total_tokens_delta_percent,
      top_heavy_file_deltas: trend.top_heavy_file_deltas
    },
    outputs: {
      report_file: path.relative(root, reportPath).replace(/\\/g, "/")
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
  writeTextFileRobust(reportFile, `${JSON.stringify(report, null, 2)}\n`);
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
