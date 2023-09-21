/* eslint-disable solid/reactivity */
import { readFileSync } from 'fs';

import fs from 'fs/promises';

import path from 'node:path';

import deepmerge from 'deepmerge';
import { app } from 'electron';
import { createSignal } from 'solid-js';

export interface Config {
  style: {
    font: string;
    fontWeight: string;
    animation: string;
    animationAtOnce: boolean;
    maxHeight: number;
    proximityOpacity: number;
    proximitySensitivity: number;
    rowGap: number;

    nowPlaying: {
      color: string;
      background: string;
      backgroundProgress: string;
      fontSize: number;
      maxWidth: number;
      visible: boolean;
      stoppedOpacity: number;
    };

    lyric: {
      color: string;
      background: string;
      fontSize: number;
      maxWidth: number;
      stoppedOpacity: number;
      containerRowGap: number;
      nextLyricScale?: number;
      previousLyricScale?: number;
      nextLyricOpacity?: number;
      previousLyricOpacity?: number;
    };

    userCSS: string | null;
  };

  lyric: {
    nextLyric: number;
    previousLyric: number;
  };

  windowPosition: {
    anchor: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
    display: number | null;
    top: number | null;
    left: number | null;
    bottom: number | null;
    right: number | null;
    direction: 'column' | 'column-reverse';
  };

  syncThrottle: number;

  language: 'ko' | 'en' | 'ja' | 'de';
  developer: boolean;

  plugins: {
    list: Record<string, string | undefined>; // id: path
    disabled: Record<string, boolean | undefined>; // id: enabled
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>; // id: config
  }
}

const getCurrentLocale = () => (/en|ko|ja|de/.exec(app.getLocale())?.at(0)) as 'ko' | 'en' | 'ja' | 'de' | undefined ?? 'ko';

export const DEFAULT_CONFIG: Config = {
  style: {
    font: 'KoPubWorldDotum',
    fontWeight: '400',
    animation: 'pretty',
    animationAtOnce: false,
    maxHeight: 400,
    proximityOpacity: 0,
    proximitySensitivity: 2,
    rowGap: 2,

    nowPlaying: {
      color: '#FFFFFF',
      background: 'rgba(29, 29, 29, .50)',
      backgroundProgress: 'rgba(29, 29, 29, .80)',
      fontSize: 11,
      maxWidth: 300,
      visible: true,
      stoppedOpacity: 0.5,
    },

    lyric: {
      color: '#FFFFFF',
      background: 'rgba(29, 29, 29, .70)',
      fontSize: 12,
      maxWidth: 700,
      stoppedOpacity: 0.5,
      containerRowGap: 1,
      nextLyricScale: 0.9,
      previousLyricScale: 0.9,
      nextLyricOpacity: 0.5,
      previousLyricOpacity: 0.5,
    },

    userCSS: null,
  },

  lyric: {
    nextLyric: 0,
    previousLyric: 0,
  },

  windowPosition: {
    anchor: 'bottom-right',
    display: null,
    top: 32,
    left: 32,
    bottom: 32,
    right: 32,
    direction: 'column',
  },

  syncThrottle: 1000 * 3,

  language: 'ko',
  developer: false,

  plugins: {
    list: {},
    disabled: {},
    config: {},
  },
} satisfies Config;

app.on('ready', () => {
  DEFAULT_CONFIG.language = getCurrentLocale();
}); // to get the correct locale

const defaultConfigDirectory = app.getPath('userData');

let configFileTimeout: NodeJS.Timeout | null = null;
const configSignal = createSignal<Config>(DEFAULT_CONFIG);

export const config = configSignal[0];
export const setConfig = (params: DeepPartial<Config>) => {
  const value = deepmerge(DEFAULT_CONFIG, deepmerge(configSignal[0](), params)) as Config;

  configSignal[1](value);

  if (configFileTimeout) clearTimeout(configFileTimeout);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  configFileTimeout = setTimeout(async () => {
    configFileTimeout = null;

    await fs.writeFile(path.join(defaultConfigDirectory, 'config.json'), JSON.stringify(configSignal[0](), null, 2), 'utf-8').catch(() => null);
  }, 1000);
};

try {
  const str = readFileSync(path.join(defaultConfigDirectory, 'config.json'), 'utf-8');
  const config = JSON.parse(str);
  setConfig(deepmerge(DEFAULT_CONFIG, config as Config)); // to upgrade config
} catch {
  setConfig(DEFAULT_CONFIG);
}

/* Lyric Mapper */
export interface LyricMapper {
  [key: string]: number;
}

let lyricMapperFileTimeout: NodeJS.Timeout | null = null;
const lyricMapperSignal = createSignal<LyricMapper>();
export const lyricMapper = lyricMapperSignal[0];
export const setLyricMapper = (params: Partial<LyricMapper>, useFallback = true) => {
  const value = {
    ...lyricMapperSignal[0](),
    ...params,
  } as LyricMapper;
  
  lyricMapperSignal[1](useFallback ? value : params as LyricMapper);

  if (lyricMapperFileTimeout) clearTimeout(lyricMapperFileTimeout);

  lyricMapperFileTimeout = setTimeout(async () => {
    lyricMapperFileTimeout = null;

    await fs.writeFile(path.join(defaultConfigDirectory, 'lyrics.json'), JSON.stringify(lyricMapperSignal[0](), null, 2), 'utf-8').catch(() => null);
  }, 1000);
};
(async () => {
  const str = await fs.readFile(path.join(defaultConfigDirectory, 'lyrics.json'), 'utf-8').catch(() => '{}');
  try {
    const lyricMapper = JSON.parse(str);
    lyricMapperSignal[1](lyricMapper as LyricMapper);
  } catch {
    setLyricMapper({});
  }
})();


/* Games */
export interface GameList {
  [path: string]: string; // mame
}

let gameListFileTimeout: NodeJS.Timeout | null = null;
const gameListSignal = createSignal<GameList>();

export const gameList = gameListSignal[0];
export const setGameList = (params: Partial<GameList>, useFallback = true) => {
  const value = {
    ...gameListSignal[0](),
    ...params,
  } as GameList;
  
  gameListSignal[1](useFallback ? value : params as GameList);

  if (gameListFileTimeout) clearTimeout(gameListFileTimeout);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  gameListFileTimeout = setTimeout(async () => {
    gameListFileTimeout = null;

    await fs.writeFile(path.join(defaultConfigDirectory, 'gameList.json'), JSON.stringify(gameListSignal[0](), null, 2), 'utf-8').catch(() => null);
  }, 1000);
};

(() => {
  try {
    const gameList = JSON.parse(readFileSync(path.join(defaultConfigDirectory, 'gameList.json'), 'utf-8'));
    gameListSignal[1](gameList as GameList);
  } catch {
    setGameList({});
  }
})();
