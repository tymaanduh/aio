"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { generate } = require("../scripts/generate-file-catalog-docs");

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aio-file-catalog-"));
}

test("generate-file-catalog-docs writes markdown and json index", () => {
  const root = makeTempRoot();
  fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.mkdirSync(path.join(root, "app"), { recursive: true });
  fs.writeFileSync(path.join(root, "scripts", "sample-script.js"), "console.log('ok');\n", "utf8");
  fs.writeFileSync(path.join(root, "app", "index.html"), "<html></html>\n", "utf8");
  fs.writeFileSync(path.join(root, "README.md"), "# temp\n", "utf8");

  const report = generate(root, {
    markdownFile: "docs/reference/file_catalog.md",
    jsonFile: "docs/reference/file_catalog.json"
  });

  const markdownPath = path.join(root, report.markdown_file);
  const jsonPath = path.join(root, report.json_file);
  assert.equal(report.status, "pass");
  assert.equal(fs.existsSync(markdownPath), true);
  assert.equal(fs.existsSync(jsonPath), true);

  const markdown = fs.readFileSync(markdownPath, "utf8");
  assert.match(markdown, /Full File Index/);
  assert.match(markdown, /scripts\/sample-script\.js/);
  assert.match(markdown, /app\/index\.html/);

  const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  assert.equal(json.schema_version, 1);
  assert.ok(Array.isArray(json.files));
  assert.ok(json.files.some((entry) => entry.path === "scripts/sample-script.js"));
});
