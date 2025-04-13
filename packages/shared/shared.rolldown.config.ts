import { defineConfig, RolldownPlugin } from 'rolldown';

import dts from '@rollup/plugin-typescript';

export default defineConfig({
  input: 'src/index.ts',
  platform: 'neutral',
  output: {
    dir: 'dist/shared',
    format: 'esm',
    plugins: []
  },
  resolve: {
    tsconfigFilename: `./tsconfig.shared.json`
  },
  plugins: [
    dts({
      tsconfig: './tsconfig.shared.json',
    }) as RolldownPlugin,
  ],
});
