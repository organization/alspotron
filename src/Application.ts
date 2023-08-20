import path from 'node:path';
import { release } from 'os';

import Koa from 'koa';
import cors from '@koa/cors';
import alsong from 'alsong';
import zodRouter from 'koa-zod-router';
import { z } from 'zod';
import bodyParser from 'koa-bodyparser';
import ProgressBar from 'electron-progressbar';
import { hmc } from 'hmc-win32';
import { autoUpdater } from 'electron-updater';
import { IS_WINDOWS_11, MicaBrowserWindow } from 'mica-electron';
import { BrowserWindow as GlassBrowserWindow, GlasstronOptions } from 'glasstron';
import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem, MenuItemConstructorOptions, nativeImage, screen, shell, Tray } from 'electron';

import { createEffect, on } from 'solid-js';

import {
  Config,
  config,
  DEFAULT_CONFIG,
  GameList,
  gameList,
  LyricMapper,
  lyricMapper,
  setConfig,
  setGameList,
  setLyricMapper
} from '../common/config';

import { getFile } from '../utils/resource';
import { getTranslation } from '../common/intl';

import type { RequestBody } from './types';
import type { IOverlay } from './electron-overlay';

type LyricMetadata = Awaited<ReturnType<typeof alsong.getLyricListByArtistName>>[number];
type Overlay = typeof IOverlay;

const iconPath = getFile('./assets/icon_square.png');
const glassOptions: Partial<GlasstronOptions> = {
  blur: true,
  blurType: process.platform === 'win32' ? 'acrylic' : 'blurbehind',
  blurGnomeSigma: 100,
  blurCornerRadius: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};
const micaOptions = {
  show: false,
};

const PlatformBrowserWindow = process.platform === 'win32' && IS_WINDOWS_11 ? MicaBrowserWindow : GlassBrowserWindow;

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName());
  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1')) {
    app.disableHardwareAcceleration();
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
app.commandLine.appendSwitch('enable-transparent-visuals');

class Application {
  private tray!: Tray;
  private app!: Koa;
  private overlay!: Overlay;
  private markQuit = false;
  private scaleFactor = 1.0;
  private lastUpdate: RequestBody | null = null;
  private contextMenu: Menu | null = null;

  public mainWindow!: BrowserWindow;
  public overlayWindow: BrowserWindow | null = null;
  public settingsWindow: BrowserWindow | null = null;
  public lyricsWindow: BrowserWindow | null = null;
  public mainWindowOptions = {
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
  };
  private onOverlayWindowUpdate: (() => void) | null = null;
  private registeredPidList: number[] = [];

  constructor() {
    if (process.platform === 'win32') {
      // HACK: import statement is not work because Electron's threading model is different from Windows COM's
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const wql = require('@jellybrick/wql-process-monitor') as typeof import('@jellybrick/wql-process-monitor');
      wql.promises.subscribe({
        creation: true,
        deletion: true,
        filterWindowsNoise: true,
      }).then((listener) => {
        listener.on('creation', ([name, pid, filePath]) => this.onProcessCreation(pid, name, filePath));
        listener.on('deletion', ([name, pid]) => this.onProcessDeletion(pid, name));
      });

      const electronOverlayWithArch = `electron-overlay${process.arch === 'ia32' ? 'ia32' : ''}.node`;
      const module = { exports: {} };
      (process as NodeJS.Process & { dlopen: (module: { exports: unknown }, path: string, flags?: unknown) => void }).dlopen(
        module,
        app.isPackaged ?
          path.join(process.resourcesPath, `./assets/${electronOverlayWithArch}`) :
          path.join(__dirname, '..', `./assets/${electronOverlayWithArch}`),
      );
      this.overlay = module.exports as Overlay;
    }
  }

  initAutoUpdater() {
    if (!app.isPackaged) return;

    autoUpdater.autoDownload = false;
    autoUpdater.on('update-available', async (it) => {
      const downloadLink = 'https://github.com/organization/alspotron/releases/latest';

      const { response } = await dialog.showMessageBox({
        type: 'info',
        buttons: [getTranslation('updater.download-and-auto-install', config().language)],
        title: `${getTranslation('updater.update-alert', config().language)} (${it.version})`,
        message: getTranslation('updater.update-available', config().language).replace('{{version}}', it.version),
        detail: getTranslation('updater.download-at', config().language).replace('{{link}}', downloadLink),
        defaultId: 0,
      });
      
      if (response === 0) {
        const updateProgressBar = new ProgressBar({
          indeterminate: false,
          title: getTranslation('updater.popup.title', config().language),
          text: getTranslation('updater.popup.text', config().language),
          initialValue: 0,
        });

        // What The F @types/electron-progressbar
        updateProgressBar
          .on('progress', ((value: number) => {
            updateProgressBar.detail = `${getTranslation('updater.popup.percent', config().language)} (${value.toFixed(2)}%)`;
          }) as () => void)
          .on('aborted', ((value: number) => {
            updateProgressBar.detail = `${getTranslation('updater.popup.download-aborted', config().language)} ${value.toFixed(2)}%`;
          }) as () => void)
          .on('completed', () => {
            updateProgressBar.detail = getTranslation('updater.popup.download-completed', config().language);
            autoUpdater.quitAndInstall(false);
          });

        autoUpdater.on('download-progress', (it) => {
          if (!updateProgressBar.isCompleted()) {
            updateProgressBar.value = it.percent;
            updateProgressBar.text = `${getTranslation('updater.popup.percent', config().language)} (${it.percent.toFixed(2)}%, ${it.transferred} / ${it.total})`;
          }
        });

        await autoUpdater.downloadUpdate();
      }
    });

    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 2000);
  }

  initMenu() {

    const menu: (MenuItemConstructorOptions | MenuItem)[] = [
      {
        type: 'normal',
        label: getTranslation('tray.lyrics.label', config().language),
        click: () => {
          if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) {
            if (this.lyricsWindow.isMinimized()) this.lyricsWindow.restore();
            this.lyricsWindow.show();
          } else {
            this.initLyricsWindow();
          }
        },
        icon: nativeImage.createFromPath(getFile('./assets/empty.png')).resize({ width: 16, height: 16 }),
      },
      {
        type: 'normal',
        label: getTranslation('tray.setting.label', config().language),
        click: () => {
          if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
            if (this.settingsWindow.isMinimized()) this.settingsWindow.restore();
            this.settingsWindow.show();
          } else {
            this.initSettingsWindow();
          }
        }
      },
      {
        type: 'separator',
      },
      {
        type: 'normal',
        role: 'quit',
        label: getTranslation('tray.exit.label', config().language),
        click: () => {
          this.markQuit = true;
          app.quit();
        }
      },
    ];

    if (config().developer) {
      menu.push(
        {
          type: 'separator',
        },
        {
          type: 'submenu',
          label: getTranslation('tray.devtools.label', config().language),
          submenu: [
            {
              label: getTranslation('tray.devtools.lyric-viewer.label', config().language),
              click: () => {
                if (this.mainWindow && !this.mainWindow.isDestroyed()) {
                  this.mainWindow.webContents.openDevTools({ mode: 'detach' });
                }
              },
            },
            {
              label: getTranslation('tray.devtools.lyrics.label', config().language),
              click: () => {
                if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) {
                  this.lyricsWindow.webContents.openDevTools({ mode: 'detach' });
                }
              },
            },
            {
              label: getTranslation('tray.devtools.setting.label', config().language),
              click: () => {
                if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
                  this.settingsWindow.webContents.openDevTools({ mode: 'detach' });
                }
              },
            }
          ]
        },
      );
    }

    this.contextMenu = Menu.buildFromTemplate(menu);
  }

  initTray() {
    const trayIcon = nativeImage.createFromPath(getFile('./assets/icon_square.png'));

    this.tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
    this.initMenu();

    this.tray.setToolTip('Alspotron');
    this.tray.setContextMenu(this.contextMenu);
    this.tray.on('click', () => {
      if (this.contextMenu) this.tray.popUpContextMenu(this.contextMenu);
    });

    createEffect(on(() => config().developer, () => {
      this.initMenu();
      this.tray.setContextMenu(this.contextMenu);
    }));
  }

  initServer() {
    this.app = new Koa();
    this.app.use(cors());
    this.app.use(bodyParser());

    const router = zodRouter();

    router.post(
      '/',
      async (ctx, next) => {
        ctx.status = 200;

        this.lastUpdate = ctx.request.body;
        this.broadcast('update', this.lastUpdate);

        await next();
      },
      {
        body: z.object({
          data: z.object({
            status: z.string(),
            title: z.string().optional(),
            artists: z.array(z.string()).optional(),
            progress: z.number().optional(),
            duration: z.number().optional(),
            cover_url: z.string().optional(),
            lyrics: z.record(z.number(), z.array(z.string())).optional(),
          }),
        }),
      },
    );

    router.post('/shutdown', () => {
      app.quit();
    });

    this.app.use(router.routes()).use(router.allowedMethods());

    this.app.listen(1608, '127.0.0.1');
  }

  public addOverlayWindow(
    name: string,
    window: Electron.BrowserWindow,
    dragborder = 0,
    captionHeight = 0,
    transparent = false
  ) {
    this.markQuit = false;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const windowManager = (require('node-window-manager') as typeof import('node-window-manager')).windowManager;
    const display = screen.getDisplayNearestPoint(
      windowManager.getWindows().find((window) => window.processId == this.registeredPidList[0])?.getBounds() as Electron.Point ??
      screen.getCursorScreenPoint()
    );

    const resizable = window.isResizable();
    this.overlay.addWindow(window.id, {
      name,
      transparent,
      resizable,
      maxWidth: resizable
        ? display.bounds.width
        : window.getBounds().width,
      maxHeight: resizable
        ? display.bounds.height
        : window.getBounds().height,
      minWidth: resizable ? 100 : window.getBounds().width,
      minHeight: resizable ? 100 : window.getBounds().height,
      nativeHandle: window.getNativeWindowHandle().readUInt32LE(0),
      rect: {
        x: Math.floor(window.getBounds().x * this.scaleFactor),
        y: Math.floor(window.getBounds().y * this.scaleFactor),
        width: Math.floor(window.getBounds().width * this.scaleFactor),
        height: Math.floor(window.getBounds().height * this.scaleFactor),
      },
      caption: {
        left: dragborder,
        right: dragborder,
        top: dragborder,
        height: captionHeight,
      },
      dragBorderWidth: dragborder,
    });

    window.webContents.on('paint', (_, __, image: Electron.NativeImage) => {
      if (this.markQuit) return;

      this.overlay.sendFrameBuffer(
        window.id,
        image.getBitmap(),
        image.getSize().width,
        image.getSize().height
      );
    });

    window.on('resize', () => {
      this.overlay.sendWindowBounds(window.id, {
        rect: {
          x: window.getBounds().x,
          y: window.getBounds().y,
          width: Math.floor(window.getBounds().width * this.scaleFactor),
          height: Math.floor(window.getBounds().height * this.scaleFactor),
        },
      });
    });

    const windowId = window.id;
    window.on('closed', () => {
      this.overlay.closeWindow(windowId);
    });

    window.webContents.on('cursor-changed', (_, type) => {
      let cursor: string | null;

      if (type === 'default') cursor = 'IDC_ARROW';
      else if (type === 'pointer') cursor = 'IDC_HAND';
      else if (type === 'crosshair') cursor = 'IDC_CROSS';
      else if (type === 'text') cursor = 'IDC_IBEAM';
      else if (type === 'wait') cursor = 'IDC_WAIT';
      else if (type === 'help') cursor = 'IDC_HELP';
      else if (type === 'move') cursor = 'IDC_SIZEALL';
      else if (type === 'nwse-resize') cursor = 'IDC_SIZENWSE';
      else if (type === 'nesw-resize') cursor = 'IDC_SIZENESW';
      else if (type === 'ns-resize') cursor = 'IDC_SIZENS';
      else if (type === 'ew-resize') cursor = 'IDC_SIZEWE';
      else if (type === 'none') cursor = '';
      else cursor = null;

      if (cursor) this.overlay.sendCommand({ command: 'cursor', cursor });
    });
  }

  removeOverlay(window: BrowserWindow) {
    this.markQuit = true;
    this.overlay.closeWindow(window.id);
  }

  initOverlay() {
    this.initOverlayWindow();
    this.overlay.start();
  }

  stopOverlay() {
    this.removeOverlayWindow();
    this.overlay.stop();
  }

  broadcast<T>(event: string, ...args: T[]) {
    if (this.mainWindow) this.mainWindow.webContents.send(event, ...args);
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) this.overlayWindow.webContents.send(event, ...args);
    if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) this.lyricsWindow.webContents.send(event, ...args);
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) this.settingsWindow.webContents.send(event, ...args);
  }

  initHook() {
    ipcMain.on('get-all-screens', (event) => {
      event.returnValue = screen.getAllDisplays();
    });
    ipcMain.on('get-primary-screen', (event) => {
      event.returnValue = screen.getPrimaryDisplay();
    });
    ipcMain.handle('get-registered-process-list', () => this.registeredPidList);
    ipcMain.handle('get-icon', (_, path: string) => {
      if (process.platform === 'win32') {
        try {
          // HACK: dynamic import is not working
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const extractIcon = (require('extract-file-icon') as typeof import('extract-file-icon'));
          const result = extractIcon(path, 32);

          return `data:image/png;base64,${Buffer.from(result).toString('base64')}`;
        } catch {
        }

        return null;
      }
    });
    ipcMain.handle('start-overlay', () => {
      this.initOverlay();

      if (this.overlayWindow) {
        this.addOverlayWindow(
          'StatusBar',
          this.overlayWindow,
          0,
          0,
          true,
        );
      }
    });
    ipcMain.handle('stop-overlay', () => this.stopOverlay());
    ipcMain.handle('inject-overlay-to-process', (_, processId: number, name?: string, filePath?: string) => {
      if (process.platform !== 'win32') return;

      this.onProcessCreation(processId, name, filePath);
    });
    ipcMain.handle('remove-overlay-from-process', (_, processId: number) => this.onProcessDeletion(processId));
    ipcMain.handle('get-current-version', () => autoUpdater.currentVersion.version);
    ipcMain.handle('compare-with-current-version', (_, otherVersion: string) => autoUpdater.currentVersion.compare(otherVersion));
    ipcMain.handle('check-update', async () => autoUpdater.checkForUpdatesAndNotify());
    ipcMain.handle('get-last-update', () => this.lastUpdate);
    ipcMain.handle('get-lyric-by-id', async (_, id: number) => {
      const lyric = await alsong.getLyricById(id).catch(() => null);
      if (lyric) delete lyric.registerDate;

      return lyric;
    });
    ipcMain.handle('get-lyric', async (_, data: RequestBody['data']) => {
      if (!Array.isArray(data.artists) || !data.title) return {};

      const artist = data?.artists?.join(', ') ?? '';
      const title = data?.title ?? '';

      const metadata: LyricMetadata[] = await alsong(artist, title).catch(() => []);
      if (metadata.length <= 0) return {};

      return await alsong.getLyricById(metadata[0].lyricId).catch(() => ({ lyric: data.lyrics }));
    });
    ipcMain.handle('search-lyric', async (_, data: { artist: string; title: string; duration?: number; }) => {
      const result: LyricMetadata[] = await alsong(data.artist, data.title, { playtime: data.duration }).catch((e) => {
        console.error(e);
        return [];
      });

      return result.map((it) => ({
        ...it,
        registerDate: it.registerDate.toISOString(),
      }));
    });

    ipcMain.handle('set-config', (_, data: DeepPartial<Config>) => {
      setConfig(data);
      this.broadcast('config', config());

      this.updateWindowConfig(this.mainWindow);
      if (process.platform === 'win32' && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
        this.overlayWindow.close();
        this.updateWindowConfig(this.overlayWindow, { isOverlay: true, gameProcessId: this.registeredPidList[0] });
        this.initOverlayWindow();
        this.addOverlayWindow('StatusBar', this.overlayWindow, 0, 0, true);
      }
    });
    ipcMain.on('get-config', (event) => {
      event.returnValue = config();
    });
    ipcMain.handle('get-default-config', () => DEFAULT_CONFIG);
    ipcMain.handle('set-lyric-mapper', (_, data: Partial<LyricMapper>, useFallback: boolean = true) => {
      setLyricMapper(data, useFallback);
      this.broadcast('lyric-mapper', lyricMapper());
    });
    ipcMain.handle('get-lyric-mapper', () => lyricMapper());
    ipcMain.handle('set-game-list', (_, data: Partial<GameList>, useFallback: boolean = true) => {
      setGameList(data, useFallback);
      this.broadcast('game-list', gameList());
    });
    ipcMain.handle('get-game-list', () => gameList());

    ipcMain.handle('window-minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
    ipcMain.handle('window-maximize', () => {
      BrowserWindow.getFocusedWindow()?.isMaximized() ?
        BrowserWindow.getFocusedWindow()?.unmaximize() : BrowserWindow.getFocusedWindow()?.maximize();
    });
    ipcMain.handle('window-is-maximized', () => BrowserWindow.getFocusedWindow()?.isMaximized());
    ipcMain.handle('window-close', () => BrowserWindow.getFocusedWindow()?.close());
    ipcMain.handle('open-devtool', (_, target: string) => {
      if (target === 'main') {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.openDevTools({ mode: 'detach' });
        }
      }
      if (target === 'lyrics') {
        if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) {
          this.lyricsWindow.webContents.openDevTools({ mode: 'detach' });
        }
      }
      if (target === 'settings') {
        if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
          this.settingsWindow.webContents.openDevTools({ mode: 'detach' });
        }
      }
    });
  }

  initMainWindow() {
    Menu.setApplicationMenu(null);
    this.mainWindow = new BrowserWindow(this.mainWindowOptions);

    this.mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    this.mainWindow.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
    });
    this.mainWindow.setIgnoreMouseEvents(true, { forward: true });

    if (app.isPackaged) {
      this.mainWindow.loadFile(path.join(__dirname, './index.html'));
    } else {
      this.mainWindow.loadURL('http://localhost:5173');
    }

    const onMainWindowUpdate = () => this.updateWindowConfig(this.mainWindow);
    screen.on('display-metrics-changed', onMainWindowUpdate);
    screen.on('display-added', onMainWindowUpdate);
    screen.on('display-removed', onMainWindowUpdate);

    onMainWindowUpdate();
  }

  initOverlayWindow() {
    if (process.platform === 'win32') {
      this.overlayWindow = new BrowserWindow({
        ...this.mainWindowOptions,
        webPreferences: {
          ...this.mainWindowOptions.webPreferences,
          offscreen: true,
        }
      });
      this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });
      if (app.isPackaged) {
        this.overlayWindow.loadFile(path.join(__dirname, './index.html'));
      } else {
        this.overlayWindow.loadURL('http://localhost:5173');
      }

      this.onOverlayWindowUpdate = () => this.updateWindowConfig(this.overlayWindow, { isOverlay: true, gameProcessId: this.registeredPidList[0] });
      screen.on('display-metrics-changed', this.onOverlayWindowUpdate);
      screen.on('display-added', this.onOverlayWindowUpdate);
      screen.on('display-removed', this.onOverlayWindowUpdate);

      this.onOverlayWindowUpdate();
    }
  }

  removeOverlayWindow() {
    if (this.overlayWindow) {
      this.removeOverlay(this.overlayWindow);
      if (this.onOverlayWindowUpdate) {
        screen.removeListener('display-metrics-changed', this.onOverlayWindowUpdate);
        screen.removeListener('display-added', this.onOverlayWindowUpdate);
        screen.removeListener('display-removed', this.onOverlayWindowUpdate);
        this.onOverlayWindowUpdate = null;
      }
      this.overlayWindow.close();
      this.overlayWindow = null;
    }
  }

  updateWindowConfig(window: BrowserWindow | null, options?: { isOverlay: boolean, gameProcessId?: number }) {
    if (!window) return;

    const { windowPosition, style } = config();
    let activeDisplay: Electron.Display;
    if (options?.isOverlay && process.platform === 'win32') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const windowManager = (require('node-window-manager') as typeof import('node-window-manager')).windowManager;
      activeDisplay = screen.getDisplayNearestPoint(
        windowManager.getWindows().find((window) => window.processId == options.gameProcessId)?.getBounds() as Electron.Point ??
        screen.getCursorScreenPoint()
      );
    } else {
      activeDisplay = screen.getAllDisplays().find((display) => display.id === windowPosition.display) ?? screen.getPrimaryDisplay();
    }

    const windowWidth = Math.min(Math.max(style.nowPlaying.maxWidth, style.lyric.maxWidth), activeDisplay.bounds.width);
    const windowHeight = style.maxHeight;

    const anchorX = (() => {
      if (windowPosition.anchor.includes('left')) {
        return activeDisplay.bounds.x + (windowPosition?.left ?? 0);
      }

      if (windowPosition.anchor.includes('right')) {
        return activeDisplay.bounds.x
          + (activeDisplay.bounds.width - windowWidth)
          - (windowPosition?.right ?? 0);
      }

      return activeDisplay.bounds.x
        + ((activeDisplay.bounds.width - windowWidth) / 2);

    })();

    const anchorY = (() => {
      if (windowPosition.anchor.includes('top')) {
        return activeDisplay.bounds.y + (windowPosition?.top ?? 0);
      }

      if (windowPosition.anchor.includes('bottom')) {
        return activeDisplay.bounds.y
          + activeDisplay.bounds.height - windowHeight
          - (windowPosition?.bottom ?? 0);
      }

      return activeDisplay.bounds.y
        + ((activeDisplay.bounds.height - windowHeight) / 2);
    })();

    window.setSize(windowWidth, windowHeight);
    window.setPosition(Math.round(anchorX), Math.round(anchorY));
  }

  initSettingsWindow() {
    this.settingsWindow = new PlatformBrowserWindow({
      ...glassOptions,
      ...micaOptions,
      width: 800,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      title: getTranslation('title.setting', config().language),
      titleBarStyle: 'hiddenInset',
      frame: false,
      transparent: true,
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this.settingsWindow instanceof MicaBrowserWindow) {
      this.settingsWindow.setAutoTheme();
      this.settingsWindow.setMicaAcrylicEffect();
    }

    this.settingsWindow.show();
    this.settingsWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);

      return { action: 'deny' };
    });

    if (app.isPackaged) {
      this.settingsWindow.loadFile(path.join(__dirname, './settings.html'));
    } else {
      this.settingsWindow.loadURL('http://localhost:5173/settings.html');
    }

    this.settingsWindow.show();
  }

  initLyricsWindow() {
    this.lyricsWindow = new PlatformBrowserWindow({
      ...glassOptions,
      ...micaOptions,
      width: 1000,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      title: getTranslation('title.lyrics', config().language),
      titleBarStyle: 'hiddenInset',
      frame: false,
      transparent: true,
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this.lyricsWindow instanceof MicaBrowserWindow) {
      this.lyricsWindow.setAutoTheme();
      this.lyricsWindow.setMicaAcrylicEffect();
    }

    this.lyricsWindow.show();
    if (app.isPackaged) {
      this.lyricsWindow.loadFile(path.join(__dirname, './lyrics.html'));
    } else {
      this.lyricsWindow.loadURL('http://localhost:5173/lyrics.html');
    }

    this.lyricsWindow.show();
  }

  injectOverlay() {
    if (process.platform === 'win32') {
      const windowList = this.overlay.getTopWindows(true);
      hmc.getDetailsProcessList()
        .filter(({ pid }) => windowList.some((window) => window.processId === pid))
        .forEach(({ pid, name, path }) => {
          this.onProcessCreation(pid, name, path);
        });
    }
  }
  
  private onProcessCreation(pid: number, _?: string, filePath?: string) {
    const gamePathList = Object.keys(gameList() ?? {});

    if (typeof filePath === 'string' && gamePathList.includes(filePath)) {
      let tryCount = 0;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const windowManager = (require('node-window-manager') as typeof import('node-window-manager')).windowManager;

      const tryToInject = () => {
        tryCount += 1;
        if (tryCount > 20) return;

        const isInit = this.overlay.getTopWindows(true).some((window) => window.processId == pid);
        if (isInit) {
          let isFirstRun = false;
          if (this.registeredPidList.length == 0) {
            const window = windowManager.getWindows().find((window) => window.processId == pid);

            if (window) {
              this.scaleFactor = window.getMonitor().getScaleFactor();
            }

            this.initOverlay();
            isFirstRun = true;
          }

          for (const window of this.overlay.getTopWindows(true)) {
            if (window.processId == pid) {
              this.overlay.injectProcess(window);

              this.registeredPidList.push(pid);
              this.broadcast('registered-process-list', this.registeredPidList);
            }
          }

          if (this.overlayWindow && isFirstRun) {
            this.addOverlayWindow(
              'StatusBar',
              this.overlayWindow,
              0,
              0,
              true,
            );
          }
        } else {
          setTimeout(tryToInject, 1000);
        }
      };

      tryToInject();
    }
  }
  private onProcessDeletion(pid: number, _?: string) {
    const index = this.registeredPidList.findIndex((it) => it === Number(pid));
    if (index >= 0) this.registeredPidList.splice(index, 1);

    this.broadcast('registered-process-list', this.registeredPidList);

    if (this.registeredPidList.length <= 0) this.stopOverlay();
  }
}

export default Application;
