import test from "node:test";
import assert from "node:assert/strict";
import { FAQ_ANSWERS, FAQ_LABELS, getWelcomeMessage } from "./content.js";

test("each FAQ topic has a label and answer", () => {
  assert.deepEqual(Object.keys(FAQ_ANSWERS).sort(), Object.keys(FAQ_LABELS).sort());
  for (const answer of Object.values(FAQ_ANSWERS)) assert.ok(answer.length > 0);
});

test("welcome message includes the configured business name", () => {
  assert.match(getWelcomeMessage("Northstar"), /Northstar/);
});