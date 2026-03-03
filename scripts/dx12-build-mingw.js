"use strict";

const path = require("node:path");
const { runCommand, getNativeLinuxCmakePath } = require("./dx12-tools");

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const cmake = getNativeLinuxCmakePath();
if (!cmake) {
  fail("DX12 MinGW build requires native Linux CMake (e.g. /usr/bin/cmake). Install cmake or set DX12_CMAKE_BIN.");
}

const buildDir = path.join("native", "dx12", "build-mingw");
const result = runCommand(cmake, ["--build", buildDir, "--parallel"], { stdio: "inherit" });
if ((result.status || 0) !== 0) {
  process.exit(result.status || 1);
}

process.stdout.write("DX12 MinGW build complete.\n");
