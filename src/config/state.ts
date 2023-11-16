import fs from 'node:fs/promises';

import { z } from 'zod';
import { deepmerge } from 'deepmerge-ts';

import type { PartialDeep } from 'type-fest';

export type StateOptions<T> = {
  file?: {
    path?: string;
    schema?: z.ZodType<T>;
    autoSync?: boolean | number;
  };
};
export class State<T> {
  private value: T;
  private path?: string;
  private schema?: z.ZodType<T>;
  private throttle?: number;

  private readonly defaultValue: T;

  private watchers: ((value: T) => void)[] = [];
  private throttleTimer: NodeJS.Timeout | null = null;

  constructor(defaultValue: T, options: StateOptions<T> = {}) {
    this.value = defaultValue;
    this.defaultValue = defaultValue;
    this.setOptions(options);

    if (typeof this.throttle === 'number') {
      this.loadFromPath();
    }
  }

  public get(): T {
    return this.value;
  }

  public set(value: PartialDeep<T>, useFallback = true): void {
    const newValue = useFallback
      ? deepmerge(this.defaultValue, this.value, value) as T
      : value as T;

    this.value = newValue;
    this.watchers.forEach((fn) => fn(newValue));

    if (typeof this.throttle === 'number') {
      if (this.throttleTimer) clearTimeout(this.throttleTimer);

      this.throttleTimer = setTimeout(() => {
        this.save().catch();
      }, this.throttle);
    }
  }

  public watch(fn: (value: T) => void): void {
    this.watchers.push(fn);
  }

  public unwatch(fn: (value: T) => void): void {
    this.watchers = this.watchers.filter((f) => f !== fn);
  }

  public watchOnce(fn: (value: T) => void): void {
    const wrapper = (value: T) => {
      fn(value);
      this.unwatch(wrapper);
    };
    this.watch(wrapper);
  }

  /* utils */
  public async loadFromPath(): Promise<void> {
    if (!this.path) throw Error('Cannot load data without path');

    const str = await fs.readFile(this.path, 'utf-8');
    let config: T = this.value;
    try {
      const rawConfig = JSON.parse(str);
      config = this.schema?.parse(rawConfig) ?? deepmerge(this.defaultValue, rawConfig) as T;
    } catch {}

    this.set(config as PartialDeep<T>);
  }

  public async save(): Promise<void> {
    if (!this.path) throw Error('Cannot save data without path');

    await fs.writeFile(this.path, JSON.stringify(this.value, null, 2), 'utf-8');
  }

  public setOptions(options: StateOptions<T>): void {
    if (options.file?.path) this.path = options.file.path;
    if (options.file?.schema) this.schema = options.file.schema;
    if (options.file?.autoSync) {
      this.throttle = typeof options.file?.autoSync === 'number'
        ? options.file.autoSync
        : 1000;
    }
  }
}
