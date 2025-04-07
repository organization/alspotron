import path from 'node:path';

import { defineConfig } from '@farmfe/core';
import farmJsPluginDts from '@farmfe/js-plugin-dts';

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
    external: ['solid-js', '@vanilla-extract/css'],
    persistentCache: false,
  },
  plugins: [
    farmJsPluginDts({
      outputDir: './dist/types',
      include: ['src/**/*.{ts,tsx}'],
      tsConfigPath: './tsconfig.json',
    }),
  ],
});
