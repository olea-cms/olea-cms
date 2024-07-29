// vite.config.js
import { defineConfig } from "vite";

import vitePugPlugin from "vite-plugin-pug-transformer";

import _env from "./.env.json";

const env = {
  // Default values
  // @ts-expect-error
  OLEA_TITLE: "OleaCMS",
  // Update with user supplied environment
  ..._env,
};

export default defineConfig(() => {
  return {
    // config options
    envPrefix: "OLEA_",
    esbuild: {
      jsxFactory: 'jsx',
      jsxFragment: 'jsx.Fragment',
    },
    plugins: [
      vitePugPlugin({
        pugLocals: {
          ENV: env,
          // If you want to add other locals you can add them below.
        },
      }),
      // feathers({ app: '../backend/src/app.ts', port: 3030 })
    ],
  };
});
