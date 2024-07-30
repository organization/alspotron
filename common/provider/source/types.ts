import { EventEmitter } from 'node:events';

import { UpdateData } from '../../schema';

export interface SourceProviderEventMap {
  start: [];
  update: [UpdateData];
  error: [Error];
  close: [];
}

export abstract class SourceProvider extends EventEmitter<SourceProviderEventMap> {
  public abstract name: string;

  public start() {
    this.emit('start');
  }

  public close() {
    this.emit('close');
  }

  public abstract isRunning(): boolean;
}
