"use strict";

const crypto = require("crypto");

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeList(values) {
  return [...new Set((Array.isArray(values) ? values : []).map((item) => normalizeText(item)).filter(Boolean))].sort();
}

function normalizeProfile(profile) {
  const source = profile && typeof profile === "object" && !Array.isArray(profile) ? profile : {};
  const allowedControls = normalizeList(source.allowed_controls);
  const startupTools = normalizeList(source.startup_tools);
  return {
    controls_cap: Number.isFinite(Number(source.controls_cap)) ? Number(source.controls_cap) : allowedControls.length,
    allowed_controls: allowedControls,
    startup_tools: startupTools,
    startup_tool_cap: Number.isFinite(Number(source.startup_tool_cap)) ? Number(source.startup_tool_cap) : startupTools.length
  };
}

function profileSignature(profile) {
  const normalized = normalizeProfile(profile);
  return JSON.stringify(normalized);
}

function stableProfileId(signature) {
  return `profile_${crypto.createHash("sha1").update(String(signature || "")).digest("hex").slice(0, 12)}`;
}

function expandAccessPolicy(policy) {
  const source = policy && typeof policy === "object" && !Array.isArray(policy) ? policy : {};
  const profilesSource =
    source.profiles && typeof source.profiles === "object" && !Array.isArray(source.profiles) ? source.profiles : {};
  const profiles = {};
  Object.keys(profilesSource).forEach((profileId) => {
    const key = normalizeText(profileId);
    if (!key) {
      return;
    }
    profiles[key] = normalizeProfile(profilesSource[profileId]);
  });

  const agentsSource = source.agents && typeof source.agents === "object" && !Array.isArray(source.agents) ? source.agents : {};
  const agents = {};

  Object.keys(agentsSource).forEach((agentId) => {
    const key = normalizeText(agentId);
    if (!key) {
      return;
    }
    const entry = agentsSource[agentId] && typeof agentsSource[agentId] === "object" ? agentsSource[agentId] : {};
    const profileRef = normalizeText(entry.profile_ref);
    const profile = profileRef && profiles[profileRef] ? profiles[profileRef] : {};
    const merged = {
      controls_cap: entry.controls_cap,
      allowed_controls: entry.allowed_controls,
      startup_tools: entry.startup_tools,
      startup_tool_cap: entry.startup_tool_cap
    };
    const normalized = normalizeProfile({
      controls_cap: Number.isFinite(Number(merged.controls_cap)) ? merged.controls_cap : profile.controls_cap,
      allowed_controls: Array.isArray(merged.allowed_controls) ? merged.allowed_controls : profile.allowed_controls,
      startup_tools: Array.isArray(merged.startup_tools) ? merged.startup_tools : profile.startup_tools,
      startup_tool_cap: Number.isFinite(Number(merged.startup_tool_cap))
        ? merged.startup_tool_cap
        : profile.startup_tool_cap
    });
    agents[key] = {
      ...entry,
      ...normalized,
      ...(profileRef ? { profile_ref: profileRef } : {})
    };
  });

  return {
    ...source,
    profiles,
    agents
  };
}

function compactAccessPolicy(policy) {
  const expanded = expandAccessPolicy(policy);
  const agents = expanded.agents && typeof expanded.agents === "object" && !Array.isArray(expanded.agents) ? expanded.agents : {};
  const profiles = {};
  const signatureToProfileId = new Map();
  const compactAgents = {};

  Object.keys(agents)
    .sort((left, right) => left.localeCompare(right))
    .forEach((agentId) => {
      const entry = agents[agentId] && typeof agents[agentId] === "object" ? agents[agentId] : {};
      const profilePayload = normalizeProfile(entry);
      const signature = profileSignature(profilePayload);
      let profileId = signatureToProfileId.get(signature);
      if (!profileId) {
        const baseProfileId = stableProfileId(signature);
        profileId = baseProfileId;
        let collisionIndex = 2;
        while (Object.prototype.hasOwnProperty.call(profiles, profileId)) {
          if (profileSignature(profiles[profileId]) === signature) {
            break;
          }
          profileId = `${baseProfileId}_${collisionIndex}`;
          collisionIndex += 1;
        }
        profiles[profileId] = profilePayload;
        signatureToProfileId.set(signature, profileId);
      }

      compactAgents[agentId] = {
        role: normalizeText(entry.role),
        profile_ref: profileId,
        project_scope_ref: normalizeText(entry.project_scope_ref),
        allowed_paths_ref: normalizeText(entry.allowed_paths_ref),
        ...(Array.isArray(entry.allowed_paths) && entry.allowed_paths.length > 0
          ? { allowed_paths: normalizeList(entry.allowed_paths) }
          : {})
      };
    });

  return {
    ...expanded,
    profiles,
    agents: compactAgents
  };
}

module.exports = {
  compactAccessPolicy,
  expandAccessPolicy,
  normalizeList,
  normalizeProfile,
  profileSignature,
  stableProfileId
};
