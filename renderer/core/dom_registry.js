import "../../brain/modules/dom_utils.js";

const DOM_MODULE = globalThis.Dictionary_Dom_Utils || globalThis.DictionaryDomUtils || {};

export const DOM_REGISTRY = Object.freeze({
  module: DOM_MODULE,
  element_ids: DOM_MODULE.RENDERER_ELEMENT_IDS || []
});

