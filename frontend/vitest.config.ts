import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        runScripts: "dangerously",
        resources: "usable",
        pretendToBeVisual: true,
        url: "http://localhost:3030",
      },
    },
    root: __dirname,
    setupFiles: ["./vitest.setup.ts"],
  },
});
