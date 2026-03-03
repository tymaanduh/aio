"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { runCommand, getNativeLinuxCmakePath, getMakePath, getMingwCompilers } = require("./dx12-tools");

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const cmake = getNativeLinuxCmakePath();
if (!cmake) {
  fail("DX12 MinGW configure requires native Linux CMake (e.g. /usr/bin/cmake). Install cmake or set DX12_CMAKE_BIN.");
}

const makePath = getMakePath();
if (!makePath) {
  fail("DX12 MinGW configure requires make. Install make or set DX12_MAKE_BIN.");
}

const compilers = getMingwCompilers();
if (!compilers.cc || !compilers.cxx) {
  fail(
    "DX12 MinGW configure requires x86_64-w64-mingw32 GCC/G++ toolchain. Install mingw-w64 or set DX12_CC and DX12_CXX."
  );
}

const buildDir = path.join("native", "dx12", "build-mingw");
const sourceDir = path.join("native", "dx12");

try {
  fs.rmSync(buildDir, { recursive: true, force: true });
} catch (error) {
  fail(`Failed to clean ${buildDir}: ${error.message}`);
}

const args = [
  "-S",
  sourceDir,
  "-B",
  buildDir,
  "-G",
  "Unix Makefiles",
  `-DCMAKE_MAKE_PROGRAM=${makePath}`,
  "-DCMAKE_SYSTEM_NAME=Windows",
  `-DCMAKE_C_COMPILER=${compilers.cc}`,
  `-DCMAKE_CXX_COMPILER=${compilers.cxx}`
];

const result = runCommand(cmake, args, { stdio: "inherit" });
if ((result.status || 0) !== 0) {
  process.exit(result.status || 1);
}

process.stdout.write(
  `DX12 MinGW configure complete.\n- cmake: ${cmake}\n- cc: ${compilers.cc}\n- cxx: ${compilers.cxx}\n`
);
