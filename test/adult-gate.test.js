import assert from "node:assert/strict";
import { ADULT_GATE_CHALLENGES, validateChallenge } from "../src/adult-gate.js";

assert.equal(ADULT_GATE_CHALLENGES.length, 100, "library must ship exactly 100 challenge variants");

const ids = new Set(ADULT_GATE_CHALLENGES.map((challenge) => challenge.id));
assert.equal(ids.size, ADULT_GATE_CHALLENGES.length, "challenge ids must be unique");
assert.equal(ADULT_GATE_CHALLENGES.some((challenge) => challenge.category === "motor"), false, "motor tasks are too weak as adult signals");
assert.equal(ADULT_GATE_CHALLENGES.some((challenge) => challenge.category === "attention"), false, "attention traps are too weak as adult signals");

for (const removedId of [
  "rent-utilities",
  "emergency-dispatch",
  "engine-oil-warning",
  "baggage-allowance",
  "pharmacy-otc",
  "analog-clock-minutes",
  "analog-five-to"
]) {
  assert.equal(ids.has(removedId), false, `${removedId} should stay out of the default challenge set`);
}

for (const challenge of ADULT_GATE_CHALLENGES) {
  assert.ok(challenge.prompt, `${challenge.id} must have prompt`);
  assert.ok(challenge.category, `${challenge.id} must have category`);

  if (challenge.type === "choice") {
    assert.ok(challenge.options.includes(challenge.answer), `${challenge.id} answer must be present in options`);
    assert.equal(validateChallenge(challenge, challenge.answer), true, `${challenge.id} must validate answer`);
    assert.equal(validateChallenge(challenge, "__wrong__"), false, `${challenge.id} must reject wrong answer`);
  }

  if (challenge.type === "text") {
    assert.ok(challenge.answers.length > 0, `${challenge.id} must have text answers`);
    assert.equal(validateChallenge(challenge, challenge.answers[0]), true, `${challenge.id} must validate text answer`);
  }

  if (challenge.type === "hold" || challenge.type === "sequence") {
    assert.equal(validateChallenge(challenge, true), true, `${challenge.id} must validate completed action`);
    assert.equal(validateChallenge(challenge, false), false, `${challenge.id} must reject incomplete action`);
  }
}

console.log("adult-gate challenge set is valid");
