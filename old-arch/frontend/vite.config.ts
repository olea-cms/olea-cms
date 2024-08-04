// vite.config.js
import { defineConfig, loadEnv } from "vite";

import vitePugPlugin from "vite-plugin-pug-transformer";

export default ({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd(), "OLEA");

  return defineConfig({
    envPrefix: "OLEA_",
    esbuild: {
      jsxFactory: "jsx",
      jsxFragment: "jsx.Fragment",
    },
    plugins: [
      vitePugPlugin({
        pugLocals: {
          ...viteEnv,
        },
      }),
      // feathers({ app: '../backend/src/app.ts', port: 3030 })
    ],
  });
};
