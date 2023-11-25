import { Accessor } from 'solid-js';

import { PluginLogger } from './logger';
import { SettingOption } from './option';
import { PluginEventMap, OverrideMap } from './event';

import type { PartialDeep } from 'type-fest';
import type { Config } from '../schema';

export type PluginState = 'enable' | 'disable';
export type PluginUnload = () => void;
export type PluginProvider = (context: PluginContext) => PluginUnload | void;

export interface PluginContext {
  on<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // once<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // off<K extends keyof PluginEventMap>(event: K, listener: PluginEventMap[K]): void;
  // emit<K extends keyof PluginEventMap>(event: K, ...args: Parameters<PluginEventMap[K]>): void;

  useConfig(): [Accessor<Config>, (config: PartialDeep<Config>) => void];
  useSetting(options: SettingOption, onValueChange?: () => void): unknown;
  useOverride<Target extends keyof OverrideMap>(target: Target, fn: OverrideMap[Target]): void;

  logger: PluginLogger;
}
