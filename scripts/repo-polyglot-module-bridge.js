#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const MAX_STDIO_BYTES = 262144;

function truncateText(value, maxLength = MAX_STDIO_BYTES) {
  const text = String(value || "");
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}\n...[truncated]`;
}

function sanitizeForJson(value, depth = 0) {
  if (depth > 4) {
    return "[max_depth_reached]";
  }
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeForJson(entry, depth + 1));
  }
  if (typeof value === "object") {
    const out = {};
    Object.keys(value)
      .sort((left, right) => left.localeCompare(right))
      .forEach((key) => {
        out[key] = sanitizeForJson(value[key], depth + 1);
      });
    return out;
  }
  return String(value);
}

function parseArgs(argv) {
  const args = {
    payloadFile: "",
    payloadBase64: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index] || "").trim();
    if (!token) {
      continue;
    }
    if (token === "--payload-file") {
      args.payloadFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--payload-base64") {
      args.payloadBase64 = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--help" || token === "-h") {
      const help = [
        "repo-polyglot-module-bridge",
        "",
        "Usage:",
        "  node scripts/repo-polyglot-module-bridge.js [--payload-file <path> | --payload-base64 <base64>]",
        "",
        "If no payload arg is passed, JSON payload is read from stdin.",
        ""
      ].join("\n");
      process.stdout.write(help);
      process.exit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function readPayloadText(args) {
  if (args.payloadFile) {
    const filePath = path.resolve(ROOT, args.payloadFile);
    return fs.readFileSync(filePath, "utf8");
  }
  if (args.payloadBase64) {
    return Buffer.from(args.payloadBase64, "base64").toString("utf8");
  }
  return fs.readFileSync(0, "utf8");
}

function parsePayload(raw) {
  const parsed = JSON.parse(String(raw || "{}"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("payload must be a JSON object");
  }
  return parsed;
}

function normalizeJsPath(sourceJsFile) {
  const relative = String(sourceJsFile || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .trim();
  if (!relative.endsWith(".js")) {
    throw new Error("source_js_file must point to a .js file");
  }
  if (!relative || relative.includes("..")) {
    throw new Error("source_js_file must be a repository-relative .js path");
  }
  const absolute = path.resolve(ROOT, relative);
  const normalizedRoot = path.resolve(ROOT) + path.sep;
  if (!absolute.startsWith(normalizedRoot) && absolute !== path.resolve(ROOT)) {
    throw new Error("source_js_file resolved outside repository root");
  }
  if (!fs.existsSync(absolute)) {
    throw new Error(`missing source_js_file: ${relative}`);
  }
  return {
    relative,
    absolute
  };
}

function resolveFunctionCandidate(moduleExports, functionName) {
  const name = String(functionName || "").trim();
  if (!name) {
    throw new Error("function_name is required for invoke_function action");
  }

  if (name === "default" && typeof moduleExports === "function") {
    return moduleExports;
  }

  if (moduleExports && typeof moduleExports[name] === "function") {
    return moduleExports[name];
  }

  if (moduleExports && moduleExports.default && typeof moduleExports.default[name] === "function") {
    return moduleExports.default[name];
  }

  if (typeof moduleExports === "function" && name === "module_export") {
    return moduleExports;
  }

  throw new Error(`unable to resolve function '${name}' from module exports`);
}

function normalizeArgsList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value;
}

function normalizeKwargs(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value;
}

async function runInvokeFunction(payload) {
  const source = normalizeJsPath(payload.source_js_file);
  const moduleExports = require(source.absolute);
  const functionName = String(payload.function_name || "").trim();
  const fn = resolveFunctionCandidate(moduleExports, functionName);
  const args = normalizeArgsList(payload.args);
  const kwargs = normalizeKwargs(payload.kwargs);
  const mergedArgs = Object.keys(kwargs).length > 0 ? [...args, kwargs] : [...args];

  const startNs = process.hrtime.bigint();
  const result = await Promise.resolve(fn(...mergedArgs));
  const elapsedNs = process.hrtime.bigint() - startNs;

  return {
    ok: true,
    action: "invoke_function",
    source_js_file: source.relative,
    function_name: functionName,
    elapsed_ns: Number(elapsedNs),
    result: sanitizeForJson(result)
  };
}

function runEntrypoint(payload) {
  const source = normalizeJsPath(payload.source_js_file);
  const args = normalizeArgsList(payload.args).map((value) => String(value));

  const startNs = process.hrtime.bigint();
  const run = spawnSync(process.execPath, [source.absolute, ...args], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  const elapsedNs = process.hrtime.bigint() - startNs;

  return {
    ok: Number(run.status || 0) === 0,
    action: "run_entrypoint",
    source_js_file: source.relative,
    elapsed_ns: Number(elapsedNs),
    exit_code: Number(run.status || 0),
    stdout: truncateText(run.stdout),
    stderr: truncateText(run.stderr)
  };
}

async function runPayload(payload) {
  const action = String(payload.action || "").trim();
  if (action === "invoke_function") {
    return runInvokeFunction(payload);
  }
  if (action === "run_entrypoint") {
    return runEntrypoint(payload);
  }
  throw new Error(`unsupported action: ${action}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const payloadText = readPayloadText(args);
  const payload = parsePayload(payloadText);
  const result = await runPayload(payload);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  const failure = {
    ok: false,
    error: String(error && error.message ? error.message : error)
  };
  process.stdout.write(`${JSON.stringify(failure)}\n`);
  process.exit(1);
});
