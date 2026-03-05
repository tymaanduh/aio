"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { ensureShardsCurrent, isShardsCurrent, readWorkflowDoc } = require("../scripts/agent-workflow-shards");

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

test("agent workflow shards build and load by requested ids", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "aio-workflow-shards-"));
  try {
    const canonicalPath = path.join(tempRoot, "to-do", "skills", "agent_workflows.json");
    writeJson(canonicalPath, {
      version: "1.0.0",
      default_agent: "alpha-agent",
      project_scope: {
        project_id: "aio"
      },
      agents: [
        {
          id: "alpha-agent",
          role: "alpha"
        },
        {
          id: "beta-agent",
          role: "beta"
        }
      ]
    });

    const ensure = ensureShardsCurrent(tempRoot, { force: true });
    assert.equal(ensure.status, "pass");
    assert.equal(ensure.total_agents, 2);
    assert.equal(isShardsCurrent(tempRoot), true);

    const loaded = readWorkflowDoc(tempRoot, {
      preferShards: true,
      ensureCurrent: true,
      agentIds: ["alpha-agent"]
    });
    assert.equal(loaded.source, "shards");
    assert.equal(Array.isArray(loaded.doc.agents), true);
    assert.equal(loaded.doc.agents.length, 1);
    assert.equal(loaded.doc.agents[0].id, "alpha-agent");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("agent workflow shards detect stale canonical metadata", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "aio-workflow-shards-stale-"));
  try {
    const canonicalPath = path.join(tempRoot, "to-do", "skills", "agent_workflows.json");
    writeJson(canonicalPath, {
      version: "1.0.0",
      default_agent: "alpha-agent",
      agents: [
        {
          id: "alpha-agent",
          role: "alpha"
        }
      ]
    });

    ensureShardsCurrent(tempRoot, { force: true });
    assert.equal(isShardsCurrent(tempRoot), true);

    const changed = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
    changed.version = "1.0.1";
    writeJson(canonicalPath, changed);

    assert.equal(isShardsCurrent(tempRoot), false);
    const ensured = ensureShardsCurrent(tempRoot);
    assert.equal(ensured.status, "pass");
    assert.equal(isShardsCurrent(tempRoot), true);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
