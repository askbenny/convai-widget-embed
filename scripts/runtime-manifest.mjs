import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, writeJson } from "./release-utils.mjs";
const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = readJson(resolve(root, "package.json"));
const core = readJson(resolve(root, "vendor/core-manifest.json"));
const installed = readJson(
  resolve(root, "node_modules/@askbenny/convai-widget-core/package.json"),
);
if (installed.version !== core.version)
  throw new Error("Installed core differs from source manifest");
const files = Object.fromEntries(
  ["index.js", "website.js"].map((name) => [
    name,
    createHash("sha256")
      .update(readFileSync(resolve(root, "dist", name)))
      .digest("hex"),
  ]),
);
writeJson(resolve(root, "dist/widget-manifest.json"), {
  embedVersion: pkg.version,
  coreVersion: core.version,
  coreCommit: core.commit,
  files,
});
