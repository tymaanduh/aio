(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Universe_Render_Utils = __MODULE_API;
  root.DictionaryUniverseRenderUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const HEX_CACHE_LIMIT = 96;
  const HEX_FALLBACK_RGB = [118 / 255, 166 / 255, 236 / 255];
  const hexColorCache = new Map();
  const hexColorByteCache = new Map();

  function normalizeHexColorKey(colorHex, maxLength = 20) {
    if (typeof colorHex !== "string") {
      return "";
    }
    return colorHex.trim().slice(0, maxLength).toLowerCase();
  }

  function getUniverseColorRgb(colorHex) {
    const key = normalizeHexColorKey(colorHex, 20);
    if (hexColorCache.has(key)) {
      return hexColorCache.get(key);
    }
    const red = Number.parseInt(key.slice(1, 3), 16);
    const green = Number.parseInt(key.slice(3, 5), 16);
    const blue = Number.parseInt(key.slice(5, 7), 16);
    const value =
      Number.isFinite(red) && Number.isFinite(green) && Number.isFinite(blue)
        ? [red / 255, green / 255, blue / 255]
        : HEX_FALLBACK_RGB;
    hexColorCache.set(key, value);
    if (hexColorCache.size > HEX_CACHE_LIMIT) {
      const oldestKey = hexColorCache.keys().next().value;
      hexColorCache.delete(oldestKey);
      hexColorByteCache.delete(oldestKey);
    }
    return value;
  }

  function getUniverseColorRgbBytes(colorHex) {
    const key = normalizeHexColorKey(colorHex, 20);
    if (hexColorByteCache.has(key)) {
      return hexColorByteCache.get(key);
    }
    const rgb = getUniverseColorRgb(key);
    const bytes = [Math.round(rgb[0] * 255), Math.round(rgb[1] * 255), Math.round(rgb[2] * 255)];
    hexColorByteCache.set(key, bytes);
    if (hexColorByteCache.size > HEX_CACHE_LIMIT) {
      const oldestKey = hexColorByteCache.keys().next().value;
      hexColorByteCache.delete(oldestKey);
    }
    return bytes;
  }

  function ensureFloat32Capacity(buffer, minLength) {
    if (buffer.length >= minLength) {
      return buffer;
    }
    let nextLength = Math.max(64, buffer.length || 64);
    while (nextLength < minLength) {
      nextLength *= 2;
    }
    return new Float32Array(nextLength);
  }

  function ensureWebglBufferCapacity(gl, glState, buffer, key, requiredFloats) {
    const requiredBytes = Math.max(0, Math.floor(requiredFloats) * 4);
    const currentBytes = glState.bufferCapacities?.[key] || 0;
    if (requiredBytes <= currentBytes) {
      return;
    }
    const nextBytes = Math.max(1024, currentBytes * 2, requiredBytes);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, nextBytes, gl.DYNAMIC_DRAW);
    glState.bufferCapacities[key] = nextBytes;
  }

  function pushRgbaPair(target, offset, rgba) {
    target[offset] = rgba[0];
    target[offset + 1] = rgba[1];
    target[offset + 2] = rgba[2];
    target[offset + 3] = rgba[3];
    target[offset + 4] = rgba[0];
    target[offset + 5] = rgba[1];
    target[offset + 6] = rgba[2];
    target[offset + 7] = rgba[3];
    return offset + 8;
  }

  function pushRgba(target, offset, red, green, blue, alpha) {
    target[offset] = red;
    target[offset + 1] = green;
    target[offset + 2] = blue;
    target[offset + 3] = alpha;
    return offset + 4;
  }

  function pushRgbaFromArray(target, offset, rgba) {
    target[offset] = rgba[0];
    target[offset + 1] = rgba[1];
    target[offset + 2] = rgba[2];
    target[offset + 3] = rgba[3];
    return offset + 4;
  }

  return {
    getUniverseColorRgb,
    getUniverseColorRgbBytes,
    ensureFloat32Capacity,
    ensureWebglBufferCapacity,
    pushRgbaPair,
    pushRgba,
    pushRgbaFromArray
  };
});
