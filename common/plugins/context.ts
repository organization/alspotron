import { Accessor } from 'solid-js';

import { PluginLogger } from './logger';
import { BooleanOption, ButtonOption, LabelOption, NumberOption, SettingOption } from './option';
import { PluginEventMap, OverrideMap } from './event';

import type { PartialDeep } from 'type-fest';
import type { Config } from '../schema';
import { SourceProvider } from '../provider';

export type PluginState = 'enable' | 'disable';
export type PluginUnload = () => void;
export type PluginProvider = (context: PluginContext) => PluginUnload | void;

export type UseSettingResult<Option extends SettingOption> = {
  set(option: Partial<SettingOption>): void;
  delete(): void;

  (): (
    Option extends NumberOption ? number :
      Option extends BooleanOption ? boolean :
        Option extends ButtonOption ? void :
          Option extends LabelOption ? void :
            string
  );
}

export interface PluginContext {
  on<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // once<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // off<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // emit<K extends keyof PluginEventMap>(event: K, ...args: Parameters<PluginEventMap[K]>): void;

  useConfig(): [Accessor<Config>, (config: PartialDeep<Config>) => void];
  useSetting<Option extends SettingOption>(options: Option, onValueChange?: () => void): UseSettingResult<Option>;
  useOverride<Target extends keyof OverrideMap>(target: Target, fn: OverrideMap[Target]): void;

  registerSourceProvider(provider: SourceProvider): void;

  logger: PluginLogger;

  Electron: typeof Electron.Main;
}
