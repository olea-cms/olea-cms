// vite.config.js
import { defineConfig } from 'vite';

import vitePugPlugin from 'vite-plugin-pug-transformer';
// import { feathers } from 'feathers-vite';

const pugLocals = {
  title: process.env.OLEA_TITLE || 'OleaCMS'
};

export default defineConfig(async () => {
  return {
  // config options
  envPrefix: 'OLEA_',
    plugins: [
      vitePugPlugin({ pugLocals }),
      // feathers({ app: '../backend/src/app.ts', port: 3030 })
    ],
}});
