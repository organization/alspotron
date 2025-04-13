import { metadata } from './metadata';
import { Config } from '../model/config';

export const DefaultConfig: Config = {
  version: 4,

  views: [
    {
      enabled: true,
      theme: 'Default Theme',
      name: 'Default View',
      position: {
        anchor: 'bottom-right',
        display: null as number | null,
        top: 32,
        left: 32,
        bottom: 32,
        right: 32,
      },
    },
  ],
  appTheme: 'system',
  language: 'ko' as 'ko' | 'en' | 'ja' | 'de',
  developer: false,
  hardwareAcceleration: true,
  streamingMode: false,

  lyricProvider: 'alsong',
  sourceProvider: 'tuna-obs',

  experimental: {},

  providers: {
    source: {
      config: {
        'tuna-obs': {
          port: 1608,
        },
      },
    },
    lyric: {
      config: {},
    },
  },

  plugins: {
    list: {},
    disabled: {},
    config: {},
  },

  __internal__: {
    version: metadata.version,
  },
};

export const PRESET_PREFIX = '__preset__';
