import path from 'node:path';

import { defineConfig } from '@farmfe/core';

import solid from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { Port } from '@alspotron/plugin';

export default defineConfig({
  compilation: {
    input: {
      index: path.join(__dirname, './index.html'),
    },
    output: {
      targetEnv: 'browser-esnext',
      path: 'dist',
      publicPath: './',
    },
    persistentCache: false,
  },
  server: {
    port: Port.TRAY,
  },
  vitePlugins: [
    () => ({
      vitePlugin: solid(),
      filters: ['\\.tsx$', '\\.jsx$'],
    }),
    () => ({
      vitePlugin: vanillaExtractPlugin(),
      filters: ['\\.css\\.ts$', '\\.vanilla\\.css$'],
    }),
  ],
  plugins: [],
});
