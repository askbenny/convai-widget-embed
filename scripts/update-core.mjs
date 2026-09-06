import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const core = resolve(process.argv[2] || resolve(root, "../convai-widget-core"));
const packageJson = JSON.parse(
  await readFile(resolve(core, "package.json"), "utf8"),
);
const commit = execFileSync("git", ["-C", core, "rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
if (
  execFileSync(
    "git",
    ["-C", core, "status", "--porcelain", "--untracked-files=no"],
    { encoding: "utf8" },
  ).trim()
)
  throw new Error("Commit the core source before creating a release snapshot.");
execFileSync("pnpm", ["build"], { cwd: core, stdio: "inherit" });
execFileSync("pnpm", ["pack", "--pack-destination", tmpdir()], {
  cwd: core,
  stdio: "inherit",
});
const filename = `askbenny-convai-widget-core-${packageJson.version}.tgz`;
const target = resolve(root, "vendor", filename);
await mkdir(dirname(target), { recursive: true });
await copyFile(resolve(tmpdir(), filename), target);
const sha256 = createHash("sha256")
  .update(await readFile(target))
  .digest("hex");
await writeFile(
  resolve(root, "vendor/core-manifest.json"),
  JSON.stringify(
    {
      repository: "https://github.com/askbenny/convai-widget-core",
      commit,
      version: packageJson.version,
      sha256,
    },
    null,
    2,
  ) + "\n",
);
const embedPackage = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8"),
);
embedPackage.devDependencies["@askbenny/convai-widget-core"] =
  `file:vendor/${filename}`;
await writeFile(
  resolve(root, "package.json"),
  JSON.stringify(embedPackage, null, 2) + "\n",
);
console.log(
  "Core snapshot updated. Run pnpm update @askbenny/convai-widget-core, pnpm test, pnpm check-types, and pnpm build.",
);
