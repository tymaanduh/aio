#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const SOURCE_FILE = path.join(__dirname, "node_script_bridge.cpp");
const BUILD_DIR = path.join(ROOT, "data", "output", "databases", "polyglot-default", "build", "polyglot_script_swaps", "bin");
const BINARY_FILE = path.join(BUILD_DIR, process.platform === "win32" ? "node_script_bridge.exe" : "node_script_bridge");

const COMPILER_PATH_CANDIDATES = Object.freeze([
  path.join("C:", "Program Files", "LLVM", "bin", "clang++.exe"),
  path.join("C:", "Program Files (x86)", "LLVM", "bin", "clang++.exe")
]);

function parseArgs(argv) {
  const args = {
    nodeExec: "",
    scriptPath: "",
    scriptArgs: []
  };

  let passthrough = false;
  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index] || "").trim();
    if (token === "--") {
      passthrough = true;
      continue;
    }
    if (passthrough) {
      args.scriptArgs.push(token);
      continue;
    }
    if (token === "--node-exec") {
      args.nodeExec = String(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (token === "--script") {
      args.scriptPath = String(argv[index + 1] || "");
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${token}`);
  }

  if (!args.nodeExec || !args.scriptPath) {
    throw new Error("cpp_node_bridge requires --node-exec <path> and --script <path>");
  }
  return args;
}

function runCommand(command, commandArgs) {
  return spawnSync(command, commandArgs, {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
}

function commandExists(command) {
  const result = runCommand(command, ["--version"]);
  return Number(result.status || 1) === 0;
}

function resolveCompiler() {
  const envCompiler = String(process.env.AIO_CPP_COMPILER || "").trim();
  if (envCompiler) {
    return envCompiler;
  }
  if (commandExists("g++")) {
    return "g++";
  }
  if (commandExists("clang++")) {
    return "clang++";
  }
  for (const candidate of COMPILER_PATH_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return "";
}

function shouldRebuildBinary() {
  if (!fs.existsSync(BINARY_FILE)) {
    return true;
  }
  const sourceStat = fs.statSync(SOURCE_FILE);
  const binaryStat = fs.statSync(BINARY_FILE);
  return sourceStat.mtimeMs > binaryStat.mtimeMs;
}

function buildBridgeBinary() {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  const compiler = resolveCompiler();
  if (!compiler) {
    throw new Error("no C++ compiler found for cpp_node_bridge (set AIO_CPP_COMPILER or install g++/clang++)");
  }

  if (!shouldRebuildBinary()) {
    return BINARY_FILE;
  }

  const compileArgs = ["-std=c++17", SOURCE_FILE, "-O2", "-o", BINARY_FILE];
  const compile = runCommand(compiler, compileArgs);
  if (Number(compile.status || 0) !== 0) {
    const output = `${String(compile.stdout || "")}${String(compile.stderr || "")}`.trim();
    throw new Error(`cpp bridge compile failed: ${output}`);
  }
  return BINARY_FILE;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const bridgeBinary = buildBridgeBinary();
  const run = runCommand(bridgeBinary, [args.nodeExec, args.scriptPath, ...args.scriptArgs]);
  if (run.stdout) {
    process.stdout.write(run.stdout);
  }
  if (run.stderr) {
    process.stderr.write(run.stderr);
  }
  process.exit(Number(run.status || 0));
}

try {
  main();
} catch (error) {
  process.stderr.write(`cpp_node_bridge failed: ${error.message}\n`);
  process.exit(1);
}
