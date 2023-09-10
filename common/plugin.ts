import { Accessor } from 'solid-js';

import { Config, GameList, LyricMapper } from './config';

import { UpdateData } from '../renderer/types';
import { Json } from '../utils/types';

interface BaseSettingOption {
  key: string;
  name: string;
  description?: string;
}
export interface SelectOption extends BaseSettingOption {
  type: 'select';
  options: {
    label: string;
    value: string;
  }[];
  default?: string;
}
export interface StringOption extends BaseSettingOption {
  type: 'string';
  default?: string;
}
export interface NumberOption extends BaseSettingOption {
  type: 'number';
  default?: number;
}
export interface BooleanOption extends BaseSettingOption {
  type: 'boolean';
  default?: boolean;
}
// export interface ButtonOption extends BaseSettingOption {
//   type: 'button';
// }

export type SettingOption = SelectOption | StringOption | NumberOption | BooleanOption; // | ButtonOption;

export interface PluginEventMap {
  'update': (updateContext: { data: UpdateData }) => void;
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
  'update': [updateContext: { data: UpdateData }];
  'config': [config: DeepPartial<Config>];
  'game-list': [gameList: Partial<GameList>];
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
}
export type OverrideMap = {
  [Key in keyof OverrideParameterMap]: (
    fn: (...args: OverrideParameterMap[Key]) => Promise<void>,
    ...args: OverrideParameterMap[Key]
  ) => Promise<void>;
};

export interface PluginContext {
  on<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // once<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // off<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // emit<K extends keyof PluginEventMap>(event: K, ...args: Parameters<PluginEventMap[K]>): void;

  useConfig(): [Accessor<Config>, (config: DeepPartial<Config>) => void];
  useSetting(options: SettingOption, onValueChange?: () => void): void;
  useOverride<Target extends keyof OverrideMap>(target: Target, fn: OverrideMap[Target]): void;
}

export type PluginUnload = () => void;
export type PluginProvider = (context: PluginContext) => PluginUnload | void;
export interface Plugin {
  css?: string[];
  js: {
    raw?: PluginProvider;
    off?: () => void;
    listeners: {
      [Key in keyof PluginEventMap]?: PluginEventMap[Key][];
    }
    settings: SettingOption[];
    overrides: {
      [Target in keyof OverrideMap]?: OverrideMap[Target][];
    };
  }
  rawManifest: string;
  manifest: Json;

  id: string;
  name: string;
  description?: string;
  author: string;
  version?: string;
  versionCode: number;
  pluginVersion: number;
}
