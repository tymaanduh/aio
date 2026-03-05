"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  resolveLanguageOrder,
  runScriptWithSwaps,
  loadCatalog
} = require("../scripts/lib/polyglot-script-swap-runner.js");

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
  assert.equal(Array.isArray(result.runtime.selection.resolved_order), true);
});
