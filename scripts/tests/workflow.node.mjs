import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
test("publishing uses tested code and never mutates its version", () => {
  const workflow = readFileSync(
    new URL("../../.github/workflows/npm-publish.yml", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(workflow, /npm version patch/);
  assert.match(workflow, /needs: validate/);
  assert.match(workflow, /release\.mjs status/);
});
