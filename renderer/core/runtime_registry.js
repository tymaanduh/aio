export const G_APP = globalThis.G_APP && typeof globalThis.G_APP === "object" ? globalThis.G_APP : {};
export const G_RT = globalThis.G_RT && typeof globalThis.G_RT === "object" ? globalThis.G_RT : {};
export const G_PAGE = globalThis.G_PAGE && typeof globalThis.G_PAGE === "object" ? globalThis.G_PAGE : {};
export const G_DOM = globalThis.G_DOM && typeof globalThis.G_DOM === "object" ? globalThis.G_DOM : {};
export const G_UNI = globalThis.G_UNI && typeof globalThis.G_UNI === "object" ? globalThis.G_UNI : {};
export const G_UNI_FX = globalThis.G_UNI_FX && typeof globalThis.G_UNI_FX === "object" ? globalThis.G_UNI_FX : {};

Object.assign(globalThis, {
  G_APP,
  G_RT,
  G_PAGE,
  G_DOM,
  G_UNI,
  G_UNI_FX
});

export const RUNTIME_GROUP_REGISTRY = Object.freeze({
  G_APP,
  G_RT,
  G_PAGE,
  G_DOM,
  G_UNI,
  G_UNI_FX
});
