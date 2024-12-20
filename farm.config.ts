import path from 'node:path';

import { defineConfig } from '@farmfe/core';
import farmPluginPostcss from '@farmfe/js-plugin-postcss';

import solid from 'vite-plugin-solid';
import electron from './farm-plugins/electron';

export default defineConfig({
  compilation: {
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
  },
  vitePlugins: [
    () => ({
      vitePlugin: solid(),
      filters: ['\\.tsx$', '\\.jsx$']
    })
  ],
  plugins: [
    electron({
      main: {
        input: './index.ts',
        farm: {
          compilation: {
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
              '^node-window-manager$'
            ],
            output: {
              targetEnv: 'node-next',
              path: 'dist',
            },
          },
        },
      },
      preload: {
        input: './src/preload.ts',
        farm: {
          compilation: {
            externalNodeBuiltins: true,
            external: [
              '^electron$',
              '^hmc-win32$',
              '^font-list$',
            ],
            output: {
              targetEnv: 'node-next',
              path: 'dist',
            },
          },
        },
      },
    }),
    farmPluginPostcss(),
  ],
});
