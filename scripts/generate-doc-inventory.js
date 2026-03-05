#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");
const OUTPUT_PATH = path.join(DOCS_DIR, "inventory.index.json");

const SCOPE_PATHS = Object.freeze([
  "app",
  "renderer",
  "main",
  "brain",
  "scripts",
  "data/input/shared",
  "tests",
  "to-do/agents",
  "to-do/skills"
]);

const EXCLUDED_PATHS = Object.freeze([
  "node_modules",
  "dist",
  "native/dx12/build",
  "native/dx12/build-mingw"
]);

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function unique(values) {
  return Array.from(new Set(toArray(values).filter(Boolean)));
}

function rel(p) {
  return normalizePath(path.relative(ROOT, p));
}

function toLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getTrackedFiles() {
  const command = `git ls-files ${SCOPE_PATHS.join(" ")}`;
  const stdout = execSync(command, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }).toString("utf8");
  return toLines(stdout).map(normalizePath);
}

function detectSubsystem(filePath) {
  if (filePath.startsWith("app/") || filePath.startsWith("renderer/")) {
    return "App shell/UI";
  }
  if (filePath.startsWith("main/")) {
    return "Main process/IPC/services";
  }
  if (filePath.startsWith("brain/")) {
    return "Brain modules/wrappers/math";
  }
  if (filePath.startsWith("data/input/shared/")) {
    return "Data catalogs/contracts";
  }
  if (filePath.startsWith("scripts/")) {
    return "Pipeline/gates/release scripts";
  }
  if (filePath.startsWith("to-do/agents/") || filePath.startsWith("to-do/skills/")) {
    return "Governance/agents/skills";
  }
  if (filePath.startsWith("tests/")) {
    return "Test suite";
  }
  return "Pipeline/gates/release scripts";
}

const FEATURE_DEFS = Object.freeze([
  {
    feature_id: "feature_app_legacy_shell",
    feature_name: "Legacy app shell UI",
    user_value: "Maintains legacy shell compatibility and app chrome behavior.",
    entrypoints: ["window", "main"],
    status: "active",
    subsystem: "App shell/UI",
    matcher: (p) => p.startsWith("app/")
  },
  {
    feature_id: "feature_renderer_boot_lifecycle",
    feature_name: "Renderer lifecycle bootstrap",
    user_value: "Deterministic app/page/control load order across renderer windows.",
    entrypoints: ["window", "page", "control"],
    status: "active",
    subsystem: "App shell/UI",
    matcher: (p) => p.startsWith("renderer/boot/")
  },
  {
    feature_id: "feature_renderer_window_shells",
    feature_name: "Renderer window shells",
    user_value: "Main/log window host shells and view wiring.",
    entrypoints: ["window"],
    status: "active",
    subsystem: "App shell/UI",
    matcher: (p) => p.startsWith("renderer/windows/") || p.startsWith("renderer/views/")
  },
  {
    feature_id: "feature_renderer_core_runtime",
    feature_name: "Renderer core runtime registries",
    user_value: "Centralized constants, registries, and DOM dictionaries for renderer behavior.",
    entrypoints: ["page", "control"],
    status: "active",
    subsystem: "App shell/UI",
    matcher: (p) => p.startsWith("renderer/core/") || p.startsWith("renderer/styles/")
  },
  {
    feature_id: "feature_renderer_control_plane",
    feature_name: "Renderer control modules",
    user_value: "Command palette, graph, tree, and universe controls.",
    entrypoints: ["control"],
    status: "active",
    subsystem: "App shell/UI",
    matcher: (p) => p.startsWith("renderer/controls/")
  },
  {
    feature_id: "feature_renderer_page_plane",
    feature_name: "Renderer page modules",
    user_value: "Workbench, sentence graph, statistics, and universe page lifecycle logic.",
    entrypoints: ["page"],
    status: "active",
    subsystem: "App shell/UI",
    matcher: (p) => p.startsWith("renderer/pages/")
  },
  {
    feature_id: "feature_renderer_workers",
    feature_name: "Renderer workers",
    user_value: "Background worker execution for heavy renderer computations.",
    entrypoints: ["page"],
    status: "active",
    subsystem: "App shell/UI",
    matcher: (p) => p.startsWith("renderer/workers/")
  },
  {
    feature_id: "feature_main_boot_lifecycle",
    feature_name: "Main process boot lifecycle",
    user_value: "Ensures pre-load/post-load and app boot orchestration is deterministic.",
    entrypoints: ["main", "window"],
    status: "active",
    subsystem: "Main process/IPC/services",
    matcher: (p) => p.startsWith("main/boot/")
  },
  {
    feature_id: "feature_main_data_repositories",
    feature_name: "Main data repository layer",
    user_value: "Persistent state, migration, and domain repository management.",
    entrypoints: ["main", "service"],
    status: "active",
    subsystem: "Main process/IPC/services",
    matcher: (p) => p.startsWith("main/data/") || p === "main/data-io.js"
  },
  {
    feature_id: "feature_main_ipc_routing",
    feature_name: "Main IPC contract and routing",
    user_value: "Stable channel contract across auth/data/diagnostics/universe/storage/UI/bridge/gpu/runtime log.",
    entrypoints: ["main", "service"],
    status: "active",
    subsystem: "Main process/IPC/services",
    matcher: (p) => p.startsWith("main/ipc/") || p === "main/ipc-contract.js"
  },
  {
    feature_id: "feature_main_domain_services",
    feature_name: "Main domain services and normalization",
    user_value: "Service adapters and normalization pipelines for safe state handling.",
    entrypoints: ["main", "service"],
    status: "active",
    subsystem: "Main process/IPC/services",
    matcher: (p) =>
      p.startsWith("main/services/") ||
      p.startsWith("main/normalize") ||
      p === "main/auth.js" ||
      p === "main/gpu-config.js" ||
      p === "main/runtime-log.js"
  },
  {
    feature_id: "feature_main_window_management",
    feature_name: "Main window management",
    user_value: "Main/log window creation, hooks, and registry control.",
    entrypoints: ["main", "window"],
    status: "active",
    subsystem: "Main process/IPC/services",
    matcher: (p) => p.startsWith("main/windows/")
  },
  {
    feature_id: "feature_brain_math_engine",
    feature_name: "Brain math engine",
    user_value: "Math primitives and assembly-line operation execution.",
    entrypoints: ["service", "script"],
    status: "active",
    subsystem: "Brain modules/wrappers/math",
    matcher: (p) => p.startsWith("brain/math/")
  },
  {
    feature_id: "feature_brain_modules",
    feature_name: "Brain module utility layer",
    user_value: "Shared renderer/data utility modules and domain helpers.",
    entrypoints: ["service", "script"],
    status: "active",
    subsystem: "Brain modules/wrappers/math",
    matcher: (p) => p.startsWith("brain/modules/") || p === "brain/README.md"
  },
  {
    feature_id: "feature_brain_renderer_wrappers",
    feature_name: "Brain renderer domain wrappers",
    user_value: "Domain wrapper orchestration for renderer actions and dispatch.",
    entrypoints: ["service", "script"],
    status: "active",
    subsystem: "Brain modules/wrappers/math",
    matcher: (p) => p.startsWith("brain/wrappers/renderer_")
  },
  {
    feature_id: "feature_brain_unified_wrapper",
    feature_name: "Unified two-pass wrapper runtime",
    user_value: "Single wrapper entrypoint for identify-then-execute pipelines.",
    entrypoints: ["service", "script"],
    status: "active",
    subsystem: "Brain modules/wrappers/math",
    matcher: (p) => p === "brain/wrappers/unified_io_wrapper.js"
  },
  {
    feature_id: "feature_data_shared_catalogs",
    feature_name: "Shared input catalog system",
    user_value: "Source-of-truth catalogs for IPC, renderer, wrapper, math, and main contracts.",
    entrypoints: ["main", "service", "script"],
    status: "active",
    subsystem: "Data catalogs/contracts",
    matcher: (p) => p.startsWith("data/input/shared/")
  },
  {
    feature_id: "feature_pipeline_orchestration",
    feature_name: "Pipeline orchestration scripts",
    user_value: "Default workflow orchestration, planning, and maintain pipeline control.",
    entrypoints: ["script"],
    status: "active",
    subsystem: "Pipeline/gates/release scripts",
    matcher: (p) =>
      p === "scripts/general-workflow.js" ||
      p === "scripts/polyglot-default-pipeline.js" ||
      p === "scripts/project-source-resolver.js"
  },
  {
    feature_id: "feature_quality_gates_and_release",
    feature_name: "Quality gates and release evidence",
    user_value: "Premerge, refactor, smoke, release evidence, and candidate gating.",
    entrypoints: ["script"],
    status: "active",
    subsystem: "Pipeline/gates/release scripts",
    matcher: (p) =>
      p === "scripts/premerge-checklist.js" ||
      p === "scripts/refactor-blocking-gate.js" ||
      p === "scripts/smoke-checklist.js" ||
      p === "scripts/release-evidence-bundle.js" ||
      p === "scripts/release-candidate-bundle.js" ||
      p === "scripts/commit-slice-report.js" ||
      p === "scripts/data-separation-audit.js"
  },
  {
    feature_id: "feature_pipeline_support_tools",
    feature_name: "Pipeline support tooling",
    user_value: "Auxiliary tooling for wrapper runs, update scans, and quick checks.",
    entrypoints: ["script"],
    status: "internal",
    subsystem: "Pipeline/gates/release scripts",
    matcher: (p) =>
      p === "scripts/run-unified-wrapper.js" ||
      p === "scripts/repo-update-log.js" ||
      p === "scripts/quick-check.js" ||
      p === "scripts/raw-storage-harness.js" ||
      p === "scripts/agent-access-request.js" ||
      p === "scripts/run-electron.js" ||
      p === "scripts/validate-agent-registry.js"
  },
  {
    feature_id: "feature_dx12_toolchain",
    feature_name: "DX12 and GPU setup tooling",
    user_value: "Local DX12 environment setup and diagnostic helper scripts.",
    entrypoints: ["script"],
    status: "experimental",
    subsystem: "Pipeline/gates/release scripts",
    matcher: (p) => p.startsWith("scripts/dx12")
  },
  {
    feature_id: "feature_pipeline_misc_scripts",
    feature_name: "Miscellaneous pipeline scripts",
    user_value: "Supporting automation scripts that do not fall into core orchestration or gate bundles.",
    entrypoints: ["script"],
    status: "internal",
    subsystem: "Pipeline/gates/release scripts",
    matcher: (p) => p.startsWith("scripts/")
  },
  {
    feature_id: "feature_governance_agent_registry",
    feature_name: "Agent governance registry",
    user_value: "Defines agent contracts, permissions, and registry linkage.",
    entrypoints: ["script"],
    status: "staging",
    subsystem: "Governance/agents/skills",
    matcher: (p) => p.startsWith("to-do/agents/")
  },
  {
    feature_id: "feature_governance_skill_registry",
    feature_name: "Skill governance registry",
    user_value: "Maintains skill definitions, workflow routing, and policy metadata.",
    entrypoints: ["script"],
    status: "staging",
    subsystem: "Governance/agents/skills",
    matcher: (p) => p.startsWith("to-do/skills/")
  },
  {
    feature_id: "feature_test_suite",
    feature_name: "Automated test suite",
    user_value: "Regression coverage for runtime modules, wrappers, IPC routes, and gate scripts.",
    entrypoints: ["script"],
    status: "active",
    subsystem: "Test suite",
    matcher: (p) => p.startsWith("tests/")
  }
]);

const FEATURE_META = Object.freeze({
  feature_main_ipc_routing: {
    runtime_dependencies: ["main/ipc/*", "preload.js", "data/input/shared/ipc/*"],
    ipc_channels: ["AUTH_*", "DICTIONARY_*", "DIAGNOSTICS_*", "UNIVERSE_*", "STORAGE_*", "BRIDGE_*", "GPU_*"],
    "storage_keys/files": [],
    commands: [],
    test_patterns: [/tests\/ipc-route-.*\.test\.js$/, /tests\/preload-api-catalog-storage\.test\.js$/],
    risk_notes: ["Channel drift between preload catalog and route registration can break runtime invocation."]
  },
  feature_main_data_repositories: {
    runtime_dependencies: ["main/data/*", "data/input/shared/main/*"],
    ipc_channels: ["DICTIONARY_LOAD", "DICTIONARY_SAVE", "STORAGE_*"],
    "storage_keys/files": ["app_state.json", "auth_state.json", "diagnostics_state.json", "universe_cache.json", "ui_preferences.json", "language_bridge_state.json"],
    commands: ["npm run raw-storage:harness"],
    test_patterns: [/tests\/repository-raw-storage\.test\.js$/, /tests\/migration-utils\.test\.js$/, /tests\/ui-preferences-utils\.test\.js$/],
    risk_notes: ["Migration/default regressions can corrupt persisted local state if not covered by tests."]
  },
  feature_quality_gates_and_release: {
    runtime_dependencies: ["scripts/premerge-checklist.js", "scripts/refactor-blocking-gate.js", "scripts/release-*.js", "data/output/databases/polyglot-default/reports/*"],
    ipc_channels: [],
    "storage_keys/files": ["smoke_checklist_report.json", "release_evidence_bundle.json", "release_candidate_bundle.json", "commit_slice_report.json"],
    commands: ["npm run premerge:checklist", "npm run release:evidence", "npm run release:candidate"],
    test_patterns: [/tests\/smoke-checklist\.test\.js$/, /tests\/release-candidate-bundle\.test\.js$/],
    risk_notes: ["Stale smoke evidence can cause false confidence unless freshness policy is enforced."]
  },
  feature_brain_unified_wrapper: {
    runtime_dependencies: ["brain/wrappers/unified_io_wrapper.js", "data/input/shared/wrapper/unified_wrapper_specs.json"],
    ipc_channels: [],
    "storage_keys/files": [],
    commands: ["npm run wrapper:run"],
    test_patterns: [/tests\/unified-io-wrapper\.test\.js$/, /tests\/io-assembly-line-math\.test\.js$/],
    risk_notes: ["Argument identification and stage resolution must stay deterministic across overrides and aliases."]
  },
  feature_data_shared_catalogs: {
    runtime_dependencies: ["data/input/shared/**/*"],
    ipc_channels: [],
    "storage_keys/files": ["repository_manifest_catalog.json", "preload_api_catalog.json", "unified_wrapper_specs.json"],
    commands: ["npm run audit:data-separation"],
    test_patterns: [/tests\/window-specs-data-source\.test\.js$/, /tests\/preload-api-catalog-storage\.test\.js$/],
    risk_notes: ["Catalog/runtime divergence can break contract-based loading paths."]
  },
  feature_governance_agent_registry: {
    runtime_dependencies: ["to-do/agents/*", "to-do/skills/agent_workflows.json"],
    ipc_channels: [],
    "storage_keys/files": ["agent_access_control.json", "agents_registry.yaml"],
    commands: ["npm run agents:validate"],
    test_patterns: [],
    risk_notes: ["No dedicated automated tests; drift is guarded by validation script output only."]
  },
  feature_governance_skill_registry: {
    runtime_dependencies: ["to-do/skills/**/*", "to-do/agents/*"],
    ipc_channels: [],
    "storage_keys/files": ["agent_workflows.json"],
    commands: ["npm run agents:validate"],
    test_patterns: [],
    risk_notes: ["Skill docs/metadata are staging assets and can drift without runtime failures."]
  },
  feature_test_suite: {
    runtime_dependencies: ["tests/*.test.js"],
    ipc_channels: [],
    "storage_keys/files": [],
    commands: ["npm test --silent"],
    test_patterns: [/tests\/.*\.test\.js$/],
    risk_notes: ["Coverage is broad but not complete for every governance staging artifact."]
  }
});

function findFeatureForFile(filePath) {
  const match = FEATURE_DEFS.find((feature) => feature.matcher(filePath));
  return match || null;
}

function buildFeatureEntries(allFiles) {
  const testFiles = allFiles.filter((filePath) => filePath.startsWith("tests/"));
  const fileToFeature = new Map();
  const featureToFiles = new Map();

  FEATURE_DEFS.forEach((feature) => {
    featureToFiles.set(feature.feature_id, []);
  });

  allFiles.forEach((filePath) => {
    const feature = findFeatureForFile(filePath);
    if (!feature) {
      throw new Error(`unmapped feature for file: ${filePath}`);
    }
    fileToFeature.set(filePath, feature.feature_id);
    featureToFiles.get(feature.feature_id).push(filePath);
  });

  const featureEntries = FEATURE_DEFS.map((feature) => {
    const ownerFiles = featureToFiles.get(feature.feature_id) || [];
    const extra = FEATURE_META[feature.feature_id] || {};
    const testPatterns = toArray(extra.test_patterns);
    const testsCovering = unique(
      testPatterns.flatMap((pattern) => testFiles.filter((testFile) => pattern.test(testFile)))
    );
    const riskNotes = unique([...(toArray(extra.risk_notes)), ...(testsCovering.length ? [] : ["No direct tests mapped; documented as uncovered risk."])]);

    return {
      feature_id: feature.feature_id,
      feature_name: feature.feature_name,
      user_value: feature.user_value,
      entrypoints: feature.entrypoints,
      owner_files: ownerFiles,
      runtime_dependencies: toArray(extra.runtime_dependencies),
      ipc_channels: toArray(extra.ipc_channels),
      "storage_keys/files": toArray(extra["storage_keys/files"]),
      commands: toArray(extra.commands),
      tests_covering: testsCovering,
      status: feature.status,
      risk_notes: riskNotes,
      primary_subsystem: feature.subsystem
    };
  });

  return {
    featureEntries,
    fileToFeature
  };
}

function buildFileEntries(allFiles, fileToFeature) {
  return allFiles.map((filePath) => {
    const subsystem = detectSubsystem(filePath);
    const featureId = fileToFeature.get(filePath);
    return {
      path: filePath,
      primary_subsystem: subsystem,
      feature_ids: featureId ? [featureId] : [],
      status: subsystem === "Governance/agents/skills" ? "staging" : "active"
    };
  });
}

function buildInventory() {
  const files = getTrackedFiles();
  const { featureEntries, fileToFeature } = buildFeatureEntries(files);
  const fileEntries = buildFileEntries(files, fileToFeature);
  const subsystemCounts = {};
  fileEntries.forEach((entry) => {
    subsystemCounts[entry.primary_subsystem] = (subsystemCounts[entry.primary_subsystem] || 0) + 1;
  });

  const unmappedFiles = fileEntries.filter((entry) => entry.feature_ids.length === 0).map((entry) => entry.path);
  if (unmappedFiles.length > 0) {
    throw new Error(`found ${unmappedFiles.length} files without feature mapping`);
  }

  return {
    generated_at: new Date().toISOString(),
    root: rel(ROOT),
    scope_paths: SCOPE_PATHS,
    excluded_paths: EXCLUDED_PATHS,
    totals: {
      files_scoped: files.length,
      features_total: featureEntries.length,
      subsystems_total: Object.keys(subsystemCounts).length
    },
    subsystem_counts: subsystemCounts,
    feature_entries: featureEntries,
    file_entries: fileEntries
  };
}

function main() {
  const inventory = buildInventory();
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
  process.stdout.write(
    `${JSON.stringify(
      {
        out_file: rel(OUTPUT_PATH),
        files_scoped: inventory.totals.files_scoped,
        features_total: inventory.totals.features_total
      },
      null,
      2
    )}\n`
  );
}

main();
