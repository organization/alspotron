import { defineConfig } from 'vite';

import solid from 'vite-plugin-solid';
import { viteStaticCopy as copy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    solid(),
    copy({
      targets: [
        {
          src: '../assets/**/*',
          dest: './assets'
        }
      ]
    }),
  ],
  root: './renderer',
  base: './',
  build: {
    outDir: '../dist/',
  },
});