import assert from "node:assert/strict";
import test from "node:test";
import { planCoreUpdate, runtimePins } from "../sync-core.mjs";
test("first registry sync replaces an equal-version bootstrap dependency", () => {
  assert.deepEqual(
    planCoreUpdate({
      coreVersion: "1.5.0",
      currentCore: "file:vendor/core.tgz",
      snapshotVersion: "1.5.0",
      embedVersion: "1.5.0",
      embedPublished: false,
    }),
    { coreVersion: "1.5.0", embedVersion: "1.5.0" },
  );
});
test("published embed gets a patch release for a new core; unchanged pins do nothing", () => {
  assert.deepEqual(
    planCoreUpdate({
      coreVersion: "1.6.0",
      currentCore: "1.5.0",
      embedVersion: "1.5.1",
      embedPublished: true,
    }),
    { coreVersion: "1.6.0", embedVersion: "1.5.2" },
  );
  assert.equal(
    planCoreUpdate({
      coreVersion: "1.5.0",
      currentCore: "1.5.0",
      embedVersion: "1.5.1",
      embedPublished: true,
    }),
    null,
  );
});
test("out-of-order events cannot downgrade a dependency", () => {
  assert.equal(
    planCoreUpdate({
      coreVersion: "1.4.11",
      currentCore: "1.5.0",
      embedVersion: "1.5.1",
      embedPublished: true,
    }),
    null,
  );
});

test("carries the exact core runtime dependencies into the embed", () => {
  const dependencies = {
    preact: "10.28.0",
    "@preact/signals": "2.5.1",
    "@elevenlabs/client": "1.1.1",
  };
  assert.deepEqual(runtimePins({ dependencies }), dependencies);
  assert.throws(() =>
    runtimePins({ dependencies: { ...dependencies, preact: "^10.28.0" } }),
  );
});
