#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { ensureShardsCurrent } = require("./agent-workflow-shards");

const ROOT = path.resolve(__dirname, "..");
const ALLOWED_ROOTS = Object.freeze([
  "app/",
  "brain/",
  "data/input/",
  "data/output/",
  "main/",
  "renderer/",
  "scripts/",
  "tests/",
  "to-do/"
]);
const SCOPE_GUARDRAILS = Object.freeze([
  "Edit only app/, brain/, data/input/, data/output/, main/, renderer/, scripts/, tests/, and to-do/.",
  "Keep runtime in brain/*, catalogs/specs in data/input/*, and generated output in data/output/*.",
  "Preserve two-pass wrapper order: identify_arguments before execute_pipeline.",
  "Run npm run governance:hard:gate after skill/agent/routing updates.",
  "Run npm run standards:baseline:gate for naming, storage, and optimization policy enforcement.",
  "Use data/input/shared/main/executive_engineering_baseline.json as the policy source for engineering decisions.",
  "Run npm run agents:validate after metadata edits."
]);
const PROJECT_SCOPE_REF = "source://project_scope";
const DEFAULT_SCOPE_PROMPT = "Stay in aio project scope only.";
const HARD_GOVERNANCE_BLOCKING_CHECK = "Hard governance gate passes (npm run governance:hard:gate).";
const HARD_GOVERNANCE_WORKFLOW_LINE = "Run npm run governance:hard:gate and stop on failures before completion.";
const HARD_GOVERNANCE_ROUTING_KEYWORDS = Object.freeze([
  "hard governance",
  "hard governance gate",
  "automation governance",
  "schedule dedupe",
  "automation roadmap blueprint",
  "standards baseline",
  "naming policy baseline",
  "data storage baseline",
  "optimization baseline"
]);
const HARD_GOVERNANCE_ROUTING_PATHS = Object.freeze([
  "scripts/hard-governance-gate.js",
  "scripts/standards-baseline-gate.js",
  "scripts/optimize-codex-automations.js",
  "data/input/shared/main/hard_governance_ruleset.json",
  "data/input/shared/main/executive_engineering_baseline.json",
  "data/input/shared/main/polyglot_engineering_standards_catalog.json",
  "data/input/shared/main/iso_standards_traceability_catalog.json",
  "data/output/databases/polyglot-default/plan/automation_roadmap.md",
  "data/output/databases/polyglot-default/plan/future_blueprint.md"
]);
const HARD_GOVERNANCE_ROUTING_SKILLS = Object.freeze([
  "polyglot-default-orchestrator",
  "agent-skill-review-research",
  "agent-skill-decision-editor",
  "refactor-blocking-gate"
]);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, `${String(text).replace(/\r?\n/g, "\n")}\n`, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeRuleValue(value) {
  return normalizeString(value).toLowerCase();
}

function dedupeCaseInsensitive(values) {
  const seen = new Set();
  return (Array.isArray(values) ? values : [])
    .map((entry) => normalizeString(entry))
    .filter(Boolean)
    .filter((entry) => {
      const key = entry.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function normalizeSkills(skills) {
  return dedupeCaseInsensitive(skills);
}

function skillSignature(skills) {
  return normalizeSkills(skills)
    .map((entry) => entry.toLowerCase())
    .sort()
    .join("|");
}

function ensureHardGovernanceAgentContract(agent) {
  const next = agent && typeof agent === "object" ? { ...agent } : {};
  const checks = dedupeCaseInsensitive(next.blocking_checks);
  const workflowLines = dedupeCaseInsensitive(next.workflow);

  if (!checks.some((entry) => /governance:hard:gate|hard governance gate|automation governance/i.test(entry))) {
    checks.push(HARD_GOVERNANCE_BLOCKING_CHECK);
  }

  if (!workflowLines.some((entry) => /governance:hard:gate|hard governance/i.test(entry))) {
    workflowLines.push(HARD_GOVERNANCE_WORKFLOW_LINE);
  }

  next.blocking_checks = checks;
  next.workflow = workflowLines;
  return next;
}

function ensureKeywordRule(doc, keywords, skills) {
  const next = doc && typeof doc === "object" ? doc : {};
  if (!Array.isArray(next.keyword_rules)) {
    next.keyword_rules = [];
  }
  const desiredSkills = normalizeSkills(skills);
  const desiredSignature = skillSignature(desiredSkills);
  if (!desiredSignature) {
    return;
  }

  let targetIndex = next.keyword_rules.findIndex((rule) => skillSignature(rule && rule.skills) === desiredSignature);
  if (targetIndex < 0) {
    targetIndex = next.keyword_rules.length;
    next.keyword_rules.push({
      keywords: [],
      skills: desiredSkills
    });
  }

  const ownership = new Map();
  next.keyword_rules.forEach((rule, ruleIndex) => {
    const signature = skillSignature(rule && rule.skills);
    const ruleKeywords = Array.isArray(rule && rule.keywords) ? rule.keywords : [];
    ruleKeywords.forEach((keyword) => {
      const key = normalizeRuleValue(keyword);
      if (key && !ownership.has(key)) {
        ownership.set(key, {
          ruleIndex,
          signature
        });
      }
    });
  });

  const targetRule = next.keyword_rules[targetIndex];
  targetRule.skills = desiredSkills;
  const mergedKeywords = dedupeCaseInsensitive(targetRule.keywords);
  normalizeSkills(keywords).forEach((keyword) => {
    const key = keyword.toLowerCase();
    const owner = ownership.get(key);
    if (owner && owner.signature !== desiredSignature) {
      return;
    }
    if (!mergedKeywords.some((existing) => existing.toLowerCase() === key)) {
      mergedKeywords.push(keyword);
    }
  });
  targetRule.keywords = mergedKeywords;
}

function ensurePathRule(doc, paths, skills) {
  const next = doc && typeof doc === "object" ? doc : {};
  if (!Array.isArray(next.path_rules)) {
    next.path_rules = [];
  }
  const desiredSkills = normalizeSkills(skills);
  const desiredSignature = skillSignature(desiredSkills);
  if (!desiredSignature) {
    return;
  }

  let targetIndex = next.path_rules.findIndex((rule) => skillSignature(rule && rule.skills) === desiredSignature);
  if (targetIndex < 0) {
    targetIndex = next.path_rules.length;
    next.path_rules.push({
      paths: [],
      skills: desiredSkills
    });
  }

  const targetRule = next.path_rules[targetIndex];
  targetRule.skills = desiredSkills;
  const mergedPaths = dedupeCaseInsensitive(targetRule.paths);
  normalizeSkills(paths).forEach((entryPath) => {
    if (!mergedPaths.some((existing) => existing.toLowerCase() === entryPath.toLowerCase())) {
      mergedPaths.push(entryPath);
    }
  });
  targetRule.paths = mergedPaths;
}

function titleCaseSkillName(skillName) {
  return String(skillName || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildDefaultPrompt(currentPrompt, skillName) {
  const cleanSkillName = String(skillName || "").trim();
  const requiredSkillToken = `$${cleanSkillName}`;
  let prompt = String(currentPrompt || "").trim();
  prompt = prompt
    .replace(/Keep all edits within dictionary-desktop project scope and local workflow files only\./gi, DEFAULT_SCOPE_PROMPT)
    .replace(/Keep all edits within aio project scope and local workflow files only\./gi, DEFAULT_SCOPE_PROMPT)
    .replace(/Stay in dictionary-desktop project scope only\./gi, DEFAULT_SCOPE_PROMPT);
  if (!prompt) {
    prompt = `Use ${requiredSkillToken} for this task.`;
  } else if (!prompt.includes(requiredSkillToken)) {
    prompt = `Use ${requiredSkillToken} for this task. ${prompt}`;
  }
  if (!/aio project scope/i.test(prompt)) {
    prompt = `${prompt} ${DEFAULT_SCOPE_PROMPT}`;
  }
  const dedupeSeen = new Set();
  const sentences = prompt
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const key = line.toLowerCase();
      if (dedupeSeen.has(key)) {
        return false;
      }
      dedupeSeen.add(key);
      return true;
    });
  const compact = sentences.slice(0, 3).join(" ");
  return compact.replace(/\s+/g, " ").trim();
}

function ensureAgentYamlScope(filePath) {
  let text = readText(filePath).replace(/\r?\n/g, "\n");
  text = text
    .replace(
      "Dispatch directly to dictionary-thesaurus-expander-agent.",
      "Run dictionary-thesaurus-expander skill stage."
    )
    .replace("Dispatch directly to word-machine-descriptor-agent.", "Run word-machine-descriptor-compiler skill stage.")
    .replace(
      "Dispatch directly to dictionary-machine-quality-gate-agent.",
      "Run dictionary-machine-quality-gate skill stage."
    );

  if (!text.includes("  project_scope_ref: source://project_scope")) {
    text = text.replace(
      "\n  runtime_contract:\n",
      [
        "\n  project_scope_ref: source://project_scope",
        "  scope_guardrails:",
        "    - Edit only app/, brain/, data/input/, data/output/, main/, renderer/, scripts/, tests/, and to-do/.",
        "    - Keep runtime in brain/*, catalogs/specs in data/input/*, and generated output in data/output/*.",
        '    - "Preserve two-pass wrapper order: identify_arguments before execute_pipeline."',
        "    - Run npm run agents:validate after metadata edits.",
        "  runtime_contract:",
        ""
      ].join("\n")
    );
  }

  text = text.replace(
    "    - Preserve two-pass wrapper order: identify_arguments before execute_pipeline.",
    '    - "Preserve two-pass wrapper order: identify_arguments before execute_pipeline."'
  );

  if (!text.includes("    allowed_runtime_roots:")) {
    text = text.replace(
      /(\s{4}wrapper_execution_mode: [^\n]+\n)/,
      [
        "$1",
        "    allowed_runtime_roots:",
        "      - brain/",
        "      - data/input/",
        "      - data/output/",
        "      - to-do/",
        "    editable_project_roots:",
        "      - app/",
        "      - brain/",
        "      - data/input/",
        "      - data/output/",
        "      - main/",
        "      - renderer/",
        "      - scripts/",
        "      - tests/",
        "      - to-do/",
        "    no_external_targets: true",
        ""
      ].join("\n")
    );
  }

  let parsed = {};
  try {
    parsed = yaml.load(text);
  } catch {
    parsed = {};
  }
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const agent = source.agent && typeof source.agent === "object" && !Array.isArray(source.agent) ? source.agent : {};
  agent.project_scope_ref = PROJECT_SCOPE_REF;
  agent.scope_guardrails = [...SCOPE_GUARDRAILS];
  const hardenedAgent = ensureHardGovernanceAgentContract(agent);
  agent.blocking_checks = hardenedAgent.blocking_checks;
  agent.workflow = hardenedAgent.workflow;
  const runtimeContract =
    agent.runtime_contract && typeof agent.runtime_contract === "object" && !Array.isArray(agent.runtime_contract)
      ? agent.runtime_contract
      : {};
  runtimeContract.allowed_runtime_roots = ["brain/", "data/input/", "data/output/", "to-do/"];
  runtimeContract.editable_project_roots = [...ALLOWED_ROOTS];
  runtimeContract.no_external_targets = true;
  agent.runtime_contract = runtimeContract;
  source.agent = agent;

  const out = yaml.dump(source, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    quotingType: "\"",
    forceQuotes: false
  });
  writeText(filePath, out.trimEnd());
}

function ensureOpenAiYamlScope(filePath, skillName) {
  let parsed = {};
  try {
    parsed = yaml.load(readText(filePath));
  } catch {
    parsed = {};
  }

  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const sourceInterface =
    source.interface && typeof source.interface === "object" && !Array.isArray(source.interface)
      ? source.interface
      : {};
  const sourcePolicy =
    source.policy && typeof source.policy === "object" && !Array.isArray(source.policy) ? source.policy : {};
  const sourceDependencies =
    source.dependencies && typeof source.dependencies === "object" && !Array.isArray(source.dependencies)
      ? source.dependencies
      : null;

  const sanitizedInterface = {
    display_name: String(sourceInterface.display_name || titleCaseSkillName(skillName) || "Skill"),
    short_description: String(sourceInterface.short_description || `Run ${skillName} workflow.`),
    default_prompt: buildDefaultPrompt(sourceInterface.default_prompt, skillName)
  };

  ["icon_small", "icon_large", "brand_color"].forEach((field) => {
    const value = sourceInterface[field];
    if (typeof value === "string" && value.trim()) {
      sanitizedInterface[field] = value.trim();
    }
  });

  const nextDoc = {
    interface: sanitizedInterface
  };
  if (sourceDependencies) {
    nextDoc.dependencies = sourceDependencies;
  }
  nextDoc.policy = {
    allow_implicit_invocation: sourcePolicy.allow_implicit_invocation !== false
  };

  const out = yaml.dump(nextDoc, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    quotingType: "\"",
    forceQuotes: true
  });
  writeText(filePath, out.trimEnd());
}

function ensureSkillMarkdownScope(filePath) {
  let text = readText(filePath).replace(/\r?\n/g, "\n");
  if (!text.includes("## Project Scope Guardrails")) {
    text = `${text.trimEnd()}\n\n## Project Scope Guardrails\n\n- Keep changes inside \`app/\`, \`brain/\`, \`data/input/\`, \`data/output/\`, \`main/\`, \`renderer/\`, \`scripts/\`, \`tests/\`, and \`to-do/\`.\n- Keep runtime logic in \`brain/*\`; keep catalogs/specs in \`data/input/*\`; keep generated artifacts/logs in \`data/output/*\`.\n- Do not introduce cloud/deployment/provider workflows unless explicitly requested.\n- Preserve the two-pass wrapper contract (\`identify_arguments\` before \`execute_pipeline\`) when touching wrapper flows.\n- Run \`npm run standards:baseline:gate\` for naming/storage/optimization policy checks when editing governance or architecture metadata.\n- Use \`data/input/shared/main/executive_engineering_baseline.json\` as policy source for engineering decisions.\n- Re-run \`npm run agents:validate\` after agent/skill metadata changes.\n`;
  }
  writeText(filePath, text.trimEnd());
}

function updateAgentWorkflowsJson(filePath) {
  const doc = readJson(filePath);
  doc.project_scope = {
    project_id: "aio",
    project_name: "AIO",
    policy_version: "2026-03-05",
    allowed_roots: ALLOWED_ROOTS,
    runtime_contract: {
      wrapper_execution_mode: "two_pass_single_wrapper",
      brain_root: "brain/",
      data_input_root: "data/input/",
      data_output_root: "data/output/",
      todo_root: "to-do/"
    }
  };

  if (Array.isArray(doc.agents)) {
    doc.agents = doc.agents.map((agent) => {
      const next = { ...agent };
      next.project_scope_ref = PROJECT_SCOPE_REF;
      next.scope_guardrails = [...SCOPE_GUARDRAILS];
      if (next.id === "dictionary-lexicon-director-agent" && Array.isArray(next.workflow)) {
        next.workflow = next.workflow.map((line) =>
          String(line)
            .replace(
              "Dispatch directly to dictionary-thesaurus-expander-agent.",
              "Run dictionary-thesaurus-expander skill stage."
            )
            .replace(
              "Dispatch directly to word-machine-descriptor-agent.",
              "Run word-machine-descriptor-compiler skill stage."
            )
            .replace(
              "Dispatch directly to dictionary-machine-quality-gate-agent.",
              "Run dictionary-machine-quality-gate skill stage."
            )
        );
      }
      const hardened = ensureHardGovernanceAgentContract(next);
      hardened.project_scope_ref = PROJECT_SCOPE_REF;
      hardened.scope_guardrails = [...SCOPE_GUARDRAILS];
      return hardened;
    });
  }

  writeJson(filePath, doc);
}

function updateAgentAccessControlJson(filePath) {
  const doc = readJson(filePath);
  doc.system.project_scope = {
    project_id: "aio",
    policy_version: "2026-03-05",
    allowed_roots: ALLOWED_ROOTS,
    runtime_roots: ["brain/", "data/input/", "data/output/", "to-do/"],
    output_only_root: "data/output/"
  };
  if (doc.agents && typeof doc.agents === "object") {
    Object.keys(doc.agents).forEach((agentId) => {
      const entry = doc.agents[agentId];
      entry.project_scope_ref = PROJECT_SCOPE_REF;
      entry.allowed_paths = [...ALLOWED_ROOTS];
    });
  }
  writeJson(filePath, doc);
}

function updateAgentsRegistryYaml(filePath) {
  let parsed = {};
  try {
    parsed = yaml.load(readText(filePath));
  } catch {
    parsed = {};
  }

  const doc = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  doc.project_scope = {
    project_id: "aio",
    project_name: "AIO",
    policy_version: "2026-03-05",
    allowed_roots: [...ALLOWED_ROOTS],
    runtime_contract_ref: "source://runtime_model",
    wrapper_contract: "two_pass_single_wrapper"
  };

  const out = yaml.dump(doc, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    quotingType: "\"",
    forceQuotes: false
  });
  writeText(filePath, out.trimEnd());
}

function updateRepeatActionRoutingJson(filePath) {
  const doc = readJson(filePath);
  doc.project_scope = {
    project_id: "aio",
    policy_version: "2026-03-05",
    allowed_roots: ALLOWED_ROOTS
  };
  ensureKeywordRule(doc, HARD_GOVERNANCE_ROUTING_KEYWORDS, HARD_GOVERNANCE_ROUTING_SKILLS);
  ensurePathRule(doc, HARD_GOVERNANCE_ROUTING_PATHS, HARD_GOVERNANCE_ROUTING_SKILLS);
  if (Array.isArray(doc.keyword_rules)) {
    doc.keyword_rules = doc.keyword_rules.map((rule) => ({
      keywords: dedupeCaseInsensitive(rule && rule.keywords),
      skills: normalizeSkills(rule && rule.skills)
    }));
  }
  if (Array.isArray(doc.path_rules)) {
    doc.path_rules = doc.path_rules.map((rule) => ({
      paths: dedupeCaseInsensitive(rule && rule.paths),
      skills: normalizeSkills(rule && rule.skills)
    }));
  }
  writeJson(filePath, doc);
}

function main() {
  const agentsDir = path.join(ROOT, "to-do", "agents");
  fs.readdirSync(agentsDir)
    .filter((name) => name.endsWith(".yaml") && name !== "agents_registry.yaml")
    .forEach((name) => ensureAgentYamlScope(path.join(agentsDir, name)));

  const skillsDir = path.join(ROOT, "to-do", "skills");
  fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => {
      const openAiYamlPath = path.join(skillsDir, entry.name, "agents", "openai.yaml");
      const skillMdPath = path.join(skillsDir, entry.name, "SKILL.md");
      if (fs.existsSync(openAiYamlPath)) {
        ensureOpenAiYamlScope(openAiYamlPath, entry.name);
      }
      if (fs.existsSync(skillMdPath)) {
        ensureSkillMarkdownScope(skillMdPath);
      }
    });

  updateAgentWorkflowsJson(path.join(ROOT, "to-do", "skills", "agent_workflows.json"));
  updateAgentAccessControlJson(path.join(ROOT, "to-do", "agents", "agent_access_control.json"));
  updateAgentsRegistryYaml(path.join(ROOT, "to-do", "agents", "agents_registry.yaml"));
  updateRepeatActionRoutingJson(path.join(ROOT, "to-do", "skills", "repeat_action_routing.json"));
  ensureShardsCurrent(ROOT, { force: true });
}

try {
  main();
  process.stdout.write("scope sync complete\n");
} catch (error) {
  process.stderr.write(`scope sync failed: ${error.message}\n`);
  process.exit(1);
}
