import { defineConfig, RolldownPlugin } from 'rolldown';

import dts from '@rollup/plugin-typescript';

export default defineConfig({
  input: 'main/index.ts',
  platform: 'node',
  output: {
    dir: 'dist/main',
    format: 'esm'
  },
  resolve: {
    tsconfigFilename: `./tsconfig.main.json`
  },
  plugins: [
    dts({
      tsconfig: './tsconfig.main.json',
    }) as RolldownPlugin,
  ],
});
