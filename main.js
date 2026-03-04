"use strict";

const electron = require("electron");

if (!electron || typeof electron !== "object") {
  // Fail fast with a clear message when launched in a plain Node runtime.
  console.error(
    "Electron APIs are unavailable. Launch this app with Electron (use Windows shell if running from WSL)."
  );
  process.exit(1);
}

const { app } = electron;

if (!app || typeof app.whenReady !== "function") {
  console.error("Electron app lifecycle is unavailable in this runtime.");
  process.exit(1);
}

const { bootstrap_main_app } = require("./main/boot/app_bootstrap.js");

app.whenReady().then(async () => {
  await bootstrap_main_app();
});
