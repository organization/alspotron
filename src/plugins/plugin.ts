type Music = unknown; // TODO: Music interface

export interface SettingOption {
  key: string;
  type: 'select' | 'string' | 'number' | 'button' | 'boolean';
}

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
  manifest: string;

  id: string;
  name: string;
  author: string;
  version: string;
  versionCode: number;
  pluginVersion: number;
}
