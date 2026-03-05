#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const CANONICAL_RELATIVE_PATH = path.join("to-do", "skills", "agent_workflows.json");
const SHARD_ROOT_RELATIVE_PATH = path.join("to-do", "agents", "agent_workflow_shards");
const SHARD_INDEX_RELATIVE_PATH = path.join(SHARD_ROOT_RELATIVE_PATH, "index.json");
const SHARD_AGENTS_RELATIVE_PATH = path.join(SHARD_ROOT_RELATIVE_PATH, "agents");
const DEFAULT_SCOPE_GUARDRAILS_REF = "source://scope_guardrails#default";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizePathForJson(value) {
  return String(value || "").replace(/\\/g, "/");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonIfChanged(filePath, payload) {
  const next = `${JSON.stringify(payload, null, 2)}\n`;
  if (fs.existsSync(filePath)) {
    const current = fs.readFileSync(filePath, "utf8");
    if (current === next) {
      return false;
    }
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

function sha256(text) {
  return crypto.createHash("sha256").update(String(text || "")).digest("hex");
}

function getPaths(root) {
  const canonicalPath = path.resolve(root, CANONICAL_RELATIVE_PATH);
  const shardRoot = path.resolve(root, SHARD_ROOT_RELATIVE_PATH);
  const shardIndexPath = path.resolve(root, SHARD_INDEX_RELATIVE_PATH);
  const shardAgentsPath = path.resolve(root, SHARD_AGENTS_RELATIVE_PATH);
  return {
    canonicalPath,
    shardRoot,
    shardIndexPath,
    shardAgentsPath
  };
}

function listWorkflowAgents(doc) {
  if (Array.isArray(doc && doc.agents)) {
    return doc.agents;
  }
  if (Array.isArray(doc && doc.agent_workflows)) {
    return doc.agent_workflows;
  }
  return [];
}

function normalizeScopeGuardrailsCatalog(doc) {
  const source = doc && typeof doc === "object" ? doc.scope_guardrails_catalog : null;
  const catalog = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const normalized = {};
  Object.keys(catalog).forEach((key) => {
    const entry = catalog[key];
    if (!Array.isArray(entry)) {
      return;
    }
    const values = entry.map((item) => normalizeText(item)).filter(Boolean);
    if (values.length > 0) {
      normalized[key] = values;
    }
  });
  return normalized;
}

function resolveScopeGuardrails(agent, catalog) {
  const guardrails = Array.isArray(agent && agent.scope_guardrails)
    ? agent.scope_guardrails.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  if (guardrails.length > 0) {
    return guardrails;
  }

  const ref = normalizeText(agent && agent.scope_guardrails_ref);
  if (!ref) {
    return [];
  }
  const [prefix, key] = ref.split("#");
  if (normalizeText(prefix) !== "source://scope_guardrails") {
    return [];
  }
  const catalogKey = normalizeText(key) || "default";
  const resolved = Array.isArray(catalog && catalog[catalogKey]) ? catalog[catalogKey] : [];
  return resolved.map((item) => normalizeText(item)).filter(Boolean);
}

function toShardFileName(agentId, index) {
  const base = normalizeText(agentId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (base) {
    return `${base}.json`;
  }
  return `agent_${index + 1}.json`;
}

function readCanonicalDoc(root) {
  const { canonicalPath } = getPaths(root);
  if (!fs.existsSync(canonicalPath)) {
    throw new Error(`missing canonical workflow file: ${normalizePathForJson(path.relative(root, canonicalPath))}`);
  }
  const raw = fs.readFileSync(canonicalPath, "utf8");
  const doc = JSON.parse(raw);
  const stat = fs.statSync(canonicalPath);
  return {
    path: canonicalPath,
    raw,
    doc,
    source: {
      file: normalizePathForJson(CANONICAL_RELATIVE_PATH),
      size_bytes: Number(stat.size),
      mtime_ms: Number(stat.mtimeMs),
      sha256: sha256(raw)
    }
  };
}

function readShardIndex(root) {
  const { shardIndexPath } = getPaths(root);
  if (!fs.existsSync(shardIndexPath)) {
    return null;
  }
  return readJson(shardIndexPath, null);
}

function isShardsCurrent(root) {
  const index = readShardIndex(root);
  if (!index || !index.source || typeof index.source !== "object") {
    return false;
  }
  const { canonicalPath } = getPaths(root);
  if (!fs.existsSync(canonicalPath)) {
    return false;
  }
  const stat = fs.statSync(canonicalPath);
  const expectedSize = Number(index.source.size_bytes || 0);
  const expectedMtime = Number(index.source.mtime_ms || 0);
  return Number(stat.size) === expectedSize && Number(stat.mtimeMs) === expectedMtime;
}

function buildShards(root) {
  const paths = getPaths(root);
  const canonical = readCanonicalDoc(root);
  const workflowDoc = canonical.doc && typeof canonical.doc === "object" ? canonical.doc : {};
  const workflowAgents = listWorkflowAgents(workflowDoc);
  const scopeGuardrailsCatalog = normalizeScopeGuardrailsCatalog(workflowDoc);

  ensureDir(paths.shardRoot);
  ensureDir(paths.shardAgentsPath);

  const shardEntries = [];
  const writeSet = new Set();
  const seenIds = new Set();
  let changedFiles = 0;

  workflowAgents.forEach((rawAgent, index) => {
    const agent = rawAgent && typeof rawAgent === "object" ? rawAgent : {};
    const agentId = normalizeText(agent.id || `agent-${index + 1}`);
    if (seenIds.has(agentId)) {
      throw new Error(`duplicate workflow agent id in canonical file: ${agentId}`);
    }
    seenIds.add(agentId);
    const fileName = toShardFileName(agentId, index);
    const relativeFile = normalizePathForJson(path.join("agents", fileName));
    const absoluteFile = path.join(paths.shardRoot, relativeFile);
    if (writeJsonIfChanged(absoluteFile, agent)) {
      changedFiles += 1;
    }
    writeSet.add(path.resolve(absoluteFile));
    shardEntries.push({
      id: agentId,
      file: relativeFile,
      order: index
    });
  });

  const existingFiles = fs
    .readdirSync(paths.shardAgentsPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.resolve(paths.shardAgentsPath, entry.name));

  const removedFiles = [];
  existingFiles.forEach((filePath) => {
    if (writeSet.has(filePath)) {
      return;
    }
    fs.rmSync(filePath, { force: true });
    removedFiles.push(normalizePathForJson(path.relative(root, filePath)));
  });

  const indexPayload = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    source: canonical.source,
    version: normalizeText(workflowDoc.version),
    default_agent: normalizeText(workflowDoc.default_agent),
    project_scope: workflowDoc.project_scope && typeof workflowDoc.project_scope === "object" ? workflowDoc.project_scope : {},
    agent_access_control:
      workflowDoc.agent_access_control && typeof workflowDoc.agent_access_control === "object"
        ? workflowDoc.agent_access_control
        : {},
    update_log_system:
      workflowDoc.update_log_system && typeof workflowDoc.update_log_system === "object"
        ? workflowDoc.update_log_system
        : {},
    runtime_model:
      workflowDoc.runtime_model && typeof workflowDoc.runtime_model === "object" ? workflowDoc.runtime_model : {},
    scope_guardrails_catalog: scopeGuardrailsCatalog,
    agents: shardEntries
  };

  if (writeJsonIfChanged(paths.shardIndexPath, indexPayload)) {
    changedFiles += 1;
  }

  return {
    status: "pass",
    root,
    canonical: normalizePathForJson(path.relative(root, paths.canonicalPath)),
    shard_index: normalizePathForJson(path.relative(root, paths.shardIndexPath)),
    shard_agents_root: normalizePathForJson(path.relative(root, paths.shardAgentsPath)),
    total_agents: shardEntries.length,
    changed_files: changedFiles,
    removed_files: removedFiles
  };
}

function ensureShardsCurrent(root, options = {}) {
  const force = Boolean(options.force);
  const current = !force && isShardsCurrent(root);
  if (current) {
    const paths = getPaths(root);
    const index = readJson(paths.shardIndexPath, {});
    return {
      status: "pass",
      root,
      canonical: normalizePathForJson(path.relative(root, paths.canonicalPath)),
      shard_index: normalizePathForJson(path.relative(root, paths.shardIndexPath)),
      shard_agents_root: normalizePathForJson(path.relative(root, paths.shardAgentsPath)),
      total_agents: Array.isArray(index.agents) ? index.agents.length : 0,
      changed_files: 0,
      removed_files: [],
      current: true
    };
  }
  const built = buildShards(root);
  return {
    ...built,
    current: false
  };
}

function loadWorkflowFromShards(root, options = {}) {
  const index = readShardIndex(root);
  if (!index || !Array.isArray(index.agents)) {
    return null;
  }
  const paths = getPaths(root);
  const requestedAgentIds = Array.isArray(options.agentIds)
    ? options.agentIds.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const requestedIds = requestedAgentIds.length > 0 ? new Set(requestedAgentIds) : null;
  const agents = [];
  const scopeGuardrailsCatalog = normalizeScopeGuardrailsCatalog(index);

  index.agents.forEach((entry, indexPos) => {
    const id = normalizeText(entry && entry.id);
    if (!id) {
      return;
    }
    if (requestedIds && !requestedIds.has(id)) {
      return;
    }
    const relativeFile = normalizeText(entry && entry.file);
    const fallbackFile = normalizePathForJson(path.join("agents", toShardFileName(id, indexPos)));
    const filePath = path.resolve(paths.shardRoot, relativeFile || fallbackFile);
    const agent = readJson(filePath, null);
    if (agent && typeof agent === "object") {
      const hydrated = { ...agent };
      if (!normalizeText(hydrated.scope_guardrails_ref)) {
        hydrated.scope_guardrails_ref = DEFAULT_SCOPE_GUARDRAILS_REF;
      }
      hydrated.scope_guardrails = resolveScopeGuardrails(hydrated, scopeGuardrailsCatalog);
      agents.push(hydrated);
    }
  });

  return {
    source: "shards",
    doc: {
      version: normalizeText(index.version),
      default_agent: normalizeText(index.default_agent),
      agents,
      agent_access_control:
        index.agent_access_control && typeof index.agent_access_control === "object" ? index.agent_access_control : {},
      update_log_system: index.update_log_system && typeof index.update_log_system === "object" ? index.update_log_system : {},
      runtime_model: index.runtime_model && typeof index.runtime_model === "object" ? index.runtime_model : {},
      scope_guardrails_catalog: scopeGuardrailsCatalog,
      project_scope: index.project_scope && typeof index.project_scope === "object" ? index.project_scope : {}
    },
    agent_ids: index.agents.map((entry) => normalizeText(entry && entry.id)).filter(Boolean),
    paths: {
      canonical: paths.canonicalPath,
      index: paths.shardIndexPath
    }
  };
}

function loadWorkflowFromCanonical(root, options = {}) {
  const canonical = readCanonicalDoc(root);
  const doc = canonical.doc && typeof canonical.doc === "object" ? canonical.doc : {};
  const allAgents = listWorkflowAgents(doc);
  const scopeGuardrailsCatalog = normalizeScopeGuardrailsCatalog(doc);
  const requestedAgentIds = Array.isArray(options.agentIds)
    ? options.agentIds.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const requestedIds = requestedAgentIds.length > 0 ? new Set(requestedAgentIds) : null;
  const selectedAgents = requestedIds
    ? allAgents.filter((agent) => requestedIds.has(normalizeText(agent && agent.id)))
    : allAgents;
  const agents = selectedAgents.map((agent) => {
    const hydrated = agent && typeof agent === "object" ? { ...agent } : {};
    if (!normalizeText(hydrated.scope_guardrails_ref)) {
      hydrated.scope_guardrails_ref = DEFAULT_SCOPE_GUARDRAILS_REF;
    }
    hydrated.scope_guardrails = resolveScopeGuardrails(hydrated, scopeGuardrailsCatalog);
    return hydrated;
  });
  return {
    source: "canonical",
    doc: {
      version: normalizeText(doc.version),
      default_agent: normalizeText(doc.default_agent),
      agents,
      agent_access_control: doc.agent_access_control && typeof doc.agent_access_control === "object" ? doc.agent_access_control : {},
      update_log_system: doc.update_log_system && typeof doc.update_log_system === "object" ? doc.update_log_system : {},
      runtime_model: doc.runtime_model && typeof doc.runtime_model === "object" ? doc.runtime_model : {},
      scope_guardrails_catalog: scopeGuardrailsCatalog,
      project_scope: doc.project_scope && typeof doc.project_scope === "object" ? doc.project_scope : {}
    },
    agent_ids: allAgents.map((entry) => normalizeText(entry && entry.id)).filter(Boolean),
    paths: {
      canonical: canonical.path,
      index: getPaths(root).shardIndexPath
    }
  };
}

function readWorkflowDoc(root, options = {}) {
  const opts = {
    preferShards: true,
    ensureCurrent: false,
    agentIds: [],
    ...options
  };

  if (opts.preferShards) {
    if (opts.ensureCurrent) {
      ensureShardsCurrent(root);
    }
    const sharded = loadWorkflowFromShards(root, opts);
    if (sharded) {
      return sharded;
    }
  }

  return loadWorkflowFromCanonical(root, opts);
}

module.exports = {
  CANONICAL_RELATIVE_PATH,
  SHARD_ROOT_RELATIVE_PATH,
  SHARD_INDEX_RELATIVE_PATH,
  SHARD_AGENTS_RELATIVE_PATH,
  buildShards,
  ensureShardsCurrent,
  isShardsCurrent,
  readShardIndex,
  readWorkflowDoc
};
