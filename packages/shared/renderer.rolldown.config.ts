import { defineConfig, RolldownPlugin } from 'rolldown';

import dts from '@rollup/plugin-typescript';
import solid from 'vite-plugin-solid';

export default defineConfig({
  input: 'renderer/index.ts',
  platform: 'browser',
  output: {
    dir: 'dist/renderer',
    format: 'esm'
  },
  resolve: {
    tsconfigFilename: `./tsconfig.renderer.json`
  },
  plugins: [
    solid() as RolldownPlugin,
    dts({
      tsconfig: './tsconfig.renderer.json',
    }) as RolldownPlugin,
  ],
});
