/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Io_Domain = __MODULE_API;
  root.DictionaryRendererIoDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function parseCsvEntries(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    return [];
  }

  const header = parseCsvLine(lines[0]).map((value) => value.toLowerCase());
  const wordIndex = header.indexOf("word");
  const definitionIndex = header.indexOf("definition");
  const labelsIndex = header.indexOf("labels");
  const modeIndex = header.indexOf("mode");
  const languageIndex = header.indexOf("language");
  const usageCountIndex = header.indexOf("usagecount");
  const startIndex = wordIndex >= 0 ? 1 : 0;

  const entries = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    const columns = parseCsvLine(lines[i]);
    const word = cleanText(columns[wordIndex >= 0 ? wordIndex : 0], MAX.WORD);
    const definition = cleanText(columns[definitionIndex >= 0 ? definitionIndex : 1], MAX.DEFINITION);
    const labels = parseLabels((columns[labelsIndex >= 0 ? labelsIndex : 2] || "").replace(/\|/g, ","));
    const mode = normalizeEntryMode(columns[modeIndex >= 0 ? modeIndex : -1] || "");
    const language = normalizeEntryLanguage(columns[languageIndex >= 0 ? languageIndex : -1] || "");
    const usageCount = Math.max(0, Math.floor(Number(columns[usageCountIndex >= 0 ? usageCountIndex : -1]) || 0));
    if (!word || !definition) {
      continue;
    }
    entries.push({
      id: window.crypto.randomUUID(),
      word,
      definition,
      labels,
      mode,
      language,
      usageCount,
      favorite: false,
      archivedAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
  }
  return entries;
}

function parseBulkImportEntries(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const splitter = line.includes(" - ")
        ? " - "
        : line.includes("\t")
          ? "\t"
          : line.includes(":")
            ? ":"
            : line.includes(",")
              ? ","
              : "";
      if (!splitter) {
        return null;
      }
      const [rawWord, ...rest] = line.split(splitter);
      const word = cleanText(rawWord, MAX.WORD);
      const definition = cleanText(rest.join(splitter), MAX.DEFINITION);
      if (!word || !definition) {
        return null;
      }
      return {
        id: window.crypto.randomUUID(),
        word,
        definition,
        labels: inferLabelsFromDefinition(definition),
        mode: "definition",
        language: "",
        usageCount: 0,
        favorite: false,
        archivedAt: null,
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
    })
    .filter(Boolean);
}

function parseImportedEntries(text) {
  const raw = String(text || "").trim();
  if (!raw) {
    return [];
  }

  if (raw[0] === "{" || raw[0] === "[") {
    try {
      const parsed = JSON.parse(raw);
      const sourceEntries = Array.isArray(parsed) ? parsed : Array.isArray(parsed.entries) ? parsed.entries : [];
      return sourceEntries.map((entry) => normalizeLoadedEntry(entry)).filter(Boolean);
    } catch {
      return [];
    }
  }

  if (raw.includes(",") && /\bword\b/i.test(raw.split(/\r?\n/)[0])) {
    return parseCsvEntries(raw);
  }

  const bulkEntries = parseBulkImportEntries(raw);
  if (bulkEntries.length > 0) {
    return bulkEntries;
  }
  return parseSmartPasteEntries(raw);
}

function parseSmartPasteEntries(text) {
  const cleaned = String(text || "")
    .replace(/\r/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
  if (!cleaned) {
    return [];
  }

  const chunks = cleaned
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const entries = [];
  chunks.forEach((line) => {
    const normalized = line.replace(/^\d+[).\s-]+/, "");
    const match = normalized.match(/^([A-Za-z][A-Za-z'\- ]{1,40})\s+[—\-:]\s+(.{6,})$/);
    if (!match) {
      return;
    }
    const word = cleanText(match[1], MAX.WORD);
    const definition = cleanText(match[2], MAX.DEFINITION);
    if (!word || !definition) {
      return;
    }
    entries.push({
      id: window.crypto.randomUUID(),
      word,
      definition,
      labels: inferLabelsFromDefinition(definition),
      mode: "definition",
      language: "",
      usageCount: 0,
      favorite: false,
      archivedAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
  });
  return entries;
}

async function importEntriesFromText(rawText, mergeMode = "skip", options = {}) {
  const { clearInputAfter = false } = options;
  const imported = parseImportedEntries(rawText);
  if (imported.length === 0) {
    setStatus("No valid entries found for import.", true);
    return false;
  }

  const result = await applyImportedEntries(imported, mergeMode);
  const summary = `Import complete: +${result.added} added, ${result.updated} updated, ${result.skipped} skipped.`;
  setStatus(summary);
  setHelperText(summary);
  (clearInputAfter) && (G_DOM.bulkImportInput.value = "");
  return true;
}

async function applyImportedEntries(importedEntries, mergeMode = "skip") {
  const entries = Array.isArray(importedEntries) ? importedEntries : [];
  if (entries.length === 0) {
    return { added: 0, updated: 0, skipped: 0 };
  }

  const mode = cleanText(mergeMode, 20).toLowerCase();
  let added = 0;
  let updated = 0;
  let skipped = 0;

  await applyInChunks(entries, 250, async (batch) => {
    batch.forEach((incoming) => {
      const duplicate = getDuplicateEntry(incoming.word);
      if (!duplicate) {
        ensureLabelsExist(incoming.labels);
        G_APP.st.addEntry({
          ...incoming,
          id: cleanText(incoming.id, MAX.WORD) || window.crypto.randomUUID(),
          favorite: Boolean(incoming.favorite),
          archivedAt: incoming.archivedAt || null,
          mode: normalizeEntryMode(incoming.mode),
          language: normalizeEntryLanguage(incoming.language || ""),
          usageCount: Math.max(0, Math.floor(Number(incoming.usageCount) || 0)),
          createdAt: incoming.createdAt || nowIso(),
          updatedAt: nowIso()
        });
        added += 1;
        return;
      }

      if (mode === "replace") {
        ensureLabelsExist(incoming.labels);
        G_APP.st.updateEntryById(duplicate.id, () => ({
          ...duplicate,
          definition: incoming.definition,
          labels: normalizeLabelArray(incoming.labels),
          mode: normalizeEntryMode(incoming.mode || duplicate.mode),
          language: normalizeEntryLanguage(incoming.language || duplicate.language || ""),
          usageCount: Math.max(0, Math.floor(Number(incoming.usageCount) || Number(duplicate.usageCount) || 0)),
          updatedAt: nowIso()
        }));
        updated += 1;
        return;
      }

      if (mode === "add") {
        const existingWord = cleanText(duplicate.word, MAX.WORD);
        const incomingWord = cleanText(incoming.word, MAX.WORD);
        if (normalizeWordLower(existingWord) === normalizeWordLower(incomingWord) && existingWord !== incomingWord) {
          skipped += 1;
          return;
        }
        ensureLabelsExist(incoming.labels);
        G_APP.st.addEntry({
          ...incoming,
          id: window.crypto.randomUUID(),
          favorite: Boolean(incoming.favorite),
          archivedAt: incoming.archivedAt || null,
          mode: normalizeEntryMode(incoming.mode),
          language: normalizeEntryLanguage(incoming.language || ""),
          usageCount: Math.max(0, Math.floor(Number(incoming.usageCount) || 0)),
          createdAt: nowIso(),
          updatedAt: nowIso()
        });
        added += 1;
        return;
      }

      skipped += 1;
    });
  });

  sortEntries();
  G_PAGE.tree.reqRender();
  G_PAGE.sentence.reqRender();
  scheduleAutosave();
  return { added, updated, skipped };
}

function toCsvSafe(value) {
  const text = String(value || "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function exportEntriesAsCsv() {
  const header = "word,definition,labels,mode,language,usageCount";
  const rows = G_APP.s.entries.map((entry) =>
    [
      toCsvSafe(entry.word),
      toCsvSafe(entry.definition),
      toCsvSafe(entry.labels.join("|")),
      toCsvSafe(normalizeEntryMode(entry.mode)),
      toCsvSafe(normalizeEntryLanguage(entry.language || "")),
      toCsvSafe(String(Math.max(0, Math.floor(Number(entry.usageCount) || 0))))
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

function triggerDownload(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function exportCurrentData(format) {
  const normalized = cleanText(format, 20).toLowerCase();
  if (normalized === "csv") {
    triggerDownload(exportEntriesAsCsv(), `dictionary-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
    return;
  }
  triggerDownload(
    JSON.stringify(buildSnapshot(), null, 2),
    `dictionary-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json"
  );
}


function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values.map((value) => value.trim());
}

  return {
    parseCsvEntries,
    legacy_parseCsvEntries: parseCsvEntries,
    modular_parseCsvEntries: parseCsvEntries,
    parseBulkImportEntries,
    legacy_parseBulkImportEntries: parseBulkImportEntries,
    modular_parseBulkImportEntries: parseBulkImportEntries,
    parseImportedEntries,
    legacy_parseImportedEntries: parseImportedEntries,
    modular_parseImportedEntries: parseImportedEntries,
    parseSmartPasteEntries,
    legacy_parseSmartPasteEntries: parseSmartPasteEntries,
    modular_parseSmartPasteEntries: parseSmartPasteEntries,
    importEntriesFromText,
    legacy_importEntriesFromText: importEntriesFromText,
    modular_importEntriesFromText: importEntriesFromText,
    applyImportedEntries,
    legacy_applyImportedEntries: applyImportedEntries,
    modular_applyImportedEntries: applyImportedEntries,
    toCsvSafe,
    legacy_toCsvSafe: toCsvSafe,
    modular_toCsvSafe: toCsvSafe,
    exportEntriesAsCsv,
    legacy_exportEntriesAsCsv: exportEntriesAsCsv,
    modular_exportEntriesAsCsv: exportEntriesAsCsv,
    triggerDownload,
    legacy_triggerDownload: triggerDownload,
    modular_triggerDownload: triggerDownload,
    exportCurrentData,
    legacy_exportCurrentData: exportCurrentData,
    modular_exportCurrentData: exportCurrentData,

    parseCsvLine,
    legacy_parseCsvLine: parseCsvLine,
    modular_parseCsvLine: parseCsvLine,
  };
});
