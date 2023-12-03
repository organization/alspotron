import { EventEmitter } from 'events';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validator } from 'hono/validator';
import { serve } from '@hono/node-server';

import { bodySchema } from '../../common/schema';

import type { Server as NodeServer } from 'node:http';
import type { Http2SecureServer, Http2Server } from 'node:http2';

type ServerType = NodeServer | Http2Server | Http2SecureServer;

export class Server extends EventEmitter {
  private app: Hono;
  private server: ServerType | null = null;

  constructor() {
    super();

    this.app = new Hono();

    this.app.use('*', cors({ origin: '*' }));

    this.app.post('/',
      validator('json', (value, c) => {
        const parsed = bodySchema.safeParse(value);
        if (!parsed.success) {
          return c.text('invalid data', 401);
        }

        return parsed.data;
      }),
      (ctx) => {
        const body = ctx.req.valid('json');

        this.emit('update', body.data);

        return ctx.text('success', 200);
      },
    );

    this.app.post('/shutdown', () => {
      this.server?.close();
      this.emit('shutdown');

      return Promise.resolve();
    });
  }

  public open() {
    this.server = serve({
      fetch: this.app.fetch,
      port: 1608,
      hostname: '127.0.0.1',
    }, () => {
      this.emit('start');
    });

    this.server.on('error', (err) => {
      this.emit('error', err);
      this.server?.close();
      this.server = null;
    });
  }

  public close(): void {
    this.server?.close();
  }

  public isOpen() {
    return this.server !== null;
  }
}
