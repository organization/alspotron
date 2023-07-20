import * as path from 'node:path';

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
          dest: './assets',
        },
      ],
    }),
  ],
  root: './renderer',
  base: './',
  build: {
    outDir: '../dist/',
    minify: 'terser',
    terserOptions: {
      ecma: 2020,
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'renderer/index.html'),
        settings: path.resolve(__dirname, 'renderer/settings.html'),
        lyrics: path.resolve(__dirname, 'renderer/lyrics.html'),
      },
    },
  },
  optimizeDeps: {
    include: ['@codemirror/state', '@codemirror/view'],
  }
});
