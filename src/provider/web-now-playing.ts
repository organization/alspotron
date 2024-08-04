import { WebSocketServer } from 'ws';

import { BaseSourceProvider } from './base-provider';

import { BaseUpdateData, UpdateData } from '../../common/schema';

export class WebNowPlayingProvider extends BaseSourceProvider {
  public override name = 'web-now-playing';

  private wss: WebSocketServer | null = null;
  private port = 1609;
  private isReady = false;

  private type: UpdateData['data']['type'] = 'idle';
  private lastUpdateData: Partial<BaseUpdateData> = {};

  public override start(config: Record<string, unknown>) {
    this.wss = new WebSocketServer({ port: this.port });
    this.wss.on('connection', (ws) => {
      this.isReady = true;
      let idleTimeout: NodeJS.Timeout | null = null;

      ws.onopen = () => ws.send('RECIPIENT');
      ws.onclose = () => this.close();
      ws.onerror = (err) => {
        const error = new Error('WebNowPlaying: Server error occurred.');
        error.cause = err;

        this.emit('error', error);
        this.close();
      };
      ws.onmessage = (e) => {
        if (typeof e.data !== 'string') return;
        const [key, ...rest] = e.data.split(':');
        const data = rest.join(':');

        if (key === 'TITLE') this.lastUpdateData.title = data;
        if (key === 'ARTIST') this.lastUpdateData.artists = [data];
        if (key === 'POSITION') this.lastUpdateData.progress = this.convertTime(data);
        if (key === 'DURATION') this.lastUpdateData.duration = this.convertTime(data);
        if (key === 'COVER') this.lastUpdateData.coverUrl = data;
        if (key === 'STATE') {
          if (idleTimeout !== null) {
            clearTimeout(idleTimeout);
            idleTimeout = null;
          }

          if (data === '0') {
            idleTimeout = setTimeout(() => {
              this.type = 'idle';
              this.updateData();
            }, 500);
          }
          if (data === '1') this.type = 'playing';
          if (data === '2') this.type = 'paused';
        }
        if (this.lastUpdateData.title && this.lastUpdateData.coverUrl) {
          this.lastUpdateData.id = `${this.lastUpdateData.title}:${this.lastUpdateData.coverUrl}`;
        }

        this.updateData();
        // console.log('[Alspotron] [WebNowPlayingProvider] Received message:', e.data);
      };
    });
    this.wss.on('close', this.close.bind(this));
    this.wss.on('error', this.onError.bind(this));

    super.start(config);
  }

  public override close() {
    this.wss?.close();
    this.wss = null;
    this.isReady = false;

    super.close();
  }

  public override isRunning() {
    return this.wss !== null && this.isReady;
  }

  private onError(err: Error) {
    const error = new Error('WebNowPlaying: Server error occurred.');
    error.cause = err;

    this.emit('error', error);
    this.close();
  }

  private convertTime(time: string) {
    const [min, sec] = time.split(':').map(Number);
    return ((min * 60) + sec) * 1000;
  }

  private updateData() {
    const updateData: UpdateData = {
      data: { type: 'idle' },
      provider: this.name,
    };

    if (this.type === 'playing' || this.type === 'paused') {
      let isDataValid = true;
      if (!this.lastUpdateData.id) isDataValid = false;
      if (!this.lastUpdateData.title) isDataValid = false;
      if (!this.lastUpdateData.artists) isDataValid = false;
      if (!this.lastUpdateData.progress) isDataValid = false;
      if (this.lastUpdateData.duration === undefined) isDataValid = false;
      if (this.lastUpdateData.coverUrl === undefined) isDataValid = false;

      if (!isDataValid) {
        updateData.data.type = 'idle';
      } else {
        const fullData = this.lastUpdateData as BaseUpdateData;
        updateData.data = {
          type: this.type,
          ...fullData,
        };
      }
    }

    this.emit('update', updateData);
  }
}
