import path from 'node:path';

import { defineConfig } from '@farmfe/core';
import farmJsPluginDts from '@farmfe/js-plugin-dts';

import solid from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  compilation: {
    input: {
      index: path.join(__dirname, './src/index.ts'),
    },
    output: {
      targetEnv: 'library-browser',
      filename: 'style.css',
      path: 'dist',
      clean: true,
    },
    external: [
      'solid-js',
      '@vanilla-extract/css',
      '@vanilla-extract/dynamic',
      '@vanilla-extract/recipes'
    ],
    persistentCache: false,
  },
  vitePlugins: [
    () => ({
      vitePlugin: vanillaExtractPlugin(),
      filters: ['\\.css\\.ts$', '\\.vanilla\\.css$'],
    }),
    () => ({
      vitePlugin: solid(),
      filters: ['\\.tsx$', '\\.jsx$'],
    }),
  ],
  plugins: [
    farmJsPluginDts({
      outputDir: './dist/types',
      include: ['src/**/*.{ts,tsx}'],
      tsConfigPath: './tsconfig.json',
    }),
  ],
});
