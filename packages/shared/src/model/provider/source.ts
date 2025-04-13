import type { EventEmitter } from 'events';

import type { UpdateData } from '../lyricFormat';

// import type { ButtonOption, SettingOption } from '../../plugins';

export type SourceProviderEventMap = {
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

  // getOptions(language: string): Exclude<SettingOption, ButtonOption>[];
  onOptionChange(options: Record<string, unknown>): void;
}
