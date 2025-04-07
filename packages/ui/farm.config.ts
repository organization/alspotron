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
      targetEnv: 'library',
      filename: 'style.css',
      path: 'dist',
      clean: true,
    },
    external: [
      'solid-js',
      '@vanilla-extract/css',
    ],
    persistentCache: false,
  },
  vitePlugins: [
    () => ({
      vitePlugin: solid(),
      filters: ['\\.tsx$', '\\.jsx$']
    }),
    () => ({
      vitePlugin: vanillaExtractPlugin(),
      filters: ['\\.css\\.ts$', '\\.vanilla\\.css$']
    }),
  ],
  plugins: [
    farmJsPluginDts({
      outputDir: './dist/types',
      // include: ['src/**/*.{ts,tsx}'],
      // exclude: ['node_modules/**'],
      tsConfigPath: './tsconfig.json',
    }),
  ],
});
