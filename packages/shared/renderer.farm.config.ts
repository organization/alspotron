import path from 'node:path';

import { defineConfig } from '@farmfe/core';
import farmJsPluginDts from '@farmfe/js-plugin-dts';
import solid from 'vite-plugin-solid';

export default defineConfig({
  compilation: {
    input: {
      index: path.join(__dirname, './renderer/index.ts'),
    },
    output: {
      targetEnv: 'library',
      path: 'dist/renderer',
    },
    persistentCache: false,
    external: [
      'solid-js'
    ]
  },
  vitePlugins: [
    () => ({
      vitePlugin: solid(),
      filters: ['\\.tsx$', '\\.jsx$'],
    }),
  ],
  root: process.cwd().replace(/\\/g, '/'), // relate https://github.com/farm-fe/farm/issues/2145
  plugins: [
    farmJsPluginDts({
      outputDir: './dist/types',
      include: ['src/**/*.{ts,tsx}'],
      tsConfigPath: './tsconfig.json',
    }),
  ],
});
