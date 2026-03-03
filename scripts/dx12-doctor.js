"use strict";

const {
  runCommand,
  isWsl,
  getNativeLinuxCmakePath,
  getMakePath,
  getMingwCompilers,
  detectVisualStudioInstallPath
} = require("./dx12-tools");

function printLine(text = "") {
  process.stdout.write(`${text}\n`);
}

function checkNode() {
  const major = Number(String(process.versions.node || "").split(".")[0] || 0);
  if (major >= 18) {
    printLine(`[OK] Node.js ${process.versions.node}`);
    return true;
  }
  printLine(`[WARN] Node.js ${process.versions.node} (recommended >= 18)`);
  return false;
}

function checkNpm() {
  const result = runCommand("npm", ["-v"]);
  if ((result.status || 0) === 0) {
    printLine(`[OK] npm ${String(result.stdout || "").trim()}`);
    return true;
  }
  printLine("[FAIL] npm is not available.");
  return false;
}

function checkDefaultCmake() {
  const result = runCommand("cmake", ["--version"]);
  if ((result.status || 0) !== 0) {
    printLine("[FAIL] cmake is not available.");
    return false;
  }
  const firstLine =
    String(result.stdout || "")
      .split(/\r?\n/)
      .find(Boolean) || "cmake detected";
  printLine(`[OK] ${firstLine}`);
  return true;
}

function main() {
  printLine("DX12 Doctor");
  printLine("===========");
  checkNode();
  checkNpm();
  checkDefaultCmake();
  printLine(`[INFO] platform=${process.platform}${isWsl() ? " (WSL)" : ""}`);

  const vsPath = detectVisualStudioInstallPath();
  if (vsPath) {
    printLine(`[OK] Visual Studio with VC tools: ${vsPath}`);
  } else {
    printLine("[WARN] Visual Studio 2022 VC toolchain not detected.");
  }

  const nativeCmake = getNativeLinuxCmakePath();
  if (nativeCmake) {
    printLine(`[OK] native Linux cmake: ${nativeCmake}`);
  } else if (process.platform === "linux") {
    printLine("[WARN] native Linux cmake not found (use /usr/bin/cmake or set DX12_CMAKE_BIN).");
  }

  const makePath = getMakePath();
  if (makePath) {
    printLine(`[OK] make: ${makePath}`);
  } else if (process.platform === "linux") {
    printLine("[WARN] make not found (set DX12_MAKE_BIN).");
  }

  const compilers = getMingwCompilers();
  if (compilers.cc && compilers.cxx) {
    printLine(`[OK] MinGW toolchain: cc=${compilers.cc}, cxx=${compilers.cxx}`);
  } else {
    printLine("[WARN] MinGW toolchain not fully detected for fallback configure.");
  }

  printLine();
  if (vsPath) {
    printLine("Recommended path (MSVC):");
    printLine("1. npm run dx12:configure");
    printLine("2. npm run dx12:build");
  } else if (nativeCmake && makePath && compilers.cc && compilers.cxx) {
    printLine("Recommended path (MinGW fallback):");
    printLine("1. npm run dx12:configure:mingw");
    printLine("2. npm run dx12:build:mingw");
  } else {
    printLine("No complete DX12 build path detected yet.");
    printLine("Install one of:");
    printLine("1. Visual Studio 2022 Build Tools with C++ workload (MSVC path).");
    printLine("2. Linux native cmake + make + mingw-w64 cross toolchain (fallback path).");
    if (isWsl()) {
      printLine();
      printLine("WSL helper:");
      printLine("1. npm run dx12:install:wsl-prereqs");
      printLine("2. npm run dx12:doctor");
      printLine("3. npm run dx12:configure:mingw");
      printLine("4. npm run dx12:build:mingw");
    }
  }
}

main();
