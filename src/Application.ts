import path from 'node:path';

import ProgressBar from 'electron-progressbar';
import { autoUpdater, UpdateInfo } from 'electron-differential-updater';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  nativeImage,
  screen,
  Tray
} from 'electron';
import { ProgressInfo } from 'electron-builder';
import { PartialDeep } from 'type-fest';

import PluginManager from './plugins/plugin-manager';
import { initServer } from './server';
import { config, gameList, lyricMapper, themeList } from './config';

import { LyricWindowProvider, SettingWindowProvider, LyricSearchWindowProvider } from './window';

import { OverlayManager } from './overlay';

import { DEFAULT_CONFIG } from '../common/constants';
import { getTranslation } from '../common/intl';
import { pure } from '../utils/pure';
import { getFile } from '../utils/resource';

import { Config, GameList, LyricMapper, StyleConfig } from '../common/schema';

import { getLyricProvider } from '../common/provider';

import type { UpdateData } from '../common/schema';
import type { OverrideMap, OverrideParameterMap, PluginEventMap } from '../common/plugins';

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
  public lyricWindowProvider!: LyricWindowProvider;
  public settingWindowProvider: SettingWindowProvider | null = null;
  public lyricSearchWindowProvider: LyricSearchWindowProvider | null = null;

  private overlayManager: OverlayManager;

  private tray!: Tray;
  private pluginManager!: PluginManager;
  private lastUpdate: UpdateData | null = null;
  private contextMenu: Menu | null = null;

  constructor(overlayManager: OverlayManager) {
    this.overlayManager = overlayManager;

    this.overlayManager.on('register-process', () => {
      this.broadcast('registered-process-list', this.overlayManager.registeredProcessList);
    });
    this.overlayManager.on('unregister-process', () => {
      this.broadcast('registered-process-list', this.overlayManager.registeredProcessList);
    });
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
          if (this.lyricSearchWindowProvider && !this.lyricSearchWindowProvider.window.isDestroyed()) {
            if (this.lyricSearchWindowProvider.window.isMinimized()) this.lyricSearchWindowProvider.window.restore();
            this.lyricSearchWindowProvider.window.show();
          } else {
            this.initLyricSearchWindow();
          }
        },
      },
      {
        type: 'normal',
        label: getTranslation('tray.setting.label', config.get().language),
        click: () => {
          if (this.settingWindowProvider && !this.settingWindowProvider.window.isDestroyed()) {
            if (this.settingWindowProvider.window.isMinimized()) this.settingWindowProvider.window.restore();
            this.settingWindowProvider.window.show();
          } else {
            this.initSettingWindow();
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
          this.overlayManager.stopOverlay();
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
                if (this.lyricWindowProvider && !this.lyricWindowProvider.window.isDestroyed()) {
                  this.lyricWindowProvider.window.webContents.openDevTools({ mode: 'detach' });
                }
              },
            },
            {
              label: getTranslation('tray.devtools.lyrics.label', config.get().language),
              click: () => {
                if (this.lyricSearchWindowProvider && !this.lyricSearchWindowProvider.window.isDestroyed()) {
                  this.lyricSearchWindowProvider.window.webContents.openDevTools({ mode: 'detach' });
                }
              },
            },
            {
              label: getTranslation('tray.devtools.setting.label', config.get().language),
              click: () => {
                if (this.settingWindowProvider && !this.settingWindowProvider.window.isDestroyed()) {
                  this.settingWindowProvider.window.webContents.openDevTools({ mode: 'detach' });
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
          : async () => {
          }
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

    if (this.lyricWindowProvider) this.lyricWindowProvider.window.webContents.send(event, ...args);
    if (this.overlayManager.windowProvider && !this.overlayManager.windowProvider.window.isDestroyed()) this.overlayManager.windowProvider.window.webContents.send(event, ...args);
    if (this.lyricSearchWindowProvider && !this.lyricSearchWindowProvider.window.isDestroyed()) this.lyricSearchWindowProvider.window.webContents.send(event, ...args);
    if (this.settingWindowProvider && !this.settingWindowProvider.window.isDestroyed()) this.settingWindowProvider.window.webContents.send(event, ...args);
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
    ipcMain.handle('get-registered-process-list', () => []); //this.registeredPidList);
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
      // this.initOverlay();
      //
      // this.overridePlugin('start-overlay', () => {
      //   if (this.overlayWindow) {
      //     this.addOverlayWindow(
      //       'StatusBar',
      //       this.overlayWindow,
      //       0,
      //       0,
      //       true,
      //     );
      //   }
      // });
      // this.broadcastPlugin('start-overlay');
    });
    ipcMain.handle('stop-overlay', () => {
      this.overridePlugin('stop-overlay', () => {
        this.overlayManager.stopOverlay();
      });
      this.broadcastPlugin('stop-overlay');
    });
    ipcMain.handle('inject-overlay-to-process', async (_, processId: number, name?: string, filePath?: string) => {
      if (process.platform !== 'win32') return;

      await this.overridePlugin('inject-overlay-to-process', async (processId, name, filePath) => {
        const gamePathList = Object.keys(gameList.get() ?? {});

        if (typeof filePath === 'string' && gamePathList.includes(filePath)) {
          await this.overlayManager.createProcess(processId);
        }
      }, processId, name, filePath);

      this.broadcastPlugin('inject-overlay-to-process', processId, name, filePath);
    });
    ipcMain.handle('remove-overlay-from-process', (_, processId: number) => {
      this.broadcastPlugin('remove-overlay-from-process', processId);
      this.overridePlugin('remove-overlay-from-process', (processId) => {
        this.overlayManager.deleteProcess(processId);
      }, processId);
    });
    ipcMain.handle('get-current-version', () => autoUpdater.currentVersion.version);
    ipcMain.handle('compare-with-current-version', (_, otherVersion: string) => autoUpdater.currentVersion.compare(otherVersion));
    ipcMain.handle('check-update', async () => autoUpdater.checkForUpdatesAndNotify());
    ipcMain.handle('get-last-update', () => this.lastUpdate);

    ipcMain.handle('set-config', async (_, data: PartialDeep<Config>) => {
      await this.overridePlugin('config', (data) => {
        config.set(data);
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
        if (this.lyricWindowProvider && !this.lyricWindowProvider.window.isDestroyed()) {
          this.lyricWindowProvider.window.webContents.openDevTools({ mode: 'detach' });
        }
      }
      if (target === 'lyrics') {
        if (this.lyricSearchWindowProvider && !this.lyricSearchWindowProvider.window.isDestroyed()) {
          this.lyricSearchWindowProvider.window.webContents.openDevTools({ mode: 'detach' });
        }
      }
      if (target === 'settings') {
        if (this.settingWindowProvider && !this.settingWindowProvider.window.isDestroyed()) {
          this.settingWindowProvider.window.webContents.openDevTools({ mode: 'detach' });
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

  initMainWindow() {
    this.lyricWindowProvider = new LyricWindowProvider();
    this.setCorsHandler(this.lyricWindowProvider.window.webContents);

    this.lyricWindowProvider.window.show();
  }

  initSettingWindow() {
    this.settingWindowProvider = new SettingWindowProvider();

    this.settingWindowProvider.window.show();
  }

  initLyricSearchWindow() {
    this.lyricSearchWindowProvider = new LyricSearchWindowProvider();
    this.setCorsHandler(this.lyricSearchWindowProvider.window.webContents);

    this.lyricSearchWindowProvider.window.show();
  }

  private setCorsHandler(webContents: Electron.WebContents) {
    webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        const provider = getLyricProvider(config.get().provider);

        if (provider) {
          const result = provider.onBeforeSendHeaders(details);

          callback(result);
          return;
        }

        callback({});
      },
    );
    webContents.session.webRequest.onHeadersReceived((details, callback) => {
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
}

export default Application;
