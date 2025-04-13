import fs from 'node:fs/promises';

import { Persister, PersisterOptions } from '@electron-persist/core';

export interface FilePersisterOptions<T> extends PersisterOptions<T> {
  path: string;
  versionField?: string;
  serializer?: typeof JSON.stringify,
  deserializer?: typeof JSON.parse,
}

export class FilePersister<T> extends Persister<T> {
  private path: string;
  private serializer: typeof JSON.stringify = JSON.stringify;
  private deserializer: typeof JSON.parse = JSON.parse;
  private versionField = '__version__';

  constructor(path: string);
  constructor(options: FilePersisterOptions<T>);
  constructor(options: FilePersisterOptions<T> | string) {
    super({
      validator: typeof options !== 'string' ? options.validator : undefined,
      migrator: typeof options !== 'string' ? options.migrator : undefined,
      version: typeof options !== 'string' ? options.version : undefined,
    });

    if (typeof options === 'string') {
      this.path = options;
    } else {
      this.path = options.path;
      this.versionField = options.versionField ?? '__version__';
      this.serializer = options.serializer ?? JSON.stringify;
      this.deserializer = options.deserializer ?? JSON.parse;
    }
  }

  protected async getConfigVersion() {
    const str = await fs.readFile(this.path, 'utf-8');
    const result = this.deserializer(str);

    return result[this.versionField];
  }

  async readData() {
    const str = await fs.readFile(this.path, 'utf-8');
    const result = this.deserializer(str);

    if (typeof result === 'object') delete result[this.versionField];

    return result;
  }

  async writeData(data: T) {
    const str = this.serializer({
      ...data,
      [this.versionField]: this.version,
    });
    await fs.writeFile(this.path, str, 'utf-8');
  }
}