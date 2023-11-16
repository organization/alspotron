import path from 'node:path';

import ProgressBar from 'electron-progressbar';
import { hmc } from 'hmc-win32';
import { autoUpdater, UpdateInfo } from 'electron-differential-updater';
import { IS_WINDOWS_11, MicaBrowserWindow } from 'mica-electron';

import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem, MenuItemConstructorOptions, nativeImage, screen, shell, Tray } from 'electron';

import deepmerge from 'deepmerge';

import { ProgressInfo } from 'electron-builder';

import { PartialDeep } from 'type-fest';

import { BrowserWindow as GlassBrowserWindow, GlasstronOptions } from 'glasstron';



import PluginManager from './plugins/plugin-manager';

import { initServer } from './server';

import { config, gameList, lyricMapper, themeList } from './config';

import { DEFAULT_CONFIG, DEFAULT_STYLE } from '../common/constants';

import { getTranslation } from '../common/intl';

import { pure } from '../utils/pure';
import { getFile } from '../utils/resource';

import { Config, GameList, LyricMapper, StyleConfig } from '../common/types';

import type { UpdateData } from '../common/types';

import type { IOverlay } from './electron-overlay';
import type { OverrideMap, OverrideParameterMap, PluginEventMap } from '../common/plugins';



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
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
app.commandLine.appendSwitch('enable-transparent-visuals');

class Application {
  private tray!: Tray;
  private overlay!: Overlay;
  private pluginManager!: PluginManager;
  private markQuit = false;
  private scaleFactor = 1.0;
  private lastUpdate: UpdateData | null = null;
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
      import('@jellybrick/wql-process-monitor').then((wql) => {
        wql.promises.subscribe({
          creation: true,
          deletion: true,
          filterWindowsNoise: true,
        }).then((listener) => {
          listener.on('creation', ([name, pid, filePath]) => this.onProcessCreation(pid, name, filePath));
          listener.on('deletion', ([name, pid]) => this.onProcessDeletion(pid, name));
        });
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

  initServer() {
    initServer({
      onUpdate: (body) => {
        this.lastUpdate = body;
        this.overridePlugin(
          'update',
          (updateData) => {
            this.broadcast('update', updateData);
          },
          this.lastUpdate,
        );
      },
    });
  }

  initPluginLoader() {
    console.log('[Alspotron] load all plugins');
    
    this.pluginManager = new PluginManager({
      config: () => config.get().plugins,
      folder: path.resolve(app.getPath('userData'), 'plugins'),
      set: (newConfig) => config.set({ plugins: newConfig }),
    });
    this.pluginManager.loadPluginsFromConfig().catch((e) => {
      console.error('[Alspotron] Cannot load plugins', e);
    });
  }

  initAutoUpdater() {
    if (!app.isPackaged) return;

    autoUpdater.autoDownload = false;
    autoUpdater.on('update-available', async (it: UpdateInfo) => {
      const downloadLink = 'https://github.com/organization/alspotron/releases/latest';

      const { response } = await dialog.showMessageBox({
        type: 'info',
        buttons: [getTranslation('updater.download-and-auto-install', config.get().language)],
        title: `${getTranslation('updater.update-alert', config.get().language)} (${it.version})`,
        message: getTranslation('updater.update-available', config.get().language).replace('{{version}}', it.version),
        detail: getTranslation('updater.download-at', config.get().language).replace('{{link}}', downloadLink),
        defaultId: 0,
      });
      
      if (response === 0) {
        const updateProgressBar = new ProgressBar({
          indeterminate: false,
          title: getTranslation('updater.popup.title', config.get().language),
          text: getTranslation('updater.popup.text', config.get().language),
          initialValue: 0,
        });

        // What The F @types/electron-progressbar
        updateProgressBar
          .on('progress', ((value: number) => {
            updateProgressBar.detail = `${getTranslation('updater.popup.percent', config.get().language)} (${value.toFixed(2)}%)`;
          }) as () => void)
          .on('aborted', ((value: number) => {
            updateProgressBar.detail = `${getTranslation('updater.popup.download-aborted', config.get().language)} ${value.toFixed(2)}%`;
          }) as () => void)
          .on('completed', () => {
            updateProgressBar.detail = getTranslation('updater.popup.download-completed', config.get().language);
            autoUpdater.quitAndInstall(true, true);
          });

        autoUpdater.on('download-progress', (it: ProgressInfo) => {
          if (!updateProgressBar.isCompleted()) {
            updateProgressBar.value = it.percent;
            updateProgressBar.text = `${getTranslation('updater.popup.percent', config.get().language)} (${it.percent.toFixed(2)}%, ${it.transferred} / ${it.total})`;
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
        label: getTranslation('tray.lyrics.label', config.get().language),
        click: () => {
          if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) {
            if (this.lyricsWindow.isMinimized()) this.lyricsWindow.restore();
            this.lyricsWindow.show();
          } else {
            this.initLyricsWindow();
          }
        },
      },
      {
        type: 'normal',
        label: getTranslation('tray.setting.label', config.get().language),
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
        label: getTranslation('tray.exit.label', config.get().language),
        click: () => {
          this.markQuit = true;
          app.quit();
        }
      },
    ];

    if (config.get().developer) {
      menu.push(
        {
          type: 'separator',
        },
        {
          type: 'submenu',
          label: getTranslation('tray.devtools.label', config.get().language),
          submenu: [
            {
              label: getTranslation('tray.devtools.lyric-viewer.label', config.get().language),
              click: () => {
                if (this.mainWindow && !this.mainWindow.isDestroyed()) {
                  this.mainWindow.webContents.openDevTools({ mode: 'detach' });
                }
              },
            },
            {
              label: getTranslation('tray.devtools.lyrics.label', config.get().language),
              click: () => {
                if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) {
                  this.lyricsWindow.webContents.openDevTools({ mode: 'detach' });
                }
              },
            },
            {
              label: getTranslation('tray.devtools.setting.label', config.get().language),
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

    let lastValue = config.get().developer;
    config.watch((config) => {
      if (lastValue !== config.developer) {
        this.initMenu();
        this.tray.setContextMenu(this.contextMenu);

        lastValue = config.developer;
      }
    });
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

  async overridePlugin<Target extends keyof OverrideMap>(
    target: Target,
    originalFn: (...args: OverrideParameterMap[Target]) => Promise<void> | void,
    ...args: OverrideParameterMap[Target]
  ): Promise<void> {
    const overrideFnList = this.pluginManager.getPlugins()
      .flatMap((plugin) => plugin.state === 'enable'
        ? plugin.js.overrides[target] ?? []
        : []
      );
    
    await Promise.all(overrideFnList.map(async (overrideFn, index) => {
      const fn = (
        index === overrideFnList.length - 1
          ? originalFn
          : async () => {}
      ) as (...args: OverrideParameterMap[Target]) => Promise<void>;

      await overrideFn(fn, ...args);
    }));

    if (overrideFnList.length === 0) {
      await originalFn(...args);
    }
  }

  broadcast<T>(event: string, ...args: T[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    this.broadcastPlugin(event as keyof PluginEventMap, ...args as any);

    if (this.mainWindow) this.mainWindow.webContents.send(event, ...args);
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) this.overlayWindow.webContents.send(event, ...args);
    if (this.lyricsWindow && !this.lyricsWindow.isDestroyed()) this.lyricsWindow.webContents.send(event, ...args);
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) this.settingsWindow.webContents.send(event, ...args);
  }

  broadcastPlugin<T extends keyof PluginEventMap>(event: T, ...args: Parameters<PluginEventMap[T]>) {
    this.pluginManager.broadcast(event, ...args);
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
        } catch (e: unknown) {
          console.error(e);
        }

        return null;
      }
    });
    ipcMain.handle('start-overlay', () => {
      this.initOverlay();

      this.overridePlugin('start-overlay', () => {
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
      this.broadcastPlugin('start-overlay');
    });
    ipcMain.handle('stop-overlay', () => {
      this.overridePlugin('stop-overlay', () => {
        this.stopOverlay();
      });
      this.broadcastPlugin('stop-overlay');
    });
    ipcMain.handle('inject-overlay-to-process', (_, processId: number, name?: string, filePath?: string) => {
      if (process.platform !== 'win32') return;

      this.overridePlugin('inject-overlay-to-process', (processId, name, filePath) => {
        this.onProcessCreation(processId, name, filePath);
      }, processId, name, filePath);
      this.broadcastPlugin('inject-overlay-to-process', processId, name, filePath);
    });
    ipcMain.handle('remove-overlay-from-process', (_, processId: number) => {
      this.broadcastPlugin('remove-overlay-from-process', processId);
      this.overridePlugin('remove-overlay-from-process', (processId) => {
        this.onProcessDeletion(processId);
      }, processId);
    });
    ipcMain.handle('get-current-version', () => autoUpdater.currentVersion.version);
    ipcMain.handle('compare-with-current-version', (_, otherVersion: string) => autoUpdater.currentVersion.compare(otherVersion));
    ipcMain.handle('check-update', async () => autoUpdater.checkForUpdatesAndNotify());
    ipcMain.handle('get-last-update', () => this.lastUpdate);

    ipcMain.handle('set-config', async (_, data: PartialDeep<Config>) => {
      await this.overridePlugin('config', (data) => {
        config.set(data);

        this.updateWindowConfig(this.mainWindow);
        if (process.platform === 'win32' && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
          this.overlayWindow.close();
          this.updateWindowConfig(this.overlayWindow, { isOverlay: true, gameProcessId: this.registeredPidList[0] });
          this.initOverlayWindow();
          this.addOverlayWindow('StatusBar', this.overlayWindow, 0, 0, true);
        }
      }, data);
      this.broadcast('config', config.get());
    });
    ipcMain.on('get-config', (event) => {
      event.returnValue = config.get();
    });
    ipcMain.handle('get-default-config', () => DEFAULT_CONFIG);
    ipcMain.handle('reset-config', () => {
      config.set(DEFAULT_CONFIG, false);
      lyricMapper.set({}, false);
      gameList.set({}, false);

      this.pluginManager.getPlugins()
        .forEach((plugin) => this.pluginManager.removePlugin(plugin));

      this.broadcast('config', config.get());
      this.broadcast('game-list', gameList.get());
    });
    ipcMain.handle('set-lyric-mapper', async (_, data: Partial<LyricMapper>, useFallback: boolean = true) => {
      await this.overridePlugin('lyric-mapper', (data) => {
        lyricMapper.set(data, useFallback);
      }, data);
      this.broadcast('lyric-mapper', lyricMapper.get());
    });
    ipcMain.handle('get-lyric-mapper', () => lyricMapper.get());
    ipcMain.handle('set-game-list', async (_, data: Partial<GameList>, useFallback: boolean = true) => {
      await this.overridePlugin('game-list', (data) => {
        gameList.set(data, useFallback);
      }, data);
      this.broadcast('game-list', gameList.get());
    });
    ipcMain.handle('get-game-list', () => gameList.get());
    ipcMain.handle('set-theme', async (_, name: string, data: PartialDeep<StyleConfig> | null, useFallback: boolean = true) => {
      await this.overridePlugin('set-theme', (data) => {
        themeList.set({
          [name]: data ?? undefined,
        }, useFallback);
      }, data);
      this.broadcast('theme-list', themeList.get());
    });
    ipcMain.handle('get-theme-list', () => themeList.get());

    ipcMain.handle('window-minimize', () => {
      this.overridePlugin('window-minimize', () => {
        BrowserWindow.getFocusedWindow()?.minimize();
      });
      this.broadcastPlugin('window-minimize');
    });
    ipcMain.handle('window-maximize', () => {
      const isMaximized = BrowserWindow.getFocusedWindow()?.isMaximized() ?? false;

      this.overridePlugin('window-maximize', (isMaximized) => {
        if (isMaximized) BrowserWindow.getFocusedWindow()?.unmaximize();
        else BrowserWindow.getFocusedWindow()?.maximize();
      }, isMaximized);

      this.broadcastPlugin('window-maximize', !isMaximized);
    });
    ipcMain.handle('window-is-maximized', () => BrowserWindow.getFocusedWindow()?.isMaximized());
    ipcMain.handle('window-close', () => {
      this.overridePlugin('window-close', () => {
        BrowserWindow.getFocusedWindow()?.close();
      });
      this.broadcastPlugin('window-close');
    });
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

    ipcMain.handle('get-plugin-list', () => pure(this.pluginManager.getPlugins()));
    ipcMain.handle('add-plugin', async (_, pluginPath: string) => {
      this.broadcastPlugin('before-add-plugin', pluginPath);

      let error: Error | null = null;
      await this.overridePlugin('add-plugin', async (pluginPath) => {
        const result = await this.pluginManager.addPlugin(pluginPath);
        if (result instanceof Error) {
          error = result;
          return;
        }

        this.broadcastPlugin('add-plugin', result, result.path);
      }, pluginPath);

      return error;
    });
    ipcMain.handle('get-plugin', (_, id: string) => pure(this.pluginManager.getPlugins().find((it) => it.id === id)));
    ipcMain.handle('remove-plugin', (_, id: string) => {
      const target = this.pluginManager.getPlugins().find((it) => it.id === id);

      if (!target) return;

      this.broadcastPlugin('before-remove-plugin', target);
      this.overridePlugin('remove-plugin', (target) => {
        this.pluginManager.removePlugin(target);
      }, target);
      this.broadcastPlugin('after-remove-plugin', target);

      config.set({ plugins: { list: { [id]: undefined } } });
    });
    ipcMain.handle('reload-plugin', async (_, id: string) => {
      const target = this.pluginManager.getPlugins().find((it) => it.id === id);
      if (!target) return;

      await this.overridePlugin('reload-plugin', async (target) => {
        await this.pluginManager.reloadPlugin(target);
      }, target);
    });

    ipcMain.handle('set-plugin-state', async (_, id: string, state: 'disable' | 'enable') => {
      const target = this.pluginManager.getPlugins().find((it) => it.id === id);
      if (!target) return;

      await this.overridePlugin('change-plugin-state', async (target, state) => {
        await this.pluginManager.setPluginState(target.id, state);
      }, target, state);
      
      this.broadcastPlugin('change-plugin-state', target, state);
    });
    ipcMain.handle('broadcast-plugin', (_, event: keyof PluginEventMap, ...args) => {
      this.broadcastPlugin(event, ...args as Parameters<PluginEventMap[typeof event]>);
    });
    ipcMain.handle('override-plugin', (_, target: keyof OverrideMap, ...args) => {
      return new Promise((resolve) => {
        let isResolved = false;

        (async () => {
          await this.overridePlugin(target, (...provided) => {
            isResolved = true;
            resolve(provided);
          }, ...args as never);

          if (!isResolved) resolve(false);
        })();
      });
    });
  }

  setCorsHandler(window: BrowserWindow) {
    window.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        const isEgg = details.url.startsWith('https://lyric.altools.com');
        if (isEgg) {
          delete details.requestHeaders['Referer'];
          delete details.requestHeaders['sec-ch-ua'];
          delete details.requestHeaders['sec-ch-ua-mobile'];
          delete details.requestHeaders['sec-ch-ua-platform'];
          delete details.requestHeaders['Sec-Fetch-Dest'];
          delete details.requestHeaders['Sec-Fetch-Mode'];
          delete details.requestHeaders['Sec-Fetch-Site'];
          callback({
            requestHeaders: {
              ...details.requestHeaders,
              'Origin': '*',
              'User-Agent': 'Dalvik/2.2.0 (Linux; U; Android 11; Pixel 4a Build/RQ3A.210805.001.A1)',
            },
          });
        } else {
          callback({});
        }
      },
    );
    window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      const isEgg = details.url.startsWith('https://lyric.altools.com');
      if (isEgg) {
        callback({
          responseHeaders: {
            'Access-Control-Allow-Origin': ['*'],
            ...details.responseHeaders,
          },
        });
      } else {
        callback({});
      }
    });
  }

  initMainWindow() {
    Menu.setApplicationMenu(null);
    this.mainWindow = new BrowserWindow(this.mainWindowOptions);
    this.setCorsHandler(this.mainWindow);

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
      this.setCorsHandler(this.overlayWindow);
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

    const {
      windowPosition,
      selectedTheme,
    } = config.get();
    const themes = themeList.get();
    const style = deepmerge(DEFAULT_STYLE, themes[selectedTheme] ?? DEFAULT_STYLE);
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

    // electron issue: https://github.com/electron/electron/issues/16711#issuecomment-1311824063
    const resizable = window.isResizable();
    window.unmaximize();
    window.setResizable(true);
    window.setSize(windowWidth, windowHeight);
    window.setResizable(resizable);
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
      title: getTranslation('title.setting', config.get().language),
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
      title: getTranslation('title.lyrics', config.get().language),
      titleBarStyle: 'hiddenInset',
      frame: false,
      transparent: true,
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });
    this.setCorsHandler(this.lyricsWindow);

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
    const gamePathList = Object.keys(gameList.get() ?? {});

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
