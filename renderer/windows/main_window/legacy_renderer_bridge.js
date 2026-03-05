const LEGACY_RENDERER_SCRIPT = Object.freeze({
  ID: "legacy-renderer-main-script",
  URL: new URL("../../../app/renderer.js", import.meta.url).toString()
});

function load_legacy_script_once(script_id, script_url) {
  const existing = document.getElementById(script_id);
  if (existing instanceof HTMLScriptElement) {
    if (existing.dataset.loaded === "1") {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load legacy script: ${script_url}`)), {
        once: true
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = script_id;
    script.src = script_url;
    script.async = false;
    script.dataset.loaded = "0";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "1";
        resolve();
      },
      { once: true }
    );
    script.addEventListener("error", () => reject(new Error(`Failed to load legacy script: ${script_url}`)), {
      once: true
    });
    document.head.appendChild(script);
  });
}

await load_legacy_script_once(LEGACY_RENDERER_SCRIPT.ID, LEGACY_RENDERER_SCRIPT.URL);
