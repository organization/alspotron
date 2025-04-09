import path from 'node:path';

import { defineConfig } from '@farmfe/core';
import farmJsPluginDts from '@farmfe/js-plugin-dts';

import solid from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { farmVanillaExtractBuildPlugin } from '@alspotron/plugin';

export default defineConfig({
  compilation: {
    input: {
      runtime: path.join(__dirname, './src/theme/runtime.ts'),
    },
    output: {
      targetEnv: 'library-node',
      path: 'dist',
      clean: false,
    },
    external: [
      '@vanilla-extract/css',
      '@vanilla-extract/dynamic',
      '@vanilla-extract/recipes',
      'deepmerge-ts',
    ],
    persistentCache: false,
  },
  root: process.cwd().replace(/\\/g, '/'), // relate https://github.com/farm-fe/farm/issues/2145
  vitePlugins: [
    () => ({
      vitePlugin: vanillaExtractPlugin(),
      filters: ['\\.css\\.ts$', '\\.vanilla\\.css$'],
    }),
  ],
  plugins: [
    farmJsPluginDts({
      outputDir: './dist/runtime-types',
      include: ['src/**/*.{ts,tsx}'],
      tsConfigPath: './tsconfig.json',
    }),
    farmVanillaExtractBuildPlugin(),
  ],
});
