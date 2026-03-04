const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeWordLower,
  inflectVerbForSubject,
  isThirdPersonSingularSubject
} = require("../brain/modules/suggestions-utils.js");

test("word normalization lowercases and trims", () => {
  assert.equal(normalizeWordLower("  Hello "), "hello");
});

test("third person singular detection works", () => {
  assert.equal(isThirdPersonSingularSubject("he", "pronoun"), true);
  assert.equal(isThirdPersonSingularSubject("they", "pronoun"), false);
  assert.equal(isThirdPersonSingularSubject("dog", "noun"), true);
  assert.equal(isThirdPersonSingularSubject("dogs", "noun"), false);
});

test("verb inflection handles be/have/default", () => {
  assert.equal(inflectVerbForSubject("be", "he", "pronoun"), "is");
  assert.equal(inflectVerbForSubject("have", "they", "pronoun"), "have");
  assert.equal(inflectVerbForSubject("play", "she", "pronoun"), "plays");
});
