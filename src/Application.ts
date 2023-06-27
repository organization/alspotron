import path from 'node:path';
import fs from 'fs';

import { app, BrowserWindow, Tray, Menu } from 'electron';
import { ipcMain } from 'electron/main';
import cors from '@koa/cors';
import alsong from 'alsong';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import type { RequestBody } from './types';

class Application {
  private tray: Tray;
  private app: Koa;

  private mainWindow: BrowserWindow;
  private settingsWindow: BrowserWindow;
  private lyricsWindow: BrowserWindow;

  initTray() {
    this.tray = new Tray('assets/IconMusic.png');
    const contextMenu = Menu.buildFromTemplate([
      {
        type: 'normal',
        label: 'Lyrics',
      },
      {
        type: 'normal',
        label: 'Settings',
      },
      {
        type: 'separator',
      },
      {
        type: 'normal',
        label: 'quit',
        click: () => {
          app.quit();
        }
      },
      {
        type: 'separator',
      },
      {
        type: 'normal',
        label: 'devtools',
        click: () => {
          this.mainWindow.webContents.openDevTools();
        },
      },
    ]);

    this.tray.setToolTip('Alspotron 0.0.1');
    this.tray.setContextMenu(contextMenu);
  }

  initServer() {
    this.app = new Koa();
    this.app.use(cors());
    this.app.use(bodyParser());

    const router = new Router();

    router.post('/', async (ctx, next) => {
      ctx.status = 200;

      this.mainWindow.webContents.send('update', ctx.request.body as RequestBody);

      await next();
    });

    router.get('/config', () => {
      // TODO: get config
    });

    router.post('/config', () => {
      // TODO: set config
    });

    router.post('/shutdown', () => {
      app.quit();
    });

    this.app.use(router.routes()).use(router.allowedMethods());

    this.app.listen(1608, '127.0.0.1');

    ipcMain.handle('get-lyric', async (event, data: RequestBody['data']) => {
      if (!Array.isArray(data.artists) || !data.title) return {};

      const artist = data?.artists?.join(', ') ?? '';
      const title = data?.title ?? '';

      const metadata = await alsong(artist, title, {}).catch(() => []);
      if (metadata.length <= 0) return {};

      const lyric = await alsong.getLyricById(metadata[0].lyricId).catch(() => ({ lyric: data.lyrics }));

      return lyric;
    });
  }

  initMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      movable: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      transparent: true,
      frame: false,
      focusable: false,
      alwaysOnTop: true,
      fullscreen: true,
      skipTaskbar: true,
      hasShadow: false,
      hiddenInMissionControl: true,
      roundedCorners: false,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
    });
    this.mainWindow.setIgnoreMouseEvents(true, { forward: true });

    if (app.isPackaged) {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    } else {
      const url = `http://localhost:5173`;
  
      this.mainWindow.loadURL(url);
  
      console.log('load from url', url);
    }
  }
};

export default Application;
