#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SCRIPTS_ROOT = path.join(ROOT, "scripts");
const EQUIVALENTS_ROOT = path.join(SCRIPTS_ROOT, "polyglot", "equivalents");
const PYTHON_EQUIVALENTS_ROOT = path.join(EQUIVALENTS_ROOT, "python");
const CPP_EQUIVALENTS_ROOT = path.join(EQUIVALENTS_ROOT, "cpp");
const PYTHON_SHARED_RUNTIME = path.join(PYTHON_EQUIVALENTS_ROOT, "_shared", "native_script_runtime.py");
const CPP_SHARED_RUNTIME = path.join(CPP_EQUIVALENTS_ROOT, "_shared", "native_script_runtime.hpp");
const PYTHON_LEGACY_SHARED_PROXY = path.join(PYTHON_EQUIVALENTS_ROOT, "_shared", "node_script_proxy.py");
const CPP_LEGACY_SHARED_PROXY = path.join(CPP_EQUIVALENTS_ROOT, "_shared", "node_script_proxy.hpp");
const PYTHON_NATIVE_IMPL_ROOT = path.join(PYTHON_EQUIVALENTS_ROOT, "_native");
const MANUAL_EQUIVALENT_DIRS = new Set(["_native", "__pycache__"]);
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

function buildPythonSharedRuntimeContent() {
  return [
    "#!/usr/bin/env python3",
    "\"\"\"Shared runtime for generated Python script equivalents.\"\"\"",
    "",
    "from __future__ import annotations",
    "",
    "import importlib.util",
    "import os",
    "import pathlib",
    "import subprocess",
    "import sys",
    "",
    "ALLOW_JS_FALLBACK_ENV = \"AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK\"",
    "",
    "",
    "def normalize_path(value: str) -> str:",
    "    return str(value or \"\").replace('\\\\', '/')",
    "",
    "",
    "def parse_truthy(value: str) -> bool:",
    "    return str(value or \"\").strip().lower() in {\"1\", \"true\", \"yes\", \"on\"}",
    "",
    "",
    "def to_snake_case_base_name(file_name: str) -> str:",
    "    return str(file_name or \"\").replace('.js', '').replace('-', '_')",
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
    "def script_relative_to_native_impl_relative(script_relative_path: str) -> pathlib.PurePosixPath:",
    "    source = pathlib.PurePosixPath(normalize_path(script_relative_path))",
    "    parts = list(source.parts)",
    "    if parts and parts[0] == \"scripts\":",
    "        parts = parts[1:]",
    "    if not parts:",
    "        raise RuntimeError(\"script_relative_path is required\")",
    "    file_name = parts.pop()",
    "    return pathlib.PurePosixPath(\"_native\", *parts, f\"{to_snake_case_base_name(file_name)}.py\")",
    "",
    "",
    "def run_node_compat(script_relative_path: str, argv: list[str] | None = None) -> int:",
    "    args = list(argv or [])",
    "    root = find_repo_root(pathlib.Path(__file__))",
    "    script_path = root / pathlib.PurePosixPath(script_relative_path)",
    "    if not script_path.exists():",
    "        sys.stderr.write(f\"missing script target: {script_path}\\\\n\")",
    "        return 1",
    "    node_exec = os.environ.get(\"AIO_NODE_EXEC\", \"node\")",
    "    env = {**os.environ, \"AIO_PYTHON_EXEC\": os.environ.get(\"AIO_PYTHON_EXEC\", sys.executable)}",
    "    completed = subprocess.run([node_exec, str(script_path), *args], cwd=str(root), env=env)",
    "    return int(completed.returncode)",
    "",
    "",
    "def load_native_module(script_relative_path: str):",
    "    root = find_repo_root(pathlib.Path(__file__))",
    "    equivalents_root = root / pathlib.PurePosixPath(\"scripts/polyglot/equivalents/python\")",
    "    native_root = equivalents_root / \"_native\"",
    "    native_impl_path = equivalents_root / script_relative_to_native_impl_relative(script_relative_path)",
    "    if not native_impl_path.exists():",
    "        return None",
    "    native_root_text = str(native_root)",
    "    if native_root_text not in sys.path:",
    "        sys.path.insert(0, native_root_text)",
    "    module_name = \"aio_native_script_\" + normalize_path(script_relative_path).replace('/', '_').replace('.', '_').replace('-', '_')",
    "    spec = importlib.util.spec_from_file_location(module_name, native_impl_path)",
    "    if spec is None or spec.loader is None:",
    "        raise RuntimeError(f\"failed to load native script implementation: {native_impl_path}\")",
    "    module = importlib.util.module_from_spec(spec)",
    "    spec.loader.exec_module(module)",
    "    return module",
    "",
    "",
    "def run_native_script(script_relative_path: str, argv: list[str] | None = None) -> int:",
    "    module = load_native_module(script_relative_path)",
    "    if module is not None:",
    "        entrypoint = getattr(module, \"main\", None) or getattr(module, \"run\", None) or getattr(module, \"run_native\", None)",
    "        if not callable(entrypoint):",
    "            raise RuntimeError(f\"native implementation missing main()/run() entrypoint for {script_relative_path}\")",
    "        result = entrypoint(list(argv or []))",
    "        return int(result or 0)",
    "    allow_fallback = ALLOW_JS_FALLBACK_ENV not in os.environ or parse_truthy(os.environ.get(ALLOW_JS_FALLBACK_ENV, \"1\"))",
    "    if allow_fallback:",
    "        return run_node_compat(script_relative_path, argv)",
    "    sys.stderr.write(f\"native Python equivalent not implemented for {script_relative_path} and JS fallback is disabled\\\\n\")",
    "    return 1",
    ""
  ].join("\n");
}

function buildCppSharedRuntimeContent() {
  return [
    "#pragma once",
    "",
    "#include <cstdlib>",
    "#include <filesystem>",
    "#include <iostream>",
    "#include <string>",
    "#include <vector>",
    "",
    "#ifdef _WIN32",
    "#include <process.h>",
    "#else",
    "#include <sys/wait.h>",
    "#endif",
    "",
    "namespace aio::native_script_runtime {",
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
    "inline std::string resolve_python_exec() {",
    "#ifdef _WIN32",
    "  char* pythonExecEnv = nullptr;",
    "  std::size_t envLength = 0;",
    "  if (_dupenv_s(&pythonExecEnv, &envLength, \"AIO_PYTHON_EXEC\") == 0 && pythonExecEnv != nullptr) {",
    "    std::string value = pythonExecEnv;",
    "    std::free(pythonExecEnv);",
    "    if (!value.empty()) {",
    "      return value;",
    "    }",
    "  }",
    "  if (pythonExecEnv != nullptr) {",
    "    std::free(pythonExecEnv);",
    "  }",
    "#else",
    "  const char* pythonExecEnv = std::getenv(\"AIO_PYTHON_EXEC\");",
    "  if (pythonExecEnv != nullptr && pythonExecEnv[0] != '\\0') {",
    "    return pythonExecEnv;",
    "  }",
    "#endif",
    "  return \"python\";",
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
    "inline std::string normalize_slashes(std::string value) {",
    "  for (char& ch : value) {",
    "    if (ch == '\\\\') {",
    "      ch = '/';",
    "    }",
    "  }",
    "  return value;",
    "}",
    "",
    "inline std::string to_snake_case_base_name(const std::string& file_name) {",
    "  std::string base = file_name;",
    "  const std::string suffix = \".js\";",
    "  if (base.size() >= suffix.size() && base.substr(base.size() - suffix.size()) == suffix) {",
    "    base = base.substr(0, base.size() - suffix.size());",
    "  }",
    "  for (char& ch : base) {",
    "    if (ch == '-') {",
    "      ch = '_';",
    "    }",
    "  }",
    "  return base;",
    "}",
    "",
    "inline std::filesystem::path resolve_python_equivalent_path(const std::filesystem::path& root, const std::string& script_relative_path) {",
    "  std::filesystem::path source = std::filesystem::path(normalize_slashes(script_relative_path));",
    "  std::filesystem::path relative;",
    "  auto iter = source.begin();",
    "  if (iter != source.end() && iter->string() == \"scripts\") {",
    "    ++iter;",
    "  }",
    "  for (; iter != source.end(); ++iter) {",
    "    relative /= *iter;",
    "  }",
    "  const std::string file_name = relative.filename().string();",
    "  relative.replace_filename(to_snake_case_base_name(file_name) + \".py\");",
    "  return root / \"scripts\" / \"polyglot\" / \"equivalents\" / \"python\" / relative;",
    "}",
    "",
    "#ifdef _WIN32",
    "inline int spawn_windows_python(",
    "    const std::string& python_exec,",
    "    const std::filesystem::path& python_equivalent,",
    "    int argc,",
    "    char** argv) {",
    "  std::vector<std::string> arguments;",
    "  arguments.reserve(static_cast<std::size_t>(argc > 1 ? argc + 1 : 2));",
    "  arguments.push_back(python_exec);",
    "  arguments.push_back(python_equivalent.string());",
    "  for (int index = 1; index < argc; index += 1) {",
    "    if (argv != nullptr && argv[index] != nullptr) {",
    "      arguments.push_back(argv[index]);",
    "    }",
    "  }",
    "",
    "  std::vector<const char*> rawArguments;",
    "  rawArguments.reserve(arguments.size() + 1);",
    "  for (const auto& argument : arguments) {",
    "    rawArguments.push_back(argument.c_str());",
    "  }",
    "  rawArguments.push_back(nullptr);",
    "",
    "  const intptr_t status = _spawnvp(_P_WAIT, python_exec.c_str(), rawArguments.data());",
    "  if (status == -1) {",
    "    return 1;",
    "  }",
    "  return static_cast<int>(status);",
    "}",
    "#endif",
    "",
    "inline int run_native_script(const std::string& script_relative_path, int argc, char** argv) {",
    "  const std::filesystem::path executablePath =",
    "      (argc > 0 && argv != nullptr) ? std::filesystem::path(argv[0]) : std::filesystem::path(\".\");",
    "  const std::filesystem::path root = find_repo_root(executablePath.parent_path());",
    "  if (root.empty()) {",
    "    std::cerr << \"failed to locate repository root for generated C++ equivalent\\n\";",
    "    return 1;",
    "  }",
    "",
    "  const std::filesystem::path pythonEquivalent = resolve_python_equivalent_path(root, script_relative_path);",
    "  if (!std::filesystem::exists(pythonEquivalent)) {",
    "    std::cerr << \"missing Python equivalent target: \" << pythonEquivalent.string() << \"\\n\";",
    "    return 1;",
    "  }",
    "",
    "  const std::string pythonExec = resolve_python_exec();",
    "",
    "#ifdef _WIN32",
    "  return spawn_windows_python(pythonExec, pythonEquivalent, argc, argv);",
    "#else",
    "  std::string command = quote_arg(pythonExec) + \" \" + quote_arg(pythonEquivalent.string());",
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
    "#endif",
    "}",
    "",
    "}  // namespace aio::native_script_runtime",
    ""
  ].join("\n");
}

function buildPythonLegacyProxyShimContent() {
  return [
    "#!/usr/bin/env python3",
    "\"\"\"Retired compatibility shim for the old Node-backed script proxy.\"\"\"",
    "",
    "from __future__ import annotations",
    "",
    "",
    "def run_node_script(script_relative_path: str, argv: list[str] | None = None) -> int:",
    "    raise RuntimeError(",
    "        \"node_script_proxy.py is retired; regenerate wrappers or use _shared/native_script_runtime.py instead\"",
    "    )",
    ""
  ].join("\n");
}

function buildCppLegacyProxyShimContent() {
  return [
    "#pragma once",
    "",
    "#include <iostream>",
    "#include <string>",
    "",
    "namespace aio::script_proxy {",
    "",
    "inline int run_node_script(const std::string&, int, char**) {",
    "  std::cerr << \"node_script_proxy.hpp is retired; regenerate wrappers or use _shared/native_script_runtime.hpp instead\\n\";",
    "  return 1;",
    "}",
    "",
    "}  // namespace aio::script_proxy",
    ""
  ].join("\n");
}

function buildPythonWrapperContent(scriptRelativePath, wrapperFilePath) {
  const wrapperDir = path.dirname(wrapperFilePath);
  const sharedRelativePath = toPosix(path.relative(wrapperDir, PYTHON_SHARED_RUNTIME));
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
    "def _load_runtime():",
    `    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "${sharedRelativePath}").resolve()`,
    "    spec = importlib.util.spec_from_file_location(\"aio_native_script_runtime\", shared_runner_path)",
    "    if spec is None or spec.loader is None:",
    "        raise RuntimeError(f\"failed to load shared runtime: {shared_runner_path}\")",
    "    module = importlib.util.module_from_spec(spec)",
    "    spec.loader.exec_module(module)",
    "    return module.run_native_script",
    "",
    "",
    "if __name__ == \"__main__\":",
    "    run_native_script = _load_runtime()",
    `    raise SystemExit(run_native_script("scripts/${scriptRelativePath}", sys.argv[1:]))`,
    ""
  ].join("\n");
}

function buildCppWrapperContent(scriptRelativePath, wrapperFilePath) {
  const wrapperDir = path.dirname(wrapperFilePath);
  const sharedRelativePath = toPosix(path.relative(wrapperDir, CPP_SHARED_RUNTIME));
  return [
    `// Auto-generated C++ equivalent for scripts/${scriptRelativePath}.`,
    `#include "${sharedRelativePath}"`,
    "",
    "int main(int argc, char** argv) {",
    `  return aio::native_script_runtime::run_native_script("scripts/${scriptRelativePath}", argc, argv);`,
    "}",
    ""
  ].join("\n");
}

function buildEquivalentTargets() {
  const scriptFiles = listScriptSourceFiles();
  const targets = new Map();
  const entries = [];

  targets.set(PYTHON_SHARED_RUNTIME, buildPythonSharedRuntimeContent());
  targets.set(CPP_SHARED_RUNTIME, buildCppSharedRuntimeContent());
  targets.set(PYTHON_LEGACY_SHARED_PROXY, buildPythonLegacyProxyShimContent());
  targets.set(CPP_LEGACY_SHARED_PROXY, buildCppLegacyProxyShimContent());

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
    const pythonNativeImplPath = path.join(PYTHON_NATIVE_IMPL_ROOT, ...pythonRelativeFile.split("/"));
    const pythonNativeImplemented = fs.existsSync(pythonNativeImplPath);

    targets.set(pythonFilePath, buildPythonWrapperContent(relFromScripts, pythonFilePath));
    targets.set(cppFilePath, buildCppWrapperContent(relFromScripts, cppFilePath));

    entries.push({
      script_id: relFromScripts.replace(/\.js$/i, "").replace(/[/-]/g, "_"),
      source_js_file: `scripts/${relFromScripts}`,
      python_equivalent_file: `scripts/polyglot/equivalents/python/${pythonRelativeFile}`,
      cpp_equivalent_file: `scripts/polyglot/equivalents/cpp/${cppRelativeFile}`,
      python_runtime_kind: "native_dispatch",
      cpp_runtime_kind: "native_dispatch",
      python_native_implemented: pythonNativeImplemented,
      python_native_impl_file: pythonNativeImplemented
        ? `scripts/polyglot/equivalents/python/_native/${pythonRelativeFile}`
        : "",
      cpp_dispatch_strategy: "python_delegate",
      js_compat_fallback_env: "AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK"
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
        if (MANUAL_EQUIVALENT_DIRS.has(entry.name)) {
          return;
        }
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
  const pythonNativeImplementationCount = entries.filter((entry) => entry.python_native_implemented === true).length;
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
      cpp_equivalent_count: entries.length + 1,
      python_native_implementation_count: pythonNativeImplementationCount,
      cpp_native_dispatch_count: entries.length
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
