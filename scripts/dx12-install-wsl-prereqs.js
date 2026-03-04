"use strict";

const { runCommand, isWsl, getNativeLinuxCmakePath, getMakePath, getMingwCompilers } = require("./dx12-tools");

const requiredPackages = ["cmake", "ninja-build", "mingw-w64", "build-essential"];

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function info(message) {
  process.stdout.write(`${message}\n`);
}

function hasSudoNoPrompt() {
  const result = runCommand("sudo", ["-n", "true"]);
  return (result.status || 0) === 0;
}

function runApt(commandArgs, elevatePrefix) {
  const [elevateCommand, ...elevateArgs] = elevatePrefix;
  if (elevateCommand) {
    return runCommand(elevateCommand, [...elevateArgs, "apt-get", ...commandArgs], { stdio: "inherit" });
  }
  return runCommand("apt-get", commandArgs, { stdio: "inherit" });
}

function main() {
  if (process.platform !== "linux") {
    fail("WSL prerequisites installer only supports Linux/WSL environments.");
  }
  if (!isWsl()) {
    info("Not running inside WSL. Proceeding anyway because platform is Linux.");
  }

  const aptCheck = runCommand("which", ["apt-get"]);
  if ((aptCheck.status || 0) !== 0) {
    fail(
      "apt-get is not available. Use your distro package manager to install: cmake ninja-build mingw-w64 build-essential"
    );
  }

  let elevatePrefix = [];
  const uid = typeof process.getuid === "function" ? process.getuid() : -1;
  if (uid !== 0) {
    if (hasSudoNoPrompt()) {
      elevatePrefix = ["sudo", "-n"];
      info("Using sudo -n for package installation.");
    } else {
      fail(
        "Need root privileges to install packages.\nRun manually:\n  sudo apt-get update && sudo apt-get install -y cmake ninja-build mingw-w64 build-essential"
      );
    }
  } else {
    info("Running as root.");
  }

  info("Installing DX12 fallback prerequisites...");
  let result = runApt(["update"], elevatePrefix);
  if ((result.status || 0) !== 0) {
    process.exit(result.status || 1);
  }

  result = runApt(["install", "-y", ...requiredPackages], elevatePrefix);
  if ((result.status || 0) !== 0) {
    process.exit(result.status || 1);
  }

  const cmakePath = getNativeLinuxCmakePath();
  const makePath = getMakePath();
  const compilers = getMingwCompilers();
  info("Install complete.");
  info(`- native cmake: ${cmakePath || "missing"}`);
  info(`- make: ${makePath || "missing"}`);
  info(`- mingw cc: ${compilers.cc || "missing"}`);
  info(`- mingw cxx: ${compilers.cxx || "missing"}`);
}

main();
