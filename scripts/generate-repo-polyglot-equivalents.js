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
const PYTHON_SHARED_RUNNER = path.join(PYTHON_ROOT, "_shared", "repo_module_proxy.py");
const CPP_SHARED_RUNNER = path.join(CPP_ROOT, "_shared", "repo_module_proxy.hpp");
const RUBY_SHARED_RUNNER = path.join(RUBY_ROOT, "_shared", "repo_module_proxy.rb");
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

const GENERATED_IGNORE_NAMES = new Set(["__pycache__"]);
const GENERATED_IGNORE_EXTENSIONS = new Set([".exe", ".obj", ".pdb", ".ilk", ".pyc"]);

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
      if (!entry.isFile() || !relativePath.endsWith(".js")) {
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

function shouldIgnoreGeneratedPath(filePath) {
  const baseName = path.basename(filePath);
  if (GENERATED_IGNORE_NAMES.has(baseName)) {
    return true;
  }
  const extension = path.extname(filePath).toLowerCase();
  return GENERATED_IGNORE_EXTENSIONS.has(extension);
}

function buildPythonSharedRunnerContent() {
  return [
    "#!/usr/bin/env python3",
    "\"\"\"Shared runtime for generated repository Python equivalents.\"\"\"",
    "",
    "from __future__ import annotations",
    "",
    "import json",
    "import os",
    "import pathlib",
    "import subprocess",
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
    "            raise RuntimeError(\"repository root not found from generated module equivalent\")",
    "        current = parent",
    "",
    "",
    "def _parse_bridge_output(raw_stdout: str) -> dict:",
    "    lines = [line.strip() for line in str(raw_stdout or \"\").splitlines() if line.strip()]",
    "    for line in reversed(lines):",
    "        try:",
    "            parsed = json.loads(line)",
    "        except json.JSONDecodeError:",
    "            continue",
    "        if isinstance(parsed, dict):",
    "            return parsed",
    "    return {}",
    "",
    "",
    "def _run_bridge(payload: dict) -> dict:",
    "    root = find_repo_root(pathlib.Path(__file__))",
    "    bridge_path = root / \"scripts\" / \"repo-polyglot-module-bridge.js\"",
    "    if not bridge_path.exists():",
    "        raise RuntimeError(f\"missing bridge script: {bridge_path}\")",
    "",
    "    node_exec = os.environ.get(\"AIO_NODE_EXEC\", \"node\")",
    "    completed = subprocess.run(",
    "        [node_exec, str(bridge_path)],",
    "        input=json.dumps(payload),",
    "        capture_output=True,",
    "        text=True,",
    "        cwd=str(root)",
    "    )",
    "    parsed = _parse_bridge_output(completed.stdout)",
    "    if completed.returncode != 0 or not bool(parsed.get(\"ok\", False)):",
    "        detail = str(parsed.get(\"error\", \"\")).strip()",
    "        stderr = str(completed.stderr or \"\").strip()",
    "        message = detail or stderr or \"bridge execution failed\"",
    "        raise RuntimeError(message)",
    "    return parsed",
    "",
    "",
    "def invoke_js_function(source_js_file: str, function_name: str, args=None, kwargs=None):",
    "    payload = {",
    "        \"action\": \"invoke_function\",",
    "        \"source_js_file\": str(source_js_file),",
    "        \"function_name\": str(function_name),",
    "        \"args\": list(args or []),",
    "        \"kwargs\": dict(kwargs or {})",
    "    }",
    "    response = _run_bridge(payload)",
    "    return response.get(\"result\")",
    "",
    "",
    "def run_js_entrypoint(source_js_file: str, args=None):",
    "    payload = {",
    "        \"action\": \"run_entrypoint\",",
    "        \"source_js_file\": str(source_js_file),",
    "        \"args\": [str(item) for item in list(args or [])]",
    "    }",
    "    return _run_bridge(payload)",
    ""
  ].join("\n");
}

function buildCppSharedRunnerContent() {
  return [
    "#pragma once",
    "",
    "#include <cstdlib>",
    "#include <ctime>",
    "#include <filesystem>",
    "#include <fstream>",
    "#include <iostream>",
    "#include <sstream>",
    "#include <string>",
    "#include <system_error>",
    "#include <vector>",
    "",
    "#ifndef _WIN32",
    "#include <sys/wait.h>",
    "#endif",
    "",
    "namespace aio::repo_module_proxy {",
    "",
    "inline std::filesystem::path find_repo_root(std::filesystem::path start) {",
    "  std::filesystem::path current = std::filesystem::absolute(start);",
    "  while (!current.empty()) {",
    "    const auto package_file = current / \"package.json\";",
    "    const auto scripts_dir = current / \"scripts\";",
    "    if (std::filesystem::exists(package_file) && std::filesystem::exists(scripts_dir)) {",
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
    "inline std::string json_escape(const std::string& value) {",
    "  std::string out;",
    "  out.reserve(value.size() + 8);",
    "  for (char ch : value) {",
    "    switch (ch) {",
    "      case '\\\\': out.append(\"\\\\\\\\\"); break;",
    "      case '\"': out.append(\"\\\\\\\"\"); break;",
    "      case '\\n': out.append(\"\\\\n\"); break;",
    "      case '\\r': out.append(\"\\\\r\"); break;",
    "      case '\\t': out.append(\"\\\\t\"); break;",
    "      default: out.push_back(ch); break;",
    "    }",
    "  }",
    "  return out;",
    "}",
    "",
    "inline std::string json_string_array(const std::vector<std::string>& values) {",
    "  std::ostringstream out;",
    "  out << \"[\";",
    "  for (size_t index = 0; index < values.size(); index += 1) {",
    "    if (index > 0) {",
    "      out << \",\";",
    "    }",
    "    out << '\"' << json_escape(values[index]) << '\"';",
    "  }",
    "  out << \"]\";",
    "  return out.str();",
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
    "inline std::string build_invoke_payload(",
    "    const std::string& source_js_file,",
    "    const std::string& function_name,",
    "    const std::string& args_json) {",
    "  std::ostringstream out;",
    "  out << \"{\"",
    "      << \"\\\"action\\\":\\\"invoke_function\\\",\"",
    "      << \"\\\"source_js_file\\\":\\\"\" << json_escape(source_js_file) << \"\\\",\"",
    "      << \"\\\"function_name\\\":\\\"\" << json_escape(function_name) << \"\\\",\"",
    "      << \"\\\"args\\\":\" << (args_json.empty() ? \"[]\" : args_json) << \",\"",
    "      << \"\\\"kwargs\\\":{}\"",
    "      << \"}\";",
    "  return out.str();",
    "}",
    "",
    "inline std::string build_entrypoint_payload(",
    "    const std::string& source_js_file,",
    "    const std::vector<std::string>& args) {",
    "  std::ostringstream out;",
    "  out << \"{\"",
    "      << \"\\\"action\\\":\\\"run_entrypoint\\\",\"",
    "      << \"\\\"source_js_file\\\":\\\"\" << json_escape(source_js_file) << \"\\\",\"",
    "      << \"\\\"args\\\":\" << json_string_array(args)",
    "      << \"}\";",
    "  return out.str();",
    "}",
    "",
    "inline int run_bridge_payload(const std::string& payload_json) {",
    "  const std::filesystem::path root = find_repo_root(std::filesystem::current_path());",
    "  if (root.empty()) {",
    "    std::cerr << \"failed to locate repository root for repo module proxy\\n\";",
    "    return 1;",
    "  }",
    "",
    "  const std::filesystem::path bridge_script = root / \"scripts\" / \"repo-polyglot-module-bridge.js\";",
    "  if (!std::filesystem::exists(bridge_script)) {",
    "    std::cerr << \"missing bridge script: \" << bridge_script.string() << \"\\n\";",
    "    return 1;",
    "  }",
    "",
    "  const auto stamp = static_cast<unsigned long long>(std::time(nullptr));",
    "  const std::filesystem::path payload_file =",
    "      std::filesystem::temp_directory_path() / (\"aio_repo_polyglot_payload_\" + std::to_string(stamp) + \"_\" + std::to_string(std::rand()) + \".json\");",
    "",
    "  {",
    "    std::ofstream stream(payload_file, std::ios::binary | std::ios::trunc);",
    "    if (!stream.good()) {",
    "      std::cerr << \"failed to write payload file for repo module proxy\\n\";",
    "      return 1;",
    "    }",
    "    stream << payload_json;",
    "  }",
    "",
    "  const char* node_exec_env = std::getenv(\"AIO_NODE_EXEC\");",
    "  const std::string node_exec = (node_exec_env != nullptr && node_exec_env[0] != '\\0') ? node_exec_env : \"node\";",
    "  const std::string command = quote_arg(node_exec) + \" \" + quote_arg(bridge_script.string()) +",
    "      \" --payload-file \" + quote_arg(payload_file.string());",
    "",
    "  const int status = std::system(command.c_str());",
    "  std::error_code error_code;",
    "  std::filesystem::remove(payload_file, error_code);",
    "  if (status < 0) {",
    "    return 1;",
    "  }",
    "  return normalize_exit_status(status);",
    "}",
    "",
    "inline int run_invoke_function(",
    "    const std::string& source_js_file,",
    "    const std::string& function_name,",
    "    const std::string& args_json = \"[]\") {",
    "  return run_bridge_payload(build_invoke_payload(source_js_file, function_name, args_json));",
    "}",
    "",
    "inline int run_entrypoint(",
    "    const std::string& source_js_file,",
    "    const std::vector<std::string>& args = {}) {",
    "  return run_bridge_payload(build_entrypoint_payload(source_js_file, args));",
    "}",
    "",
    "inline int dispatch_proxy_cli(const std::string& source_js_file, int argc, char** argv) {",
    "  std::string function_name;",
    "  std::string args_json = \"[]\";",
    "  std::vector<std::string> passthrough_args;",
    "  for (int index = 1; index < argc; index += 1) {",
    "    const std::string token = argv[index] ? argv[index] : \"\";",
    "    if (token == \"--function\") {",
    "      if (index + 1 >= argc) {",
    "        std::cerr << \"--function requires a value\\n\";",
    "        return 2;",
    "      }",
    "      function_name = argv[index + 1] ? argv[index + 1] : \"\";",
    "      index += 1;",
    "      continue;",
    "    }",
    "    if (token == \"--args-json\") {",
    "      if (index + 1 >= argc) {",
    "        std::cerr << \"--args-json requires a value\\n\";",
    "        return 2;",
    "      }",
    "      args_json = argv[index + 1] ? argv[index + 1] : \"[]\";",
    "      index += 1;",
    "      continue;",
    "    }",
    "    passthrough_args.push_back(token);",
    "  }",
    "  if (!function_name.empty()) {",
    "    return run_invoke_function(source_js_file, function_name, args_json);",
    "  }",
    "  return run_entrypoint(source_js_file, passthrough_args);",
    "}",
    "",
    "}  // namespace aio::repo_module_proxy",
    ""
  ].join("\n");
}

function buildRubySharedRunnerContent() {
  return [
    "# frozen_string_literal: true",
    "",
    "require \"json\"",
    "require \"open3\"",
    "require \"pathname\"",
    "",
    "module Aio",
    "  module RepoPolyglotEquivalents",
    "    module Shared",
    "      module RepoModuleProxy",
    "        module_function",
    "",
    "        def find_repo_root(start_path)",
    "          current = Pathname.new(start_path).expand_path",
    "          current = current.dirname if current.file?",
    "          loop do",
    "            package_file = current.join(\"package.json\")",
    "            scripts_dir = current.join(\"scripts\")",
    "            return current if package_file.exist? && scripts_dir.exist?",
    "            parent = current.parent",
    "            raise \"repository root not found\" if parent == current",
    "            current = parent",
    "          end",
    "        end",
    "",
    "        def parse_bridge_output(raw_stdout)",
    "          lines = String(raw_stdout || \"\").lines.map(&:strip).reject(&:empty?)",
    "          lines.reverse_each do |line|",
    "            begin",
    "              parsed = JSON.parse(line)",
    "              return parsed if parsed.is_a?(Hash)",
    "            rescue JSON::ParserError",
    "              next",
    "            end",
    "          end",
    "          {}",
    "        end",
    "",
    "        def run_bridge(payload)",
    "          root = find_repo_root(__dir__)",
    "          bridge_path = root.join(\"scripts\", \"repo-polyglot-module-bridge.js\")",
    "          raise \"missing bridge script: #{bridge_path}\" unless bridge_path.exist?",
    "",
    "          node_exec = ENV.fetch(\"AIO_NODE_EXEC\", \"node\")",
    "          stdout, stderr, status = Open3.capture3(",
    "            node_exec,",
    "            bridge_path.to_s,",
    "            stdin_data: JSON.generate(payload),",
    "            chdir: root.to_s",
    "          )",
    "",
    "          parsed = parse_bridge_output(stdout)",
    "          unless status.success? && parsed[\"ok\"] == true",
    "            detail = String(parsed[\"error\"] || \"\").strip",
    "            err = String(stderr || \"\").strip",
    "            message = detail.empty? ? err : detail",
    "            message = \"bridge execution failed\" if message.empty?",
    "            raise message",
    "          end",
    "",
    "          parsed",
    "        end",
    "",
    "        def invoke_js_function(source_js_file, function_name, args = [], kwargs = {})",
    "          payload = {",
    "            action: \"invoke_function\",",
    "            source_js_file: String(source_js_file),",
    "            function_name: String(function_name),",
    "            args: Array(args),",
    "            kwargs: kwargs.is_a?(Hash) ? kwargs : {}",
    "          }",
    "          run_bridge(payload)[\"result\"]",
    "        end",
    "",
    "        def run_js_entrypoint(source_js_file, args = [])",
    "          payload = {",
    "            action: \"run_entrypoint\",",
    "            source_js_file: String(source_js_file),",
    "            args: Array(args).map(&:to_s)",
    "          }",
    "          run_bridge(payload)",
    "        end",
    "      end",
    "    end",
    "  end",
    "end",
    ""
  ].join("\n");
}

function buildPythonEquivalentContent(entry, targetFilePath) {
  const functionWrappers = Object.entries(entry.language_symbols.python)
    .map(([sourceName, targetName]) =>
      [
        `def ${targetName}(*args, **kwargs):`,
        `    return invoke_source_function(${JSON.stringify(sourceName)}, *args, **kwargs)`
      ].join("\n")
    )
    .join("\n\n");
  const sharedRelativePath = toPosix(path.relative(path.dirname(targetFilePath), PYTHON_SHARED_RUNNER));

  return [
    "#!/usr/bin/env python3",
    "\"\"\"Auto-generated Python equivalent module proxy.\"\"\"",
    "",
    "from __future__ import annotations",
    "",
    "import argparse",
    "import importlib.util",
    "import json",
    "import pathlib",
    "import sys",
    "",
    `AIO_SOURCE_JS_FILE = ${JSON.stringify(entry.source_js_file)}`,
    "AIO_EQUIVALENT_KIND = \"repo_module_proxy\"",
    `AIO_FUNCTION_TOKENS = ${JSON.stringify(entry.function_tokens, null, 2)}`,
    `AIO_SYMBOL_MAP = ${JSON.stringify(entry.language_symbols.python, null, 2)}`,
    "",
    "",
    "def _load_proxy_runner():",
    `    shared_runner_path = (pathlib.Path(__file__).resolve().parent / ${JSON.stringify(sharedRelativePath)}).resolve()`,
    "    spec = importlib.util.spec_from_file_location(\"aio_repo_module_proxy\", shared_runner_path)",
    "    if spec is None or spec.loader is None:",
    "        raise RuntimeError(f\"failed to load shared runner: {shared_runner_path}\")",
    "    module = importlib.util.module_from_spec(spec)",
    "    spec.loader.exec_module(module)",
    "    return module",
    "",
    "",
    "_PROXY = _load_proxy_runner()",
    "",
    "",
    "def module_equivalent_metadata():",
    "    return {",
    "        \"source_js_file\": AIO_SOURCE_JS_FILE,",
    "        \"equivalent_kind\": AIO_EQUIVALENT_KIND,",
    "        \"function_tokens\": list(AIO_FUNCTION_TOKENS),",
    "        \"symbol_map\": dict(AIO_SYMBOL_MAP),",
    "    }",
    "",
    "",
    "def invoke_source_function(function_name, *args, **kwargs):",
    "    return _PROXY.invoke_js_function(AIO_SOURCE_JS_FILE, function_name, list(args), dict(kwargs))",
    "",
    "",
    "def run_source_entrypoint(args=None):",
    "    return _PROXY.run_js_entrypoint(AIO_SOURCE_JS_FILE, list(args or []))",
    "",
    functionWrappers || "# No function tokens discovered.",
    "",
    "",
    "def _main(argv):",
    "    parser = argparse.ArgumentParser(add_help=False)",
    "    parser.add_argument(\"--function\", dest=\"function_name\", default=\"\")",
    "    parser.add_argument(\"--args-json\", dest=\"args_json\", default=\"[]\")",
    "    parsed, _ = parser.parse_known_args(argv)",
    "    if parsed.function_name:",
    "        args = json.loads(parsed.args_json)",
    "        result = invoke_source_function(parsed.function_name, *list(args))",
    "        sys.stdout.write(json.dumps({\"ok\": True, \"result\": result}) + \"\\n\")",
    "        return 0",
    "    report = run_source_entrypoint(argv)",
    "    return int(report.get(\"exit_code\", 0))",
    "",
    "",
    "if __name__ == \"__main__\":",
    "    raise SystemExit(_main(sys.argv[1:]))",
    ""
  ].join("\n");
}

function buildCppEquivalentContent(entry, targetFilePath) {
  const functionWrappers = Object.entries(entry.language_symbols.cpp)
    .map(([sourceName, targetName]) =>
      [
        `inline int ${targetName}(const std::string& args_json = "[]") {`,
        `  return aio::repo_module_proxy::run_invoke_function(source_js_file(), ${JSON.stringify(sourceName)}, args_json);`,
        "}"
      ].join("\n")
    )
    .join("\n\n");
  const sharedRelativePath = toPosix(path.relative(path.dirname(targetFilePath), CPP_SHARED_RUNNER));

  return [
    `// Auto-generated C++ equivalent module proxy for ${entry.source_js_file}.`,
    `#include "${sharedRelativePath}"`,
    "",
    "#include <string>",
    "#include <vector>",
    "",
    `static constexpr const char* AIO_SOURCE_JS_FILE = ${JSON.stringify(entry.source_js_file)};`,
    "",
    `namespace aio::repo_polyglot_equivalents::${toNamespacePath(entry.source_js_file)} {`,
    "",
    "inline const char* source_js_file() {",
    "  return AIO_SOURCE_JS_FILE;",
    "}",
    "",
    "inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {",
    "  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);",
    "}",
    "",
    functionWrappers || "// No function tokens discovered.",
    "",
    "}  // namespace aio::repo_polyglot_equivalents",
    "",
    "int main(int argc, char** argv) {",
    "  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);",
    "}",
    ""
  ].join("\n");
}

function buildRubyEquivalentContent(entry, targetFilePath) {
  const functionWrappers = Object.entries(entry.language_symbols.ruby)
    .map(([sourceName, targetName]) =>
      [
        `      def self.${targetName}(*args, **kwargs)`,
        `        invoke_source_function(${JSON.stringify(sourceName)}, *args, **kwargs)`,
        "      end"
      ].join("\n")
    )
    .join("\n\n");
  const sharedRelativePath = toPosix(path.relative(path.dirname(targetFilePath), RUBY_SHARED_RUNNER)).replace(/\.rb$/i, "");

  return [
    "# frozen_string_literal: true",
    "",
    `require_relative ${JSON.stringify(sharedRelativePath)}`,
    "require \"json\"",
    "",
    "module Aio",
    "  module RepoPolyglotEquivalents",
    "    module ModuleProxy",
    `      SOURCE_JS_FILE = ${JSON.stringify(entry.source_js_file)}`,
    "      EQUIVALENT_KIND = \"repo_module_proxy\"",
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
    "      def self.invoke_source_function(function_name, *args, **kwargs)",
    "        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(",
    "          SOURCE_JS_FILE,",
    "          function_name,",
    "          args,",
    "          kwargs",
    "        )",
    "      end",
    "",
    "      def self.run_source_entrypoint(args = [])",
    "        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)",
    "      end",
    "",
    functionWrappers || "      # No function tokens discovered.",
    "    end",
    "  end",
    "end",
    "",
    "if __FILE__ == $PROGRAM_NAME",
    "  args = ARGV.dup",
    "  function_flag_index = args.index(\"--function\")",
    "  if function_flag_index",
    "    function_name = args[function_flag_index + 1] || \"\"",
    "    args_json_index = args.index(\"--args-json\")",
    "    args_json = args_json_index ? (args[args_json_index + 1] || \"[]\") : \"[]\"",
    "    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(",
    "      function_name,",
    "      *Array(JSON.parse(args_json))",
    "    )",
    "    puts(JSON.generate({ ok: true, result: result }))",
    "    exit(0)",
    "  end",
    "",
    "  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)",
    "  exit(Integer(report.fetch(\"exit_code\", 0)))",
    "end",
    ""
  ].join("\n");
}

function buildTargetsAndEntries() {
  const sourceFiles = listRepositoryJsFiles();
  const targets = new Map();
  const entries = [];

  targets.set(PYTHON_SHARED_RUNNER, buildPythonSharedRunnerContent());
  targets.set(CPP_SHARED_RUNNER, buildCppSharedRunnerContent());
  targets.set(RUBY_SHARED_RUNNER, buildRubySharedRunnerContent());

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
      equivalent_kind: "repo_module_proxy",
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

    targets.set(pythonFile, buildPythonEquivalentContent(entry, pythonFile));
    targets.set(cppFile, buildCppEquivalentContent(entry, cppFile));
    targets.set(rubyFile, buildRubyEquivalentContent(entry, rubyFile));
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
      if (shouldIgnoreGeneratedPath(absolutePath)) {
        return;
      }
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
    schema_version: 2,
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
      python_equivalent_count: entries.length + 1,
      cpp_equivalent_count: entries.length + 1,
      ruby_equivalent_count: entries.length + 1
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
