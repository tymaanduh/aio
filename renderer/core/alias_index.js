export const ALIAS_WORD_INDEX = Object.freeze([
  ["app", ["application"]],
  ["pg", ["page"]],
  ["rt", ["runtime"]],
  ["dom", ["document"]],
  ["cfg", ["configuration"]],
  ["idx", ["index"]],
  ["fx", ["effects"]],
  ["gfx", ["graphics"]],
  ["ui", ["user interface"]],
  ["ux", ["user experience"]],
  ["auth", ["authentication"]],
  ["diag", ["diagnostics"]],
  ["stat", ["statistics"]],
  ["tree", ["tree"]],
  ["graph", ["graph"]],
  ["uni", ["universe"]],
  ["mod", ["module"]],
  ["fn", ["function"]],
  ["arg", ["argument"]],
  ["val", ["value"]],
  ["ref", ["reference"]],
  ["tmp", ["temporary"]],
  ["cmd", ["command"]],
  ["evt", ["event"]],
  ["msg", ["message"]],
  ["api", ["application programming interface"]],
  ["ipc", ["inter-process communication"]],
  ["ch", ["channel"]],
  ["win", ["window"]],
  ["env", ["environment"]],
  ["util", ["utility"]]
]);

export function normalize_alias(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function create_alias_map(index = ALIAS_WORD_INDEX) {
  const map = new Map();
  (Array.isArray(index) ? index : []).forEach((row) => {
    const alias = normalize_alias(Array.isArray(row) ? row[0] : "");
    if (!alias) {
      return;
    }
    const words = Array.isArray(row[1]) ? row[1].filter((item) => typeof item === "string" && item.trim()) : [];
    map.set(alias, words);
  });
  return map;
}

export function get_alias_words(alias, map_or_index = ALIAS_WORD_INDEX) {
  const map = map_or_index instanceof Map ? map_or_index : create_alias_map(map_or_index);
  return map.get(normalize_alias(alias)) || [];
}
