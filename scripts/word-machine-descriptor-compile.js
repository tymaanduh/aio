#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const normalize_service = require("../main/services/normalize_service.js");
const language_bridge_service = require("../main/services/language_bridge_service.js");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_OUT_DIR = path.join(ROOT, "artifacts", "dictionary-lexicon");
const DEFAULT_STATE_FILE = path.join(DEFAULT_OUT_DIR, "state", "language_bridge_state.json");
const DEFAULT_REPORT_FILE = path.join(DEFAULT_OUT_DIR, "reports", "machine_descriptor_compile_report.json");

function printHelpAndExit(code) {
  const helpText = [
    "word-machine-descriptor-compile",
    "",
    "Usage:",
    "  npm run dictionary:compile:descriptors -- [options]",
    "",
    "Options:",
    '  --text "..."             Inline text to compile into machine descriptors',
    "  --text-file <path>        File path with source text",
    "  --entries-file <path>     JSON array file with dictionary entries",
    "  --state-file <path>       Bridge state file (default: artifacts/dictionary-lexicon/state/language_bridge_state.json)",
    "  --report-file <path>      Compile report output file",
    "  --source-id <id>          Source id for descriptor compilation",
    "  --help                    Show help"
  ].join("\n");
  process.stdout.write(`${helpText}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = {
    text: "",
    textFile: "",
    entriesFile: "",
    stateFile: DEFAULT_STATE_FILE,
    reportFile: DEFAULT_REPORT_FILE,
    sourceId: "dictionary-descriptor-compile"
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--text") {
      args.text = String(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (token === "--text-file") {
      args.textFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--entries-file") {
      args.entriesFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--state-file") {
      args.stateFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--report-file") {
      args.reportFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--source-id") {
      args.sourceId = String(argv[index + 1] || "").trim() || args.sourceId;
      index += 1;
      continue;
    }
    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readTextFile(filePath) {
  if (!filePath) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJsonFile(filePath, fallbackValue) {
  if (!filePath || !fs.existsSync(filePath)) {
    return fallbackValue;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallbackValue;
  }
}

function writeJson(filePath, payload) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function createMemoryBridgeRepository(seedState = null) {
  let state = seedState || normalize_service.create_default_language_bridge_state();
  return {
    async load_bridge_state() {
      return state;
    },
    async save_bridge_state(next_state) {
      state = next_state;
      return state;
    },
    get_state() {
      return state;
    }
  };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const textFromFile = readTextFile(args.textFile);
  const dictionaryEntries = readJsonFile(args.entriesFile, []);
  const seedState = readJsonFile(args.stateFile, normalize_service.create_default_language_bridge_state());
  const sourceText = `${String(args.text || "").trim()}\n${String(textFromFile || "").trim()}`.trim();

  const repository = createMemoryBridgeRepository(seedState);
  language_bridge_service.inject_language_bridge_repository(repository);

  const compileResult = await language_bridge_service.compile_machine_descriptors({
    text: sourceText,
    dictionary_entries: Array.isArray(dictionaryEntries) ? dictionaryEntries : [],
    source_meta: {
      source_id: args.sourceId,
      entry_ids: (Array.isArray(dictionaryEntries) ? dictionaryEntries : [])
        .map((entry) => String(entry && entry.id ? entry.id : "").trim())
        .filter(Boolean)
    }
  });

  const finalState = repository.get_state();
  writeJson(args.stateFile, finalState);
  writeJson(args.reportFile, {
    generated_at: new Date().toISOString(),
    source_id: args.sourceId,
    descriptor_count: compileResult.descriptor_count,
    descriptor_refs: compileResult.descriptor_refs,
    stats: compileResult.stats,
    state_file: path.relative(ROOT, args.stateFile)
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        descriptor_count: compileResult.descriptor_count,
        report_file: path.relative(ROOT, args.reportFile),
        state_file: path.relative(ROOT, args.stateFile)
      },
      null,
      2
    )}\n`
  );
}

run().catch((error) => {
  process.stderr.write(`word-machine-descriptor-compile failed: ${error.message}\n`);
  process.exit(1);
});
