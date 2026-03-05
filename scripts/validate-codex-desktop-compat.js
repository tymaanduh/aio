#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { findProjectRoot } = require("./project-source-resolver");

const TOP_LEVEL_ALLOWED = new Set(["interface", "dependencies", "policy"]);
const INTERFACE_ALLOWED = new Set([
  "display_name",
  "short_description",
  "icon_small",
  "icon_large",
  "brand_color",
  "default_prompt"
]);
const INTERFACE_REQUIRED = Object.freeze(["display_name", "short_description", "default_prompt"]);

function parseArgs(argv) {
  return {
    strict: !argv.includes("--no-strict"),
    json: true
  };
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseYamlFile(filePath) {
  return yaml.load(readText(filePath));
}

function parseFrontmatter(filePath) {
  const text = readText(filePath).replace(/\r?\n/g, "\n");
  if (!text.startsWith("---\n")) {
    throw new Error("missing YAML frontmatter start delimiter");
  }
  const lines = text.split("\n");
  let endIndex = -1;
  for (let idx = 1; idx < lines.length; idx += 1) {
    if (lines[idx].trim() === "---") {
      endIndex = idx;
      break;
    }
  }
  if (endIndex < 0) {
    throw new Error("missing YAML frontmatter end delimiter");
  }
  const frontmatterText = lines.slice(1, endIndex).join("\n");
  const parsed = yaml.load(frontmatterText);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("frontmatter must be a YAML object");
  }
  return parsed;
}

function issue(level, type, detail, extra = {}) {
  return {
    level,
    type,
    detail,
    ...extra
  };
}

function validateSkill(skillRoot, skillName) {
  const issues = [];
  const skillMdPath = path.join(skillRoot, "SKILL.md");
  const openAiYamlPath = path.join(skillRoot, "agents", "openai.yaml");

  if (!fs.existsSync(skillMdPath)) {
    issues.push(issue("error", "missing_skill_md", "SKILL.md is missing", { skill: skillName }));
    return issues;
  }
  if (!fs.existsSync(openAiYamlPath)) {
    issues.push(issue("error", "missing_openai_yaml", "agents/openai.yaml is missing", { skill: skillName }));
    return issues;
  }

  try {
    const frontmatter = parseFrontmatter(skillMdPath);
    const fmName = String(frontmatter.name || "").trim();
    const fmDescription = String(frontmatter.description || "").trim();
    if (!fmName) {
      issues.push(issue("error", "missing_frontmatter_name", "frontmatter.name is empty", { skill: skillName }));
    } else if (fmName !== skillName) {
      issues.push(
        issue("error", "frontmatter_name_mismatch", "frontmatter.name must match folder name", {
          skill: skillName,
          expected: skillName,
          actual: fmName
        })
      );
    }
    if (!fmDescription) {
      issues.push(
        issue("error", "missing_frontmatter_description", "frontmatter.description is empty", { skill: skillName })
      );
    }
  } catch (error) {
    issues.push(
      issue("error", "invalid_frontmatter", "Unable to parse SKILL.md frontmatter", {
        skill: skillName,
        error: error.message
      })
    );
  }

  let openAiDoc = null;
  try {
    openAiDoc = parseYamlFile(openAiYamlPath);
  } catch (error) {
    issues.push(
      issue("error", "invalid_openai_yaml", "Unable to parse agents/openai.yaml", {
        skill: skillName,
        error: error.message
      })
    );
    return issues;
  }

  if (!openAiDoc || typeof openAiDoc !== "object" || Array.isArray(openAiDoc)) {
    issues.push(issue("error", "openai_yaml_not_object", "openai.yaml must be a YAML object", { skill: skillName }));
    return issues;
  }

  Object.keys(openAiDoc).forEach((key) => {
    if (!TOP_LEVEL_ALLOWED.has(key)) {
      issues.push(
        issue("error", "unsupported_openai_top_level_key", "Unsupported top-level key in openai.yaml", {
          skill: skillName,
          key
        })
      );
    }
  });

  const interfaceDoc =
    openAiDoc.interface && typeof openAiDoc.interface === "object" && !Array.isArray(openAiDoc.interface)
      ? openAiDoc.interface
      : null;
  if (!interfaceDoc) {
    issues.push(
      issue("error", "missing_interface_block", "openai.yaml must include interface object", {
        skill: skillName
      })
    );
    return issues;
  }

  Object.keys(interfaceDoc).forEach((key) => {
    if (!INTERFACE_ALLOWED.has(key)) {
      issues.push(
        issue("error", "unsupported_interface_key", "Unsupported interface key in openai.yaml", {
          skill: skillName,
          key
        })
      );
    }
  });

  INTERFACE_REQUIRED.forEach((fieldName) => {
    const value = interfaceDoc[fieldName];
    if (typeof value !== "string" || !value.trim()) {
      issues.push(
        issue("error", "missing_interface_field", "Required interface field is missing or empty", {
          skill: skillName,
          field: fieldName
        })
      );
    }
  });

  const prompt = String(interfaceDoc.default_prompt || "");
  const skillToken = `$${skillName}`;
  if (!prompt.includes(skillToken)) {
    issues.push(
      issue("error", "default_prompt_missing_skill_token", "default_prompt must reference the skill token", {
        skill: skillName,
        expected_token: skillToken
      })
    );
  }

  ["icon_small", "icon_large"].forEach((fieldName) => {
    const value = interfaceDoc[fieldName];
    if (typeof value !== "string" || !value.trim()) {
      return;
    }
    const resolved = path.resolve(skillRoot, value);
    if (!fs.existsSync(resolved)) {
      issues.push(
        issue("error", "missing_icon_asset", "Configured icon path does not exist", {
          skill: skillName,
          field: fieldName,
          configured_path: value
        })
      );
    }
  });

  if (openAiDoc.policy !== undefined) {
    if (!openAiDoc.policy || typeof openAiDoc.policy !== "object" || Array.isArray(openAiDoc.policy)) {
      issues.push(issue("error", "invalid_policy_block", "policy must be an object when present", { skill: skillName }));
    } else if (
      openAiDoc.policy.allow_implicit_invocation !== undefined &&
      typeof openAiDoc.policy.allow_implicit_invocation !== "boolean"
    ) {
      issues.push(
        issue("error", "invalid_allow_implicit_invocation", "policy.allow_implicit_invocation must be boolean", {
          skill: skillName
        })
      );
    }
  }

  if (openAiDoc.dependencies !== undefined) {
    if (!openAiDoc.dependencies || typeof openAiDoc.dependencies !== "object" || Array.isArray(openAiDoc.dependencies)) {
      issues.push(
        issue("error", "invalid_dependencies_block", "dependencies must be an object when present", {
          skill: skillName
        })
      );
    }
  }

  return issues;
}

function buildReport() {
  const root = findProjectRoot(process.cwd());
  const skillsRoot = path.join(root, "to-do", "skills");
  const report = {
    status: "pass",
    root,
    skills_root: path.relative(root, skillsRoot).replace(/\\/g, "/"),
    counts: {
      skills: 0,
      errors: 0,
      warnings: 0
    },
    issues: []
  };

  if (!fs.existsSync(skillsRoot)) {
    report.status = "fail";
    report.issues.push(issue("error", "missing_skills_directory", "to-do/skills directory does not exist"));
    report.counts.errors = 1;
    return report;
  }

  const skillDirs = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  report.counts.skills = skillDirs.length;
  skillDirs.forEach((skillName) => {
    const skillIssues = validateSkill(path.join(skillsRoot, skillName), skillName);
    report.issues.push(...skillIssues);
  });

  report.counts.errors = report.issues.filter((entry) => entry.level === "error").length;
  report.counts.warnings = report.issues.filter((entry) => entry.level === "warn").length;
  report.status = report.counts.errors > 0 ? "fail" : "pass";
  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = buildReport();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && report.status !== "pass") {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`validate-codex-desktop-compat failed: ${error.message}\n`);
  process.exit(1);
}
