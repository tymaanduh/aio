"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("../project-source-resolver");

const DEFAULT_ROUTING_FILE = path.join("to-do", "skills", "repeat_action_routing.json");

function normalizeText(value) {
  return String(value || "").trim();
}

function dedupeCaseInsensitive(values) {
  const seen = new Set();
  return (Array.isArray(values) ? values : [])
    .map((entry) => normalizeText(entry))
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

function stableStackId(signature) {
  return `stack_${crypto.createHash("sha1").update(String(signature || "")).digest("hex").slice(0, 12)}`;
}

function normalizeSkillStacks(doc) {
  const source = doc && typeof doc === "object" && !Array.isArray(doc) ? doc.skill_stacks : {};
  const map = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const normalized = {};
  Object.keys(map).forEach((stackId) => {
    const key = normalizeText(stackId);
    const skills = normalizeSkills(map[stackId]);
    if (!key || !skills.length) {
      return;
    }
    normalized[key] = skills;
  });
  return normalized;
}

function resolveRuleSkills(rule, docOrStacks) {
  if (Array.isArray(rule && rule.skills)) {
    return normalizeSkills(rule.skills);
  }
  const ref = normalizeText(rule && rule.skills_ref);
  if (!ref) {
    return [];
  }
  const stacks =
    docOrStacks && typeof docOrStacks === "object" && !Array.isArray(docOrStacks)
      ? docOrStacks.skill_stacks && typeof docOrStacks.skill_stacks === "object"
        ? docOrStacks.skill_stacks
        : docOrStacks
      : {};
  const values = Array.isArray(stacks[ref]) ? stacks[ref] : [];
  return normalizeSkills(values);
}

function upsertSkillStack(doc, skills) {
  const next = doc && typeof doc === "object" && !Array.isArray(doc) ? doc : {};
  if (!next.skill_stacks || typeof next.skill_stacks !== "object" || Array.isArray(next.skill_stacks)) {
    next.skill_stacks = {};
  }
  const normalizedSkills = normalizeSkills(skills);
  const signature = skillSignature(normalizedSkills);
  if (!signature) {
    return "";
  }

  const existingIds = Object.keys(next.skill_stacks);
  for (let index = 0; index < existingIds.length; index += 1) {
    const stackId = existingIds[index];
    const stackSignature = skillSignature(next.skill_stacks[stackId]);
    if (stackSignature === signature) {
      next.skill_stacks[stackId] = normalizeSkills(next.skill_stacks[stackId]);
      return stackId;
    }
  }

  const preferredId = stableStackId(signature);
  let finalId = preferredId;
  let collisionIndex = 2;
  while (Object.prototype.hasOwnProperty.call(next.skill_stacks, finalId)) {
    const existingSignature = skillSignature(next.skill_stacks[finalId]);
    if (existingSignature === signature) {
      return finalId;
    }
    finalId = `${preferredId}_${collisionIndex}`;
    collisionIndex += 1;
  }
  next.skill_stacks[finalId] = normalizedSkills;
  return finalId;
}

function compactRoutingDoc(doc) {
  const source = doc && typeof doc === "object" && !Array.isArray(doc) ? doc : {};
  const next = {
    ...source,
    skill_stacks: normalizeSkillStacks(source)
  };

  const usedStackIds = new Set();

  const keywordRules = Array.isArray(source.keyword_rules) ? source.keyword_rules : [];
  next.keyword_rules = keywordRules.map((rule) => {
    const resolvedSkills = resolveRuleSkills(rule, next.skill_stacks);
    const stackId = upsertSkillStack(next, resolvedSkills);
    if (stackId) {
      usedStackIds.add(stackId);
    }
    return {
      keywords: dedupeCaseInsensitive(rule && rule.keywords),
      ...(stackId ? { skills_ref: stackId } : {})
    };
  });

  const pathRules = Array.isArray(source.path_rules) ? source.path_rules : [];
  next.path_rules = pathRules.map((rule) => {
    const resolvedSkills = resolveRuleSkills(rule, next.skill_stacks);
    const stackId = upsertSkillStack(next, resolvedSkills);
    if (stackId) {
      usedStackIds.add(stackId);
    }
    return {
      paths: dedupeCaseInsensitive(rule && rule.paths),
      ...(stackId ? { skills_ref: stackId } : {})
    };
  });

  const compactStacks = {};
  Object.keys(next.skill_stacks)
    .sort((left, right) => left.localeCompare(right))
    .forEach((stackId) => {
      if (!usedStackIds.has(stackId)) {
        return;
      }
      compactStacks[stackId] = normalizeSkills(next.skill_stacks[stackId]);
    });
  next.skill_stacks = compactStacks;

  return next;
}

function resolveRoutingDoc(doc) {
  const source = doc && typeof doc === "object" && !Array.isArray(doc) ? doc : {};
  const skillStacks = normalizeSkillStacks(source);
  const resolved = {
    ...source,
    skill_stacks: skillStacks
  };
  resolved.keyword_rules = (Array.isArray(source.keyword_rules) ? source.keyword_rules : []).map((rule) => ({
    ...rule,
    keywords: dedupeCaseInsensitive(rule && rule.keywords),
    skills: resolveRuleSkills(rule, skillStacks)
  }));
  resolved.path_rules = (Array.isArray(source.path_rules) ? source.path_rules : []).map((rule) => ({
    ...rule,
    paths: dedupeCaseInsensitive(rule && rule.paths),
    skills: resolveRuleSkills(rule, skillStacks)
  }));
  return resolved;
}

function readRoutingPolicy(startDir, options = {}) {
  const root = findProjectRoot(startDir || process.cwd());
  const relPath = normalizeText(options.routingFile || DEFAULT_ROUTING_FILE);
  const routingPath = path.resolve(root, relPath);
  if (!fs.existsSync(routingPath)) {
    throw new Error(`missing routing file: ${relPath.replace(/\\/g, "/")}`);
  }
  const rawDoc = JSON.parse(fs.readFileSync(routingPath, "utf8"));
  return {
    root,
    routingPath,
    doc: resolveRoutingDoc(rawDoc),
    rawDoc
  };
}

module.exports = {
  DEFAULT_ROUTING_FILE,
  compactRoutingDoc,
  dedupeCaseInsensitive,
  normalizeSkillStacks,
  normalizeSkills,
  readRoutingPolicy,
  resolveRoutingDoc,
  resolveRuleSkills,
  skillSignature,
  upsertSkillStack
};
