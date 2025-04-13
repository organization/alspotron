import { EventEmitter } from 'events';

import type { SourceProvider, SourceProviderEventMap } from '../../../common/provider';
import type { ButtonOption, SettingOption } from '../../../packages/shared/src/model/plugins';

export abstract class BaseSourceProvider extends EventEmitter<SourceProviderEventMap> implements SourceProvider {
  public abstract name: string;

  public start(options: Record<string, unknown>) {
    this.emit('start');
  }

  public close() {
    this.emit('close');
  }

  public getOptions(language: string): Exclude<SettingOption, ButtonOption>[] {
    return [];
  }
  public onOptionChange(options: Record<string, unknown>) {}

  public abstract isRunning(): boolean;
}
