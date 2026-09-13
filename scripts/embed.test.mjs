import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
let browser;
before(async () => {
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    headless: true,
  });
});
after(async () => browser?.close());

test("bundles the reviewed core without changing the SDK baseline", () => {
  const core = require("@askbenny/convai-widget-core/package.json");
  assert.equal(core.version, "1.4.14");
  assert.equal(core.scripts.postinstall, undefined);
  const lock = readFileSync(new URL("../pnpm-lock.yaml", import.meta.url), "utf8");
  const versions = [...lock.matchAll(/@elevenlabs\/client@([^':\s]+)/g)].map((match) => match[1]);
  assert.ok(versions.length > 0);
  assert.ok(versions.every((version) => version === "1.1.1" || version.startsWith("1.1.1(")));
});

for (const lockedHost of [false, true]) {
  test(`classic bundle renders and honors disable-banner${lockedHost ? " on a Wix-style locked host" : ""}`, async () => {
    const context = await browser.newContext();
    try {
      if (lockedHost) {
        await context.addInitScript(() => {
          for (const name of ["addEventListener", "removeEventListener", "dispatchEvent"]) {
            Object.defineProperty(EventTarget.prototype, name, { writable: false, configurable: false });
          }
        });
      }
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.hostname === "embed.test") {
          return route.fulfill({ contentType: "text/html", body: "<!doctype html><html><body></body></html>" });
        }
        if (url.hostname === "api.askbenny.ca" && url.pathname === "/elevenlabs/agents/config") {
          return route.fulfill({ json: { body: { schemaVersion: 2, agentId: "test", branchId: "website-test", agent: { firstMessage: "Hello from AskBenny" } } } });
        }
        if (url.hostname === "fonts.googleapis.com") return route.fulfill({ contentType: "text/css", body: "" });
        if (url.href === "https://storage.googleapis.com/eleven-public-cdn/images/perlin-noise.png") {
          return route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=", "base64") });
        }
        errors.push(`Unexpected network request: ${route.request().method()} ${url}`);
        return route.abort();
      });
      await page.goto("https://embed.test");
      await page.addScriptTag({ path: new URL("../dist/index.js", import.meta.url).pathname });
      assert.equal(await page.evaluate(() => !!customElements.get("askbenny-convai")), true);
      assert.equal(await page.evaluate(() => !!customElements.get("elevenlabs-convai")), false);
      await page.evaluate(() => {
        const widget = document.createElement("askbenny-convai");
        widget.setAttribute("agent-id", "test");
        widget.setAttribute("override-config", JSON.stringify({
          variant: "full", placement: "bottom-right", language: "en", text_only: true,
          supports_text_only: true, text_input_enabled: true, default_expanded: true,
          first_message: "Hello from AskBenny", disable_banner: false,
          avatar: { type: "orb", color_1: "#000000", color_2: "#ffffff" },
        }));
        document.body.appendChild(widget);
      });
      await page.getByText("Hello from AskBenny", { exact: true }).waitFor();
      // Assert the visible branding first, then the attribute's live override.
      await page.getByText("Powered by", { exact: false }).waitFor();
      await page.locator("askbenny-convai").evaluate((element) => element.setAttribute("disable-banner", "true"));
      await page.getByText("Powered by", { exact: false }).waitFor({ state: "hidden" });
      await page.locator("askbenny-convai").evaluate((element) => element.setAttribute("disable-banner", "false"));
      await page.getByText("Powered by", { exact: false }).waitFor();
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  });
}
