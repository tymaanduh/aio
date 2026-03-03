const e = require("electron");
console.log("ELECTRON_RUN_AS_NODE", process.env.ELECTRON_RUN_AS_NODE || "");
console.log("versions.electron", process.versions.electron || "");
console.log("electronType", typeof e);
console.log("hasApp", !!(e && e.app));
if (e && e.app) console.log("hasCommandLine", !!e.app.commandLine);
process.exit(0);
