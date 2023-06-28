import { createSignal } from 'solid-js';

import fs from 'fs/promises';

export interface Config {
  style: {
    font: string;

    nowPlaying: {
      color: string;
      background: string;
      backgroundProgress: string;
      fontSize: number;
      width: number;
    };
    lyric: {
      color: string;
      background: string;
      fontSize: number;
      width: number;
      height: number;
      align: string;
    };
  };

  syncThrottle: number;
}
export const DEFAULT_CONFIG = {
  style: {
    font: 'KoPubWorldDotum',
    nowPlaying: {
      color: '#FFFFFF',
      background: 'rgba(29, 29, 29, .50)',
      backgroundProgress: 'rgba(29, 29, 29, .80)',
      fontSize: 11,
      width: 300
    },

    lyric: {
      color: '#FFFFFF',
      background: 'rgba(29, 29, 29, .70)',
      fontSize: 12,
      width: 500,
      height: 150,
      align: 'right'
    }
  },

  syncThrottle: 1000 * 3,
};

let configFileTimeout: NodeJS.Timeout | null = null;
const configSignal = createSignal<Config>(DEFAULT_CONFIG);
(async () => {
  const str = await fs.readFile('config.json', 'utf-8').catch(() => null);
  try {
    const config = JSON.parse(str);
    configSignal[1](config);
  } catch {}
})();

export const config = configSignal[0];
export const setConfig = (params: Partial<Config>) => {
  const value = {
    ...DEFAULT_CONFIG,
    ...configSignal[0](),
    ...params,
    style: {
      ...DEFAULT_CONFIG.style,
      ...configSignal[0]().style,
      ...params.style,
      nowPlaying: {
        ...DEFAULT_CONFIG.style.nowPlaying,
        ...configSignal[0]().style.nowPlaying,
        ...params.style?.nowPlaying,
      },
      lyric: {
        ...DEFAULT_CONFIG.style.lyric,
        ...configSignal[0]().style.lyric,
        ...params.style?.lyric,
      },
    },
  };
  
  configSignal[1](value);

  if (configFileTimeout) clearTimeout(configFileTimeout);
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
(async () => {
  const str = await fs.readFile('lyrics.json', 'utf-8').catch(() => null);
  try {
    const lyricMapper = JSON.parse(str);
    lyricMapperSignal[1](lyricMapper);
  } catch {}
})();

export const lyricMapper = lyricMapperSignal[0];
export const setLyricMapper = (params: Partial<LyricMapper>) => {
  const value = {
    ...lyricMapperSignal[0](),
    ...params,
  };
  
  lyricMapperSignal[1](value);

  if (lyricMapperFileTimeout) clearTimeout(lyricMapperFileTimeout);
  lyricMapperFileTimeout = setTimeout(async () => {
    lyricMapperFileTimeout = null;

    await fs.writeFile('lyrics.json', JSON.stringify(lyricMapperSignal[0](), null, 2), 'utf-8').catch(() => null);
  }, 1000);
};
