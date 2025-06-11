import path from 'node:path';

import ProgressBar from 'electron-progressbar';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  nativeImage,
  Rectangle,
  screen,
  Tray,
} from 'electron';
import { PartialDeep } from 'type-fest';

import PluginManager from './plugins/plugin-manager';
import { config, gameList, lyricMapper, themeList } from './config';

import {
  LyricSearchWindowProvider,
  LyricWindowProvider,
  SettingWindowProvider,
  TrayWindowProvider,
} from './window';

import { OverlayManager } from './overlay';

import {
  LrclibLyricProvider,
  TunaObsProvider,
  WebNowPlayingProvider,
} from './provider';

import { DEFAULT_CONFIG } from '../common/constants';
import { getTranslation } from '../common/intl';

import { Config, GameList, LyricMapper, StyleConfig } from '../common/schema';
import { LyricProvider, SourceProvider } from '../common/provider';
import { pure } from '../utils/pure';
import { getFile } from '../utils/resource';
import { isMacOS, isWin32 } from '../utils/is';

import type { UpdateData } from '../common/schema';
import type {
  OverrideMap,
  OverrideParameterMap,
  PluginEventMap,
} from '../common/plugins';

// Set application name for Windows 10+ notifications
if (isWin32()) {
  app.setAppUserModelId(app.getName());
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
app.commandLine.appendSwitch('enable-transparent-visuals');

if (!config.get().hardwareAcceleration) app.disableHardwareAcceleration();

class Application {
  public lyricWindowProviders: LyricWindowProvider[] = [];
  public settingWindowProvider: SettingWindowProvider | null = null;
  public lyricSearchWindowProvider: LyricSearchWindowProvider | null = null;
  public trayWindowProvider: TrayWindowProvider | null = null;
  public onMap = {
    'get-all-screens': (event) => {
      event.returnValue = screen.getAllDisplays();
    },
    'get-primary-screen': (event) => {
      event.returnValue = screen.getPrimaryDisplay();
    },
    'get-config': (event) => {
      event.returnValue = config.get();
    },
  } satisfies Record<string, (event: Electron.IpcMainEvent) => void>;
  private overlayManager: OverlayManager;
  private pluginManager!: PluginManager;
  private sourceProviders: SourceProvider[] = [];
  private lyricProviders: LyricProvider[] = [];
  private contextMenu: Menu | null = null;
  private tray!: Tray;
  private lastUpdate: UpdateData | null = null;
  public handleMap = {
    'get-registered-process-list': () =>
      this.overlayManager.registeredProcessList,
    'get-icon': (_, path: string) => {
      if (isWin32()) {
        try {
          // HACK: dynamic import is not working
          const extractIcon =
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require('extract-file-icon') as typeof import('extract-file-icon');
          const result = extractIcon(path, 32);

          return `data:image/png;base64,${Buffer.from(result).toString('base64')}`;
        } catch (e: unknown) {
          console.error(e);
        }

        return null;
      }
    },
    'start-overlay': () => {
      this.overridePlugin('start-overlay', () => {
        this.overlayManager.startOverlay();
      });
      this.broadcastPlugin('start-overlay');
    },
    'stop-overlay': () => {
      this.overridePlugin('stop-overlay', () => {
        this.overlayManager.stopOverlay();
      });
      this.broadcastPlugin('stop-overlay');
    },
    'inject-overlay-to-process': async (
      _,
      processId: number,
      name?: string,
      filePath?: string,
    ) => {
      if (process.platform !== 'win32') return;

      await this.overridePlugin(
        'inject-overlay-to-process',
        async (processId, name, filePath) => {
          const gamePathList = Object.keys(gameList.get() ?? {});

          if (typeof filePath === 'string' && gamePathList.includes(filePath)) {
            await this.overlayManager.createRegisteredProcess(
              processId,
              filePath,
            );
          }
        },
        processId,
        name,
        filePath,
      );

      this.broadcastPlugin(
        'inject-overlay-to-process',
        processId,
        name,
        filePath,
      );
    },
    'remove-overlay-from-process': (_, processId: number) => {
      this.broadcastPlugin('remove-overlay-from-process', processId);
      this.overridePlugin(
        'remove-overlay-from-process',
        (processId) => {
          this.overlayManager.deleteProcess(processId);
        },
        processId,
      );
    },
    'get-current-version': () => autoUpdater.currentVersion.version,
    'compare-with-current-version': (_, otherVersion: string) =>
      autoUpdater.currentVersion.compare(otherVersion),
    'check-update': async () => autoUpdater.checkForUpdatesAndNotify(),
    'get-last-update': () => this.lastUpdate,

    'set-config': async (_, data: PartialDeep<Config>) => {
      await this.overridePlugin(
        'config',
        (data) => {
          config.set(data);
        },
        data,
      );
    },
    'get-default-config': () => DEFAULT_CONFIG,
    'reset-config': () => {
      config.set(DEFAULT_CONFIG, false);
      lyricMapper.set({}, false);
      gameList.set({}, false);

      this.pluginManager
        .getPlugins()
        .forEach((plugin) => this.pluginManager.removePlugin(plugin));
    },
    'set-lyric-mapper': async (
      _,
      data: Partial<LyricMapper>,
      useFallback: boolean = true,
    ) => {
      await this.overridePlugin(
        'lyric-mapper',
        (data) => {
          lyricMapper.set(data, useFallback);
        },
        data,
      );
    },
    'get-lyric-mapper': () => lyricMapper.get(),
    'set-game-list': async (
      _,
      data: Partial<GameList>,
      useFallback: boolean = true,
    ) => {
      await this.overridePlugin(
        'game-list',
        (data) => {
          gameList.set(data, useFallback);
        },
        data,
      );
    },
    'get-game-list': () => gameList.get(),
    'set-theme': async (
      _,
      name: string,
      data: PartialDeep<StyleConfig> | null,
      useFallback: boolean = true,
    ) => {
      await this.overridePlugin(
        'set-theme',
        (data) => {
          themeList.set(
            {
              [name]: data ?? undefined,
            },
            useFallback,
          );
        },
        data,
      );
    },
    'get-theme-list': () => themeList.get(),

    'window-minimize': () => {
      this.overridePlugin('window-minimize', () => {
        BrowserWindow.getFocusedWindow()?.minimize();
      });
      this.broadcastPlugin('window-minimize');
    },
    'window-maximize': () => {
      const isMaximized =
        BrowserWindow.getFocusedWindow()?.isMaximized() ?? false;

      this.overridePlugin(
        'window-maximize',
        (isMaximized) => {
          if (isMaximized) BrowserWindow.getFocusedWindow()?.unmaximize();
          else BrowserWindow.getFocusedWindow()?.maximize();
        },
        isMaximized,
      );

      this.broadcastPlugin('window-maximize', !isMaximized);
    },
    'window-is-maximized': () =>
      !!BrowserWindow.getFocusedWindow()?.isMaximized(),
    'window-close': () => {
      this.overridePlugin('window-close', () => {
        BrowserWindow.getFocusedWindow()?.close();
      });
      this.broadcastPlugin('window-close');
    },
    'open-window': (
      _,
      target: 'lyrics' | 'settings' | 'tray',
      bounds?: Rectangle,
    ) => {
      if (target === 'lyrics') {
        if (
          this.lyricSearchWindowProvider &&
          !this.lyricSearchWindowProvider.window.isDestroyed()
        ) {
          if (this.lyricSearchWindowProvider.window.isMinimized())
            this.lyricSearchWindowProvider.window.restore();
          this.lyricSearchWindowProvider.window.show();
        } else {
          this.initLyricSearchWindow();
        }
      }
      if (target === 'settings') {
        if (
          this.settingWindowProvider &&
          !this.settingWindowProvider.window.isDestroyed()
        ) {
          if (this.settingWindowProvider.window.isMinimized())
            this.settingWindowProvider.window.restore();
          this.settingWindowProvider.window.show();
        } else {
          this.initSettingWindow();
        }
      }
      if (target === 'tray') {
        if (!this.trayWindowProvider) this.initTrayWindow();
        this.trayWindowProvider?.show(bounds ?? this.tray.getBounds());
      }
    },
    'open-devtool': (
      _,
      target: 'main' | 'lyrics' | 'settings' | 'tray',
      index: number = 0,
    ) => {
      if (target === 'main') {
        if (
          this.lyricWindowProviders &&
          !this.lyricWindowProviders[index].window.isDestroyed()
        ) {
          this.lyricWindowProviders[index].window.webContents.openDevTools({
            mode: 'detach',
          });
        }
      }
      if (target === 'lyrics') {
        if (
          this.lyricSearchWindowProvider &&
          !this.lyricSearchWindowProvider.window.isDestroyed()
        ) {
          this.lyricSearchWindowProvider.window.webContents.openDevTools({
            mode: 'detach',
          });
        }
      }
      if (target === 'settings') {
        if (
          this.settingWindowProvider &&
          !this.settingWindowProvider.window.isDestroyed()
        ) {
          this.settingWindowProvider.window.webContents.openDevTools({
            mode: 'detach',
          });
        }
      }
      if (target === 'tray') {
        if (
          this.trayWindowProvider &&
          !this.trayWindowProvider.window.isDestroyed()
        ) {
          this.trayWindowProvider.window.webContents.openDevTools({
            mode: 'detach',
          });
        }
      }
    },
    'get-plugin-list': () => pure(this.pluginManager.getPlugins()),
    'add-plugin': async (_, pluginPath: string) => {
      this.broadcastPlugin('before-add-plugin', pluginPath);

      let error: Error | null = null;
      await this.overridePlugin(
        'add-plugin',
        async (pluginPath) => {
          const result = await this.pluginManager.addPlugin(pluginPath);
          if (result instanceof Error) {
            error = result;
            return;
          }

          this.broadcastPlugin('add-plugin', result, result.path);
        },
        pluginPath,
      );

      return error as Error | null;
    },
    'get-plugin': (_, id: string) =>
      pure(this.pluginManager.getPlugins().find((it) => it.id === id)),
    'remove-plugin': (_, id: string) => {
      const target = this.pluginManager.getPlugins().find((it) => it.id === id);

      if (!target) return;

      this.broadcastPlugin('before-remove-plugin', target);
      this.overridePlugin(
        'remove-plugin',
        (target) => {
          this.pluginManager.removePlugin(target);
        },
        target,
      );
      this.broadcastPlugin('after-remove-plugin', target);

      config.set({ plugins: { list: { [id]: undefined } } });
    },
    'reload-plugin': async (_, id: string) => {
      const target = this.pluginManager.getPlugins().find((it) => it.id === id);
      if (!target) return;

      await this.overridePlugin(
        'reload-plugin',
        async (target) => {
          await this.pluginManager.reloadPlugin(target);
        },
        target,
      );
    },
    'set-plugin-state': async (_, id: string, state: 'disable' | 'enable') => {
      const target = this.pluginManager.getPlugins().find((it) => it.id === id);
      if (!target) return;

      await this.overridePlugin(
        'change-plugin-state',
        async (target, state) => {
          await this.pluginManager.setPluginState(target.id, state);
        },
        target,
        state,
      );

      this.broadcastPlugin('change-plugin-state', target, state);
    },
    'broadcast-plugin': (_, event: keyof PluginEventMap, ...args) => {
      this.broadcastPlugin(
        event,
        ...(args as Parameters<PluginEventMap[typeof event]>),
      );
    },
    'override-plugin': (_, target: keyof OverrideMap, ...args) => {
      return new Promise((resolve) => {
        let isResolved = false;

        (async () => {
          await this.overridePlugin(
            target,
            (...provided) => {
              isResolved = true;
              resolve(provided);
            },
            ...(args as never),
          );

          if (!isResolved) resolve(false);
        })();
      });
    },

    'get-all-source-providers': () =>
      this.getAllSourceProviders().map((it) => ({
        name: it.name,
        options: it.getOptions(config.get().language),
      })),
    'get-current-source-provider-state': () =>
      this.sourceProvider.isRunning() ? 'start' : 'close',
    'restart-source-provider': () => {
      if (!this.sourceProvider) this.initSourceProvider();
      else {
        if (this.sourceProvider.isRunning()) this.sourceProvider.close();
        this.sourceProvider.start(
          config.get().providers.source.config[this.sourceProvider.name],
        );
      }
    },

    'quit-application': () => {
      app.exit(0);
    },
    'restart-application': () => {
      app.relaunch();
      app.exit(0);
    },
    'update-window': (_, index: number = 0) => {
      this.lyricWindowProviders[index].updateWindowConfig();
    },

    'lyric-provider:get-all-lyric-providers': () =>
      this.getAllLyricProviders().map((it) => it.name),
    'lyric-provider:get-lyric': async (
      _,
      ...params: Parameters<LyricProvider['getLyric']>
    ) => this.lyricProvider.getLyric(...params),
    'lyric-provider:get-lyric-by-id': async (
      _,
      ...params: Parameters<LyricProvider['getLyricById']>
    ) => this.lyricProvider.getLyricById(...params),
    'lyric-provider:search-lyrics': async (
      _,
      ...params: Parameters<LyricProvider['searchLyrics']>
    ) => this.lyricProvider.searchLyrics(...params),
    'lyric-provider:get-options': (
      _,
      ...params: Parameters<LyricProvider['getOptions']>
    ) => this.lyricProvider.getOptions(...params),
    'lyric-provider:on-option-change': (
      _,
      ...params: Parameters<LyricProvider['onOptionChange']>
    ) => this.lyricProvider.onOptionChange(...params),
  } satisfies Record<
    string,
    (event: Electron.IpcMainInvokeEvent, ...args: never[]) => unknown
  >;

  constructor(overlayManager: OverlayManager) {
    this.overlayManager = overlayManager;
    this.overlayManager.setCorsCallback(this.setCorsHandler.bind(this));
    this.sourceProviders = [new TunaObsProvider(), new WebNowPlayingProvider()];
    this.lyricProviders = [new LrclibLyricProvider()];
  }

  get sourceProvider() {
    const providerName = config.get().sourceProvider;
    return (
      this.getAllSourceProviders().find((it) => it.name === providerName) ??
      this.sourceProviders[0]
    );
  }

  get lyricProvider() {
    const providerName = config.get().lyricProvider;
    return (
      this.getAllLyricProviders().find((it) => it.name === providerName) ??
      this.lyricProviders[0]
    );
  }

  initSourceProvider() {
    console.log(
      `[Lyrs] init source provider "${this.sourceProvider.name}"`,
    );
    this.sourceProvider.start(
      config.get().providers.source.config[this.sourceProvider.name],
    );

    this.sourceProvider.on('start', () => {
      this.broadcast('current-source-provider-state', 'start');
      this.tray.setImage(
        nativeImage.createFromPath(getFile('./assets/icon_square.png')).resize({
          width: 16,
          height: 16,
        }),
      );
    });
    this.sourceProvider.on('close', () => {
      this.broadcast('current-source-provider-state', 'close');
      this.tray.setImage(
        nativeImage.createFromPath(getFile('./assets/icon_error.png')).resize({
          width: 16,
          height: 16,
        }),
      );
    });
    this.sourceProvider.on('error', (err) => {
      this.broadcast('current-source-provider-state', 'error', err.toString());
      this.tray.setImage(
        nativeImage.createFromPath(getFile('./assets/icon_error.png')).resize({
          width: 16,
          height: 16,
        }),
      );
    });

    this.sourceProvider.on('update', (body) => {
      this.lastUpdate = body;
      this.overridePlugin(
        'update',
        (updateData) => {
          this.broadcast('update', updateData);
        },
        this.lastUpdate,
      );
    });
  }

  initPluginLoader() {
    console.log('[Lyrs] load all plugins');

    this.pluginManager = new PluginManager({
      config: () => config.get().plugins,
      folder: path.resolve(app.getPath('userData'), 'plugins'),
      set: (newConfig) => config.set({ plugins: newConfig }),
    });
    this.pluginManager.loadPredefinedPlugins().catch((e) => {
      console.error('[Lyrs] Cannot load predefined plugins', e);
    });
    this.pluginManager.loadPluginsFromConfig().catch((e) => {
      console.error('[Lyrs] Cannot load plugins', e);
    });
  }

  async initOverlay() {
    this.overlayManager.event.on('register-process', () => {
      this.broadcast(
        'registered-process-list',
        this.overlayManager.registeredProcessList,
      );
    });
    this.overlayManager.event.on('unregister-process', () => {
      this.broadcast(
        'registered-process-list',
        this.overlayManager.registeredProcessList,
      );
    });
    await this.overlayManager.startOverlay();

    gameList.watch(() => {
      this.overlayManager.updateGameView();
    });
  }

  initAutoUpdater() {
    if (!app.isPackaged) return;

    autoUpdater.autoDownload = false;
    autoUpdater.on('update-available', async (it: UpdateInfo) => {
      const downloadLink =
        'https://github.com/organization/lyrs/releases/latest';

      const language = config.get().language;
      const { response } = await dialog.showMessageBox({
        type: 'info',
        buttons: [
          getTranslation('common.cancel', language),
          getTranslation('updater.download-and-auto-install', language),
        ],
        title: `${getTranslation('updater.update-alert', language)} (${it.version})`,
        message: getTranslation('updater.update-available', language).replace(
          '{{version}}',
          it.version,
        ),
        detail: getTranslation('updater.download-at', language).replace(
          '{{link}}',
          downloadLink,
        ),
        defaultId: 1,
        cancelId: 0,
      });

      if (response === 1) {
        const downloadProgressBar = new ProgressBar({
          indeterminate: true,
          title: getTranslation('updater.popup.title', language),
          text: getTranslation('updater.popup.text', language),
        });

        await autoUpdater.downloadUpdate();

        app.removeAllListeners('window-all-closed');
        this.settingWindowProvider?.window.close();
        this.lyricSearchWindowProvider?.window.close();
        this.lyricWindowProviders.forEach((provider) => provider.close());

        autoUpdater.quitAndInstall(true, true);

        downloadProgressBar.close();
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
          if (
            this.lyricSearchWindowProvider &&
            !this.lyricSearchWindowProvider.window.isDestroyed()
          ) {
            if (this.lyricSearchWindowProvider.window.isMinimized())
              this.lyricSearchWindowProvider.window.restore();
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
          if (
            this.settingWindowProvider &&
            !this.settingWindowProvider.window.isDestroyed()
          ) {
            if (this.settingWindowProvider.window.isMinimized())
              this.settingWindowProvider.window.restore();
            this.settingWindowProvider.window.show();
          } else {
            this.initSettingWindow();
          }
        },
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
        },
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
            ...this.lyricWindowProviders.map((provider, index) => ({
              label: getTranslation(
                'tray.devtools.lyric-viewer.label',
                config.get().language,
              ).replace('{{index}}', `${index}`),
              click: () => {
                if (!provider.window.isDestroyed()) {
                  provider.window.webContents.openDevTools({ mode: 'detach' });
                }
              },
            })),
            {
              label: getTranslation(
                'tray.devtools.lyrics.label',
                config.get().language,
              ),
              click: () => {
                if (
                  this.lyricSearchWindowProvider &&
                  !this.lyricSearchWindowProvider.window.isDestroyed()
                ) {
                  this.lyricSearchWindowProvider.window.webContents.openDevTools(
                    { mode: 'detach' },
                  );
                }
              },
            },
            {
              label: getTranslation(
                'tray.devtools.setting.label',
                config.get().language,
              ),
              click: () => {
                if (
                  this.settingWindowProvider &&
                  !this.settingWindowProvider.window.isDestroyed()
                ) {
                  this.settingWindowProvider.window.webContents.openDevTools({
                    mode: 'detach',
                  });
                }
              },
            },
            {
              label: getTranslation(
                'tray.devtools.tray.label',
                config.get().language,
              ),
              click: () => {
                if (
                  this.trayWindowProvider &&
                  !this.trayWindowProvider.window.isDestroyed()
                ) {
                  this.trayWindowProvider.window.webContents.openDevTools({
                    mode: 'detach',
                  });
                }
              },
            },
          ],
        },
      );
    }

    this.contextMenu = Menu.buildFromTemplate(menu);
  }

  initTray() {
    const trayIcon = nativeImage.createFromPath(
      getFile('./assets/icon_error.png'),
    );

    this.tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
    this.initMenu();

    this.tray.setToolTip('Lyrs');
    if (!isMacOS()) this.tray.setContextMenu(this.contextMenu);

    this.tray.on('click', (_, bounds) => {
      this.tray.closeContextMenu();

      if (this.trayWindowProvider?.window.isFocused()) {
        this.trayWindowProvider?.window?.blur();
      } else {
        if (!this.trayWindowProvider) this.initTrayWindow();

        this.trayWindowProvider?.show(bounds);
      }
    });
    if (isMacOS()) {
      this.tray.on('right-click', (_, bounds) => {
        if (!this.contextMenu) return;

        this.tray.popUpContextMenu(this.contextMenu, bounds);
      });
    }

    let lastValue = config.get().developer;
    config.watch((config) => {
      if (lastValue !== config.developer) {
        this.initMenu();
        if (!isMacOS()) this.tray.setContextMenu(this.contextMenu);

        lastValue = config.developer;
      }
    });
  }

  async overridePlugin<Target extends keyof OverrideMap>(
    target: Target,
    originalFn: (...args: OverrideParameterMap[Target]) => Promise<void> | void,
    ...args: OverrideParameterMap[Target]
  ): Promise<void> {
    const overrideFnList = this.pluginManager
      .getPlugins()
      .flatMap((plugin) =>
        plugin.state === 'enable' ? (plugin.js.overrides[target] ?? []) : [],
      );

    await Promise.all(
      overrideFnList.map(async (overrideFn, index) => {
        const fn = (
          index === overrideFnList.length - 1 ? originalFn : async () => {}
        ) as (...args: OverrideParameterMap[Target]) => Promise<void>;

        await overrideFn(fn, ...args);
      }),
    );

    if (overrideFnList.length === 0) {
      await originalFn(...args);
    }
  }

  broadcast<T>(event: string, ...args: T[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    this.broadcastPlugin(event as keyof PluginEventMap, ...(args as any));

    this.lyricWindowProviders.forEach((it) => {
      if (it.window.isDestroyed()) return;

      it.window.webContents.send(event, ...args);
    });
    this.overlayManager.broadcast(event, ...args);
    if (
      this.lyricSearchWindowProvider &&
      !this.lyricSearchWindowProvider.window.isDestroyed()
    )
      this.lyricSearchWindowProvider.window.webContents.send(event, ...args);
    if (
      this.settingWindowProvider &&
      !this.settingWindowProvider.window.isDestroyed()
    )
      this.settingWindowProvider.window.webContents.send(event, ...args);
    if (
      this.trayWindowProvider &&
      !this.trayWindowProvider.window.isDestroyed()
    )
      this.trayWindowProvider.window.webContents.send(event, ...args);
  }

  broadcastPlugin<T extends keyof PluginEventMap>(
    event: T,
    ...args: Parameters<PluginEventMap[T]>
  ) {
    this.pluginManager.broadcast(event, ...args);
  }

  getAllSourceProviders() {
    return [
      ...this.sourceProviders,
      ...this.pluginManager
        .getPlugins()
        .flatMap((it) => it.js.providers.source),
    ];
  }

  getAllLyricProviders() {
    return [
      ...this.lyricProviders,
      ...this.pluginManager.getPlugins().flatMap((it) => it.js.providers.lyric),
    ];
  }

  initHook() {
    let lastConfig = config.get();

    config.watch((config) => {
      this.broadcast('config', config);

      if (lastConfig.streamingMode !== config.streamingMode) {
        this.lyricWindowProviders.forEach((it) => it.updateWindowConfig());
      }

      if (lastConfig.sourceProvider !== config.sourceProvider) {
        const notExist = !this.getAllSourceProviders().some(
          (it) => it.name === config.sourceProvider,
        );
        if (notExist) {
          console.log(
            `[Lyrs] Source provider "${config.sourceProvider}" is not exist`,
          );
          return;
        }

        const oldProvider = this.getAllSourceProviders().find(
          (it) => it.name === lastConfig.sourceProvider,
        );
        oldProvider?.close();

        this.initSourceProvider();
      }

      if (
        lastConfig.providers.source.config !== config.providers.source.config
      ) {
        this.sourceProvider.onOptionChange(
          config.providers.source.config[this.sourceProvider.name],
        );
      }

      lastConfig = config;
    });
    lyricMapper.watch((lyricMapper) => {
      this.broadcast('lyric-mapper', lyricMapper);
    });
    gameList.watch((gameList) => {
      this.broadcast('game-list', gameList);
    });
    themeList.watch((themeList) => {
      this.broadcast('theme-list', themeList);
    });

    Object.entries(this.handleMap).forEach(([event, handler]) => {
      ipcMain.handle(
        event,
        handler as (event: Electron.IpcMainInvokeEvent) => unknown,
      );
    });

    Object.entries(this.onMap).forEach(([event, handler]) => {
      ipcMain.on(event, handler as (event: Electron.IpcMainEvent) => unknown);
    });
  }

  initMainWindow() {
    const updateMainWindow = (config: Config) => {
      let isChanged = false;

      if (config.views.length < this.lyricWindowProviders.length) {
        isChanged = true;
        this.lyricWindowProviders.forEach((it, index) => {
          if (it.window.isDestroyed()) return;
          if (index >= config.views.length) it.close();
        });
      }

      if (config.views.length > this.lyricWindowProviders.length) {
        isChanged = true;
        for (
          let i = this.lyricWindowProviders.length;
          i < config.views.length;
          i++
        ) {
          this.lyricWindowProviders[i] = new LyricWindowProvider(i);
          this.setCorsHandler(this.lyricWindowProviders[i].window.webContents);

          this.lyricWindowProviders[i].window.show();
        }
      }

      if (isChanged) {
        this.initMenu();
        if (!isMacOS()) this.tray.setContextMenu(this.contextMenu);
      }
    };

    updateMainWindow(config.get());
    config.watch(updateMainWindow);
  }

  initTrayWindow() {
    this.trayWindowProvider = new TrayWindowProvider();

    this.trayWindowProvider?.window.on('blur', () => {
      if (this.trayWindowProvider?.isShowing) return;

      this.trayWindowProvider?.window.hide();
    });
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
    webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
      const provider = this.lyricProvider;

      if (provider && provider.onBeforeSendHeaders) {
        const result = provider.onBeforeSendHeaders(details);

        callback(result);
        return;
      }

      callback(details);
    });
    webContents.session.webRequest.onHeadersReceived((details, callback) => {
      const provider = this.lyricProvider;

      if (provider && provider.onHeadersReceived) {
        const result = provider.onHeadersReceived(details);

        callback(result);
        return;
      }

      callback(details);
    });
  }
}

export default Application;
