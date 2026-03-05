"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const DEFAULT_CATALOG_FILE = path.join(ROOT, "data", "input", "shared", "main", "polyglot_script_swap_catalog.json");

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
      env_overrides: {
        preferred_language: "AIO_SCRIPT_RUNTIME_LANGUAGE",
        ordered_languages: "AIO_SCRIPT_RUNTIME_ORDER",
        disable_swaps: "AIO_SCRIPT_RUNTIME_DISABLE"
      }
    },
    adapters: {},
    stage_script_map: {}
  });
}

function resolveLanguageOrder(input = {}) {
  const catalog = input.catalog && typeof input.catalog === "object" ? input.catalog : loadCatalog();
  const contract = catalog.runtime_contract && typeof catalog.runtime_contract === "object" ? catalog.runtime_contract : {};
  const envOverrides = contract.env_overrides && typeof contract.env_overrides === "object" ? contract.env_overrides : {};

  const disableEnvKey = String(envOverrides.disable_swaps || "AIO_SCRIPT_RUNTIME_DISABLE");
  const preferredEnvKey = String(envOverrides.preferred_language || "AIO_SCRIPT_RUNTIME_LANGUAGE");
  const orderEnvKey = String(envOverrides.ordered_languages || "AIO_SCRIPT_RUNTIME_ORDER");

  const baselineLanguage = toLanguageId(contract.baseline_language || "javascript") || "javascript";
  const fallbackLanguage = toLanguageId(contract.fallback_language || baselineLanguage) || baselineLanguage;

  if (!input.allowSwaps || parseTruthy(process.env[disableEnvKey])) {
    return [baselineLanguage];
  }

  const runtimeOrderFromEnv = parseLanguageOrderCsv(process.env[orderEnvKey] || "");
  const runtimeOrderFromInput = toUniqueLanguageList(input.runtimeOrder || []);
  const runtimeOrderFromCatalog = toUniqueLanguageList(contract.default_language_order || [baselineLanguage, "python", "cpp"]);
  const preferredFromEnv = toLanguageId(process.env[preferredEnvKey] || "");
  const preferredFromInput = toLanguageId(input.preferredLanguage || "");

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
  runtimeOrderFromInput.forEach(append);
  runtimeOrderFromEnv.forEach(append);
  runtimeOrderFromCatalog.forEach(append);
  append(fallbackLanguage);
  append(baselineLanguage);

  return merged.length > 0 ? merged : [baselineLanguage];
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

function resolveExecutionCommand(input = {}) {
  const catalog = input.catalog && typeof input.catalog === "object" ? input.catalog : loadCatalog();
  const language = toLanguageId(input.language);
  const scriptPath = path.resolve(ROOT, String(input.scriptPath || ""));
  const scriptArgs = Array.isArray(input.scriptArgs) ? input.scriptArgs.map((value) => String(value)) : [];
  const adapter = resolveAdapter(language, catalog);
  if (!adapter) {
    return null;
  }

  if (adapter.kind === "native_node") {
    return {
      language,
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
      command: process.execPath,
      commandArgs: [bridgeScript, "--node-exec", "node", "--script", scriptPath, "--", ...scriptArgs]
    };
  }

  return null;
}

function runScriptWithSwaps(input = {}) {
  const catalog = loadCatalog(input.catalogFile || DEFAULT_CATALOG_FILE);
  const cwd = input.cwd ? path.resolve(input.cwd) : ROOT;
  const scriptPath = input.scriptPath
    ? path.resolve(ROOT, input.scriptPath)
    : resolveStageScriptPath(String(input.stageId || ""), catalog);

  if (!scriptPath || !fs.existsSync(scriptPath)) {
    throw new Error(`script path not found for stage '${String(input.stageId || "")}'`);
  }

  const scriptArgs = Array.isArray(input.scriptArgs) ? input.scriptArgs.map((value) => String(value)) : [];
  const languageOrder = resolveLanguageOrder({
    catalog,
    preferredLanguage: input.preferredLanguage || "",
    runtimeOrder: input.runtimeOrder || [],
    allowSwaps: input.allowSwaps !== false
  });

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
    if (!commandSpec) {
      attempts.push({
        language,
        command: "",
        statusCode: -1,
        skipped: true,
        reason: "adapter unavailable"
      });
      continue;
    }

    const run = spawnSync(commandSpec.command, commandSpec.commandArgs, {
      cwd,
      encoding: "utf8",
      shell: false
    });
    const errorText = run && run.error ? `${run.error.message || String(run.error)}\n` : "";
    const statusCode = run && run.error ? 1 : typeof run.status === "number" ? Number(run.status) : 0;
    const commandText = [commandSpec.command, ...commandSpec.commandArgs].join(" ");
    const stdout = String(run.stdout || "");
    const stderr = `${String(run.stderr || "")}${errorText}`;

    const entry = {
      language,
      command: commandText,
      statusCode,
      skipped: false
    };
    attempts.push(entry);

    const payload = {
      command: commandText,
      statusCode,
      stdout,
      stderr,
      runtime: {
        stage_id: String(input.stageId || ""),
        script_file: toPathFromRoot(scriptPath),
        selected_language: language,
        swapped: language !== "javascript",
        attempts
      }
    };

    fallbackResult = payload;
    if (statusCode === 0) {
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
    stderr: "no available script runtime adapter\n",
    runtime: {
      stage_id: String(input.stageId || ""),
      script_file: toPathFromRoot(scriptPath),
      selected_language: "",
      swapped: false,
      attempts
    }
  };
}

module.exports = {
  DEFAULT_CATALOG_FILE,
  loadCatalog,
  resolveLanguageOrder,
  resolveExecutionCommand,
  runScriptWithSwaps,
  toLanguageId,
  parseLanguageOrderCsv
};
