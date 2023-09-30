import { readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import deepmerge from 'deepmerge';
import { app } from 'electron';
import { createSignal } from 'solid-js';

import { DEFAULT_CONFIG, DEFAULT_STYLE } from './constants';
import migrateLegacyTheme from './migrate-legacy-theme';

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
  selectedTheme: string;

  /** @deprecated */
  style?: StyleConfig;
  /** @deprecated */
  lyric?: {
    nextLyric: number;
    previousLyric: number;
  }

  windowPosition: {
    anchor: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
    display: number | null;
    top: number | null;
    left: number | null;
    bottom: number | null;
    right: number | null;
    /** @deprecated */
    direction?: StyleConfig['lyric']['direction'];
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
let migrationCallback: (() => void) | null = null;

let configFileTimeout: NodeJS.Timeout | null = null;
// eslint-disable-next-line solid/reactivity
const configSignal = createSignal<Config>(DEFAULT_CONFIG);

export const config = configSignal[0];
export const setConfig = (params: DeepPartial<Config>, useFallback = true) => {
  const value = (useFallback ? deepmerge(DEFAULT_CONFIG, deepmerge(configSignal[0](), params)) : params) as Config;

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
  const config = JSON.parse(str) as Config;
  const [legacyConfig, legacyTheme] = migrateLegacyTheme(config) ?? [null, null];
  const updatedConfig = deepmerge(config, legacyConfig ?? {});

  if (legacyTheme) {
    migrationCallback = () => {
      const [name, theme] = legacyTheme;
      setTheme(name, theme);
    };
  }
  setConfig(deepmerge(DEFAULT_CONFIG, updatedConfig)); // to upgrade config
} catch (err) {
  setConfig(DEFAULT_CONFIG);
}

/* Lyric Mapper */
export interface LyricMapper {
  [key: string]: number;
}

let lyricMapperFileTimeout: NodeJS.Timeout | null = null;
// eslint-disable-next-line solid/reactivity
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
// eslint-disable-next-line solid/reactivity
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

/* Themes */
let themeListFileTimeout: NodeJS.Timeout | null = null;
// eslint-disable-next-line solid/reactivity
const themeListSignal = createSignal<Record<string, StyleConfig>>();
export const themeList = themeListSignal[0];
export const setTheme = (name: string, style: DeepPartial<StyleConfig> | null, useFallback = true) => {
  const original = themeListSignal[0]() ?? {};
  if (!original['Default Theme'] && name !== 'Default Theme') original['Default Theme'] = DEFAULT_STYLE;

  if (style === null) {
    const newList = { ...original };
    delete newList[name];

    themeListSignal[1](newList);
  } else {
    const value = (
      useFallback
      ? deepmerge(DEFAULT_STYLE, deepmerge(original?.[name] ?? DEFAULT_STYLE, style))
      : style
    ) as StyleConfig;

    themeListSignal[1]({
      ...original,
      [name]: value,
    });
  }

  if (themeListFileTimeout) clearTimeout(themeListFileTimeout);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  themeListFileTimeout = setTimeout(async () => {
    themeListFileTimeout = null;

    const data = themeListSignal[0]() ?? {};
    const names = Object.entries(data).filter(([, value]) => value).map(([key]) => key);

    const themeFolderPath = path.join(defaultConfigDirectory, '/theme');
    await fs.mkdir(themeFolderPath).catch(() => null);

    const toDeleteList = (await fs.readdir(themeFolderPath))
      .filter((filename) => filename.match(/\.json$/) && !names.includes(filename.replace(/\.json$/, '')));

    await Promise.all(toDeleteList.map(async (filename) => fs.unlink(path.join(themeFolderPath, filename))));
    await Promise.all(names.map(async (name) => {
      const themePath = path.join(themeFolderPath, `${name}.json`);
      await fs.writeFile(themePath, JSON.stringify(data[name], null, 2), 'utf-8').catch(() => null);
    }));
  }, 1000);
};

(async () => {
  try {
    const themeFolderPath = path.join(defaultConfigDirectory, '/theme');
    await fs.mkdir(themeFolderPath).catch(() => null);

    const fileList = await fs.readdir(themeFolderPath, { withFileTypes: true }).catch(() => []);
    const nameList = fileList.filter((it) => it.isFile()).map((it) => it.name);

    const initThemeList: Record<string, StyleConfig> = {};
    await Promise.all(nameList.map(async (filename) => {
      if (filename.match(/\.json$/)?.[0] !== '.json') return;

      const name = filename.replace(/\.json$/, '');
      const data = await fs.readFile(path.join(themeFolderPath, filename), 'utf-8').catch(() => null);
      if (data === null) return;

      initThemeList[name] = JSON.parse(data) as StyleConfig;
    }));
    
    themeListSignal[1](initThemeList);
  
    migrationCallback?.();
  } catch {
    setTheme('Default Theme', DEFAULT_STYLE);
  }
})();
