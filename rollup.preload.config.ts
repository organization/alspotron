import { defineConfig } from 'rollup';
import builtinModules from 'builtin-modules';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';
import swc from '@rollup/plugin-swc';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    json(),
    swc({ exclude: [/node_modules/] }),
    nodeResolve({ browser: false }),
    commonjs({ extensions: ['.js', '.ts'] }),
    isProduction && terser({
      ecma: 2020,
    }),
    {
      closeBundle() {
        if (!process.env.ROLLUP_WATCH) {
          setTimeout(() => process.exit(0));
        }
      },
      name: 'force-close'
    },
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
