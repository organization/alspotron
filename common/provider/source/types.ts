import type { EventEmitter } from 'events';

import type { UpdateData } from '../../schema';
import type { ButtonOption, SettingOption } from '../../plugins';

export interface SourceProviderEventMap {
  start: [];
  update: [UpdateData];
  error: [Error];
  close: [];
}

export interface SourceProvider extends EventEmitter<SourceProviderEventMap> {
  name: string;

  start(options: Record<string, unknown>): void;
  close(): void;
  isRunning(): boolean;

  getOptions(language: string): Exclude<SettingOption, ButtonOption>[];
  getOptionValue(key: string): unknown;
  onOptionChange(options: Record<string, unknown>): void;
}
