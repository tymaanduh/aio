"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  resolveLanguageOrder,
  runScriptWithSwaps,
  loadCatalog,
  resolveExecutionCommand
} = require("../scripts/lib/polyglot-script-swap-runner.js");

const ROOT = path.resolve(__dirname, "..");

test("resolveLanguageOrder honors preferred language and fallback ordering", () => {
  const catalog = loadCatalog();
  const order = resolveLanguageOrder({
    catalog,
    preferredLanguage: "cpp",
    runtimeOrder: ["python", "javascript"],
    allowSwaps: true
  });

  assert.equal(order[0], "cpp");
  assert.equal(order.includes("python"), true);
  assert.equal(order.includes("javascript"), true);
});

test("runScriptWithSwaps executes javascript stage when swaps disabled", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-script-swap-"));
  const scriptPath = path.join(tempDir, "echo.js");
  fs.writeFileSync(
    scriptPath,
    [
      '"use strict";',
      "const payload = { ok: true, argv: process.argv.slice(2) };",
      "process.stdout.write(`${JSON.stringify(payload)}\\n`);"
    ].join("\n"),
    "utf8"
  );

  const result = runScriptWithSwaps({
    scriptPath,
    scriptArgs: ["hello", "world"],
    allowSwaps: false
  });

  assert.equal(result.statusCode, 0);
  assert.equal(result.runtime.selected_language, "javascript");
  assert.equal(result.runtime.swapped, false);

  const payload = JSON.parse(String(result.stdout || "{}").trim());
  assert.equal(payload.ok, true);
  assert.deepEqual(payload.argv, ["hello", "world"]);
});

test("runScriptWithSwaps honors stage policy runtime order with fallback", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-script-swap-policy-"));
  const scriptPath = path.join(tempDir, "echo.js");
  const catalogPath = path.join(tempDir, "swap-catalog.json");
  fs.writeFileSync(
    scriptPath,
    [
      '"use strict";',
      "const payload = { ok: true, source: 'stage-policy' };",
      "process.stdout.write(`${JSON.stringify(payload)}\\n`);"
    ].join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    catalogPath,
    `${JSON.stringify(
      {
        schema_version: 1,
        catalog_id: "test_catalog",
        runtime_contract: {
          baseline_language: "javascript",
          default_language_order: ["javascript"],
          fallback_language: "javascript",
          env_overrides: {
            preferred_language: "AIO_SCRIPT_RUNTIME_LANGUAGE",
            ordered_languages: "AIO_SCRIPT_RUNTIME_ORDER",
            disable_swaps: "AIO_SCRIPT_RUNTIME_DISABLE",
            strict_runtime: "AIO_SCRIPT_RUNTIME_STRICT"
          }
        },
        adapters: {
          javascript: { kind: "native_node" }
        },
        stage_script_map: {
          custom_stage: {
            script_file: scriptPath,
            preferred_language: "python",
            runtime_order: ["python", "javascript"],
            allow_swaps: true,
            strict_runtime: false
          }
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const result = runScriptWithSwaps({
    stageId: "custom_stage",
    catalogFile: catalogPath
  });

  assert.equal(result.statusCode, 0);
  assert.equal(result.runtime.selected_language, "javascript");
  assert.equal(result.runtime.fallback_used, true);
  assert.equal(Array.isArray(result.runtime.attempts), true);
  assert.equal(result.runtime.attempts.length >= 2, true);
  assert.equal(result.runtime.attempts[0].language, "python");
});

test("runScriptWithSwaps strict runtime blocks fallback on unavailable adapter", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-script-swap-strict-"));
  const scriptPath = path.join(tempDir, "echo.js");
  const catalogPath = path.join(tempDir, "swap-catalog.json");
  fs.writeFileSync(
    scriptPath,
    [
      '"use strict";',
      "const payload = { ok: true };",
      "process.stdout.write(`${JSON.stringify(payload)}\\n`);"
    ].join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    catalogPath,
    `${JSON.stringify(
      {
        schema_version: 1,
        catalog_id: "test_catalog_strict",
        runtime_contract: {
          baseline_language: "javascript",
          default_language_order: ["javascript"],
          fallback_language: "javascript",
          env_overrides: {
            preferred_language: "AIO_SCRIPT_RUNTIME_LANGUAGE",
            ordered_languages: "AIO_SCRIPT_RUNTIME_ORDER",
            disable_swaps: "AIO_SCRIPT_RUNTIME_DISABLE",
            strict_runtime: "AIO_SCRIPT_RUNTIME_STRICT"
          }
        },
        adapters: {
          javascript: { kind: "native_node" }
        },
        stage_script_map: {
          strict_stage: {
            script_file: scriptPath,
            preferred_language: "python",
            runtime_order: ["python", "javascript"],
            allow_swaps: true,
            strict_runtime: true
          }
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const result = runScriptWithSwaps({
    stageId: "strict_stage",
    catalogFile: catalogPath
  });

  assert.equal(result.statusCode, 1);
  assert.equal(result.runtime.strict_runtime, true);
  assert.equal(result.runtime.attempts.length, 1);
  assert.equal(result.runtime.attempts[0].language, "python");
  assert.equal(result.runtime.attempts[0].skipped, true);
});

test("resolveExecutionCommand uses AIO_PYTHON_EXEC for python native adapters", () => {
  const previousPythonExec = process.env.AIO_PYTHON_EXEC;
  process.env.AIO_PYTHON_EXEC = "python-from-env";

  try {
    const commandSpec = resolveExecutionCommand({
      catalog: {
        schema_version: 1,
        catalog_id: "test_catalog_python_env",
        adapters: {
          python: {
            kind: "python_native_equivalent",
            equivalent_catalog_file: path.join(
              ROOT,
              "data",
              "output",
              "databases",
              "polyglot-default",
              "build",
              "script_polyglot_equivalents_catalog.json"
            )
          }
        }
      },
      language: "python",
      scriptPath: path.join(ROOT, "scripts", "validate-script-swap-catalog.js"),
      scriptArgs: ["--check"]
    });

    assert.equal(commandSpec.command, "python-from-env");
    assert.equal(commandSpec.commandArgs.includes("--check"), true);
  } finally {
    if (previousPythonExec === undefined) {
      delete process.env.AIO_PYTHON_EXEC;
    } else {
      process.env.AIO_PYTHON_EXEC = previousPythonExec;
    }
  }
});

test("resolveLanguageOrder prioritizes benchmark auto-best stage policy", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-script-swap-auto-best-order-"));
  const winnerMapPath = path.join(tempDir, "winner-map.json");

  fs.writeFileSync(
    winnerMapPath,
    `${JSON.stringify(
      {
        method: "min_ns_per_iteration",
        overall_winner_language: "cpp",
        per_function: [
          {
            function_id: "math.add",
            winner_language: "cpp",
            winner_avg_ns_per_iteration: 120,
            language_rankings: [
              { language: "cpp", avg_ns_per_iteration: 120 },
              { language: "javascript", avg_ns_per_iteration: 180 },
              { language: "python", avg_ns_per_iteration: 350 }
            ]
          }
        ]
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const order = resolveLanguageOrder({
    stageId: "benchmark_stage",
    catalog: {
      schema_version: 1,
      catalog_id: "test_catalog_auto_best_order",
      runtime_contract: {
        baseline_language: "javascript",
        default_language_order: ["javascript", "python", "cpp"],
        fallback_language: "javascript",
        benchmark_winner_map_file: winnerMapPath,
        env_overrides: {
          preferred_language: "AIO_SCRIPT_RUNTIME_LANGUAGE",
          ordered_languages: "AIO_SCRIPT_RUNTIME_ORDER",
          disable_swaps: "AIO_SCRIPT_RUNTIME_DISABLE",
          strict_runtime: "AIO_SCRIPT_RUNTIME_STRICT",
          auto_select_best: "AIO_SCRIPT_RUNTIME_AUTO_BEST"
        }
      },
      adapters: {
        javascript: { kind: "native_node" },
        python: { kind: "native_node" },
        cpp: { kind: "native_node" }
      },
      stage_script_map: {
        benchmark_stage: {
          script_file: "scripts/workflow-preflight.js",
          preferred_language: "javascript",
          runtime_order: ["javascript", "python", "cpp"],
          allow_swaps: true,
          strict_runtime: false,
          auto_select_from_benchmark: true,
          benchmark_function_ids: ["math.add"]
        }
      }
    }
  });

  assert.equal(order[0], "cpp");
  assert.equal(order.includes("javascript"), true);
});

test("runScriptWithSwaps emits benchmark auto-best selection metadata", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-script-swap-auto-best-runtime-"));
  const scriptPath = path.join(tempDir, "echo.js");
  const catalogPath = path.join(tempDir, "swap-catalog.json");
  const winnerMapPath = path.join(tempDir, "winner-map.json");

  fs.writeFileSync(
    scriptPath,
    [
      '"use strict";',
      "const payload = { ok: true, source: 'auto-best' };",
      "process.stdout.write(`${JSON.stringify(payload)}\\n`);"
    ].join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    winnerMapPath,
    `${JSON.stringify(
      {
        method: "min_ns_per_iteration",
        overall_winner_language: "cpp",
        per_function: [
          {
            function_id: "math.multiply",
            winner_language: "cpp",
            winner_avg_ns_per_iteration: 150,
            language_rankings: [
              { language: "cpp", avg_ns_per_iteration: 150 },
              { language: "javascript", avg_ns_per_iteration: 230 }
            ]
          }
        ]
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  fs.writeFileSync(
    catalogPath,
    `${JSON.stringify(
      {
        schema_version: 1,
        catalog_id: "test_catalog_auto_best_runtime",
        runtime_contract: {
          baseline_language: "javascript",
          default_language_order: ["javascript", "cpp"],
          fallback_language: "javascript",
          benchmark_winner_map_file: winnerMapPath,
          env_overrides: {
            preferred_language: "AIO_SCRIPT_RUNTIME_LANGUAGE",
            ordered_languages: "AIO_SCRIPT_RUNTIME_ORDER",
            disable_swaps: "AIO_SCRIPT_RUNTIME_DISABLE",
            strict_runtime: "AIO_SCRIPT_RUNTIME_STRICT",
            auto_select_best: "AIO_SCRIPT_RUNTIME_AUTO_BEST"
          }
        },
        adapters: {
          javascript: { kind: "native_node" },
          cpp: { kind: "native_node" }
        },
        stage_script_map: {
          auto_best_stage: {
            script_file: scriptPath,
            preferred_language: "javascript",
            runtime_order: ["javascript", "cpp"],
            allow_swaps: true,
            strict_runtime: false,
            auto_select_from_benchmark: true,
            benchmark_function_ids: ["math.multiply"]
          }
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const result = runScriptWithSwaps({
    stageId: "auto_best_stage",
    catalogFile: catalogPath
  });

  assert.equal(result.statusCode, 0);
  assert.equal(result.runtime.selected_language, "cpp");
  assert.equal(result.runtime.selection.auto_select_enabled, true);
  assert.equal(result.runtime.selection.auto_best_language, "cpp");
  assert.equal(result.runtime.selection.auto_best_source, "benchmark_winner_map");
  assert.equal(Array.isArray(result.runtime.selection.resolved_order), true);
});

test("runScriptWithSwaps emits fallback auto-best evidence for non-benchmark stages", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-script-swap-fallback-auto-best-"));
  const scriptPath = path.join(tempDir, "echo.js");
  const catalogPath = path.join(tempDir, "swap-catalog.json");

  fs.writeFileSync(
    scriptPath,
    [
      '"use strict";',
      "const payload = { ok: true, source: 'fallback-auto-best' };",
      "process.stdout.write(`${JSON.stringify(payload)}\\n`);"
    ].join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    catalogPath,
    `${JSON.stringify(
      {
        schema_version: 1,
        catalog_id: "test_catalog_fallback_auto_best_runtime",
        runtime_contract: {
          baseline_language: "javascript",
          default_language_order: ["javascript", "python", "cpp"],
          fallback_language: "javascript",
          env_overrides: {
            preferred_language: "AIO_SCRIPT_RUNTIME_LANGUAGE",
            ordered_languages: "AIO_SCRIPT_RUNTIME_ORDER",
            disable_swaps: "AIO_SCRIPT_RUNTIME_DISABLE",
            strict_runtime: "AIO_SCRIPT_RUNTIME_STRICT",
            auto_select_best: "AIO_SCRIPT_RUNTIME_AUTO_BEST"
          }
        },
        adapters: {
          javascript: { kind: "native_node" },
          python: { kind: "native_node" },
          cpp: { kind: "native_node" }
        },
        stage_script_map: {
          fallback_auto_best_stage: {
            script_file: scriptPath,
            preferred_language: "javascript",
            runtime_order: ["javascript", "python", "cpp"],
            allow_swaps: true,
            strict_runtime: false,
            auto_select_from_benchmark: false,
            benchmark_function_ids: []
          }
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const result = runScriptWithSwaps({
    stageId: "fallback_auto_best_stage",
    catalogFile: catalogPath,
    autoSelectBest: true
  });

  assert.equal(result.statusCode, 0);
  assert.equal(result.runtime.selection.auto_select_enabled, true);
  assert.equal(result.runtime.selection.auto_best_language, "javascript");
  assert.equal(result.runtime.selection.auto_best_source, "fallback_runtime_order");
});

test("runScriptWithSwaps can execute a native Python equivalent from the generated catalog", (t) => {
  const catalog = loadCatalog();
  const commandSpec = resolveExecutionCommand({
    catalog,
    language: "python",
    scriptPath: path.join(ROOT, "scripts", "validate-script-swap-catalog.js"),
    scriptArgs: []
  });

  if (!commandSpec) {
    t.skip("python runtime unavailable for native equivalent execution");
    return;
  }

  const result = runScriptWithSwaps({
    stageId: "validate_script_swap_catalog",
    preferredLanguage: "python",
    runtimeOrder: ["python", "javascript"]
  });

  assert.equal(result.statusCode, 0, `${String(result.stdout || "")}\n${String(result.stderr || "")}`);
  assert.equal(result.runtime.selected_language, "python");

  const payload = JSON.parse(String(result.stdout || "{}").trim());
  assert.equal(payload.status, "pass");
});

test("runScriptWithSwaps keeps authoritative nonzero stage output instead of falling through to javascript", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-script-swap-authoritative-fail-"));
  const scriptPath = path.join(tempDir, "authoritative-fail.js");
  const catalogPath = path.join(tempDir, "swap-catalog.json");

  fs.writeFileSync(
    scriptPath,
    [
      '"use strict";',
      "process.stdout.write(`${JSON.stringify({ status: 'fail', source: 'python-authoritative' })}\\n`);",
      "process.exit(1);"
    ].join("\n"),
    "utf8"
  );

  fs.writeFileSync(
    catalogPath,
    `${JSON.stringify(
      {
        schema_version: 1,
        catalog_id: "test_catalog_authoritative_nonzero",
        runtime_contract: {
          baseline_language: "javascript",
          default_language_order: ["javascript", "python"],
          fallback_language: "javascript",
          env_overrides: {
            preferred_language: "AIO_SCRIPT_RUNTIME_LANGUAGE",
            ordered_languages: "AIO_SCRIPT_RUNTIME_ORDER",
            disable_swaps: "AIO_SCRIPT_RUNTIME_DISABLE",
            strict_runtime: "AIO_SCRIPT_RUNTIME_STRICT",
            auto_select_best: "AIO_SCRIPT_RUNTIME_AUTO_BEST"
          }
        },
        adapters: {
          javascript: { kind: "native_node" },
          python: { kind: "native_node" }
        },
        stage_script_map: {
          authoritative_nonzero_stage: {
            script_file: scriptPath,
            preferred_language: "python",
            runtime_order: ["python", "javascript"],
            allow_swaps: true,
            strict_runtime: false
          }
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const result = runScriptWithSwaps({
    stageId: "authoritative_nonzero_stage",
    catalogFile: catalogPath
  });

  assert.equal(result.statusCode, 1);
  assert.equal(result.runtime.selected_language, "python");
  assert.equal(result.runtime.fallback_used, false);
  const payload = JSON.parse(String(result.stdout || "{}").trim());
  assert.equal(payload.source, "python-authoritative");
});
