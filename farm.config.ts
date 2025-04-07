import path from 'node:path';

import { defineConfig } from '@farmfe/core';
import electron from '@farmfe/js-plugin-electron';

import solid from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  compilation: {
    presetEnv: false,
    sourcemap: false,
    input: {
      main: path.join(__dirname, './renderer/index.html'),
      settings: path.join(__dirname, './renderer/settings.html'),
      lyrics: path.join(__dirname, './renderer/lyrics.html'),
      tray: path.join(__dirname, './renderer/tray.html'),
    },
    output: {
      targetEnv: 'browser-esnext',
      path: 'dist',
      publicPath: './',
    },
    persistentCache: false,
  },
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
    electron({
      main: {
        input: './index.ts',
        farm: {
          compilation: {
            sourcemap: false,
            externalNodeBuiltins: true,
            external: [
              '^electron$',
              '^@alexssmusica/ffi-napi$',
              '^@alexssmusica/ref-napi$',
              '^@jellybrick/wql-process-monitor$',
              '^mica-electron$',
              '^glasstron$',
              '^hmc-win32$',
              '^extract-file-icon$',
              '^node-window-manager$',
            ],
            output: {
              targetEnv: 'node-next',
              path: 'dist/main',
            },
          },
        },
      },
      preload: {
        input: './src/preload.ts',
        farm: {
          compilation: {
            sourcemap: false,
            externalNodeBuiltins: true,
            external: ['^electron$', '^hmc-win32$', '^font-list$'],
            output: {
              targetEnv: 'node-next',
              path: 'dist/preload',
            },
          },
        },
      },
    }),
  ],
});
