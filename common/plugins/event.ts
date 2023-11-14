import { Plugin } from './plugin';

import { Config, GameList, LyricMapper, StyleConfig } from '../config';
import { UpdateData } from '../types';

export interface PluginEventMap {
  'update': (updateContext: UpdateData) => void;
  'config': (config: DeepPartial<Config>) => void;
  'game-list': (gameList: Partial<GameList>) => void;
  'lyric-mapper': (lyricMapper: Partial<LyricMapper>) => void;
  'registered-process-list': (pidList: number[]) => void;
  'window-minimize': () => void;
  'window-maximize': (maximize: boolean) => void;
  'window-close': () => void;
  'before-add-plugin': (pluginPath: string) => void;
  'add-plugin': (plugin: Plugin, extractPath: string) => void;
  'before-remove-plugin': (plugin: Plugin) => void;
  'after-remove-plugin': (plugin: Plugin) => void;
  'change-plugin-state': (plugin: Plugin, state: 'enable' | 'disable') => void;
  'start-overlay': () => void;
  'stop-overlay': () => void;
  'inject-overlay-to-process': (processId: number, name?: string, filePath?: string) => void;
  'remove-overlay-from-process': (processId: number) => void;
}
export interface OverrideParameterMap {
  'update': [updateContext: UpdateData];
  'config': [config: DeepPartial<Config>];
  'game-list': [gameList: Partial<GameList>];
  'set-theme': [themeList: DeepPartial<StyleConfig> | null];
  'lyric-mapper': [lyricMapper: Partial<LyricMapper>];
  'window-minimize': [];
  'window-maximize': [maximize: boolean];
  'window-close': [];
  'before-add-plugin': [pluginPath: string];
  'add-plugin': [extractPath: string];
  'remove-plugin': [plugin: Plugin];
  'reload-plugin': [plugin: Plugin];
  'change-plugin-state': [plugin: Plugin, state: 'enable' | 'disable'];
  'start-overlay': [];
  'stop-overlay': [];
  'inject-overlay-to-process': [processId: number, name?: string, filePath?: string];
  'remove-overlay-from-process': [processId: number];

  /* renderer */
  'search-lyrics': [artist: string, title: string, options?: {
    playtime?: number;
    page?: number;
  }];
}
export type OverrideMap = {
  [Key in keyof OverrideParameterMap]: (
    fn: (...args: OverrideParameterMap[Key]) => Promise<void>,
    ...args: OverrideParameterMap[Key]
  ) => Promise<void>;
};
