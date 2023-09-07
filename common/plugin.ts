import { Json } from '../utils/types';

type Music = unknown; // TODO: Music interface


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
  loadMusic: (music: Music) => void;
  findLyric: (query: string) => string;
  changeSetting: (key: string, value: unknown) => void;
}

export abstract class PluginInterface {
  public listeners: { [Key in keyof PluginEventMap]?: PluginEventMap[Key][] } = {};
  public settings: SettingOption[] = [];

  abstract onLoad(): void;
  abstract onUnload(): void;

  on<Event extends keyof PluginEventMap>(event: Event, callback: PluginEventMap[Event]) {
    this.listeners[event] ??= [];
    this.listeners[event]?.push(callback);
  }

  registerSetting(options: SettingOption) {
    this.settings.push(options);
  }

  getConfig(key: string) {
    throw Error(`${key} Not implemented`);
  }
}

export interface Plugin {
  css?: string[];
  js?: PluginInterface;
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
