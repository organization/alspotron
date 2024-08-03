import type { EventEmitter } from 'events';

import type { UpdateData } from '../../schema';

export interface SourceProviderEventMap {
  start: [];
  update: [UpdateData];
  error: [Error];
  close: [];
}

export interface SourceProvider extends EventEmitter<SourceProviderEventMap> {
  name: string;
  start(): void;
  close(): void;
  isRunning(): boolean;
}
