"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { childProcessSpawnAllowed, runNodeScript } = require("./in-process-script-runner");

const ROOT = path.resolve(__dirname, "..", "..");
const DEFAULT_CATALOG_FILE = path.join(ROOT, "data", "input", "shared", "main", "polyglot_script_swap_catalog.json");
const DEFAULT_BENCHMARK_WINNER_MAP_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_winner_map.json"
);
const BENCHMARK_WINNER_MAP_CACHE = new Map();
const EQUIVALENT_CATALOG_CACHE = new Map();

function readJsonFile(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function loadEquivalentCatalog(filePath) {
  const absolutePath = path.resolve(ROOT, String(filePath || ""));
  const cacheKey = absolutePath.toLowerCase();
  if (EQUIVALENT_CATALOG_CACHE.has(cacheKey)) {
    return EQUIVALENT_CATALOG_CACHE.get(cacheKey);
  }
  const payload = readJsonFile(absolutePath, {});
  EQUIVALENT_CATALOG_CACHE.set(cacheKey, payload);
  return payload;
}

function toLanguageId(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function parseTruthy(value) {
  const text = String(value || "")
    .trim()
    .toLowerCase();
  return text === "1" || text === "true" || text === "yes" || text === "on";
}

function toUniqueLanguageList(values) {
  const list = Array.isArray(values) ? values : [];
  const result = [];
  const seen = new Set();
  list.forEach((value) => {
    const language = toLanguageId(value);
    if (!language || seen.has(language)) {
      return;
    }
    seen.add(language);
    result.push(language);
  });
  return result;
}

function toUniqueStringList(values) {
  const list = Array.isArray(values) ? values : [];
  const result = [];
  const seen = new Set();
  list.forEach((value) => {
    const text = String(value || "").trim();
    if (!text || seen.has(text)) {
      return;
    }
    seen.add(text);
    result.push(text);
  });
  return result;
}

function parseLanguageOrderCsv(value) {
  return toUniqueLanguageList(
    String(value || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
  );
}

function commandExists(command) {
  const candidate = String(command || "").trim();
  if (!candidate) {
    return false;
  }
  if (!childProcessSpawnAllowed()) {
    return false;
  }
  const checkArgs = process.platform === "win32" ? ["-Command", `Get-Command ${candidate} -ErrorAction SilentlyContinue`] : ["-lc", `command -v ${candidate}`];
  const shell = process.platform === "win32" ? "powershell" : "bash";
  const result = spawnSync(shell, checkArgs, {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  return Number(result.status || 1) === 0;
}

function detectPythonRuntime() {
  const explicitPythonExec = String(process.env.AIO_PYTHON_EXEC || "").trim();
  if (explicitPythonExec) {
    return {
      command: explicitPythonExec,
      argsPrefix: [],
      label: explicitPythonExec
    };
  }
  if (commandExists("python")) {
    return {
      command: "python",
      argsPrefix: [],
      label: "python"
    };
  }
  if (commandExists("py")) {
    return {
      command: "py",
      argsPrefix: ["-3"],
      label: "py -3"
    };
  }
  return null;
}

function loadCatalog(catalogFile = DEFAULT_CATALOG_FILE) {
  return readJsonFile(catalogFile, {
    schema_version: 1,
    catalog_id: "aio_polyglot_script_swap_catalog",
    runtime_contract: {
      baseline_language: "javascript",
      default_language_order: ["javascript", "python", "cpp"],
      fallback_language: "javascript",
      benchmark_winner_map_file: path.relative(ROOT, DEFAULT_BENCHMARK_WINNER_MAP_FILE).replace(/\\/g, "/"),
      env_overrides: {
        preferred_language: "AIO_SCRIPT_RUNTIME_LANGUAGE",
        ordered_languages: "AIO_SCRIPT_RUNTIME_ORDER",
        disable_swaps: "AIO_SCRIPT_RUNTIME_DISABLE",
        strict_runtime: "AIO_SCRIPT_RUNTIME_STRICT",
        auto_select_best: "AIO_SCRIPT_RUNTIME_AUTO_BEST"
      }
    },
    adapters: {},
    stage_script_map: {}
  });
}

function resolveStagePolicy(stageId, catalog) {
  const map = catalog.stage_script_map && typeof catalog.stage_script_map === "object" ? catalog.stage_script_map : {};
  const policy = map[stageId] && typeof map[stageId] === "object" ? map[stageId] : {};
  return {
    script_file: String(policy.script_file || ""),
    preferred_language: toLanguageId(policy.preferred_language || ""),
    runtime_order: toUniqueLanguageList(policy.runtime_order || []),
    allow_swaps: typeof policy.allow_swaps === "boolean" ? policy.allow_swaps : null,
    strict_runtime: typeof policy.strict_runtime === "boolean" ? policy.strict_runtime : false,
    auto_select_from_benchmark: typeof policy.auto_select_from_benchmark === "boolean" ? policy.auto_select_from_benchmark : false,
    benchmark_function_ids: toUniqueStringList(policy.benchmark_function_ids || [])
  };
}

function loadBenchmarkWinnerMap(catalog) {
  const contract = catalog.runtime_contract && typeof catalog.runtime_contract === "object" ? catalog.runtime_contract : {};
  const mapFileFromCatalog = String(contract.benchmark_winner_map_file || "").trim();
  const winnerMapPath = mapFileFromCatalog
    ? path.resolve(ROOT, mapFileFromCatalog)
    : DEFAULT_BENCHMARK_WINNER_MAP_FILE;
  const cacheKey = winnerMapPath.toLowerCase();
  if (BENCHMARK_WINNER_MAP_CACHE.has(cacheKey)) {
    return BENCHMARK_WINNER_MAP_CACHE.get(cacheKey);
  }
  const data = readJsonFile(winnerMapPath, {});
  const payload = {
    filePath: winnerMapPath,
    data
  };
  BENCHMARK_WINNER_MAP_CACHE.set(cacheKey, payload);
  return payload;
}

function resolveBenchmarkPreferredLanguage(input = {}) {
  const stagePolicy = input.stagePolicy && typeof input.stagePolicy === "object" ? input.stagePolicy : {};
  if (stagePolicy.auto_select_from_benchmark !== true) {
    return "";
  }

  const catalog = input.catalog && typeof input.catalog === "object" ? input.catalog : loadCatalog();
  const adapters = catalog.adapters && typeof catalog.adapters === "object" ? catalog.adapters : {};
  const supportedLanguages = new Set(
    Object.keys(adapters)
      .map((entry) => toLanguageId(entry))
      .filter(Boolean)
  );
  if (supportedLanguages.size === 0) {
    return "";
  }

  const winnerMapPayload = loadBenchmarkWinnerMap(catalog);
  const winnerMap = winnerMapPayload.data && typeof winnerMapPayload.data === "object" ? winnerMapPayload.data : {};
  const functionIds = toUniqueStringList(stagePolicy.benchmark_function_ids || []);

  if (functionIds.length > 0) {
    const perFunction = Array.isArray(winnerMap.per_function) ? winnerMap.per_function : [];
    const scoreByLanguage = new Map();

    const includeScore = (languageId, score) => {
      const language = toLanguageId(languageId);
      const numericScore = Number(score);
      if (!language || !supportedLanguages.has(language) || !Number.isFinite(numericScore) || numericScore <= 0) {
        return;
      }
      const current = scoreByLanguage.get(language) || { total: 0, count: 0 };
      current.total += numericScore;
      current.count += 1;
      scoreByLanguage.set(language, current);
    };

    functionIds.forEach((functionId) => {
      const row = perFunction.find((entry) => String(entry && entry.function_id ? entry.function_id : "") === functionId);
      if (!row) {
        return;
      }
      const rankings = Array.isArray(row.language_rankings) ? row.language_rankings : [];
      if (rankings.length > 0) {
        rankings.forEach((ranking) => {
          includeScore(ranking && ranking.language ? ranking.language : "", ranking && ranking.avg_ns_per_iteration);
        });
        return;
      }
      includeScore(row.winner_language, row.winner_avg_ns_per_iteration);
    });

    const ranked = [...scoreByLanguage.entries()]
      .map(([language, score]) => ({
        language,
        count: Number(score.count || 0),
        avg: score.count > 0 ? score.total / score.count : Number.POSITIVE_INFINITY
      }))
      .sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count;
        }
        return left.avg - right.avg;
      });

    if (ranked.length > 0) {
      return ranked[0].language;
    }
  }

  const overallWinner = toLanguageId(winnerMap.overall_winner_language || "");
  if (overallWinner && supportedLanguages.has(overallWinner)) {
    return overallWinner;
  }
  return "";
}

function resolveLanguageSelection(input = {}) {
  const catalog = input.catalog && typeof input.catalog === "object" ? input.catalog : loadCatalog();
  const contract = catalog.runtime_contract && typeof catalog.runtime_contract === "object" ? catalog.runtime_contract : {};
  const envOverrides = contract.env_overrides && typeof contract.env_overrides === "object" ? contract.env_overrides : {};
  const stagePolicy = resolveStagePolicy(String(input.stageId || ""), catalog);

  const disableEnvKey = String(envOverrides.disable_swaps || "AIO_SCRIPT_RUNTIME_DISABLE");
  const preferredEnvKey = String(envOverrides.preferred_language || "AIO_SCRIPT_RUNTIME_LANGUAGE");
  const orderEnvKey = String(envOverrides.ordered_languages || "AIO_SCRIPT_RUNTIME_ORDER");
  const autoBestEnvKey = String(envOverrides.auto_select_best || "AIO_SCRIPT_RUNTIME_AUTO_BEST");

  const baselineLanguage = toLanguageId(contract.baseline_language || "javascript") || "javascript";
  const fallbackLanguage = toLanguageId(contract.fallback_language || baselineLanguage) || baselineLanguage;
  const allowSwapsInput = input.allowSwaps !== false;
  const allowSwapsPolicy = stagePolicy.allow_swaps;
  const allowSwaps = allowSwapsPolicy === null ? allowSwapsInput : allowSwapsInput && allowSwapsPolicy;

  if (!allowSwaps || parseTruthy(process.env[disableEnvKey])) {
    return {
      language_order: [baselineLanguage],
      preferred_language_input: "",
      preferred_language_env: "",
      preferred_language_stage: stagePolicy.preferred_language,
      auto_select_enabled: false,
      auto_best_language: "",
      auto_best_source: "disabled"
    };
  }

  const preferredFromInput = toLanguageId(input.preferredLanguage || "");
  const preferredFromEnv = toLanguageId(process.env[preferredEnvKey] || "");
  const preferredFromStage = toLanguageId(stagePolicy.preferred_language || "");
  const autoSelectFromInput = input.autoSelectBest === true;
  const autoSelectFromEnv = parseTruthy(process.env[autoBestEnvKey]);
  const autoSelectFromStage = stagePolicy.auto_select_from_benchmark === true;
  const autoSelectBest = autoSelectFromInput || autoSelectFromEnv || autoSelectFromStage;
  const autoBestLanguageFromBenchmark = autoSelectBest
    ? resolveBenchmarkPreferredLanguage({
        catalog,
        stagePolicy
      })
    : "";

  const runtimeOrderFromEnv = parseLanguageOrderCsv(process.env[orderEnvKey] || "");
  const runtimeOrderFromInput = toUniqueLanguageList(input.runtimeOrder || []);
  const runtimeOrderFromStagePolicy = toUniqueLanguageList(stagePolicy.runtime_order || []);
  const runtimeOrderFromCatalog = toUniqueLanguageList(contract.default_language_order || [baselineLanguage, "python", "cpp"]);

  const merged = [];
  const seen = new Set();
  const append = (value) => {
    const language = toLanguageId(value);
    if (!language || seen.has(language)) {
      return;
    }
    seen.add(language);
    merged.push(language);
  };

  append(preferredFromInput);
  append(preferredFromEnv);
  append(autoBestLanguageFromBenchmark);
  append(preferredFromStage);
  runtimeOrderFromInput.forEach(append);
  runtimeOrderFromStagePolicy.forEach(append);
  runtimeOrderFromEnv.forEach(append);
  runtimeOrderFromCatalog.forEach(append);
  append(fallbackLanguage);
  append(baselineLanguage);

  const resolvedLanguageOrder = merged.length > 0 ? merged : [baselineLanguage];
  const autoBestLanguage = autoSelectBest
    ? toLanguageId(autoBestLanguageFromBenchmark || resolvedLanguageOrder[0] || fallbackLanguage || baselineLanguage)
    : "";
  const autoBestSource = !autoSelectBest
    ? "disabled"
    : autoBestLanguageFromBenchmark
      ? "benchmark_winner_map"
      : "fallback_runtime_order";

  return {
    language_order: resolvedLanguageOrder,
    preferred_language_input: preferredFromInput,
    preferred_language_env: preferredFromEnv,
    preferred_language_stage: preferredFromStage,
    auto_select_enabled: autoSelectBest,
    auto_best_language: autoBestLanguage,
    auto_best_source: autoBestSource
  };
}

function resolveLanguageOrder(input = {}) {
  return resolveLanguageSelection(input).language_order;
}

function resolveStageScriptPath(stageId, catalog) {
  const map = catalog.stage_script_map && typeof catalog.stage_script_map === "object" ? catalog.stage_script_map : {};
  const file = map[stageId] && typeof map[stageId] === "object" ? map[stageId].script_file : "";
  if (!file) {
    return "";
  }
  return path.resolve(ROOT, String(file));
}

function toPathFromRoot(value) {
  return path.relative(ROOT, String(value || ""))
    .replace(/\\/g, "/")
    .replace(/^\.\//, "");
}

function resolveAdapter(language, catalog) {
  const adapters = catalog.adapters && typeof catalog.adapters === "object" ? catalog.adapters : {};
  return adapters[language] && typeof adapters[language] === "object" ? adapters[language] : null;
}

function resolveEquivalentEntry(scriptPath, adapter) {
  const equivalentCatalogFile = String(adapter && adapter.equivalent_catalog_file ? adapter.equivalent_catalog_file : "").trim();
  if (!equivalentCatalogFile) {
    return null;
  }
  const sourceJsFile = toPathFromRoot(scriptPath);
  if (!sourceJsFile || !sourceJsFile.startsWith("scripts/")) {
    return null;
  }
  const catalog = loadEquivalentCatalog(equivalentCatalogFile);
  const entries = Array.isArray(catalog.entries) ? catalog.entries : [];
  return entries.find((entry) => String(entry && entry.source_js_file ? entry.source_js_file : "") === sourceJsFile) || null;
}

function resolveExecutionCommand(input = {}) {
  const catalog = input.catalog && typeof input.catalog === "object" ? input.catalog : loadCatalog();
  const language = toLanguageId(input.language);
  const scriptPath = path.resolve(ROOT, String(input.scriptPath || ""));
  const scriptArgs = Array.isArray(input.scriptArgs) ? input.scriptArgs.map((value) => String(value)) : [];
  const adapter = resolveAdapter(language, catalog);
  if (!adapter) {
    return null;
  }

  if (adapter.kind === "python_native_equivalent") {
    const python = detectPythonRuntime();
    const equivalentEntry = resolveEquivalentEntry(scriptPath, adapter);
    if (!python || !equivalentEntry) {
      return null;
    }
    const equivalentFile = path.resolve(ROOT, String(equivalentEntry.python_equivalent_file || ""));
    if (!fs.existsSync(equivalentFile)) {
      return null;
    }
    return {
      language,
      adapter_kind: adapter.kind,
      command: python.command,
      commandArgs: [...python.argsPrefix, equivalentFile, ...scriptArgs],
      env: {
        AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK: adapter.allow_js_fallback === false ? "0" : "1"
      }
    };
  }

  if (adapter.kind === "cpp_native_equivalent") {
    const python = detectPythonRuntime();
    const equivalentEntry = resolveEquivalentEntry(scriptPath, adapter);
    const runnerScript = path.resolve(ROOT, String(adapter.runner_script || ""));
    if (!python || !equivalentEntry || !fs.existsSync(runnerScript)) {
      return null;
    }
    const equivalentFile = path.resolve(ROOT, String(equivalentEntry.cpp_equivalent_file || ""));
    if (!fs.existsSync(equivalentFile)) {
      return null;
    }
    return {
      language,
      adapter_kind: adapter.kind,
      command: python.command,
      commandArgs: [...python.argsPrefix, runnerScript, equivalentFile, "--", ...scriptArgs],
      env: {
        AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK: adapter.allow_js_fallback === false ? "0" : "1"
      }
    };
  }

  if (adapter.kind === "native_node") {
    return {
      language,
      adapter_kind: adapter.kind,
      command: process.execPath,
      commandArgs: [scriptPath, ...scriptArgs]
    };
  }

  if (adapter.kind === "python_node_bridge") {
    const python = detectPythonRuntime();
    if (!python) {
      return null;
    }
    const bridgeScript = path.resolve(ROOT, String(adapter.bridge_script || ""));
    if (!fs.existsSync(bridgeScript)) {
      return null;
    }
    return {
      language,
      adapter_kind: adapter.kind,
      command: python.command,
      commandArgs: [...python.argsPrefix, bridgeScript, process.execPath, scriptPath, ...scriptArgs]
    };
  }

  if (adapter.kind === "cpp_node_bridge") {
    const bridgeScript = path.resolve(ROOT, String(adapter.bridge_script || ""));
    if (!fs.existsSync(bridgeScript)) {
      return null;
    }
    return {
      language,
      adapter_kind: adapter.kind,
      command: process.execPath,
      commandArgs: [bridgeScript, "--node-exec", "node", "--script", scriptPath, "--", ...scriptArgs]
    };
  }

  return null;
}

function hasAuthoritativeStageOutput(stdout) {
  const stdoutText = String(stdout || "").trim();
  return Boolean(stdoutText);
}

function shouldFallbackAfterRun(statusCode, stdout, stderr) {
  if (Number(statusCode) === 0) {
    return false;
  }
  return !hasAuthoritativeStageOutput(stdout);
}

function runScriptWithSwaps(input = {}) {
  const catalog = loadCatalog(input.catalogFile || DEFAULT_CATALOG_FILE);
  const stageId = String(input.stageId || "");
  const stagePolicy = resolveStagePolicy(stageId, catalog);
  const contract = catalog.runtime_contract && typeof catalog.runtime_contract === "object" ? catalog.runtime_contract : {};
  const envOverrides = contract.env_overrides && typeof contract.env_overrides === "object" ? contract.env_overrides : {};
  const strictEnvKey = String(envOverrides.strict_runtime || "AIO_SCRIPT_RUNTIME_STRICT");
  const cwd = input.cwd ? path.resolve(input.cwd) : ROOT;
  const scriptPath = input.scriptPath
    ? path.resolve(ROOT, input.scriptPath)
    : resolveStageScriptPath(stageId, catalog);

  if (!scriptPath || !fs.existsSync(scriptPath)) {
    throw new Error(`script path not found for stage '${stageId}'`);
  }

  const scriptArgs = Array.isArray(input.scriptArgs) ? input.scriptArgs.map((value) => String(value)) : [];
  const selection = resolveLanguageSelection({
    catalog,
    stageId,
    preferredLanguage: input.preferredLanguage || "",
    runtimeOrder: input.runtimeOrder || [],
    autoSelectBest: input.autoSelectBest === true,
    allowSwaps: input.allowSwaps !== false
  });
  const resolvedLanguageOrder = selection.language_order;
  const strictRuntime =
    input.strictRuntime === true || stagePolicy.strict_runtime === true || parseTruthy(process.env[strictEnvKey]);
  const subprocessAllowed = childProcessSpawnAllowed();
  const languageOrder = strictRuntime ? resolvedLanguageOrder.slice(0, 1) : resolvedLanguageOrder.slice();

  const attempts = [];
  let fallbackResult = null;

  for (let index = 0; index < languageOrder.length; index += 1) {
    const language = languageOrder[index];
    const commandSpec = resolveExecutionCommand({
      catalog,
      language,
      scriptPath,
      scriptArgs
    });

    if (!subprocessAllowed && commandSpec && commandSpec.adapter_kind === "native_node") {
      const start = Date.now();
      const run = runNodeScript(scriptPath, scriptArgs, {
        cwd,
        forceInProcess: true
      });
      const durationMs = Date.now() - start;
      const statusCode = typeof run.status === "number" ? Number(run.status) : run.error ? 1 : 0;
      const commandText = [process.execPath, scriptPath, ...scriptArgs].join(" ");
      const entry = {
        language,
        command: commandText,
        statusCode,
        duration_ms: durationMs,
        skipped: false
      };
      attempts.push(entry);

      const payload = {
        command: commandText,
        statusCode,
        stdout: String(run.stdout || ""),
        stderr: String(run.stderr || ""),
        runtime: {
          stage_id: stageId,
          script_file: toPathFromRoot(scriptPath),
          selected_language: language,
          swapped: language !== "javascript",
          strict_runtime: strictRuntime,
          selection: {
            resolved_order: languageOrder,
            preferred_language_input: selection.preferred_language_input,
            preferred_language_env: selection.preferred_language_env,
            preferred_language_stage: selection.preferred_language_stage,
            auto_select_enabled: selection.auto_select_enabled,
            auto_best_language: selection.auto_best_language,
            auto_best_source: selection.auto_best_source
          },
          duration_ms: durationMs,
          attempt_count: attempts.length,
          fallback_used: attempts.length > 1,
          attempts
        }
      };

      fallbackResult = payload;
      if (!shouldFallbackAfterRun(statusCode, run.stdout, run.stderr) || strictRuntime) {
        return payload;
      }
      continue;
    }

    if (!subprocessAllowed && commandSpec && commandSpec.adapter_kind !== "native_node") {
      attempts.push({
        language,
        command: "",
        statusCode: -1,
        duration_ms: 0,
        skipped: true,
        reason: "child process unavailable for non-native adapter"
      });
      if (strictRuntime) {
        break;
      }
      continue;
    }
    if (!commandSpec) {
      attempts.push({
        language,
        command: "",
        statusCode: -1,
        duration_ms: 0,
        skipped: true,
        reason: "adapter unavailable"
      });
      if (strictRuntime) {
        break;
      }
      continue;
    }

    const start = Date.now();
    const run = spawnSync(commandSpec.command, commandSpec.commandArgs, {
      cwd,
      env: commandSpec.env ? { ...process.env, ...commandSpec.env } : process.env,
      encoding: "utf8",
      shell: false
    });
    const durationMs = Date.now() - start;
    const errorText = run && run.error ? `${run.error.message || String(run.error)}\n` : "";
    const statusCode = run && run.error ? 1 : typeof run.status === "number" ? Number(run.status) : 0;
    const commandText = [commandSpec.command, ...commandSpec.commandArgs].join(" ");
    const stdout = String(run.stdout || "");
    const stderr = `${String(run.stderr || "")}${errorText}`;

    const entry = {
      language,
      command: commandText,
      statusCode,
      duration_ms: durationMs,
      skipped: false
    };
    attempts.push(entry);

    const payload = {
      command: commandText,
      statusCode,
      stdout,
      stderr,
      runtime: {
        stage_id: stageId,
        script_file: toPathFromRoot(scriptPath),
        selected_language: language,
        swapped: language !== "javascript",
        strict_runtime: strictRuntime,
        selection: {
          resolved_order: languageOrder,
          preferred_language_input: selection.preferred_language_input,
          preferred_language_env: selection.preferred_language_env,
          preferred_language_stage: selection.preferred_language_stage,
          auto_select_enabled: selection.auto_select_enabled,
          auto_best_language: selection.auto_best_language,
          auto_best_source: selection.auto_best_source
        },
        duration_ms: durationMs,
        attempt_count: attempts.length,
        fallback_used: attempts.length > 1,
        attempts
      }
    };

    fallbackResult = payload;
    if (!shouldFallbackAfterRun(statusCode, stdout, stderr)) {
      return payload;
    }
    if (strictRuntime) {
      return payload;
    }
  }

  if (fallbackResult) {
    return fallbackResult;
  }

  return {
    command: "",
    statusCode: 1,
    stdout: "",
    stderr: subprocessAllowed ? "no available script runtime adapter\n" : "child process execution unavailable in current runtime\n",
    runtime: {
      stage_id: stageId,
      script_file: toPathFromRoot(scriptPath),
      selected_language: "",
      swapped: false,
      strict_runtime: strictRuntime,
      selection: {
        resolved_order: languageOrder,
        preferred_language_input: selection.preferred_language_input,
        preferred_language_env: selection.preferred_language_env,
        preferred_language_stage: selection.preferred_language_stage,
        auto_select_enabled: selection.auto_select_enabled,
        auto_best_language: selection.auto_best_language,
        auto_best_source: selection.auto_best_source
      },
      duration_ms: 0,
      attempt_count: attempts.length,
      fallback_used: false,
      attempts
    }
  };
}

module.exports = {
  DEFAULT_CATALOG_FILE,
  loadCatalog,
  resolveLanguageSelection,
  resolveLanguageOrder,
  resolveBenchmarkPreferredLanguage,
  resolveExecutionCommand,
  runScriptWithSwaps,
  toLanguageId,
  parseLanguageOrderCsv
};
