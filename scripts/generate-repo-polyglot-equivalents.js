#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_ROOT = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "generated",
  "repo_polyglot_equivalents"
);
const PYTHON_ROOT = path.join(OUTPUT_ROOT, "python");
const CPP_ROOT = path.join(OUTPUT_ROOT, "cpp");
const RUBY_ROOT = path.join(OUTPUT_ROOT, "ruby");
const CATALOG_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "repo_polyglot_equivalents_catalog.json"
);

const ROOT_SKIP_PREFIXES = Object.freeze([
  ".git/",
  ".github/",
  ".vs/",
  ".vscode/",
  "node_modules/",
  "dist/",
  "data/output/",
  "scripts/polyglot/equivalents/",
  "native/dx12/build/"
]);

function parseArgs(argv) {
  return {
    check: argv.includes("--check")
  };
}

function toPosix(value) {
  return String(value || "").replace(/\\/g, "/");
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function normalizeRelativePath(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function shouldSkip(relativePath) {
  const normalized = `${toPosix(relativePath).replace(/^\.\/+/, "")}`;
  return ROOT_SKIP_PREFIXES.some((prefix) => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix));
}

function listRepositoryJsFiles() {
  const files = [];
  const queue = [ROOT];
  while (queue.length > 0) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absolutePath = path.join(current, entry.name);
      const relativePath = normalizeRelativePath(absolutePath);
      if (shouldSkip(relativePath)) {
        return;
      }
      if (entry.isDirectory()) {
        queue.push(absolutePath);
        return;
      }
      if (!entry.isFile()) {
        return;
      }
      if (!relativePath.endsWith(".js")) {
        return;
      }
      files.push(absolutePath);
    });
  }
  return files.sort((left, right) => normalizeRelativePath(left).localeCompare(normalizeRelativePath(right)));
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

function extractFunctionTokens(sourceText) {
  const source = String(sourceText || "");
  const tokens = [];

  const declarationPattern = /\b(?:async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g;
  let match = declarationPattern.exec(source);
  while (match) {
    tokens.push(String(match[1] || "").trim());
    match = declarationPattern.exec(source);
  }

  const assignedPattern =
    /\b(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][A-Za-z0-9_$]*\s*=>)/g;
  match = assignedPattern.exec(source);
  while (match) {
    tokens.push(String(match[1] || "").trim());
    match = assignedPattern.exec(source);
  }

  const exportsPattern = /\b(?:module\.exports|exports)\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=/g;
  match = exportsPattern.exec(source);
  while (match) {
    tokens.push(String(match[1] || "").trim());
    match = exportsPattern.exec(source);
  }

  return uniqueSorted(tokens);
}

function toSnake(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function toCppIdentifier(value) {
  const token = String(value || "")
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (!token) {
    return "unknown_symbol";
  }
  if (/^[0-9]/.test(token)) {
    return `f_${token}`;
  }
  return token;
}

function toRubyIdentifier(value) {
  const token = toSnake(value);
  if (!token) {
    return "unknown_symbol";
  }
  if (/^[0-9]/.test(token)) {
    return `f_${token}`;
  }
  return token;
}

function toPythonIdentifier(value) {
  const token = toSnake(value);
  if (!token) {
    return "unknown_symbol";
  }
  if (/^[0-9]/.test(token)) {
    return `f_${token}`;
  }
  return token;
}

function buildLanguageSymbolMap(functionTokens, transform) {
  const map = {};
  const used = new Set();
  functionTokens.forEach((token) => {
    const base = transform(token) || "unknown_symbol";
    let candidate = base;
    let index = 2;
    while (used.has(candidate)) {
      candidate = `${base}_${index}`;
      index += 1;
    }
    used.add(candidate);
    map[token] = candidate;
  });
  return map;
}

function toNamespacePath(relativeJsPath) {
  const withoutExt = relativeJsPath.replace(/\.js$/i, "");
  return withoutExt
    .split("/")
    .map((part) =>
      part
        .replace(/[^A-Za-z0-9_]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase() || "segment"
    )
    .join("::");
}

function buildPythonEquivalentContent(entry) {
  const stubs = Object.entries(entry.language_symbols.python)
    .map(([sourceName, targetName]) => {
      return [
        `def ${targetName}(*args, **kwargs):`,
        `    raise NotImplementedError("Equivalent stub for '${sourceName}' from ${entry.source_js_file}")`
      ].join("\n");
    })
    .join("\n\n");

  return [
    '"""Auto-generated Python equivalent module stub."""',
    "",
    `AIO_SOURCE_JS_FILE = ${JSON.stringify(entry.source_js_file)}`,
    "AIO_EQUIVALENT_KIND = \"repo_module_stub\"",
    `AIO_FUNCTION_TOKENS = ${JSON.stringify(entry.function_tokens, null, 2)}`,
    `AIO_SYMBOL_MAP = ${JSON.stringify(entry.language_symbols.python, null, 2)}`,
    "",
    "def module_equivalent_metadata():",
    "    return {",
    "        \"source_js_file\": AIO_SOURCE_JS_FILE,",
    "        \"equivalent_kind\": AIO_EQUIVALENT_KIND,",
    "        \"function_tokens\": list(AIO_FUNCTION_TOKENS),",
    "        \"symbol_map\": dict(AIO_SYMBOL_MAP),",
    "    }",
    "",
    stubs || "# No function tokens discovered.",
    ""
  ].join("\n");
}

function buildCppEquivalentContent(entry) {
  const stubs = Object.entries(entry.language_symbols.cpp)
    .map(([sourceName, targetName]) => {
      return [
        `inline void ${targetName}() {`,
        `  throw std::runtime_error("Equivalent stub for '${toPosix(sourceName)}' from ${entry.source_js_file}");`,
        "}"
      ].join("\n");
    })
    .join("\n\n");

  return [
    `// Auto-generated C++ equivalent module stub for ${entry.source_js_file}.`,
    "#include <stdexcept>",
    "#include <string>",
    "",
    `namespace aio::repo_polyglot_equivalents::${toNamespacePath(entry.source_js_file)} {`,
    "",
    "inline const char* source_js_file() {",
    `  return "${entry.source_js_file.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}";`,
    "}",
    "",
    stubs || "// No function tokens discovered.",
    "",
    "}  // namespace",
    ""
  ].join("\n");
}

function buildRubyEquivalentContent(entry) {
  const stubs = Object.entries(entry.language_symbols.ruby)
    .map(([sourceName, targetName]) => {
      return [
        `      def self.${targetName}(*args)`,
        `        raise NotImplementedError, \"Equivalent stub for '${sourceName}' from ${entry.source_js_file}\"`,
        "      end"
      ].join("\n");
    })
    .join("\n\n");

  return [
    "# frozen_string_literal: true",
    "",
    "module Aio",
    "  module RepoPolyglotEquivalents",
    "    module ModuleStub",
    `      SOURCE_JS_FILE = ${JSON.stringify(entry.source_js_file)}`,
    "      EQUIVALENT_KIND = \"repo_module_stub\"",
    `      FUNCTION_TOKENS = ${JSON.stringify(entry.function_tokens, null, 2)}`,
    `      SYMBOL_MAP = ${JSON.stringify(entry.language_symbols.ruby, null, 2)}`,
    "",
    "      def self.module_equivalent_metadata",
    "        {",
    "          \"source_js_file\" => SOURCE_JS_FILE,",
    "          \"equivalent_kind\" => EQUIVALENT_KIND,",
    "          \"function_tokens\" => FUNCTION_TOKENS.dup,",
    "          \"symbol_map\" => SYMBOL_MAP.dup",
    "        }",
    "      end",
    "",
    stubs || "      # No function tokens discovered.",
    "    end",
    "  end",
    "end",
    ""
  ].join("\n");
}

function buildTargetsAndEntries() {
  const sourceFiles = listRepositoryJsFiles();
  const targets = new Map();
  const entries = [];

  sourceFiles.forEach((absoluteJsFile) => {
    const sourceJsFile = normalizeRelativePath(absoluteJsFile);
    const sourceText = fs.readFileSync(absoluteJsFile, "utf8");
    const functionTokens = extractFunctionTokens(sourceText);
    const pythonSymbols = buildLanguageSymbolMap(functionTokens, toPythonIdentifier);
    const cppSymbols = buildLanguageSymbolMap(functionTokens, toCppIdentifier);
    const rubySymbols = buildLanguageSymbolMap(functionTokens, toRubyIdentifier);

    const relativeWithoutExt = sourceJsFile.replace(/\.js$/i, "");
    const pythonRelative = `${relativeWithoutExt}.py`;
    const cppRelative = `${relativeWithoutExt}.cpp`;
    const rubyRelative = `${relativeWithoutExt}.rb`;

    const pythonFile = path.join(PYTHON_ROOT, ...pythonRelative.split("/"));
    const cppFile = path.join(CPP_ROOT, ...cppRelative.split("/"));
    const rubyFile = path.join(RUBY_ROOT, ...rubyRelative.split("/"));

    const entry = {
      file_id: relativeWithoutExt.replace(/[/.\\-]+/g, "_"),
      source_js_file: sourceJsFile,
      function_tokens: functionTokens,
      language_symbols: {
        python: pythonSymbols,
        cpp: cppSymbols,
        ruby: rubySymbols
      },
      python_equivalent_file: normalizeRelativePath(pythonFile),
      cpp_equivalent_file: normalizeRelativePath(cppFile),
      ruby_equivalent_file: normalizeRelativePath(rubyFile)
    };

    targets.set(pythonFile, buildPythonEquivalentContent(entry));
    targets.set(cppFile, buildCppEquivalentContent(entry));
    targets.set(rubyFile, buildRubyEquivalentContent(entry));
    entries.push(entry);
  });

  return {
    targets,
    entries: entries.sort((left, right) => left.source_js_file.localeCompare(right.source_js_file))
  };
}

function listFilesRecursive(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }
  const out = [];
  const queue = [rootDir];
  while (queue.length > 0) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(absolutePath);
        return;
      }
      if (entry.isFile()) {
        out.push(absolutePath);
      }
    });
  }
  return out;
}

function removeStaleFiles(targets) {
  const stale = [];
  [PYTHON_ROOT, CPP_ROOT, RUBY_ROOT].forEach((rootDir) => {
    listFilesRecursive(rootDir).forEach((filePath) => {
      if (!targets.has(filePath)) {
        stale.push(filePath);
      }
    });
  });
  stale.forEach((filePath) => fs.unlinkSync(filePath));
  return stale;
}

function buildCatalog(entries) {
  return {
    schema_version: 1,
    catalog_id: "aio_repo_polyglot_equivalents",
    generated_at: new Date().toISOString(),
    root: ".",
    outputs: {
      python_root: normalizeRelativePath(PYTHON_ROOT),
      cpp_root: normalizeRelativePath(CPP_ROOT),
      ruby_root: normalizeRelativePath(RUBY_ROOT),
      catalog_file: normalizeRelativePath(CATALOG_FILE)
    },
    metrics: {
      js_file_count: entries.length,
      python_equivalent_count: entries.length,
      cpp_equivalent_count: entries.length,
      ruby_equivalent_count: entries.length
    },
    entries
  };
}

function normalizeCatalogForComparison(catalog) {
  const payload = catalog && typeof catalog === "object" ? { ...catalog } : {};
  delete payload.generated_at;
  return payload;
}

function runCheck(targets, catalog) {
  const issues = [];
  targets.forEach((expected, filePath) => {
    if (!fs.existsSync(filePath)) {
      issues.push({
        level: "error",
        type: "missing_equivalent_file",
        file: normalizeRelativePath(filePath)
      });
      return;
    }
    const actual = fs.readFileSync(filePath, "utf8");
    if (actual !== expected) {
      issues.push({
        level: "error",
        type: "drifted_equivalent_file",
        file: normalizeRelativePath(filePath)
      });
    }
  });

  [PYTHON_ROOT, CPP_ROOT, RUBY_ROOT].forEach((rootDir) => {
    listFilesRecursive(rootDir).forEach((filePath) => {
      if (!targets.has(filePath)) {
        issues.push({
          level: "error",
          type: "stale_equivalent_file",
          file: normalizeRelativePath(filePath)
        });
      }
    });
  });

  if (!fs.existsSync(CATALOG_FILE)) {
    issues.push({
      level: "error",
      type: "missing_equivalent_catalog",
      file: normalizeRelativePath(CATALOG_FILE)
    });
  } else {
    try {
      const existingCatalog = JSON.parse(fs.readFileSync(CATALOG_FILE, "utf8"));
      const existingNormalized = JSON.stringify(normalizeCatalogForComparison(existingCatalog));
      const expectedNormalized = JSON.stringify(normalizeCatalogForComparison(catalog));
      if (existingNormalized !== expectedNormalized) {
        issues.push({
          level: "error",
          type: "drifted_equivalent_catalog",
          file: normalizeRelativePath(CATALOG_FILE)
        });
      }
    } catch (error) {
      issues.push({
        level: "error",
        type: "invalid_equivalent_catalog_json",
        file: normalizeRelativePath(CATALOG_FILE),
        error: String(error.message || error)
      });
    }
  }

  const report = {
    status: issues.length === 0 ? "pass" : "fail",
    mode: "check",
    generated_at: new Date().toISOString(),
    root: ".",
    metrics: {
      target_file_count: targets.size
    },
    issues
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.status !== "pass") {
    process.exit(1);
  }
}

function runWrite(targets, catalog) {
  targets.forEach((content, filePath) => {
    ensureDirForFile(filePath);
    fs.writeFileSync(filePath, content, "utf8");
  });
  const staleFiles = removeStaleFiles(targets);
  ensureDirForFile(CATALOG_FILE);
  fs.writeFileSync(CATALOG_FILE, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  const report = {
    status: "pass",
    mode: "write",
    generated_at: new Date().toISOString(),
    root: ".",
    metrics: {
      target_file_count: targets.size,
      stale_files_removed: staleFiles.length,
      js_file_count: catalog.metrics.js_file_count
    },
    outputs: catalog.outputs
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { targets, entries } = buildTargetsAndEntries();
  const catalog = buildCatalog(entries);
  if (args.check) {
    runCheck(targets, catalog);
    return;
  }
  runWrite(targets, catalog);
}

try {
  main();
} catch (error) {
  process.stderr.write(`generate-repo-polyglot-equivalents failed: ${error.message}\n`);
  process.exit(1);
}

