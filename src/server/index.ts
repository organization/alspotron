import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

import { bodySchema, UpdateData } from '../../common/schema';

export type ServerListener = {
  onUpdate?: (data: UpdateData) => void;
  onShutdown?: () => void;
  onStart?: () => void;
  onError?: (err: unknown) => void;
}

export const initServer = (listeners: ServerListener): Hono => {
  const app = new Hono();
  app.use('*', cors({ origin: '*' }));

  app.post('/',
    validator('json', (value, c) => {
      const parsed = bodySchema.safeParse(value);
      if (!parsed.success) {
        return c.text('invalid data', 401);
      }

      return parsed.data;
    }),
    (ctx) => {
      const body = ctx.req.valid('json');

      listeners.onUpdate?.(body.data);

      return ctx.text('success', 200);
    },
  );

  app.post('/shutdown', () => {
    server.close();
    listeners.onShutdown?.();

    return Promise.resolve();
  });

  const server = serve({
    fetch: app.fetch,
    port: 1608,
    hostname: '127.0.0.1',
  }, () => {
    listeners.onStart?.();
  });

  server.on('error', (err) => {
    listeners.onError?.(err);
  });

  return app;
};
