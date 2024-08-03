import { EventEmitter } from 'events';

import { SourceProviderEventMap } from '../../common/provider';

export abstract class BaseSourceProvider extends EventEmitter<SourceProviderEventMap> {
  public abstract name: string;

  public start() {
    this.emit('start');
  }

  public close() {
    this.emit('close');
  }

  public abstract isRunning(): boolean;
}
