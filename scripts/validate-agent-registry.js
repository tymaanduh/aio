#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const {
  findProjectRoot,
  listMatchingFiles,
  resolveAgentAccessControl
} = require("./project-source-resolver");

function parseArgs(argv) {
  return {
    strict: !argv.includes("--no-strict"),
    json: argv.includes("--json")
  };
}

function findSinglePath(root, filename) {
  const matches = listMatchingFiles(root, filename);
  if (!matches.length) {
    throw new Error(`unable to locate ${filename} in project scope`);
  }
  return matches[0];
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readYaml(filePath) {
  return yaml.load(fs.readFileSync(filePath, "utf8"));
}

function normalizeList(values) {
  return Array.isArray(values) ? values.map((value) => String(value)).slice().sort() : [];
}

function compareArray(left, right) {
  const normalizedLeft = normalizeList(left);
  const normalizedRight = normalizeList(right);
  return JSON.stringify(normalizedLeft) === JSON.stringify(normalizedRight);
}

function buildSkillCatalog(skillsRoot) {
  const catalog = new Map();
  if (!fs.existsSync(skillsRoot)) {
    return catalog;
  }

  const entries = fs.readdirSync(skillsRoot, { withFileTypes: true });
  entries.forEach((entry) => {
    if (!entry.isDirectory()) {
      return;
    }
    if (entry.name === ".system") {
      const systemRoot = path.join(skillsRoot, entry.name);
      const systemEntries = fs.readdirSync(systemRoot, { withFileTypes: true });
      systemEntries.forEach((systemEntry) => {
        if (!systemEntry.isDirectory()) {
          return;
        }
        const skillId = String(systemEntry.name || "").trim();
        const skillPath = path.join(systemRoot, skillId, "SKILL.md");
        if (skillId && fs.existsSync(skillPath)) {
          catalog.set(skillId, skillPath);
        }
      });
      return;
    }

    const skillId = String(entry.name || "").trim();
    const skillPath = path.join(skillsRoot, skillId, "SKILL.md");
    if (skillId && fs.existsSync(skillPath)) {
      catalog.set(skillId, skillPath);
    }
  });

  return catalog;
}

function pushCapIssues(issues, sourceLabel, agentId, capName, values, level = "error") {
  const cap = Number(values && values[capName] ? values[capName] : 0);
  const list =
    capName === "startup_tool_cap"
      ? Array.isArray(values && values.startup_tools)
        ? values.startup_tools
        : []
      : Array.isArray(values && values.allowed_controls)
        ? values.allowed_controls
        : [];
  if (cap < list.length) {
    issues.push({
      level,
      type: "cap_violation",
      source: sourceLabel,
      agent_id: agentId,
      cap_field: capName,
      cap,
      list_count: list.length
    });
  }
}

function buildReport() {
  const root = findProjectRoot(process.cwd());
  const workflowsPath = findSinglePath(root, "agent_workflows.json");
  const registryPath = findSinglePath(root, "agents_registry.yaml");
  const { policyPath: accessPath, policy: accessControl } = resolveAgentAccessControl(root);

  const registry = readYaml(registryPath);
  const workflowsJson = readJson(workflowsPath);

  const workflowList = Array.isArray(workflowsJson.agents)
    ? workflowsJson.agents
    : Array.isArray(workflowsJson.agent_workflows)
      ? workflowsJson.agent_workflows
      : [];
  const workflowMap = new Map(workflowList.map((entry) => [entry.id, entry]));

  const agentsDir = path.dirname(registryPath);
  const agentFiles = fs
    .readdirSync(agentsDir)
    .filter((name) => name.endsWith(".yaml") && name !== path.basename(registryPath))
    .sort();

  const yamlAgents = agentFiles
    .map((name) => readYaml(path.join(agentsDir, name)))
    .map((loaded) => loaded && loaded.agent)
    .filter(Boolean);

  const registryAgents = Array.isArray(registry && registry.agents) ? registry.agents.map((id) => String(id)) : [];
  const registrySet = new Set(registryAgents);
  const accessMap = accessControl && accessControl.agents ? accessControl.agents : {};
  const issues = [];
  const counts = {
    yaml_agent_files: yamlAgents.length,
    registry_agents: registryAgents.length,
    workflow_agents: workflowList.length,
    access_control_agents: Object.keys(accessMap).length
  };

  yamlAgents.forEach((agentEntry) => {
    const id = String(agentEntry.id || "");
    if (!id) {
      issues.push({
        level: "error",
        type: "missing_agent_id",
        detail: "agent yaml file missing agent.id"
      });
      return;
    }

    if (!registrySet.has(id)) {
      issues.push({
        level: "error",
        type: "registry_missing_agent",
        agent_id: id,
        detail: "agent id is missing in agents_registry.yaml"
      });
    }

    const workflowEntry = workflowMap.get(id);
    if (!workflowEntry) {
      issues.push({
        level: "error",
        type: "workflow_missing_agent",
        agent_id: id,
        detail: "agent id is missing in agent_workflows.json"
      });
    }

    const accessEntry = accessMap[id];
    if (!accessEntry) {
      issues.push({
        level: "error",
        type: "access_control_missing_agent",
        agent_id: id,
        detail: "agent id is missing in agent_access_control.json"
      });
    }

    if (!workflowEntry || !accessEntry) {
      return;
    }

    const fieldChecks = [
      ["role", "string"],
      ["controls_cap", "number"],
      ["startup_tool_cap", "number"]
    ];
    fieldChecks.forEach(([fieldName, fieldType]) => {
      const yamlValue = agentEntry[fieldName];
      const workflowValue = workflowEntry[fieldName];
      const accessValue = accessEntry[fieldName];
      const left = fieldType === "number" ? Number(yamlValue || 0) : String(yamlValue || "");
      const mid = fieldType === "number" ? Number(workflowValue || 0) : String(workflowValue || "");
      const right = fieldType === "number" ? Number(accessValue || 0) : String(accessValue || "");
      if (!(left === mid && left === right)) {
        issues.push({
          level: "error",
          type: "field_mismatch",
          agent_id: id,
          field: fieldName,
          yaml: left,
          workflow: mid,
          access_control: right
        });
      }
    });

    if (!compareArray(agentEntry.allowed_controls, workflowEntry.allowed_controls)) {
      issues.push({
        level: "error",
        type: "allowed_controls_mismatch",
        agent_id: id,
        detail: "allowed_controls differ between agent yaml and workflow entry"
      });
    }
    if (!compareArray(agentEntry.allowed_controls, accessEntry.allowed_controls)) {
      issues.push({
        level: "error",
        type: "allowed_controls_mismatch",
        agent_id: id,
        detail: "allowed_controls differ between agent yaml and access control entry"
      });
    }
    if (!compareArray(agentEntry.startup_tools, workflowEntry.startup_tools)) {
      issues.push({
        level: "error",
        type: "startup_tools_mismatch",
        agent_id: id,
        detail: "startup_tools differ between agent yaml and workflow entry"
      });
    }
    if (!compareArray(agentEntry.startup_tools, accessEntry.startup_tools)) {
      issues.push({
        level: "error",
        type: "startup_tools_mismatch",
        agent_id: id,
        detail: "startup_tools differ between agent yaml and access control entry"
      });
    }

    if (!compareArray(agentEntry.skill_stack, workflowEntry.skill_stack)) {
      issues.push({
        level: "error",
        type: "skill_stack_mismatch",
        agent_id: id,
        detail: "skill_stack differs between agent yaml and workflow entry"
      });
    }

    const skillCatalog = buildSkillCatalog(path.dirname(workflowsPath));
    const stackedSkills = normalizeList([...(agentEntry.skill_stack || []), ...(workflowEntry.skill_stack || [])]);
    stackedSkills.forEach((skillId) => {
      if (!skillCatalog.has(skillId)) {
        issues.push({
          level: "error",
          type: "missing_skill_definition",
          agent_id: id,
          skill_id: skillId,
          detail: "skill id referenced by agent but SKILL.md not found under to-do/skills"
        });
      }
    });

    pushCapIssues(issues, "agent_yaml", id, "startup_tool_cap", agentEntry);
    pushCapIssues(issues, "workflow_json", id, "startup_tool_cap", workflowEntry);
    pushCapIssues(issues, "access_control", id, "startup_tool_cap", accessEntry);
    pushCapIssues(issues, "agent_yaml", id, "controls_cap", agentEntry);
    pushCapIssues(issues, "workflow_json", id, "controls_cap", workflowEntry);
    pushCapIssues(issues, "access_control", id, "controls_cap", accessEntry);
  });

  const yamlIds = new Set(yamlAgents.map((agentEntry) => String(agentEntry.id || "")));
  registryAgents.forEach((id) => {
    if (!yamlIds.has(String(id))) {
      issues.push({
        level: "warn",
        type: "registry_orphan_agent",
        agent_id: id,
        detail: "agent id exists in registry but no matching yaml file was found"
      });
    }
  });

  workflowList.forEach((entry) => {
    const id = String(entry.id || "");
    if (id && !yamlIds.has(id)) {
      issues.push({
        level: "warn",
        type: "workflow_orphan_agent",
        agent_id: id,
        detail: "agent id exists in workflow but no matching yaml file was found"
      });
    }
  });

  Object.keys(accessMap).forEach((id) => {
    if (!yamlIds.has(String(id))) {
      issues.push({
        level: "warn",
        type: "access_control_orphan_agent",
        agent_id: id,
        detail: "agent id exists in access control but no matching yaml file was found"
      });
    }
  });

  const versionTriplet = {
    registry: String((registry && registry.version) || ""),
    workflows: String((workflowsJson && workflowsJson.version) || ""),
    access_control: String((accessControl && accessControl.version) || "")
  };
  if (!(versionTriplet.registry && versionTriplet.workflows && versionTriplet.access_control)) {
    issues.push({
      level: "warn",
      type: "version_missing",
      detail: "one or more governance files do not declare version"
    });
  } else if (!(versionTriplet.registry === versionTriplet.workflows && versionTriplet.registry === versionTriplet.access_control)) {
    issues.push({
      level: "warn",
      type: "version_mismatch",
      detail: "version differs across registry/workflows/access_control",
      versions: versionTriplet
    });
  }

  return {
    status: issues.some((item) => item.level === "error") ? "fail" : "pass",
    root,
    files: {
      workflows: path.relative(root, workflowsPath).replace(/\\/g, "/"),
      registry: path.relative(root, registryPath).replace(/\\/g, "/"),
      access_control: path.relative(root, accessPath).replace(/\\/g, "/")
    },
    counts,
    issues
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = buildReport();
  const output = JSON.stringify(report, null, 2);
  process.stdout.write(`${output}\n`);

  if (args.strict && report.status !== "pass") {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`validate-agent-registry failed: ${error.message}\n`);
  process.exit(1);
}
