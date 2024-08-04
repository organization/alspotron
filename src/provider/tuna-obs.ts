import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validator } from 'hono/validator';
import { serve } from '@hono/node-server';

import { BaseSourceProvider } from './base-provider';

import { TunaObsBody, TunaObsBodySchema, UpdateData } from '../../common/schema';
import { getTranslation } from '../../common/intl';

import type { Http2SecureServer, Http2Server } from 'node:http2';
import type { Server as NodeServer } from 'node:http';
import type { ButtonOption, SettingOption } from '../../common/plugins';

type ServerType = NodeServer | Http2Server | Http2SecureServer;

export class TunaObsProvider extends BaseSourceProvider {
  public override name = 'tuna-obs';
  private app: Hono;
  private port = 1608;
  private server: ServerType | null = null;

  constructor() {
    super();

    this.app = new Hono();

    this.app.use('*', cors({ origin: '*' }));

    this.app.post('/',
      validator('json', (value, c) => {
        const parsed = TunaObsBodySchema.safeParse(value);
        if (!parsed.success) {
          return c.text('invalid data', 401);
        }

        return parsed.data;
      }),
      (ctx) => {
        const body = ctx.req.valid('json');

        this.emit('update', this.convertData(body));

        return ctx.text('success', 200);
      },
    );

    this.app.post('/shutdown', () => {
      this.server?.close();

      return Promise.resolve();
    });
  }

  public override start(options: Record<string, unknown>) {
    this.port = Number(options.port);
    if (!Number.isFinite(this.port)) this.port = 1608;

    this.server = serve({
      fetch: this.app.fetch,
      port: this.port,
      hostname: '127.0.0.1',
    }, () => {
      this.emit('start');
    });

    this.server.on('error', (err) => {
      const error = new Error('TunaOBS: Server error occurred.');
      error.cause = err;

      this.emit('error', error);
      this.server?.close();
      this.server = null;
    });

    super.start(options);
  }

  public override close(): void {
    this.server?.close();

    super.close();
  }

  public override isRunning() {
    return this.server !== null;
  }

  public override getOptions(language: string): Exclude<SettingOption, ButtonOption>[] {
    return [
      {
        type: 'string',
        key: 'port',
        name: getTranslation('provider.source.tuna-obs.port.name', language),
        description: getTranslation('provider.source.tuna-obs.port.description', language),
        default: '1608',
      }
    ];
  }

  public override onOptionChange(options: Record<string, unknown>) {
    if (options.port) {
      this.server?.close();
      this.port = Number(options.port);
      if (!Number.isFinite(this.port)) this.port = 1608;

      this.start(options);
    }

    super.onOptionChange(options);
  }

  private convertData(data: TunaObsBody): UpdateData {
    const result: UpdateData = {
      data: { type: 'idle' },
      provider: 'tuna-obs',
    };

    if (data.data.status === 'playing') {
      result.data = {
        type: 'playing',
        id: `${data.data.title}:${data.data.cover_url}`,
        title: data.data.title ?? '',
        artists: data.data.artists ?? [],
        progress: data.data.progress ?? 0,
        duration: data.data.duration ?? 0,
        coverUrl: data.data.cover_url ?? '',
        playerLyrics: data.data.lyrics,
        metadata: data,
      };
    }

    if (data.data.status === 'paused') {
      result.data = {
        type: 'paused',
        id: `${data.data.title}:${data.data.cover_url}`,
        title: data.data.title ?? '',
        artists: data.data.artists ?? [],
        progress: data.data.progress ?? 0,
        duration: data.data.duration ?? 0,
        coverUrl: data.data.cover_url ?? '',
        playerLyrics: data.data.lyrics,
        metadata: data,
      };
    }

    return result;
  }
}
