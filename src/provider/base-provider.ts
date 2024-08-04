import { EventEmitter } from 'events';

import { SourceProvider, SourceProviderEventMap } from '../../common/provider';
import { ButtonOption, SettingOption } from '../../common/plugins';

export abstract class BaseSourceProvider extends EventEmitter<SourceProviderEventMap> implements SourceProvider {
  public abstract name: string;

  public start() {
    this.emit('start');
  }

  public close() {
    this.emit('close');
  }

  public getOptions(language: string): Exclude<SettingOption, ButtonOption>[] {
    return [];
  }
  public getOptionValue(key: string): unknown {
    return null;
  }
  public setOption(key: string, value: unknown) {}

  public abstract isRunning(): boolean;
}
