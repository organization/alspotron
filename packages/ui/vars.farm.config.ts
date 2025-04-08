import path from 'node:path';

import { defineConfig } from '@farmfe/core';
import farmJsPluginDts from '@farmfe/js-plugin-dts';

import solid from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { farmVanillaExtractBuildPlugin } from '@alspotron/plugin';

export default defineConfig({
  compilation: {
    input: {
      vars: path.join(__dirname, './src/theme/vars.css.ts'),
    },
    output: {
      targetEnv: 'library-node',
      path: 'dist',
      clean: false,
    },
    external: [
      'solid-js',
      '@vanilla-extract/css',
      '@vanilla-extract/dynamic',
      '@vanilla-extract/recipes',
      '@floating-ui/dom',
      '@solid-primitives/media',
    ],
    persistentCache: false,
  },
  root: process.cwd().replace(/\\/g, '/'), // relate https://github.com/farm-fe/farm/issues/2145
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
  plugins: [
    farmJsPluginDts({
      outputDir: './dist/types',
      include: ['src/**/*.{ts,tsx}'],
      tsConfigPath: './tsconfig.json',
    }),
    farmVanillaExtractBuildPlugin(),
  ],
});
