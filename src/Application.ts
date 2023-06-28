import path from 'node:path';
import fs from 'fs';

import { app, BrowserWindow, Tray, Menu } from 'electron';
import { MicaBrowserWindow } from 'mica-electron';
import { ipcMain } from 'electron/main';
import cors from '@koa/cors';
import alsong from 'alsong';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import type { RequestBody } from './types';
import { getFile } from '../utils/resource';
import { Config, LyricMapper, config, lyricMapper, setConfig, setLyricMapper } from './config';

const iconPath = getFile('./assets/icon_square.png');

class Application {
  private tray: Tray;
  private app: Koa;

  public mainWindow: BrowserWindow;
  public settingsWindow: MicaBrowserWindow;
  public lyricsWindow: MicaBrowserWindow;

  initTray() {
    this.tray = new Tray(getFile('./assets/icon_music.png'));
    const contextMenu = Menu.buildFromTemplate([
      {
        type: 'normal',
        label: '가사 선택',
        click: () => {
          this.initLyricsWindow();
          this.lyricsWindow.show();
        }
      },
      {
        type: 'normal',
        label: '설정',
        click: () => {
          this.initSettingsWindow();
          this.settingsWindow.show();
        }
      },
      {
        type: 'separator',
      },
      {
        type: 'normal',
        label: '종료',
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

    this.tray.setToolTip('Alspotron');
    this.tray.setContextMenu(contextMenu);
  }

  initServer() {
    this.app = new Koa();
    this.app.use(cors());
    this.app.use(bodyParser());

    const router = new Router();

    router.post('/', async (ctx, next) => {
      ctx.status = 200;

      this.broadcast('update', ctx.request.body as RequestBody);

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
  }

  broadcast(event: string, ...args: any[]) {
    this.mainWindow.webContents.send(event, ...args);
    if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) this.lyricsWindow.webContents.send(event, ...args);
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) this.settingsWindow.webContents.send(event, ...args);
  }

  initHook() {
    ipcMain.handle('get-lyric-by-id', async (_, id: number) => {
      const lyric = await alsong.getLyricById(id).catch(() => null);
      if (lyric) delete lyric.registerDate;

      return lyric;
    });
    ipcMain.handle('get-lyric', async (_, data: RequestBody['data']) => {
      if (!Array.isArray(data.artists) || !data.title) return {};

      const artist = data?.artists?.join(', ') ?? '';
      const title = data?.title ?? '';

      const metadata = await alsong(artist, title, {}).catch(() => []);
      if (metadata.length <= 0) return {};

      const lyric = await alsong.getLyricById(metadata[0].lyricId).catch(() => ({ lyric: data.lyrics }));

      return lyric;
    });
    ipcMain.handle('search-lyric', async (_, data: { artist: string; title: string; duration?: number; }) => {
      const result = await alsong(data.artist, data.title, {
        playtime: data.duration,
      }).catch(() => []);

      return result.map((it) => ({ ...it, registerDate: it.registerDate.toISOString() }));
    });

    ipcMain.handle('set-config', async (_, data: Partial<Config>) => {
      setConfig(data);
      this.broadcast('config', config());
    });
    ipcMain.handle('get-config', async () => config());
    ipcMain.handle('set-lyric-mapper', async (_, data: Partial<LyricMapper>) => {
      setLyricMapper(data);
      this.broadcast('lyric-mapper', lyricMapper());
    });
    ipcMain.handle('get-lyric-mapper', async () => lyricMapper());
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
      show: false,
      icon: iconPath,
    });
    this.mainWindow.setIgnoreMouseEvents(true, { forward: true });

    if (app.isPackaged) {
      this.mainWindow.loadFile(getFile('./index.html'));
    } else {
      this.mainWindow.loadURL(`http://localhost:5173`);
    }
  }

  initSettingsWindow() {
    this.settingsWindow = new MicaBrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      show: false,
      title: 'Alspotron 설정',
      // transparent: true,
      // frame: false,
      backgroundColor: 'transparent',
      backgroundMaterial: 'mica',
      autoHideMenuBar: true,
      resizable: false,
      transparent: false,
      icon: iconPath,
    });
    this.settingsWindow.setDarkTheme();
    this.settingsWindow.setMicaEffect();

    if (app.isPackaged) {
      this.settingsWindow.loadFile(getFile('./settings.html'));
    } else {
      this.settingsWindow.loadURL(`http://localhost:5173/settings.html`);
    }
  }
  
  initLyricsWindow() {
    this.lyricsWindow = new MicaBrowserWindow({
      width: 1000,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      show: false,
      title: '가사 선택',
      // transparent: true,
      // frame: false,
      backgroundColor: 'transparent',
      backgroundMaterial: 'mica',
      autoHideMenuBar: true,
      resizable: false,
      transparent: false,
      icon: iconPath,
    });
    this.lyricsWindow.setDarkTheme();
    this.lyricsWindow.setMicaEffect();

    if (app.isPackaged) {
      this.lyricsWindow.loadFile(getFile('./lyrics.html'));
    } else {
      this.lyricsWindow.loadURL(`http://localhost:5173/lyrics.html`);
    }
  }
};

export default Application;
