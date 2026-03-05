#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { findProjectRoot, listMatchingFiles, resolveAgentAccessControl } = require("./project-source-resolver");
const { readWorkflowDoc } = require("./agent-workflow-shards");

const EXPECTED_PROJECT_SCOPE_REF = "source://project_scope";
const EXPECTED_ALLOWED_ROOTS = Object.freeze([
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

function readYaml(filePath) {
  return yaml.load(fs.readFileSync(filePath, "utf8"));
}

function normalizeList(values) {
  return Array.isArray(values)
    ? values
        .map((value) => String(value))
        .slice()
        .sort()
    : [];
}

function compareArray(left, right) {
  const normalizedLeft = normalizeList(left);
  const normalizedRight = normalizeList(right);
  return JSON.stringify(normalizedLeft) === JSON.stringify(normalizedRight);
}

function buildReport() {
  const root = findProjectRoot(process.cwd());
  const registryPath = findSinglePath(root, "agents_registry.yaml");
  const { policyPath: accessPath, policy: accessControl } = resolveAgentAccessControl(root);
  const workflowLoad = readWorkflowDoc(root, {
    preferShards: true,
    ensureCurrent: true
  });
  const workflowsJson = workflowLoad.doc && typeof workflowLoad.doc === "object" ? workflowLoad.doc : {};
  const workflowsPath =
    workflowLoad.paths && workflowLoad.paths.canonical
      ? workflowLoad.paths.canonical
      : findSinglePath(root, "agent_workflows.json");

  const registry = readYaml(registryPath);

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
    access_control_agents: Object.keys(accessMap).length,
    workflow_source: workflowLoad.source || "canonical"
  };
  const registryScopeRoots = registry && registry.project_scope ? registry.project_scope.allowed_roots : [];
  const workflowScopeRoots =
    workflowsJson && workflowsJson.project_scope ? workflowsJson.project_scope.allowed_roots : [];
  const accessScopeRoots =
    accessControl && accessControl.system && accessControl.system.project_scope
      ? accessControl.system.project_scope.allowed_roots
      : [];

  if (!registry || !registry.project_scope) {
    issues.push({
      level: "error",
      type: "registry_missing_project_scope",
      detail: "agents_registry.yaml is missing project_scope"
    });
  }
  if (!workflowsJson || !workflowsJson.project_scope) {
    issues.push({
      level: "error",
      type: "workflow_missing_project_scope",
      detail: "agent_workflows.json is missing project_scope"
    });
  }
  if (!accessControl || !accessControl.system || !accessControl.system.project_scope) {
    issues.push({
      level: "error",
      type: "access_control_missing_project_scope",
      detail: "agent_access_control.json is missing system.project_scope"
    });
  }

  if (registry && registry.project_scope && !compareArray(registryScopeRoots, EXPECTED_ALLOWED_ROOTS)) {
    issues.push({
      level: "error",
      type: "registry_project_scope_roots_mismatch",
      expected_allowed_roots: EXPECTED_ALLOWED_ROOTS,
      actual_allowed_roots: normalizeList(registryScopeRoots)
    });
  }
  if (workflowsJson && workflowsJson.project_scope && !compareArray(workflowScopeRoots, EXPECTED_ALLOWED_ROOTS)) {
    issues.push({
      level: "error",
      type: "workflow_project_scope_roots_mismatch",
      expected_allowed_roots: EXPECTED_ALLOWED_ROOTS,
      actual_allowed_roots: normalizeList(workflowScopeRoots)
    });
  }
  if (
    accessControl &&
    accessControl.system &&
    accessControl.system.project_scope &&
    !compareArray(accessScopeRoots, EXPECTED_ALLOWED_ROOTS)
  ) {
    issues.push({
      level: "error",
      type: "access_control_project_scope_roots_mismatch",
      expected_allowed_roots: EXPECTED_ALLOWED_ROOTS,
      actual_allowed_roots: normalizeList(accessScopeRoots)
    });
  }

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

    const yamlScopeRef = String(agentEntry.project_scope_ref || "");
    const workflowScopeRef = String(workflowEntry.project_scope_ref || "");
    const accessScopeRef = String(accessEntry.project_scope_ref || "");
    if (!(yamlScopeRef === EXPECTED_PROJECT_SCOPE_REF && workflowScopeRef === EXPECTED_PROJECT_SCOPE_REF)) {
      issues.push({
        level: "error",
        type: "project_scope_ref_mismatch",
        agent_id: id,
        expected: EXPECTED_PROJECT_SCOPE_REF,
        yaml: yamlScopeRef,
        workflow: workflowScopeRef
      });
    }
    if (accessScopeRef !== EXPECTED_PROJECT_SCOPE_REF) {
      issues.push({
        level: "error",
        type: "project_scope_ref_mismatch",
        agent_id: id,
        expected: EXPECTED_PROJECT_SCOPE_REF,
        access_control: accessScopeRef
      });
    }

    if (!compareArray(accessEntry.allowed_paths, EXPECTED_ALLOWED_ROOTS)) {
      issues.push({
        level: "error",
        type: "access_control_allowed_paths_mismatch",
        agent_id: id,
        expected_allowed_paths: EXPECTED_ALLOWED_ROOTS,
        actual_allowed_paths: normalizeList(accessEntry.allowed_paths)
      });
    }

    if (!compareArray(agentEntry.scope_guardrails, workflowEntry.scope_guardrails)) {
      issues.push({
        level: "error",
        type: "scope_guardrails_mismatch",
        agent_id: id,
        detail: "scope_guardrails differ between agent yaml and workflow entry"
      });
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

  return {
    status: issues.some((item) => item.level === "error") ? "fail" : "pass",
    root,
    files: {
      workflows: path.relative(root, workflowsPath).replace(/\\/g, "/"),
      workflow_index:
        workflowLoad.paths && workflowLoad.paths.index
          ? path.relative(root, workflowLoad.paths.index).replace(/\\/g, "/")
          : "",
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
