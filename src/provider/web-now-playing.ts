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

  public override start() {
    this.wss = new WebSocketServer({ port: this.port });
    this.wss.on('connection', (ws) => {
      this.isReady = true;
      ws.onopen = () => ws.send('RECIPIENT');
      ws.onclose = () => this.close();
      ws.onerror = (err) => {
        console.log('error', err, err.error, err.type, err.message, err.target);
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
          if (data === '0') this.type = 'playing'; // buffering
          if (data === '1') this.type = 'playing';
          if (data === '2') this.type = 'paused';
        }
        if (this.lastUpdateData.title && this.lastUpdateData.coverUrl) {
          this.lastUpdateData.id = `${this.lastUpdateData.title}:${this.lastUpdateData.coverUrl}`;
        }

        this.updateData();
        console.log('[Alspotron] [WebNowPlayingProvider] Received message:', e.data);
      };
    });
    this.wss.on('close', this.close.bind(this));
    this.wss.on('error', this.onError.bind(this));

    super.start();
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
    if (!this.lastUpdateData.id) return;
    if (!this.lastUpdateData.title) return;
    if (!this.lastUpdateData.artists) return;
    if (!this.lastUpdateData.progress) return;
    if (!this.lastUpdateData.duration) return;
    if (!this.lastUpdateData.coverUrl) return;

    const fullData = this.lastUpdateData as BaseUpdateData;

    const updateData: UpdateData = {
      data: { type: 'idle' },
      provider: this.name,
    };

    if (this.type === 'playing') {
      updateData.data = {
        type: 'playing',
        ...fullData,
      };
    }
    if (this.type === 'paused') {
      updateData.data = {
        type: 'paused',
        ...fullData,
      };
    }

    this.emit('update', updateData);
  }
}
