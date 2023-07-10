import { promises as WQLAsync } from '@jellybrick/wql-process-monitor';
import cors from '@koa/cors';
import alsong from 'alsong';
import { app, BrowserWindow, Menu, dialog, screen, shell, Tray, ipcMain, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import { extractIcon } from 'exe-icon-extractor';
import { BrowserWindow as GlassBrowserWindow, GlasstronOptions } from 'glasstron';
import { hmc } from 'hmc-win32';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { MicaBrowserWindow, IS_WINDOWS_11 } from 'mica-electron';
import { getFile } from '../utils/resource';
import { Config, config, DEFAULT_CONFIG, GameList, gameList, LyricMapper, lyricMapper, setConfig, setGameList, setLyricMapper } from './config';
import type { IOverlay } from './electron-overlay';
import type { RequestBody } from './types';
import path from 'node:path';

type Lyric = Awaited<ReturnType<typeof alsong.getLyricById>>;
type LyricMetadata = Awaited<ReturnType<typeof alsong>>;
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

app.commandLine.appendSwitch('enable-transparent-visuals');

class Application {
  private tray: Tray;
  private app: Koa;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  private overlay: Overlay = require(
    app.isPackaged ?
      path.join(process.resourcesPath, './assets/electron-overlay.node') :
      path.join('../../', './assets/electron-overlay.node'),
  ) as Overlay;
  private markQuit = false;
  private scaleFactor = 1.0;

  public mainWindow: BrowserWindow;
  public overlayWindow: BrowserWindow;
  public settingsWindow: BrowserWindow;
  public lyricsWindow: BrowserWindow;
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
  private onOverlayWindowUpdate: () => void;
  private registeredPidList: number[] = [];

  constructor() {
    if (process.platform === 'win32') {
      void WQLAsync.subscribe({
        creation: true,
        deletion: true,
        filterWindowsNoise: true,
      }).then((it) => {
        it.on('creation', ([name, pid, filePath]) => this.onProcessCreation(name, pid, filePath));
        it.on('deletion', ([name, pid]) => this.onProcessDeletion(name, pid));
      });
    }
  }

  initAutoUpdater() {
    if (app.isPackaged) {
      autoUpdater.autoDownload = false;

      autoUpdater.on('update-available', (it) => {
        const downloadLink =
          'https://github.com/organization/alspotron/releases/latest';
        const releaseNote: string | null
          = typeof it.releaseNotes === 'string' ? it.releaseNotes : it.releaseNotes?.map((it) => it.note)?.join('\n')
        const dialogOpts: Electron.MessageBoxOptions = {
          type: 'info',
          buttons: ['다운로드 & 설치 후 재실행'],
          title: `Alspotron 업데이트 알림 (${it.version})`,
          message: `새로운 ${it.version} 버전이 ${it.releaseDate}에 출시되었어요.`,
          detail: `릴리즈 노트: ${releaseNote}` ?? `${downloadLink}에서 다운로드 할 수 있어요.`,
        };
        void dialog.showMessageBox(dialogOpts).then((dialogOutput) => {
          switch (dialogOutput.response) {
            // Download
            case 1:
              void autoUpdater.downloadUpdate().then(() => {
                autoUpdater.quitAndInstall(true, true)
              });
              break;
            // TODO: Discard updates
            case 2:
              break;
            default:
              break;
          }
        });
      });

      const updateTimeout = setTimeout(() => {
        void autoUpdater.checkForUpdatesAndNotify();
        clearTimeout(updateTimeout);
      }, 2000);
    }
  }

  initTray() {
    const trayIcon = nativeImage.createFromPath(getFile('./assets/icon_square.png'));
    trayIcon.resize({
      width: 16,
      height: 16,
    });
    this.tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
      {
        type: 'normal',
        label: '가사 선택',
        click: () => {
          if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) {
            if (this.lyricsWindow.isMinimized()) this.lyricsWindow.restore();
            this.lyricsWindow.show();
          } else {
            this.initLyricsWindow();
          }
        }
      },
      {
        type: 'normal',
        label: '설정',
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
        label: '종료',
        click: () => {
          this.markQuit = true;
          app.quit();
        }
      },
      {
        type: 'separator',
      },
      {
        label: '개발자 도구',
        submenu: [
          {
            label: '가사 표시기 창',
            click: () => {
              this.mainWindow?.webContents.openDevTools({ mode: 'detach' });
            },
          },
          {
            label: '가사 선택 창',
            click: () => {
              this.lyricsWindow?.webContents.openDevTools({ mode: 'detach' });
            },
          },
          {
            label: '설정 창',
            click: () => {
              this.settingsWindow?.webContents.openDevTools({ mode: 'detach' });
            },
          }
        ]
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

  public addOverlayWindow(
    name: string,
    window: Electron.BrowserWindow,
    dragborder = 0,
    captionHeight = 0,
    transparent = false
  ) {
    this.markQuit = false;

    const display = screen.getDisplayNearestPoint(
      screen.getCursorScreenPoint()
    );

    this.overlay.addWindow(window.id, {
      name,
      transparent,
      resizable: window.isResizable(),
      maxWidth: window.isResizable
        ? display.bounds.width
        : window.getBounds().width,
      maxHeight: window.isResizable
        ? display.bounds.height
        : window.getBounds().height,
      minWidth: window.isResizable ? 100 : window.getBounds().width,
      minHeight: window.isResizable ? 100 : window.getBounds().height,
      nativeHandle: window.getNativeWindowHandle().readUInt32LE(0),
      rect: {
        x: window.getBounds().x,
        y: window.getBounds().y,
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

    window.webContents.on(
      'paint',
      (event, dirty, image: Electron.NativeImage) => {
        if (this.markQuit) {
          return;
        }
        this.overlay.sendFrameBuffer(
          window.id,
          image.getBitmap(),
          image.getSize().width,
          image.getSize().height
        );
      }
    );

    window.on('ready-to-show', () => {
      window.focusOnWebView();
    });

    window.on('resize', () => {
      console.log(`${name} resizing`)
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

    window.webContents.on('cursor-changed', (event, type) => {
      let cursor: string;
      switch (type) {
        case 'default':
          cursor = 'IDC_ARROW';
          break;
        case 'pointer':
          cursor = 'IDC_HAND';
          break;
        case 'crosshair':
          cursor = 'IDC_CROSS';
          break;
        case 'text':
          cursor = 'IDC_IBEAM';
          break;
        case 'wait':
          cursor = 'IDC_WAIT';
          break;
        case 'help':
          cursor = 'IDC_HELP';
          break;
        case 'move':
          cursor = 'IDC_SIZEALL';
          break;
        case 'nwse-resize':
          cursor = 'IDC_SIZENWSE';
          break;
        case 'nesw-resize':
          cursor = 'IDC_SIZENESW';
          break;
        case 'ns-resize':
          cursor = 'IDC_SIZENS';
          break;
        case 'ew-resize':
          cursor = 'IDC_SIZEWE';
          break;
        case 'none':
          cursor = '';
          break;
      }
      if (cursor) {
        this.overlay.sendCommand({ command: 'cursor', cursor });
      }
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
    this.mainWindow.webContents.send(event, ...args);
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) this.overlayWindow.webContents.send(event, ...args);
    if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) this.lyricsWindow.webContents.send(event, ...args);
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) this.settingsWindow.webContents.send(event, ...args);
  }

  initHook() {
    ipcMain.handle('get-registered-process-list', () => this.registeredPidList);
    ipcMain.handle('get-icon', (_, path: string) => {
      try {
        const result = extractIcon(path, 'large');

        return `data:image/png;base64,${Buffer.from(result).toString('base64')}`; 
        // return result;
      } catch (err) {
        // console.warn(err);
      }

      return null;
    });
    ipcMain.handle('start-overlay', () => {
      this.initOverlay();

      this.addOverlayWindow('StatusBar', this.overlayWindow, 0, 0, true);
    });
    ipcMain.handle('stop-overlay', () => {
      this.stopOverlay();
    });
    ipcMain.handle('inject-overlay-to-process', (_, processId: number) => {
      if (process.platform !== 'win32') {
        return;
      }

      this.overlay.injectProcess({
        processId,
        windowId: hmc.getProcessHandle(processId).handle,
      });
    });
    ipcMain.handle('get-current-version', () => {
      return autoUpdater.currentVersion.version;
    });
    ipcMain.handle('compare-with-current-version', (_, otherVersion: string) => {
      return autoUpdater.currentVersion.compare(otherVersion);
    });
    ipcMain.handle('check-update', async () => {
      return await autoUpdater.checkForUpdatesAndNotify();
    });
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

      return await alsong.getLyricById(metadata[0].lyricId).catch(() => ({ lyric: data.lyrics }));
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
      this.updateWindowConfig(this.mainWindow);
      if (process.platform === 'win32') {
        this.updateWindowConfig(this.overlayWindow);
      }
    });
    ipcMain.handle('get-config', () => config());
    ipcMain.handle('get-default-config', () => DEFAULT_CONFIG);
    ipcMain.handle('set-lyric-mapper', (_, data: Partial<LyricMapper>, useFallback = true) => {
      setLyricMapper(data, useFallback as boolean); // SUPER WEIRD TypeScript
      this.broadcast('lyric-mapper', lyricMapper());
    });
    ipcMain.handle('get-lyric-mapper', () => lyricMapper());
    ipcMain.handle('set-game-list', (_, data: Partial<GameList>, useFallback = true) => {
      setGameList(data, useFallback as boolean);
      this.broadcast('game-list', gameList());
    });
    ipcMain.handle('get-game-list', () => gameList());

    ipcMain.on('window-minimize', () => {
      BrowserWindow.getFocusedWindow()?.minimize();
    })
    ipcMain.on('window-maximize', () => {
      if (BrowserWindow.getFocusedWindow()?.isMaximized()) BrowserWindow.getFocusedWindow()?.unmaximize();
      else BrowserWindow.getFocusedWindow()?.maximize();
    })
    ipcMain.on('window-close', () => {
      BrowserWindow.getFocusedWindow()?.close();
    })
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
      void this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
    } else {
      void this.mainWindow.loadURL('http://localhost:5173');
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
        void this.overlayWindow.loadFile(path.join(__dirname, '../index.html'));
      } else {
        void this.overlayWindow.loadURL('http://localhost:5173');
      }

      this.onOverlayWindowUpdate = () => this.updateWindowConfig(this.overlayWindow);
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
        this.onOverlayWindowUpdate = undefined;
      }
      this.overlayWindow.close();
      this.overlayWindow = undefined;
    }
  }

  updateWindowConfig(window: BrowserWindow) {
    const { windowPosition, style } = config();
    const activeDisplay =
      screen.getAllDisplays().find((display) => display.id === windowPosition.display) ||
      screen.getPrimaryDisplay();

    const windowWidth = Math.min(Math.max(style.nowPlaying.maxWidth, style.lyric.maxWidth), activeDisplay.bounds.width);
    const windowHeight = 300;

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

    window.setSize(windowWidth, windowHeight);
    window.setPosition(Math.round(anchorX), Math.round(anchorY));
  }

  initSettingsWindow() {
    this.settingsWindow = new (IS_WINDOWS_11 ? MicaBrowserWindow : GlassBrowserWindow)({
      ...glassOptions,
      ...micaOptions,
      width: 800,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      title: 'Alspotron 설정',
      titleBarStyle: 'hiddenInset',
      frame: false,
      vibrancy: 'sidebar',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this.settingsWindow instanceof MicaBrowserWindow) {
      this.settingsWindow.setDarkTheme();
      this.settingsWindow.setMicaEffect();
      this.settingsWindow.show();
    }

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
    this.lyricsWindow = new (IS_WINDOWS_11 ? MicaBrowserWindow : GlassBrowserWindow)({
      ...glassOptions,
      ...micaOptions,
      width: 1000,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      title: '가사 선택',
      titleBarStyle: 'hiddenInset',
      frame: false,
      vibrancy: 'sidebar',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this.lyricsWindow instanceof MicaBrowserWindow) {
      this.lyricsWindow.setDarkTheme();
      this.lyricsWindow.setMicaEffect();
      this.lyricsWindow.show();
    }

    if (app.isPackaged) {
      void this.lyricsWindow.loadFile(path.join(__dirname, '../lyrics.html'));
    } else {
      void this.lyricsWindow.loadURL('http://localhost:5173/lyrics.html');
    }
  }
  
  private onProcessCreation(name: string, pid: number, filePath?: string) {
    const gamePathList = Object.keys(gameList());

    if (gamePathList.includes(filePath)) {
      let tryCount = 0;

      const tryToInject = () => {
        tryCount += 1;

        if (tryCount > 20) {
          console.warn('failed to inject', name, pid, filePath);
          return;
        }

        const isInit = Number(hmc.getForegroundWindowProcessID()) === Number(pid);
        if (isInit) {
          if (this.registeredPidList.length == 0) {
            this.scaleFactor = screen.getDisplayNearestPoint({
              x: 0,
              y: 0,
            }).scaleFactor;

            this.initOverlay();
            this.addOverlayWindow('StatusBar', this.overlayWindow, 0, 0, true);
          }

          for (const window of this.overlay.getTopWindows(true)) {
            if (window.processId == pid) {
              this.overlay.injectProcess(window);

              this.registeredPidList.push(pid);
              this.broadcast('registered-process-list', this.registeredPidList);
            }
          }
        } else {
          setTimeout(tryToInject, 1000);
        }
      };
      tryToInject();
    }
  }
  private onProcessDeletion(name: string, pid: number) {
    const index = this.registeredPidList.findIndex((it) => it === Number(pid));
    if (index >= 0) this.registeredPidList.splice(index, 1);

    this.broadcast('registered-process-list', this.registeredPidList);

    if (this.registeredPidList.length <= 0) this.stopOverlay();
  }
}

export default Application;
