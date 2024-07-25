// vite.config.js
import vitePugPlugin from 'vite-plugin-pug-transformer';

const pugLocals = {
  title: process.env.OLEA_TITLE || 'OleaCMS'
};

export default {
  // config options
  envPrefix: 'OLEA_',
  plugins: [vitePugPlugin({ pugLocals })],
};
