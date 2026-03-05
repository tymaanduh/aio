#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");

const SKILL_MARKER_FILENAME = ".aio-skill.json";
const MANIFEST_FILENAME = ".aio-managed.json";
const LEGACY_MARKER_FILENAMES = Object.freeze([".dictionary-desktop-skill.json"]);
const MANAGED_BY_VALUES = new Set(["aio-codex-sync", "dictionary-desktop-codex-sync"]);

function parseArgs(argv) {
  const args = {
    dryRun: argv.includes("--dry-run"),
    codexHome: "",
    strict: !argv.includes("--no-strict")
  };
  for (let idx = 0; idx < argv.length; idx += 1) {
    if (argv[idx] === "--codex-home" && argv[idx + 1]) {
      args.codexHome = String(argv[idx + 1]).trim();
      idx += 1;
    }
  }
  return args;
}

function normalizePath(value) {
  return path.resolve(String(value || "")).replace(/\\/g, "/").toLowerCase();
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

function readManagementMarker(skillDir) {
  const candidates = [SKILL_MARKER_FILENAME, ...LEGACY_MARKER_FILENAMES];
  for (const markerName of candidates) {
    const marker = readJsonIfExists(path.join(skillDir, markerName));
    if (marker && typeof marker === "object") {
      return marker;
    }
  }
  return null;
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDirectory(sourceDir, destinationDir) {
  fs.cpSync(sourceDir, destinationDir, {
    recursive: true,
    force: true
  });
}

function ensureManagedDestination(destinationSkillDir, sourceRoot) {
  if (!fs.existsSync(destinationSkillDir)) {
    return true;
  }
  const marker = readManagementMarker(destinationSkillDir);
  if (!marker || !MANAGED_BY_VALUES.has(String(marker.managed_by || ""))) {
    return false;
  }
  if (!marker.source_root) {
    return true;
  }
  const markerSourceRoot = normalizePath(marker.source_root);
  const activeSourceRoot = normalizePath(sourceRoot);
  const renamedWorkspacePathMatch =
    (markerSourceRoot.endsWith("/dicccc") && activeSourceRoot.endsWith("/aio")) ||
    (markerSourceRoot.endsWith("/aio") && activeSourceRoot.endsWith("/dicccc"));
  return markerSourceRoot === activeSourceRoot || renamedWorkspacePathMatch;
}

function listSkillDirectories(skillsRoot) {
  if (!fs.existsSync(skillsRoot)) {
    return [];
  }
  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function syncSkills({ root, codexHome, dryRun }) {
  const sourceSkillsRoot = path.join(root, "to-do", "skills");
  const destinationSkillsRoot = path.join(codexHome, "skills");
  const timestamp = new Date().toISOString();
  const report = {
    source: sourceSkillsRoot,
    destination: destinationSkillsRoot,
    synced: [],
    collisions: [],
    total: 0
  };

  const skillNames = listSkillDirectories(sourceSkillsRoot).filter((skillName) => {
    const skillMdPath = path.join(sourceSkillsRoot, skillName, "SKILL.md");
    const openAiYamlPath = path.join(sourceSkillsRoot, skillName, "agents", "openai.yaml");
    return fs.existsSync(skillMdPath) && fs.existsSync(openAiYamlPath);
  });
  report.total = skillNames.length;

  if (!dryRun) {
    ensureDirectory(destinationSkillsRoot);
  }

  skillNames.forEach((skillName) => {
    const sourceSkillDir = path.join(sourceSkillsRoot, skillName);
    const destinationSkillDir = path.join(destinationSkillsRoot, skillName);
    const canManage = ensureManagedDestination(destinationSkillDir, root);
    if (!canManage) {
      report.collisions.push({
        skill: skillName,
        destination: destinationSkillDir,
        reason: "destination exists and is not managed by this repository"
      });
      return;
    }

    if (!dryRun) {
      fs.rmSync(destinationSkillDir, { recursive: true, force: true });
      copyDirectory(sourceSkillDir, destinationSkillDir);
      fs.writeFileSync(
        path.join(destinationSkillDir, SKILL_MARKER_FILENAME),
        `${JSON.stringify(
          {
            managed_by: "aio-codex-sync",
            source_root: root,
            skill: skillName,
            synced_at: timestamp
          },
          null,
          2
        )}\n`,
        "utf8"
      );
    }

    report.synced.push(skillName);
  });

  if (!dryRun && report.collisions.length === 0) {
    fs.writeFileSync(
      path.join(destinationSkillsRoot, MANIFEST_FILENAME),
      `${JSON.stringify(
        {
          managed_by: "aio-codex-sync",
          source_root: root,
          synced_at: timestamp,
          skills: report.synced
        },
        null,
        2
      )}\n`,
      "utf8"
    );
  }

  return report;
}

function syncAgentsSnapshot({ root, codexHome, dryRun }) {
  const sourceAgentsRoot = path.join(root, "to-do", "agents");
  const sourceSkillsRoot = path.join(root, "to-do", "skills");
  const destinationAgentsRoot = path.join(codexHome, "agents", "aio");
  const timestamp = new Date().toISOString();

  const copiedFiles = [];
  if (!dryRun) {
    ensureDirectory(destinationAgentsRoot);
  }

  if (fs.existsSync(sourceAgentsRoot)) {
    const agentFiles = fs
      .readdirSync(sourceAgentsRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort();

    agentFiles.forEach((fileName) => {
      const sourceFile = path.join(sourceAgentsRoot, fileName);
      const destinationFile = path.join(destinationAgentsRoot, fileName);
      if (!dryRun) {
        fs.copyFileSync(sourceFile, destinationFile);
      }
      copiedFiles.push(`to-do/agents/${fileName}`);
    });
  }

  ["agent_workflows.json", "repeat_action_routing.json"].forEach((fileName) => {
    const sourceFile = path.join(sourceSkillsRoot, fileName);
    if (!fs.existsSync(sourceFile)) {
      return;
    }
    const destinationFile = path.join(destinationAgentsRoot, fileName);
    if (!dryRun) {
      fs.copyFileSync(sourceFile, destinationFile);
    }
    copiedFiles.push(`to-do/skills/${fileName}`);
  });

  if (!dryRun) {
    fs.writeFileSync(
      path.join(destinationAgentsRoot, "manifest.json"),
      `${JSON.stringify(
        {
          managed_by: "aio-codex-sync",
          source_root: root,
          synced_at: timestamp,
          files: copiedFiles
        },
        null,
        2
      )}\n`,
      "utf8"
    );
  }

  return {
    source_agents: sourceAgentsRoot,
    source_skills: sourceSkillsRoot,
    destination: destinationAgentsRoot,
    files: copiedFiles
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = findProjectRoot(process.cwd());
  const codexHome = path.resolve(args.codexHome || process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));

  const skillsReport = syncSkills({
    root,
    codexHome,
    dryRun: args.dryRun
  });
  const agentsReport = syncAgentsSnapshot({
    root,
    codexHome,
    dryRun: args.dryRun
  });

  const report = {
    status: skillsReport.collisions.length > 0 ? "fail" : "pass",
    mode: args.dryRun ? "dry-run" : "apply",
    root,
    codex_home: codexHome,
    skills: skillsReport,
    agents: agentsReport
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && report.status !== "pass") {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`codex-desktop-sync failed: ${error.message}\n`);
  process.exit(1);
}
