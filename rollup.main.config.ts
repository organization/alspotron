import { defineConfig } from 'rollup';
import builtinModules from 'builtin-modules';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import swc from '@rollup/plugin-swc';

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
  input: './index.ts',
  output: {
    format: 'cjs',
    name: '[name].js',
    dir: './dist',
  },
  external: isProduction ? [
    'electron',
    '@alexssmusica/ffi-napi',
    '@alexssmusica/ref-napi',
    '@jellybrick/wql-process-monitor',
    'mica-electron',
    'glasstron',
    'hmc-win32',
    'extract-file-icon',
    ...builtinModules,
  ] : [
    /node_modules/,
    ...builtinModules
  ],
});
