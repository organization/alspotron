/* eslint-disable solid/reactivity */
import { readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import deepmerge from 'deepmerge';
import { app } from 'electron';
import { createSignal } from 'solid-js';

import { DEFAULT_CONFIG } from './constants';

export type StyleConfig = {
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
    multipleContainerRowGap: number;
    direction: 'column' | 'column-reverse';
    nextLyric: number;
    previousLyric: number;
    nextLyricScale: number;
    previousLyricScale: number;
    nextLyricOpacity: number;
    previousLyricOpacity: number;
  };

  userCSS: string | null;
};

export interface Config {
  version: 1;

  themes: Record<string, StyleConfig | undefined>;
  selectedTheme: string;

  /** @deprecated */
  style?: StyleConfig;

  windowPosition: {
    anchor: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
    display: number | null;
    top: number | null;
    left: number | null;
    bottom: number | null;
    right: number | null;
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

app.on('ready', () => {
  DEFAULT_CONFIG.language = getCurrentLocale();
}); // to get the correct locale

const defaultConfigDirectory = app.getPath('userData');

let configFileTimeout: NodeJS.Timeout | null = null;
const configSignal = createSignal<Config>(DEFAULT_CONFIG);

export const config = configSignal[0];
export const setConfig = (params: DeepPartial<Config>, useDefault = true) => {
  const value = (useDefault ? deepmerge(DEFAULT_CONFIG, deepmerge(configSignal[0](), params)) : params) as Config;

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
