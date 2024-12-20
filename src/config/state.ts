import fs from 'node:fs/promises';
import fsSync from 'node:fs';

import { z, ZodTypeDef } from 'zod';

import { deepmerge } from '../../utils/merge';

import type { PartialDeep } from 'type-fest';

export type StateMiddlewareOption<T> = {
  raw?: PartialDeep<T>;
};
export type StateMiddleware<T> = (
  value: T,
  next: (value: T) => T,
  options?: StateMiddlewareOption<T>,
) => unknown;
export type StateOptions<T> = {
  file?: {
    path?: string;
    schema?: z.ZodType<T, ZodTypeDef, unknown>;
    autoSync?: boolean | number;
    middleware?: StateMiddleware<unknown>;
  };
  middleware?: StateMiddleware<T>;
};
export class State<T> {
  private value: T;
  private path?: string;
  private _schema?: z.ZodType<T, ZodTypeDef, unknown>;
  private throttle?: number;
  private fileMiddleware?: StateMiddleware<unknown>;
  private stateMiddleware?: StateMiddleware<T>;

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

  public get schema() {
    return this._schema;
  }

  public set(value: PartialDeep<T>, useFallback = true): void {
    const newValue = useFallback
      ? (deepmerge(this.defaultValue, this.value, value) as T)
      : (value as T);

    const setter = (data: T) => {
      this.value = data;

      return data;
    };

    if (this.stateMiddleware) {
      this.stateMiddleware(newValue, setter, { raw: value });
    } else {
      setter(newValue);
    }

    this.value = newValue;
    this.watchers.forEach((fn) => {
      fn(newValue);
    });

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
    if (!fsSync.existsSync(this.path)) {
      await fs.writeFile(
        this.path,
        JSON.stringify(this.value, null, 2),
        'utf-8',
      );
    }

    const str = await fs.readFile(this.path, 'utf-8');
    let config: T = this.value;
    try {
      const rawConfig = JSON.parse(str);

      const setter = (data: unknown) => {
        const parsed = this._schema?.safeParse(data);
        if (parsed?.success) {
          config = parsed.data;
        } else {
          config = deepmerge(this.defaultValue, data) as T;
        }

        return config;
      };

      if (this.fileMiddleware) {
        this.fileMiddleware(rawConfig, setter);
      } else {
        setter(rawConfig);
      }
    } catch {}

    this.set(config as PartialDeep<T>);
  }

  public async save(): Promise<void> {
    if (!this.path) throw Error('Cannot save data without path');

    await fs.writeFile(this.path, JSON.stringify(this.value, null, 2), 'utf-8');
  }

  public setOptions(options: StateOptions<T>): void {
    if (options.file?.path) this.path = options.file.path;
    if (options.file?.schema) this._schema = options.file.schema;
    if (options.file?.autoSync) {
      this.throttle =
        typeof options.file?.autoSync === 'number'
          ? options.file.autoSync
          : 1000;
    }
    if (options.file?.middleware) this.fileMiddleware = options.file.middleware;
    if (options.middleware) this.stateMiddleware = options.middleware;
  }
}
