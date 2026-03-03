"use strict";

const fs = require("node:fs");
const { spawnSync } = require("node:child_process");

function existsExecutable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: options.stdio || "pipe",
    encoding: "utf8",
    env: options.env || process.env,
    cwd: options.cwd || process.cwd()
  });
  return result;
}

function isWsl() {
  if (process.platform !== "linux") {
    return false;
  }
  try {
    const release = fs.readFileSync("/proc/sys/kernel/osrelease", "utf8").toLowerCase();
    if (release.includes("microsoft")) {
      return true;
    }
  } catch {
    // Ignore.
  }
  return fs.existsSync("/proc/sys/fs/binfmt_misc/WSLInterop");
}

function firstExisting(paths) {
  for (const filePath of paths) {
    if (filePath && existsExecutable(filePath)) {
      return filePath;
    }
  }
  return "";
}

function getNativeLinuxCmakePath() {
  const fromEnv = process.env.DX12_CMAKE_BIN || "";
  if (fromEnv && existsExecutable(fromEnv)) {
    return fromEnv;
  }
  const home = process.env.HOME || "";
  const candidates = ["/usr/bin/cmake", "/usr/local/bin/cmake"];
  if (home) {
    candidates.push(`${home}/.local/opt/cmake/bin/cmake`);
    candidates.push(`${home}/.local/cmake/bin/cmake`);
    try {
      const optDir = `${home}/.local/opt`;
      const entries = fs.existsSync(optDir) ? fs.readdirSync(optDir, { withFileTypes: true }) : [];
      const cmakeDirs = entries
        .filter((entry) => entry.isDirectory() && entry.name.startsWith("cmake-"))
        .map((entry) => `${optDir}/${entry.name}/bin/cmake`)
        .sort()
        .reverse();
      candidates.push(...cmakeDirs);
    } catch {
      // Ignore scan errors.
    }
  }
  return firstExisting(candidates);
}

function getMakePath() {
  const fromEnv = process.env.DX12_MAKE_BIN || "";
  if (fromEnv && existsExecutable(fromEnv)) {
    return fromEnv;
  }
  return firstExisting(["/usr/bin/make", "/usr/local/bin/make"]);
}

function getMingwCompilers() {
  const ccFromEnv = process.env.DX12_CC || "";
  const cxxFromEnv = process.env.DX12_CXX || "";
  const cc =
    ccFromEnv && existsExecutable(ccFromEnv)
      ? ccFromEnv
      : firstExisting([
          "/usr/bin/x86_64-w64-mingw32-gcc-win32",
          "/usr/bin/x86_64-w64-mingw32-gcc-posix",
          "/usr/bin/x86_64-w64-mingw32-gcc"
        ]);
  const cxx =
    cxxFromEnv && existsExecutable(cxxFromEnv)
      ? cxxFromEnv
      : firstExisting([
          "/usr/bin/x86_64-w64-mingw32-g++-win32",
          "/usr/bin/x86_64-w64-mingw32-g++-posix",
          "/usr/bin/x86_64-w64-mingw32-g++"
        ]);
  return { cc, cxx };
}

function getWindowsPowershellPath() {
  return firstExisting([
    "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
    "/mnt/c/Windows/system32/WindowsPowerShell/v1.0/powershell.exe"
  ]);
}

function detectVisualStudioInstallPath() {
  const powershell = getWindowsPowershellPath();
  if (!powershell) {
    return "";
  }
  const script = [
    '$vswhere = "$env:ProgramFiles(x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe";',
    "if (Test-Path $vswhere) {",
    "  & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath",
    "}"
  ].join(" ");
  const result = runCommand(powershell, ["-NoProfile", "-Command", script]);
  if (result.status !== 0) {
    return "";
  }
  return String(result.stdout || "").trim();
}

module.exports = {
  existsExecutable,
  runCommand,
  isWsl,
  getNativeLinuxCmakePath,
  getMakePath,
  getMingwCompilers,
  getWindowsPowershellPath,
  detectVisualStudioInstallPath
};
