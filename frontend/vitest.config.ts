import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const viteEnv = loadEnv("test", process.cwd(), "OLEA");

export default defineConfig({
  plugins: [
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        runScripts: "dangerously",
        resources: "usable",
        pretendToBeVisual: true,
        url: "http://localhost:3030",
        console: true,
      },
    },
    server: {
      deps: {
        //         inline: ["htmx.org", "msx/browser"],
      },
    },
    root: __dirname,
    setupFiles: ["./vitest.setup.ts"],
    env: viteEnv,
  },
});
