import { createSignal } from 'solid-js';

import fs from 'fs/promises';

export interface Config {
  style: {
    font: string;
    fontWeight: string;

    nowPlaying: {
      color: string;
      background: string;
      backgroundProgress: string;
      fontSize: number;
      maxWidth: number;
    };
    lyric: {
      color: string;
      background: string;
      fontSize: number;
    };
  };

  windowPosition: {
    anchor: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
    top: number | null;
    left: number | null;
    bottom: number | null;
    right: number | null;
  };

  syncThrottle: number;
}
export const DEFAULT_CONFIG = {
  style: {
    font: 'KoPubWorldDotum',
    fontWeight: '400',

    nowPlaying: {
      color: '#FFFFFF',
      background: 'rgba(29, 29, 29, .50)',
      backgroundProgress: 'rgba(29, 29, 29, .80)',
      fontSize: 11,
      maxWidth: 300
    },

    lyric: {
      color: '#FFFFFF',
      background: 'rgba(29, 29, 29, .70)',
      fontSize: 12,
    }
  },

  windowPosition: {
    anchor: 'bottom-right',
    top: 32,
    left: 32,
    bottom: 32,
    right: 32,
  },

  syncThrottle: 1000 * 3,
} satisfies Config;

let configFileTimeout: NodeJS.Timeout | null = null;
const configSignal = createSignal<Config>(DEFAULT_CONFIG);
void (async () => {
  const str = await fs.readFile('config.json', 'utf-8').catch(() => JSON.stringify(DEFAULT_CONFIG));
  try {
    const config = JSON.parse(str);
    configSignal[1](config as Config);
  } catch {
    setConfig(DEFAULT_CONFIG);
  }
})();

export const config = configSignal[0];
export const setConfig = (params: DeepPartial<Config>) => {
  const value = {
    ...DEFAULT_CONFIG,
    ...configSignal[0](),
    ...params,

    style: {
      ...DEFAULT_CONFIG.style,
      ...configSignal[0]()?.style,
      ...params?.style,
      nowPlaying: {
        ...DEFAULT_CONFIG.style.nowPlaying,
        ...configSignal[0]()?.style?.nowPlaying,
        ...params?.style?.nowPlaying,
      },
      lyric: {
        ...DEFAULT_CONFIG.style.lyric,
        ...configSignal[0]()?.style?.lyric,
        ...params?.style?.lyric,
      },
    },

    windowPosition: {
      ...DEFAULT_CONFIG.windowPosition,
      ...configSignal[0]()?.windowPosition,
      ...params?.windowPosition,
    },
  };
  
  configSignal[1](value);

  if (configFileTimeout) clearTimeout(configFileTimeout);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  configFileTimeout = setTimeout(async () => {
    configFileTimeout = null;

    await fs.writeFile('config.json', JSON.stringify(configSignal[0](), null, 2), 'utf-8').catch(() => null);
  }, 1000);
};

export interface LyricMapper {
  [key: string]: number;
}

let lyricMapperFileTimeout: NodeJS.Timeout | null = null;
const lyricMapperSignal = createSignal<LyricMapper>();
void (async () => {
  const str = await fs.readFile('lyrics.json', 'utf-8').catch(() => '{}');
  try {
    const lyricMapper = JSON.parse(str);
    lyricMapperSignal[1](lyricMapper as LyricMapper);
  } catch {
    setLyricMapper({});
  }
})();

export const lyricMapper = lyricMapperSignal[0];
export const setLyricMapper = (params: Partial<LyricMapper>) => {
  const value = {
    ...lyricMapperSignal[0](),
    ...params,
  };
  
  lyricMapperSignal[1](value);

  if (lyricMapperFileTimeout) clearTimeout(lyricMapperFileTimeout);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  lyricMapperFileTimeout = setTimeout(async () => {
    lyricMapperFileTimeout = null;

    await fs.writeFile('lyrics.json', JSON.stringify(lyricMapperSignal[0](), null, 2), 'utf-8').catch(() => null);
  }, 1000);
};
