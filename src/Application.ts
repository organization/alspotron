import cors from '@koa/cors';
import alsong from 'alsong';
// eslint-disable-next-line import/no-unresolved
import { setupTitlebar, attachTitlebarToWindow } from 'custom-electron-titlebar/main';
import { app, BrowserWindow, Menu, screen, shell, Tray } from 'electron';
// eslint-disable-next-line import/no-unresolved
import {ipcMain} from 'electron/main';
import glasstron from 'glasstron';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import {getFile} from '../utils/resource';
import {Config, config, LyricMapper, lyricMapper, setConfig, setLyricMapper} from './config';
import type {RequestBody} from './types';
import path from 'node:path';

type Lyric = Awaited<ReturnType<typeof alsong.getLyricById>>;
type LyricMetadata = Awaited<ReturnType<typeof alsong>>;

const iconPath = getFile('./assets/icon_square.png');

app.commandLine.appendSwitch('enable-transparent-visuals');

class Application {
  private tray: Tray;
  private app: Koa;

  public mainWindow: BrowserWindow;
  public settingsWindow: BrowserWindow;
  public lyricsWindow: BrowserWindow;

  initTray() {
    this.tray = new Tray(getFile('./assets/icon_music.png'));
    const contextMenu = Menu.buildFromTemplate([
      {
        type: 'normal',
        label: '가사 선택',
        click: () => {
          if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) {
            if (this.lyricsWindow.isMinimized()) this.lyricsWindow.restore();
            this.lyricsWindow.focus();
          } else {
            this.initLyricsWindow();
            this.lyricsWindow.show();
          }
        }
      },
      {
        type: 'normal',
        label: '설정',
        click: () => {
          if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
            if (this.settingsWindow.isMinimized()) this.settingsWindow.restore();
            this.settingsWindow.focus();
          } else {
            this.initSettingsWindow();
            this.settingsWindow.show();
          }
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
          this.mainWindow.webContents.openDevTools({ mode: 'detach' });
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

  broadcast<T>(event: string, ...args: T[]) {
    this.mainWindow.webContents.send(event, ...args);
    if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) this.lyricsWindow.webContents.send(event, ...args);
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) this.settingsWindow.webContents.send(event, ...args);
  }

  initHook() {
    ipcMain.handle('get-lyric-by-id', async (_, id: number) => {
      const lyric = await alsong.getLyricById(id).catch(() => null) as Lyric & { registerDate?: Date };
      if (lyric) delete lyric.registerDate;

      return lyric;
    });
    ipcMain.handle('get-lyric', async (_, data: RequestBody['data']) => {
      if (!Array.isArray(data.artists) || !data.title) return {};

      const artist = data?.artists?.join(', ') ?? '';
      const title = data?.title ?? '';

      const metadata = await alsong(artist, title, {}).catch(() => []) as LyricMetadata[];
      if (metadata.length <= 0) return {};

      return await alsong.getLyricById(metadata[0].lyricId).catch(() => ({lyric: data.lyrics}));
    });
    ipcMain.handle('search-lyric', async (_, data: { artist: string; title: string; duration?: number; }) => {
      const result = await alsong(data.artist, data.title, {
        playtime: data.duration,
      }).catch(() => []) as (LyricMetadata & { registerDate: Date })[];

      return result.map((it) => ({ ...it, registerDate: it.registerDate.toISOString() }));
    });

    ipcMain.handle('set-config', (_, data: DeepPartial<Config>) => {
      setConfig(data);
      this.broadcast('config', config());
      this.updateMainWindowConfig();
    });
    ipcMain.handle('get-config', () => config());
    ipcMain.handle('set-lyric-mapper', (_, data: Partial<LyricMapper>) => {
      setLyricMapper(data);
      this.broadcast('lyric-mapper', lyricMapper());
    });
    ipcMain.handle('get-lyric-mapper', () => lyricMapper());
  }

  initMainWindow() {
    setupTitlebar();
    // HACK: empty application menu without breaking layout
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
      label: '',
      submenu: []
    }]));
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
      fullscreen: false,
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
      void this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
    } else {
      void this.mainWindow.loadURL('http://localhost:5173');
    }

    const onUpdate = () => this.updateMainWindowConfig();
    screen.on('display-metrics-changed', onUpdate);
    screen.on('display-added', onUpdate);
    screen.on('display-removed', onUpdate);

    onUpdate();
  }

  updateMainWindowConfig() {
    const { windowPosition, style } = config();
    const windowWidth = style.nowPlaying.maxWidth;
    const windowHeight = 300;
    const activeDisplay =
      screen.getAllDisplays().find(display => display.id === windowPosition.display) ||
      screen.getPrimaryDisplay();
    
    const anchorX = (() => {
      if (windowPosition.anchor.includes('left')) {
        return activeDisplay.bounds.x + windowPosition.left;
      }

      if (windowPosition.anchor.includes('right')) {
        return activeDisplay.bounds.x
          + (activeDisplay.bounds.width - windowWidth)
          - windowPosition.right;
      }

      return activeDisplay.bounds.x
          + ((activeDisplay.bounds.width - windowWidth) / 2);

    })();

    const anchorY = (() => {
      if (windowPosition.anchor.includes('top')) {
        return activeDisplay.bounds.y + windowPosition.top;
      }

      if (windowPosition.anchor.includes('bottom')) {
        return activeDisplay.bounds.y
          + activeDisplay.bounds.height - windowHeight
          - windowPosition.bottom;
      }

      return activeDisplay.bounds.y
          + ((activeDisplay.bounds.height - windowHeight) / 2);
    })();

    this.mainWindow.setSize(windowWidth, windowHeight);
    this.mainWindow.setPosition(Math.round(anchorX), Math.round(anchorY));
  }

  initSettingsWindow() {
    this.settingsWindow = new glasstron.BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, './preload-titlebar.js'),
        nodeIntegration: true,
      },
      show: false,
      title: 'Alspotron 설정',
      transparent: false,
      frame: false,
      blur: true,
      blurType: process.platform === 'win32' ? 'acrylic' : 'blurbehind',
      blurGnomeSigma: 100,
      blurCornerRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      resizable: false,
      icon: iconPath,
    });
    this.settingsWindow.setResizable(true);
    attachTitlebarToWindow(this.settingsWindow);

    this.settingsWindow.webContents.setWindowOpenHandler(({ url }) => {
      void shell.openExternal(url);
      return { action: 'deny' };
    });

    if (app.isPackaged) {
      void this.settingsWindow.loadFile(path.join(__dirname, '../settings.html'));
    } else {
      void this.settingsWindow.loadURL('http://localhost:5173/settings.html');
    }
  }
  
  initLyricsWindow() {
    this.lyricsWindow = new glasstron.BrowserWindow({
      width: 1000,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, './preload-titlebar.js'),
        nodeIntegration: true,
      },
      show: false,
      title: '가사 선택',
      transparent: false,
      frame: false,
      blur: true,
      blurType: process.platform === 'win32' ? 'acrylic' : 'blurbehind',
      blurGnomeSigma: 100,
      blurCornerRadius: 20,
      vibrancy: 'fullscreen-ui',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      autoHideMenuBar: true,
      resizable: false,
      icon: iconPath,
    });
    this.lyricsWindow.setResizable(true);
    attachTitlebarToWindow(this.lyricsWindow);

    if (app.isPackaged) {
      void this.lyricsWindow.loadFile(path.join(__dirname, '../lyrics.html'));
    } else {
      void this.lyricsWindow.loadURL('http://localhost:5173/lyrics.html');
    }
  }
}

export default Application;
