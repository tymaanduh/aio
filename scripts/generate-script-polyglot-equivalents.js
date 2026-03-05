#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SCRIPTS_ROOT = path.join(ROOT, "scripts");
const EQUIVALENTS_ROOT = path.join(SCRIPTS_ROOT, "polyglot", "equivalents");
const PYTHON_EQUIVALENTS_ROOT = path.join(EQUIVALENTS_ROOT, "python");
const CPP_EQUIVALENTS_ROOT = path.join(EQUIVALENTS_ROOT, "cpp");
const PYTHON_SHARED_RUNNER = path.join(PYTHON_EQUIVALENTS_ROOT, "_shared", "node_script_proxy.py");
const CPP_SHARED_RUNNER = path.join(CPP_EQUIVALENTS_ROOT, "_shared", "node_script_proxy.hpp");
const CATALOG_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "script_polyglot_equivalents_catalog.json"
);

function parseArgs(argv) {
  return {
    check: argv.includes("--check")
  };
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function toPosix(value) {
  return String(value).replace(/\\/g, "/");
}

function toSnakeCaseBaseName(fileName) {
  const withoutExt = fileName.replace(/\.js$/i, "");
  return withoutExt.replace(/-/g, "_");
}

function listScriptSourceFiles() {
  const files = [];
  const queue = [SCRIPTS_ROOT];

  while (queue.length > 0) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absPath = path.join(current, entry.name);
      const relPath = toPosix(path.relative(SCRIPTS_ROOT, absPath));
      if (entry.isDirectory()) {
        if (relPath === "polyglot/equivalents" || relPath.startsWith("polyglot/equivalents/")) {
          return;
        }
        queue.push(absPath);
        return;
      }
      if (!entry.isFile()) {
        return;
      }
      if (!entry.name.endsWith(".js")) {
        return;
      }
      files.push(absPath);
    });
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function buildPythonSharedRunnerContent() {
  return [
    "#!/usr/bin/env python3",
    "\"\"\"Shared runtime for generated Python equivalents of Node script entrypoints.\"\"\"",
    "",
    "from __future__ import annotations",
    "",
    "import os",
    "import pathlib",
    "import subprocess",
    "import sys",
    "",
    "",
    "def find_repo_root(start_path: pathlib.Path) -> pathlib.Path:",
    "    current = start_path.resolve()",
    "    if current.is_file():",
    "        current = current.parent",
    "    while True:",
    "        if (current / \"package.json\").exists() and (current / \"scripts\").exists():",
    "            return current",
    "        parent = current.parent",
    "        if parent == current:",
    "            raise RuntimeError(\"repository root not found from generated script equivalent\")",
    "        current = parent",
    "",
    "",
    "def run_node_script(script_relative_path: str, argv: list[str] | None = None) -> int:",
    "    args = list(argv or [])",
    "    root = find_repo_root(pathlib.Path(__file__))",
    "    script_path = root / pathlib.PurePosixPath(script_relative_path)",
    "    if not script_path.exists():",
    "        sys.stderr.write(f\"missing script target: {script_path}\\\\n\")",
    "        return 1",
    "    node_exec = os.environ.get(\"AIO_NODE_EXEC\", \"node\")",
    "    completed = subprocess.run([node_exec, str(script_path), *args], cwd=str(root))",
    "    return int(completed.returncode)",
    ""
  ].join("\n");
}

function buildCppSharedRunnerContent() {
  return [
    "#pragma once",
    "",
    "#include <cstdlib>",
    "#include <filesystem>",
    "#include <iostream>",
    "#include <string>",
    "",
    "#ifndef _WIN32",
    "#include <sys/wait.h>",
    "#endif",
    "",
    "namespace aio::script_proxy {",
    "",
    "inline std::filesystem::path find_repo_root(std::filesystem::path start) {",
    "  std::filesystem::path current = std::filesystem::absolute(start);",
    "  while (!current.empty()) {",
    "    const auto packageFile = current / \"package.json\";",
    "    const auto scriptsDir = current / \"scripts\";",
    "    if (std::filesystem::exists(packageFile) && std::filesystem::exists(scriptsDir)) {",
    "      return current;",
    "    }",
    "    if (current == current.root_path()) {",
    "      break;",
    "    }",
    "    current = current.parent_path();",
    "  }",
    "  return {};",
    "}",
    "",
    "inline std::string quote_arg(const std::string& value) {",
    "  std::string out;",
    "  out.reserve(value.size() + 2);",
    "  out.push_back('\"');",
    "  for (char ch : value) {",
    "    if (ch == '\\\\' || ch == '\"') {",
    "      out.push_back('\\\\');",
    "    }",
    "    out.push_back(ch);",
    "  }",
    "  out.push_back('\"');",
    "  return out;",
    "}",
    "",
    "inline int normalize_exit_status(int status) {",
    "#ifdef _WIN32",
    "  return status;",
    "#else",
    "  if (WIFEXITED(status)) {",
    "    return WEXITSTATUS(status);",
    "  }",
    "  if (WIFSIGNALED(status)) {",
    "    return 128 + WTERMSIG(status);",
    "  }",
    "  return status;",
    "#endif",
    "}",
    "",
    "inline int run_node_script(const std::string& script_relative_path, int argc, char** argv) {",
    "  const std::filesystem::path executablePath =",
    "      (argc > 0 && argv != nullptr) ? std::filesystem::path(argv[0]) : std::filesystem::path(\".\");",
    "  const std::filesystem::path root = find_repo_root(executablePath.parent_path());",
    "  if (root.empty()) {",
    "    std::cerr << \"failed to locate repository root for generated script equivalent\\n\";",
    "    return 1;",
    "  }",
    "",
    "  const std::filesystem::path scriptPath = root / std::filesystem::path(script_relative_path);",
    "  if (!std::filesystem::exists(scriptPath)) {",
    "    std::cerr << \"missing script target: \" << scriptPath.string() << \"\\n\";",
    "    return 1;",
    "  }",
    "",
    "  const char* nodeExecEnv = std::getenv(\"AIO_NODE_EXEC\");",
    "  const std::string nodeExec = (nodeExecEnv != nullptr && nodeExecEnv[0] != '\\0') ? nodeExecEnv : \"node\";",
    "  std::string command = quote_arg(nodeExec) + \" \" + quote_arg(scriptPath.string());",
    "  for (int index = 1; index < argc; index += 1) {",
    "    command.append(\" \");",
    "    command.append(quote_arg(argv[index]));",
    "  }",
    "",
    "  const int status = std::system(command.c_str());",
    "  if (status < 0) {",
    "    return 1;",
    "  }",
    "  return normalize_exit_status(status);",
    "}",
    "",
    "}  // namespace aio::script_proxy",
    ""
  ].join("\n");
}

function buildPythonWrapperContent(scriptRelativePath, wrapperFilePath) {
  const wrapperDir = path.dirname(wrapperFilePath);
  const sharedRelativePath = toPosix(path.relative(wrapperDir, PYTHON_SHARED_RUNNER));
  return [
    "#!/usr/bin/env python3",
    `"""Auto-generated Python equivalent for scripts/${scriptRelativePath}."""`,
    "",
    "from __future__ import annotations",
    "",
    "import importlib.util",
    "import pathlib",
    "import sys",
    "",
    "",
    "def _load_runner():",
    `    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "${sharedRelativePath}").resolve()`,
    "    spec = importlib.util.spec_from_file_location(\"aio_node_script_proxy\", shared_runner_path)",
    "    if spec is None or spec.loader is None:",
    "        raise RuntimeError(f\"failed to load shared runner: {shared_runner_path}\")",
    "    module = importlib.util.module_from_spec(spec)",
    "    spec.loader.exec_module(module)",
    "    return module.run_node_script",
    "",
    "",
    "if __name__ == \"__main__\":",
    "    run_node_script = _load_runner()",
    `    raise SystemExit(run_node_script("scripts/${scriptRelativePath}", sys.argv[1:]))`,
    ""
  ].join("\n");
}

function buildCppWrapperContent(scriptRelativePath, wrapperFilePath) {
  const wrapperDir = path.dirname(wrapperFilePath);
  const sharedRelativePath = toPosix(path.relative(wrapperDir, CPP_SHARED_RUNNER));
  return [
    `// Auto-generated C++ equivalent for scripts/${scriptRelativePath}.`,
    `#include "${sharedRelativePath}"`,
    "",
    "int main(int argc, char** argv) {",
    `  return aio::script_proxy::run_node_script("scripts/${scriptRelativePath}", argc, argv);`,
    "}",
    ""
  ].join("\n");
}

function buildEquivalentTargets() {
  const scriptFiles = listScriptSourceFiles();
  const targets = new Map();
  const entries = [];

  targets.set(PYTHON_SHARED_RUNNER, buildPythonSharedRunnerContent());
  targets.set(CPP_SHARED_RUNNER, buildCppSharedRunnerContent());

  scriptFiles.forEach((absScriptPath) => {
    const relFromScripts = toPosix(path.relative(SCRIPTS_ROOT, absScriptPath));
    const scriptDir = path.dirname(relFromScripts);
    const scriptBaseName = path.basename(relFromScripts);
    const snakeBase = toSnakeCaseBaseName(scriptBaseName);
    const normalizedScriptDir = scriptDir === "." ? "" : toPosix(scriptDir);
    const pythonRelativeFile = normalizedScriptDir
      ? `${normalizedScriptDir}/${snakeBase}.py`
      : `${snakeBase}.py`;
    const cppRelativeFile = normalizedScriptDir
      ? `${normalizedScriptDir}/${snakeBase}.cpp`
      : `${snakeBase}.cpp`;

    const pythonFilePath = path.join(PYTHON_EQUIVALENTS_ROOT, ...pythonRelativeFile.split("/"));
    const cppFilePath = path.join(CPP_EQUIVALENTS_ROOT, ...cppRelativeFile.split("/"));

    targets.set(pythonFilePath, buildPythonWrapperContent(relFromScripts, pythonFilePath));
    targets.set(cppFilePath, buildCppWrapperContent(relFromScripts, cppFilePath));

    entries.push({
      script_id: relFromScripts.replace(/\.js$/i, "").replace(/[/-]/g, "_"),
      source_js_file: `scripts/${relFromScripts}`,
      python_equivalent_file: `scripts/polyglot/equivalents/python/${pythonRelativeFile}`,
      cpp_equivalent_file: `scripts/polyglot/equivalents/cpp/${cppRelativeFile}`
    });
  });

  return {
    targets,
    entries
  };
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function listGeneratedFiles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }
  const files = [];
  const queue = [rootDir];
  while (queue.length > 0) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(absPath);
        return;
      }
      if (entry.isFile()) {
        files.push(absPath);
      }
    });
  }
  return files;
}

function writeTargets(targets) {
  targets.forEach((content, filePath) => {
    ensureDirForFile(filePath);
    fs.writeFileSync(filePath, content, "utf8");
  });
}

function removeStaleGeneratedFiles(targets) {
  const stale = [];
  [PYTHON_EQUIVALENTS_ROOT, CPP_EQUIVALENTS_ROOT].forEach((rootDir) => {
    listGeneratedFiles(rootDir).forEach((filePath) => {
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
    catalog_id: "aio_script_polyglot_equivalents",
    generated_at: new Date().toISOString(),
    root: ROOT,
    outputs: {
      python_root: "scripts/polyglot/equivalents/python",
      cpp_root: "scripts/polyglot/equivalents/cpp",
      catalog_file: toPosix(path.relative(ROOT, CATALOG_FILE))
    },
    metrics: {
      script_count: entries.length,
      python_equivalent_count: entries.length + 1,
      cpp_equivalent_count: entries.length + 1
    },
    entries
  };
}

function writeCatalog(catalog) {
  ensureDirForFile(CATALOG_FILE);
  fs.writeFileSync(CATALOG_FILE, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

function normalizeCatalogForComparison(catalog) {
  const payload = catalog && typeof catalog === "object" ? { ...catalog } : {};
  delete payload.generated_at;
  delete payload.root;
  return payload;
}

function runCheck(targets, catalog) {
  const issues = [];
  targets.forEach((expectedContent, filePath) => {
    if (!fs.existsSync(filePath)) {
      issues.push({
        level: "error",
        type: "missing_equivalent",
        file: toPosix(path.relative(ROOT, filePath))
      });
      return;
    }
    const actualContent = readText(filePath);
    if (actualContent !== expectedContent) {
      issues.push({
        level: "error",
        type: "drifted_equivalent",
        file: toPosix(path.relative(ROOT, filePath))
      });
    }
  });

  [PYTHON_EQUIVALENTS_ROOT, CPP_EQUIVALENTS_ROOT].forEach((rootDir) => {
    listGeneratedFiles(rootDir).forEach((filePath) => {
      if (!targets.has(filePath)) {
        issues.push({
          level: "error",
          type: "stale_equivalent",
          file: toPosix(path.relative(ROOT, filePath))
        });
      }
    });
  });

  if (!fs.existsSync(CATALOG_FILE)) {
    issues.push({
      level: "error",
      type: "missing_equivalent_catalog",
      file: toPosix(path.relative(ROOT, CATALOG_FILE))
    });
  } else {
    try {
      const existingCatalog = JSON.parse(readText(CATALOG_FILE));
      const existingSerialized = JSON.stringify(normalizeCatalogForComparison(existingCatalog));
      const expectedSerialized = JSON.stringify(normalizeCatalogForComparison(catalog));
      if (existingSerialized !== expectedSerialized) {
        issues.push({
          level: "error",
          type: "drifted_equivalent_catalog",
          file: toPosix(path.relative(ROOT, CATALOG_FILE))
        });
      }
    } catch (error) {
      issues.push({
        level: "error",
        type: "invalid_equivalent_catalog_json",
        file: toPosix(path.relative(ROOT, CATALOG_FILE)),
        error: String(error.message || error)
      });
    }
  }

  const report = {
    status: issues.length > 0 ? "fail" : "pass",
    mode: "check",
    generated_at: new Date().toISOString(),
    root: ROOT,
    metrics: {
      target_file_count: targets.size
    },
    issues
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (issues.length > 0) {
    process.exit(1);
  }
}

function runWrite(targets, catalog) {
  writeTargets(targets);
  const staleFiles = removeStaleGeneratedFiles(targets);
  writeCatalog(catalog);
  const report = {
    status: "pass",
    mode: "write",
    generated_at: new Date().toISOString(),
    root: ROOT,
    metrics: {
      target_file_count: targets.size,
      stale_files_removed: staleFiles.length,
      script_count: catalog.metrics.script_count
    },
    outputs: {
      python_root: "scripts/polyglot/equivalents/python",
      cpp_root: "scripts/polyglot/equivalents/cpp",
      catalog_file: toPosix(path.relative(ROOT, CATALOG_FILE))
    }
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = buildEquivalentTargets();
  const catalog = buildCatalog(result.entries);
  if (args.check) {
    runCheck(result.targets, catalog);
    return;
  }
  runWrite(result.targets, catalog);
}

try {
  main();
} catch (error) {
  process.stderr.write(`generate-script-polyglot-equivalents failed: ${error.message}\n`);
  process.exit(1);
}
