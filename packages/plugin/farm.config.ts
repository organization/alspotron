import path from 'node:path';

import { defineConfig } from '@farmfe/core';
import farmJsPluginDts from '@farmfe/js-plugin-dts';

console.log(process.cwd().replace(/\\/g, '/'))
export default defineConfig({
  compilation: {
    input: {
      index: path.join(__dirname, './src/index.ts'),
    },
    output: {
      targetEnv: 'library',
      filename: '[name].js',
      path: 'dist',
      clean: true,
    },
    persistentCache: false,
  },
  root: process.cwd().replace(/\\/g, '/'), // relate https://github.com/farm-fe/farm/issues/2145
  plugins: [
    farmJsPluginDts({
      outputDir: './dist/types',
      include: ['src/**/*.{ts,tsx}'],
      tsConfigPath: './tsconfig.json',
    }),
  ],
});
