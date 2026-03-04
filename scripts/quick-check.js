const http = require("http");
const WebSocket = require("ws");
let id = 1;

http.get("http://localhost:9222/json", (r) => {
  let d = "";
  r.on("data", (c) => (d += c));
  r.on("end", () => {
    const targets = JSON.parse(d);
    console.log("Targets:", targets.length);
    const page = targets.find((t) => t.type === "page");
    if (!page) { console.log("No page target!"); process.exit(1); }
    console.log("Page:", page.title, page.url);
    console.log("WS:", page.webSocketDebuggerUrl);

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.on("error", (e) => { console.log("WS error:", e.message); process.exit(1); });
    ws.on("open", () => {
      console.log("WebSocket connected\n");

      const send = (method, params) => {
        const i = id++;
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error("timeout " + method)), 8000);
          const handler = (raw) => {
            const msg = JSON.parse(raw);
            if (msg.id === i) {
              clearTimeout(timer);
              ws.removeListener("message", handler);
              resolve(msg);
            }
          };
          ws.on("message", handler);
          ws.send(JSON.stringify({ id: i, method, params: params || {} }));
        });
      };

      const ev = async (expr) => {
        const msg = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
        if (msg.error) return "CDP_ERROR: " + JSON.stringify(msg.error);
        if (msg.result && msg.result.exceptionDetails) return "JS_ERROR: " + (msg.result.exceptionDetails.text || "unknown");
        if (msg.result && msg.result.result) return msg.result.result.value;
        return "NO_VALUE: " + JSON.stringify(msg.result);
      };

      (async () => {
        // Enable Runtime first
        const enableResult = await send("Runtime.enable");
        console.log("Runtime.enable:", enableResult.error ? "FAILED" : "OK");

        // Simple test
        const simple = await ev("1 + 1");
        console.log("Simple eval (1+1):", simple);

        // Check document exists
        const docExists = await ev("typeof document");
        console.log("typeof document:", docExists);

        if (docExists !== "object") {
          console.log("\nDocument not available - wrong execution context?");
          ws.close();
          process.exit(1);
        }

        const checks = [
          ["appRoot hidden", "document.getElementById('appRoot').classList.contains('hidden')"],
          ["authGate hidden", "document.getElementById('authGate').classList.contains('hidden')"],
          ["search visible", "!!(document.getElementById('treeSearchInput') && document.getElementById('treeSearchInput').offsetParent)"],
          ["logout visible", "!!(document.getElementById('logoutAction') && document.getElementById('logoutAction').offsetParent)"],
          ["save visible", "!!(document.getElementById('entrySaveAction') && document.getElementById('entrySaveAction').offsetParent)"],
          ["tree children", "document.getElementById('treeView').children.length"],
          ["export visible", "!!(document.getElementById('exportDataAction') && document.getElementById('exportDataAction').offsetParent)"],
          ["labelFilter visible", "!!(document.getElementById('treeLabelFilter') && document.getElementById('treeLabelFilter').offsetParent)"],
          ["newEntry visible", "!!(document.getElementById('newEntryAction') && document.getElementById('newEntryAction').offsetParent)"],
          ["universeJump exists", "!!document.getElementById('universeJumpAction')"],
          ["universeColorMode exists", "!!document.getElementById('universeColorModeSelect')"],
          ["universeClusterList exists", "!!document.getElementById('universeClusterList')"],
        ];

        console.log("\n--- Element Checks ---");
        for (const [label, expr] of checks) {
          const val = await ev(expr);
          console.log(`  ${label}: ${JSON.stringify(val)}`);
        }

        ws.close();
        process.exit(0);
      })().catch((e) => { console.error("Error:", e.message); ws.close(); process.exit(1); });
    });
  });
}).on("error", (e) => {
  console.log("HTTP error:", e.message);
  process.exit(1);
});
