#!/usr/bin/env node
"use strict";

const { findProjectRoot } = require("./project-source-resolver");
const { generate: generateFileCatalog } = require("./generate-file-catalog-docs");
const { generate: generateRuntimeVisuals } = require("./generate-runtime-visuals");

function main() {
  const root = findProjectRoot(process.cwd());
  const fileCatalog = generateFileCatalog(root, {});
  const runtimeVisuals = generateRuntimeVisuals(root, {});
  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root,
    outputs: {
      file_catalog: fileCatalog,
      runtime_visuals: runtimeVisuals
    }
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`generate-documentation-suite failed: ${error.message}\n`);
    process.exit(1);
  }
}
