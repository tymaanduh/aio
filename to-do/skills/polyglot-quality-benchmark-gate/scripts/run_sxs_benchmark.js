#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function nowMs() {
  const [sec, nano] = process.hrtime();
  return sec * 1000 + nano / 1e6;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function runCommand(command, cwd) {
  const start = nowMs();
  execSync(command, { cwd, stdio: "ignore", shell: true });
  return nowMs() - start;
}

function bytesForPath(targetPath) {
  const stats = fs.statSync(targetPath);
  if (stats.isFile()) {
    return stats.size;
  }
  if (!stats.isDirectory()) {
    return 0;
  }
  return fs.readdirSync(targetPath).reduce((sum, child) => {
    return sum + bytesForPath(path.join(targetPath, child));
  }, 0);
}

function safeSize(targetPath) {
  try {
    return bytesForPath(targetPath);
  } catch {
    return 0;
  }
}

function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    process.stderr.write("Usage: run_sxs_benchmark.js <manifest.json>\n");
    process.exit(1);
  }

  const absManifestPath = path.resolve(process.cwd(), manifestPath);
  const manifest = readJson(absManifestPath);
  const iterations = Math.max(Number(manifest.iterations || 5), 1);
  const warmup = Math.max(Number(manifest.warmupIterations || 1), 0);
  const variants = Array.isArray(manifest.variants) ? manifest.variants : [];

  if (!variants.length) {
    process.stderr.write("Manifest requires at least one variant.\n");
    process.exit(1);
  }

  const cwd = path.dirname(absManifestPath);
  const results = [];

  for (const variant of variants) {
    const id = String(variant.id || "unknown");
    const build = String(variant.build || "").trim();
    const run = String(variant.run || "").trim();
    const artifactPaths = Array.isArray(variant.artifactPaths) ? variant.artifactPaths : [];

    if (!run) {
      throw new Error(`variant '${id}' missing run command`);
    }

    if (build) {
      runCommand(build, cwd);
    }

    for (let i = 0; i < warmup; i += 1) {
      runCommand(run, cwd);
    }

    const samples = [];
    for (let i = 0; i < iterations; i += 1) {
      samples.push(runCommand(run, cwd));
    }

    const totalBytes = artifactPaths.reduce((sum, relPath) => {
      return sum + safeSize(path.resolve(cwd, relPath));
    }, 0);

    results.push({
      id,
      iterations,
      medianMs: Number(median(samples).toFixed(3)),
      minMs: Number(Math.min(...samples).toFixed(3)),
      maxMs: Number(Math.max(...samples).toFixed(3)),
      artifactBytes: totalBytes
    });
  }

  const ranking = [...results].sort((a, b) => {
    if (a.medianMs !== b.medianMs) return a.medianMs - b.medianMs;
    return a.artifactBytes - b.artifactBytes;
  });

  process.stdout.write(
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        manifestPath: absManifestPath,
        results,
        ranking
      },
      null,
      2
    ) + "\n"
  );
}

main();
