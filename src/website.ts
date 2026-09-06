import { registerWidget } from "@askbenny/convai-widget-core";

// Capture the loading script synchronously: document.currentScript is null once
// execution yields. Defaults are per element and explicit attributes can override
// them when several deployments share one host page.
const script = document.currentScript;
registerWidget("website-widget", {
  "api-base-url": script?.getAttribute("data-api-base-url") ?? undefined,
  "portal-hostname": script?.getAttribute("data-portal-hostname") ?? undefined,
});
