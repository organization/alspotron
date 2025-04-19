import path from 'node:path';

import { EventEmitter } from 'events';

import { app, NativeImage, TextureInfo } from 'electron';
import { hmc } from 'hmc-win32';
import { type Overlay } from 'asdf-overlay-node';

import { config, gameList } from './config';
import { IOverlay } from './electron-overlay';
import { OverlayWindowProvider } from './window';

import { isWin32 } from '../utils/is';

type IOverlay = typeof IOverlay;
let wql: typeof import('@jellybrick/wql-process-monitor') | undefined;
let nodeWindowManager: typeof import('node-window-manager') | undefined;

let asdfOverlay: typeof import('asdf-overlay-node') | undefined;

export class OverlayManager extends EventEmitter {
  private newOverlay: Overlay | null = null;
  private overlay: IOverlay | null = null;
  private provider: OverlayWindowProvider | null = null;
  private registeredProcesses: { pid: number; path: string }[] = [];
  private scaleFactor = 1.0;
  private markQuit = false;
  private applyCorsHeader:
    | ((webContents: Electron.WebContents) => void)
    | null = null;

  constructor() {
    super();

    if (isWin32()) {
      console.log('load wql process monitor');

      // HACK: import statement is not work because Electron's threading model is different from Windows COM's
      wql =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@jellybrick/wql-process-monitor') as typeof import('@jellybrick/wql-process-monitor');

      nodeWindowManager =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('node-window-manager') as typeof import('node-window-manager');

      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
      asdfOverlay = require('asdf-overlay-node');
    }

    this.init();
  }

  public setCorsHeader(callback: (webContents: Electron.WebContents) => void) {
    this.applyCorsHeader = callback;
  }

  public get windowProvider() {
    return this.provider;
  }

  public get registeredProcessList() {
    return this.registeredProcesses;
  }

  public injectOverlay() {
    if (!this.overlay) return;

    const windowList = this.overlay.getTopWindows(true);
    hmc
      .getDetailsProcessList()
      .filter(({ pid }) =>
        windowList.some((window) => window.processId === pid),
      )
      .forEach(({ pid, name, path }) => {
        this.onProcessCreation(pid, name, path);
      });
  }

  public startOverlay() {
    if (!nodeWindowManager) return false;

    this.provider = new OverlayWindowProvider(nodeWindowManager);
    this.applyCorsHeader?.(this.provider.window.webContents);
    this.addOverlayWindow('StatusBar', this.provider.window, 0, 0, true);
  }

  public stopOverlay() {
    this.markQuit = true;

    if (this.provider) {
      this.overlay?.closeWindow(this.provider.window.id);
      this.provider.close();
    }

    this.provider = null;
    this.overlay?.stop();
  }

  public async createProcess(pid: number, path: string): Promise<boolean> {
    if (!wql || !nodeWindowManager) return false;
    const windowManager = nodeWindowManager.windowManager;

    const tryInject = async (): Promise<boolean> => {
      const isInit = this.overlay
        ?.getTopWindows(true)
        .some((window) => window.processId === pid);
      if (!isInit || !this.overlay || !nodeWindowManager) {
        return false;
      }

      console.log('[Alspotron] try to inject process:', pid);

      let isFirstRun = false;
      if (this.registeredProcesses.length === 0) {
        const window = windowManager
          .getWindows()
          .find((window) => window.processId === pid);
        if (window) this.scaleFactor = window.getMonitor().getScaleFactor();

        this.provider = new OverlayWindowProvider(nodeWindowManager);
        this.applyCorsHeader?.(this.provider.window.webContents);
        this.overlay.start();
        isFirstRun = true;
      }

      for (const window of this.overlay.getTopWindows(true)) {
        if (
          window.processId !== pid ||
          this.registeredProcesses.some((it) => it.pid === pid)
        ) {
          continue;
        }

        if (asdfOverlay) {
          if (this.newOverlay) {
            this.newOverlay.destroy();
            this.newOverlay = null;
          }

          try {
            await this.injectAsdfOverlay(asdfOverlay, pid);
          } catch (e) {
            console.warn('[Alspotron] fallback to legacy overlay', e);
            this.overlay.injectProcess(window);
          }
        } else {
          this.overlay.injectProcess(window);
        }

        this.registeredProcesses.push({
          pid,
          path,
        });
        this.emit('register-process', pid);
        this.provider?.setAttachedProcess(this.registeredProcesses[0].pid);
        this.setGamePath(path);
      }

      if (this.provider && isFirstRun) {
        this.addOverlayWindow('StatusBar', this.provider.window, 0, 0, true);
      }

      return true;
    };

    for (let currentTry = 0; currentTry < 20; currentTry++) {
      if (await tryInject()) {
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.warn('[Alspotron] Failed to inject process.');
    return false;
  }

  private async injectAsdfOverlay(
    asdfOverlay: typeof import('asdf-overlay-node'),
    pid: number,
  ) {
    this.newOverlay = await asdfOverlay.Overlay.attach(
      'alspotron-overlay',
      // electron asar path fix
      asdfOverlay.defaultDllDir().replace('app.asar', 'app.asar.unpacked'),
      pid,
      1000,
    );

    try {
      await this.newOverlay.setPosition(
        asdfOverlay.percent(1.0),
        asdfOverlay.percent(1.0),
      );
      await this.newOverlay.setAnchor(
        asdfOverlay.percent(1.0),
        asdfOverlay.percent(1.0),
      );
    } catch (e) {
      this.newOverlay.destroy();
      this.newOverlay = null;

      throw e;
    }
  }

  public deleteProcess(pid: number) {
    const index = this.registeredProcesses.findIndex((it) => it.pid === pid);
    if (index >= 0) this.registeredProcesses.splice(index, 1);

    this.emit('unregister-process', pid, index >= 0);

    if (this.registeredProcesses.length <= 0) this.stopOverlay();
    else this.provider?.setAttachedProcess(this.registeredProcesses[0].pid);
  }

  public updateGameView() {
    if (this.registeredProcesses.length <= 0) return;

    this.setGamePath(this.registeredProcesses[0].path);
  }

  public setGamePath(path: string) {
    const list = gameList.get();
    const viewName = Object.keys(list).find((key) =>
      list[key].some((it) => it.path === path),
    );
    if (!viewName) return;

    const views = config.get().views;
    const index = views.findIndex((it) => it.name === viewName);
    console.log('[Alspotron] set game path:', path, index);

    this.provider?.setIndex(index, true);
  }

  private init() {
    if (!wql || !nodeWindowManager) return;

    wql.promises
      .subscribe({
        creation: true,
        deletion: true,
        filterWindowsNoise: true,
      })
      .then((listener) => {
        listener.on('creation', ([name, pid, filePath]) =>
          this.onProcessCreation(Number(pid), name, filePath),
        );
        listener.on('deletion', ([name, pid]) =>
          this.onProcessDeletion(Number(pid), name),
        );
      });

    const electronOverlayWithArch = `electron-overlay${process.arch === 'ia32' ? 'ia32' : ''}.node`;
    const module = { exports: {} };

    process.dlopen(
      module,
      app.isPackaged
        ? path.join(
            process.resourcesPath,
            `./assets/${electronOverlayWithArch}`,
          )
        : path.join(__dirname, '..', `./assets/${electronOverlayWithArch}`),
    );

    this.overlay = module.exports as IOverlay;

    this.injectOverlay();
  }

  private onProcessCreation(pid: number, _?: string, filePath?: string) {
    if (!wql || !nodeWindowManager) return;

    const gamePathList = Object.values(gameList.get() ?? {}).flat();

    if (
      typeof filePath === 'string' &&
      gamePathList.some((it) => it.path === filePath)
    ) {
      this.createProcess(pid, filePath);
    }
  }

  private onProcessDeletion(pid: number, _?: string) {
    this.deleteProcess(pid);
  }

  private async updateOverlaySurface(
    bitmap: NativeImage,
    sharedTexture?: TextureInfo,
  ): Promise<boolean> {
    if (!this.newOverlay) {
      return false;
    }

    try {
      try {
        if (sharedTexture) {
          await this.newOverlay.updateShtex(sharedTexture.sharedTextureHandle);
          return true;
        }
      } catch (e) {
        console.warn(
          '[Alspotron] failed update overlay using shared surface. ',
          e,
        );
      }

      await this.newOverlay.updateBitmap(
        bitmap.getSize().width,
        bitmap.getBitmap(),
      );
    } catch (e) {
      console.error('[Alspotron] error while updating overlay', e);
      this.newOverlay.destroy();
      this.newOverlay = null;
      throw e;
    }

    return true;
  }

  private addOverlayWindow(
    name: string,
    window: Electron.BrowserWindow,
    dragborder = 0,
    captionHeight = 0,
    transparent = false,
  ) {
    this.markQuit = false;

    const windowManager = nodeWindowManager?.windowManager;
    if (!windowManager || !this.overlay || !this.provider) return;

    this.overlay.addWindow(window.id, {
      name,
      transparent,
      resizable: true,
      maxWidth: window.getBounds().width * this.scaleFactor,
      maxHeight: window.getBounds().height * this.scaleFactor,
      minWidth: 100,
      minHeight: 100,
      nativeHandle: window.getNativeWindowHandle().readUInt32LE(0),
      rect: {
        x: Math.floor(window.getBounds().x * this.scaleFactor),
        y: Math.floor(window.getBounds().y * this.scaleFactor),
        width: Math.floor(window.getBounds().width * this.scaleFactor),
        height: Math.floor(window.getBounds().height * this.scaleFactor),
      },
      caption: {
        left: Math.floor(dragborder * this.scaleFactor),
        right: Math.floor(dragborder * this.scaleFactor),
        top: Math.floor(dragborder * this.scaleFactor),
        height: Math.floor(captionHeight * this.scaleFactor),
      },
      dragBorderWidth: Math.floor(dragborder),
    });

    window.webContents.on('paint', (e, __, image: Electron.NativeImage) => {
      if (this.markQuit || !this.overlay) return;

      const oldOverlay = this.overlay;
      (async () => {
        try {
          if (this.newOverlay) {
            await this.updateOverlaySurface(image, e.texture?.textureInfo);
          } else {
            oldOverlay.sendFrameBuffer(
              window.id,
              image.getBitmap(),
              image.getSize().width,
              image.getSize().height,
            );
          }
        } finally {
          e.texture?.release();
        }
      })();
    });

    let isFocused = false;
    let throttle: NodeJS.Timeout | null = null;
    const onUpdate = () => {
      const targetWindow = windowManager
        .getWindows()
        .find((window) => window.processId === this.registeredProcesses[0].pid);
      const newScaleFactor = targetWindow?.getMonitor().getScaleFactor();

      if (typeof newScaleFactor === 'number') this.scaleFactor = newScaleFactor;
      if (throttle !== null) clearTimeout(throttle);

      const windowBounds = window.getBounds();
      const bounds = {
        x: ~~(windowBounds.x * this.scaleFactor),
        y: ~~(windowBounds.y * this.scaleFactor),
        width: ~~(windowBounds.width * this.scaleFactor),
        height: ~~(windowBounds.height * this.scaleFactor),
      };

      this.overlay?.sendWindowBounds(window.id, { rect: bounds });
      this.provider?.updateWindowConfig();

      throttle = setTimeout(() => {
        if (!isFocused) return;

        const windowBounds = window.getBounds();
        const bounds = {
          x: ~~(windowBounds.x * this.scaleFactor),
          y: ~~(windowBounds.y * this.scaleFactor),
          width: ~~(windowBounds.width * this.scaleFactor),
          height: ~~(windowBounds.height * this.scaleFactor),
        };

        this.overlay?.sendWindowBounds(window.id, { rect: bounds });

        this.provider?.updateWindowConfig();
        throttle = null;
      }, 1000);
    };

    config.watch(onUpdate);
    onUpdate();

    const updateEvents = ['graphics.window.event.resize'];
    this.overlay.setEventCallback((event, params) => {
      if (this.markQuit || !this.overlay) return;

      if (event === 'graphics.window.event.focus') {
        isFocused = !!(params as Record<string, unknown>).focused;
      }

      if (updateEvents.includes(event)) {
        onUpdate();
      }
    });

    window.on('close', () => {
      config.unwatch(onUpdate);

      if (this.newOverlay) {
        this.newOverlay.destroy();
        this.newOverlay = null;
      }
    });

    window.webContents.on('cursor-changed', (_, type) => {
      if (this.markQuit || !this.overlay) return;

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
}
