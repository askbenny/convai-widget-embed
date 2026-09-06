import { beforeEach, describe, expect, it, vi } from "vitest";
const register = vi.hoisted(() => vi.fn());
vi.mock("@askbenny/convai-widget-core", () => ({ registerWidget: register }));
beforeEach(() => {
  vi.resetModules();
  register.mockClear();
});
describe("compatible script entrypoints", () => {
  it("retains the default legacy registration", async () => {
    await import("../index");
    expect(register).toHaveBeenCalledWith();
  });
  it("captures its own script configuration and only registers the neutral tag", async () => {
    vi.stubGlobal("document", {
      currentScript: {
        getAttribute: (name: string) =>
          ({
            "data-api-base-url": "https://api-dev.askbennypartners.com",
            "data-portal-hostname": "portal.brand.test",
          })[name],
      },
    });
    await import("../website");
    expect(register).toHaveBeenCalledExactlyOnceWith("website-widget", {
      "api-base-url": "https://api-dev.askbennypartners.com",
      "portal-hostname": "portal.brand.test",
    });
  });
});
