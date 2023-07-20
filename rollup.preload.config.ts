import { defineConfig } from 'rollup';
import { builtinModules } from 'module';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  plugins: [
    typescript({
      module: 'ESNext',
    }),
    nodeResolve({ browser: false }),
    commonjs(),
    json(),
    terser({
      ecma: 2020,
    }),
  ],
  input: './src/preload.ts',
  output: {
    format: 'cjs',
    name: '[name].js',
    dir: './dist',
  },
  external: [
    'electron',
    'font-list',
    'hmc-win32',
    ...builtinModules,
  ],
});