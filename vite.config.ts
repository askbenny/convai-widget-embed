import { defineConfig } from "vite";
import analyzer from "vite-bundle-analyzer";

export default defineConfig(({ mode }) => {
  const website = mode === "website";
  return {
    build: {
      lib: {
        name: website ? "WebsiteWidgetEmbed" : "ConvaiWidgetEmbed",
        entry: website ? "src/website.ts" : "src/index.ts",
        fileName: () => (website ? "website.js" : "index.js"),
        formats: ["iife"],
      },
      outDir: "dist",
      emptyOutDir: !website,
    },
    plugins: [...(process.env.ANALYZE ? [analyzer()] : [])],
  };
});
