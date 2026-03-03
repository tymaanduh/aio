"use strict";

const os = require("os");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const electronBinary = require("electron");
const appRoot = path.resolve(__dirname, "..");

function isWslRuntime() {
  if (process.platform !== "linux") {
    return false;
  }
  return /microsoft/i.test(os.release()) || Boolean(process.env.WSL_DISTRO_NAME);
}

function toWindowsPath(posixPath) {
  const result = spawnSync("wslpath", ["-w", posixPath], { encoding: "utf8" });
  if (result.status === 0) {
    return result.stdout.trim();
  }
  return posixPath;
}

function toCmdQuoted(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

if (isWslRuntime()) {
  const electronExe = toWindowsPath(String(electronBinary));
  const appPath = toWindowsPath(appRoot);
  const extraArgs = process.argv
    .slice(2)
    .map((arg) => toCmdQuoted(arg))
    .join(" ");
  const command = `set ELECTRON_RUN_AS_NODE=& ${electronExe} ${appPath}${extraArgs ? ` ${extraArgs}` : ""}`;
  const child = spawn("cmd.exe", ["/d", "/c", command], {
    stdio: "inherit",
    windowsHide: false
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
} else {
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;

  const child = spawn(electronBinary, [appRoot, ...process.argv.slice(2)], {
    cwd: appRoot,
    stdio: "inherit",
    env,
    windowsHide: false
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}
