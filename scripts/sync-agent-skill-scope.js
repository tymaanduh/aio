#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

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
  "Keep changes inside app/, brain/, data/input/, data/output/, main/, renderer/, scripts/, tests/, and to-do/.",
  "Keep executable runtime logic in brain/* and catalogs/specs in data/input/*.",
  "Write generated artifacts and logs only to data/output/*.",
  "Preserve two-pass wrapper contract: identify_arguments before execute_pipeline.",
  "Run npm run agents:validate after metadata edits."
]);
const PROJECT_SCOPE_REF = "source://project_scope";
const DEFAULT_SCOPE_PROMPT = "Keep all edits within aio project scope and local workflow files only.";

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
  if (!prompt) {
    prompt = `Use ${requiredSkillToken} for this task.`;
  } else if (!prompt.includes(requiredSkillToken)) {
    prompt = `Use ${requiredSkillToken} for this task. ${prompt}`;
  }
  if (!prompt.includes("aio project scope")) {
    prompt = `${prompt} ${DEFAULT_SCOPE_PROMPT}`;
  }
  return prompt.replace(/\s+/g, " ").trim();
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
        "    - Keep changes inside app/, brain/, data/input/, data/output/, main/, renderer/, scripts/, tests/, and to-do/.",
        "    - Keep executable runtime logic in brain/* and catalogs/specs in data/input/*.",
        "    - Write generated artifacts and logs only to data/output/*.",
        '    - "Preserve two-pass wrapper contract: identify_arguments before execute_pipeline."',
        "    - Run npm run agents:validate after metadata edits.",
        "  runtime_contract:",
        ""
      ].join("\n")
    );
  }

  text = text.replace(
    "    - Preserve two-pass wrapper contract: identify_arguments before execute_pipeline.",
    '    - "Preserve two-pass wrapper contract: identify_arguments before execute_pipeline."'
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

  writeText(filePath, text.trimEnd());
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
    text = `${text.trimEnd()}\n\n## Project Scope Guardrails\n\n- Keep changes inside \`app/\`, \`brain/\`, \`data/input/\`, \`data/output/\`, \`main/\`, \`renderer/\`, \`scripts/\`, \`tests/\`, and \`to-do/\`.\n- Keep runtime logic in \`brain/*\`; keep catalogs/specs in \`data/input/*\`; keep generated artifacts/logs in \`data/output/*\`.\n- Do not introduce cloud/deployment/provider workflows unless explicitly requested.\n- Preserve the two-pass wrapper contract (\`identify_arguments\` before \`execute_pipeline\`) when touching wrapper flows.\n- Re-run \`npm run agents:validate\` after agent/skill metadata changes.\n`;
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
      return next;
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
  let text = readText(filePath).replace(/\r?\n/g, "\n");
  if (!text.includes("\nproject_scope:\n")) {
    text = `${text.trimEnd()}\n\nproject_scope:\n  project_id: aio\n  project_name: AIO\n  policy_version: "2026-03-05"\n  allowed_roots:\n    - app/\n    - brain/\n    - data/input/\n    - data/output/\n    - main/\n    - renderer/\n    - scripts/\n    - tests/\n    - to-do/\n  runtime_contract_ref: source://runtime_model\n  wrapper_contract: two_pass_single_wrapper\n`;
  }
  writeText(filePath, text.trimEnd());
}

function updateRepeatActionRoutingJson(filePath) {
  const doc = readJson(filePath);
  doc.project_scope = {
    project_id: "aio",
    policy_version: "2026-03-05",
    allowed_roots: ALLOWED_ROOTS
  };
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
}

try {
  main();
  process.stdout.write("scope sync complete\n");
} catch (error) {
  process.stderr.write(`scope sync failed: ${error.message}\n`);
  process.exit(1);
}
