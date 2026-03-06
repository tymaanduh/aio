"use strict";

const fs = require("fs");
const path = require("path");
const Module = require("module");
const { spawnSync } = require("child_process");

let CHILD_PROCESS_SPAWN_ALLOWED_CACHE = null;

class ScriptExitSignal extends Error {
  constructor(code) {
    super(`script exited with code ${code}`);
    this.name = "ScriptExitSignal";
    this.code = Number.isFinite(Number(code)) ? Number(code) : 0;
  }
}

function childProcessSpawnAllowed() {
  if (typeof CHILD_PROCESS_SPAWN_ALLOWED_CACHE === "boolean") {
    return CHILD_PROCESS_SPAWN_ALLOWED_CACHE;
  }

  const probe = spawnSync(process.execPath, ["-e", "process.exit(0)"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  CHILD_PROCESS_SPAWN_ALLOWED_CACHE = !probe.error && Number(probe.status || 0) === 0;
  return CHILD_PROCESS_SPAWN_ALLOWED_CACHE;
}

function normalizeOutputChunk(chunk, encoding) {
  if (Buffer.isBuffer(chunk)) {
    return chunk.toString(typeof encoding === "string" ? encoding : "utf8");
  }
  return String(chunk || "");
}

function runNodeScriptInProcess(scriptPath, scriptArgs = [], options = {}) {
  const absoluteScriptPath = path.resolve(String(scriptPath || ""));
  const cwd = options.cwd ? path.resolve(String(options.cwd)) : process.cwd();
  const source = fs.readFileSync(absoluteScriptPath, "utf8");
  const stdoutChunks = [];
  const stderrChunks = [];
  const originalArgv = process.argv.slice();
  const originalExit = process.exit;
  const originalExitCode = process.exitCode;
  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const originalStderrWrite = process.stderr.write.bind(process.stderr);
  const originalMainModule = process.mainModule;
  const originalCwd = process.cwd();
  const originalCachedModule = require.cache[absoluteScriptPath];
  const scriptModule = new Module(absoluteScriptPath, module.parent || module);
  let runtimeError = null;
  let statusCode = 0;

  scriptModule.filename = absoluteScriptPath;
  scriptModule.id = ".";
  scriptModule.paths = Module._nodeModulePaths(path.dirname(absoluteScriptPath));

  process.argv = [process.execPath, absoluteScriptPath, ...scriptArgs.map((entry) => String(entry))];
  process.exitCode = 0;
  process.mainModule = scriptModule;
  if (cwd !== originalCwd) {
    process.chdir(cwd);
  }

  process.exit = (code = 0) => {
    throw new ScriptExitSignal(code);
  };
  process.stdout.write = (chunk, encoding, callback) => {
    stdoutChunks.push(normalizeOutputChunk(chunk, encoding));
    if (typeof callback === "function") {
      callback();
    }
    return true;
  };
  process.stderr.write = (chunk, encoding, callback) => {
    stderrChunks.push(normalizeOutputChunk(chunk, encoding));
    if (typeof callback === "function") {
      callback();
    }
    return true;
  };

  require.cache[absoluteScriptPath] = scriptModule;

  try {
    scriptModule._compile(source, absoluteScriptPath);
    statusCode = Number(process.exitCode || 0);
  } catch (error) {
    if (error instanceof ScriptExitSignal) {
      statusCode = Number(error.code || process.exitCode || 0);
    } else {
      runtimeError = error;
      statusCode = Number(process.exitCode || 1) || 1;
      stderrChunks.push(`${String(error && error.stack ? error.stack : error && error.message ? error.message : error)}\n`);
    }
  } finally {
    process.argv = originalArgv;
    process.exit = originalExit;
    process.exitCode = originalExitCode;
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
    process.mainModule = originalMainModule;
    if (process.cwd() !== originalCwd) {
      process.chdir(originalCwd);
    }
    if (originalCachedModule) {
      require.cache[absoluteScriptPath] = originalCachedModule;
    } else {
      delete require.cache[absoluteScriptPath];
    }
  }

  return {
    status: statusCode,
    stdout: stdoutChunks.join(""),
    stderr: stderrChunks.join(""),
    error: runtimeError,
    mode: "in_process"
  };
}

function runNodeScript(scriptPath, scriptArgs = [], options = {}) {
  const absoluteScriptPath = path.resolve(String(scriptPath || ""));
  const cwd = options.cwd ? path.resolve(String(options.cwd)) : process.cwd();

  if (!options.forceInProcess && childProcessSpawnAllowed()) {
    const result = spawnSync(process.execPath, [absoluteScriptPath, ...scriptArgs.map((entry) => String(entry))], {
      cwd,
      encoding: "utf8",
      shell: false
    });
    return {
      status: result.error ? 1 : typeof result.status === "number" ? Number(result.status) : 1,
      stdout: String(result.stdout || ""),
      stderr: `${String(result.stderr || "")}${result.error ? String(result.error.message || result.error) : ""}`,
      error: result.error || null,
      mode: "child_process"
    };
  }

  return runNodeScriptInProcess(absoluteScriptPath, scriptArgs, { cwd });
}

module.exports = {
  childProcessSpawnAllowed,
  runNodeScript,
  runNodeScriptInProcess
};
