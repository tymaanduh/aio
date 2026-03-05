#!/usr/bin/env node
"use strict";

const { findProjectRoot } = require("./project-source-resolver");
const { buildShards, ensureShardsCurrent, isShardsCurrent, readShardIndex } = require("./agent-workflow-shards");

function parseArgs(argv) {
  return {
    checkOnly: argv.includes("--check"),
    force: argv.includes("--force"),
    strict: !argv.includes("--no-strict")
  };
}

function buildCheckReport(root) {
  const current = isShardsCurrent(root);
  const index = readShardIndex(root);
  return {
    status: current ? "pass" : "fail",
    mode: "check",
    root,
    shards_current: current,
    shard_agent_count: Array.isArray(index && index.agents) ? index.agents.length : 0
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = findProjectRoot(process.cwd());
  const report = args.checkOnly
    ? buildCheckReport(root)
    : args.force
      ? {
          mode: "build",
          ...buildShards(root)
        }
      : {
          mode: "ensure",
          ...ensureShardsCurrent(root)
        };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`build-agent-workflow-shards failed: ${error.message}\n`);
    process.exit(1);
  }
}
