import { readdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { parseDocument } from "yaml";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  stableVersion,
  compareVersions,
  bumpVersion,
  packageMetadata,
  readJson,
  writeJson,
  output,
} from "./release-utils.mjs";

export function runtimePins(metadata) {
  return Object.fromEntries(
    ["preact", "@preact/signals", "@elevenlabs/client"].map((name) => [
      name,
      stableVersion(metadata.dependencies?.[name]),
    ]),
  );
}

export function planCoreUpdate({
  coreVersion,
  currentCore,
  snapshotVersion,
  embedVersion,
  embedPublished,
}) {
  stableVersion(coreVersion);
  const current = currentCore.startsWith("file:")
    ? snapshotVersion
    : currentCore;
  if (compareVersions(coreVersion, current) < 0 || currentCore === coreVersion)
    return null;
  return {
    coreVersion,
    embedVersion: embedPublished
      ? bumpVersion(embedVersion, "patch")
      : embedVersion,
  };
}
async function main() {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const pkg = readJson(resolve(root, "package.json"));
  const core = await packageMetadata(
    "@askbenny/convai-widget-core",
    process.argv[2] || "latest",
  );
  if (!core) throw new Error("Requested core release is not published");
  const published = await packageMetadata(pkg.name, pkg.version);
  const snapshotPath = resolve(root, "vendor/core-manifest.json");
  const snapshot = readJson(snapshotPath);
  const plan = planCoreUpdate({
    coreVersion: core.version,
    currentCore: pkg.devDependencies[core.name],
    snapshotVersion: snapshot.version,
    embedVersion: pkg.version,
    embedPublished: !!published,
  });
  output("changed", !!plan);
  if (!plan) return;
  if (
    !core.dist?.integrity?.startsWith("sha512-") ||
    !/^[0-9a-f]{40}$/.test(core.gitHead || "")
  )
    throw new Error(
      "Core release is missing integrity or source commit provenance",
    );
  const pins = runtimePins(core);
  const workspacePath = resolve(root, "pnpm-workspace.yaml");
  const workspace = parseDocument(readFileSync(workspacePath, "utf8"));
  if (workspace.errors.length)
    throw new Error("Cannot parse pnpm workspace configuration");
  for (const [name, version] of Object.entries(pins))
    workspace.setIn(["overrides", name], version);
  writeFileSync(workspacePath, workspace.toString());
  pkg.devDependencies[core.name] = plan.coreVersion;
  pkg.version = plan.embedVersion;
  writeJson(resolve(root, "package.json"), pkg);
  writeJson(snapshotPath, {
    source: "npm",
    package: core.name,
    repository: "https://github.com/askbenny/convai-widget-core",
    commit: core.gitHead,
    version: core.version,
    integrity: core.dist.integrity,
  });
  for (const file of readdirSync(resolve(root, "vendor")))
    if (/^askbenny-convai-widget-core-.*\.tgz$/.test(file))
      rmSync(resolve(root, "vendor", file));
  execFileSync(
    "pnpm",
    ["install", "--no-frozen-lockfile", "--ignore-scripts"],
    { cwd: root, stdio: "inherit" },
  );
  output("version", plan.embedVersion);
  output("core", plan.coreVersion);
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
