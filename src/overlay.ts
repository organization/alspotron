import path from 'node:path';

import { EventEmitter } from 'events';

import { app } from 'electron';
import { hmc } from 'hmc-win32';

import { config, gameList } from './config';
import type { IOverlay } from './electron-overlay';
import { OverlayWindowProvider } from './window';

import { isWin32 } from '../utils/is';

type IOverlay = typeof IOverlay;
let wql: typeof import('@jellybrick/wql-process-monitor') | undefined;
let nodeWindowManager: typeof import('node-window-manager') | undefined;

export class OverlayManager extends EventEmitter {
  private overlay: IOverlay | null = null;
  private provider: OverlayWindowProvider | null = null;
  private registeredProcesses: { pid: number; path: string }[] = [];
  private scaleFactor = 1.0;
  private markQuit = false;
  private applyCorsHeader: ((webContents: Electron.WebContents) => void) | null = null;

  constructor() {
    super();

    if (isWin32()) {
      console.log('load wql process monitor');

      // HACK: import statement is not work because Electron's threading model is different from Windows COM's
      wql = require('@jellybrick/wql-process-monitor') as typeof import('@jellybrick/wql-process-monitor');
      nodeWindowManager = require('node-window-manager') as typeof import('node-window-manager');
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
      .filter(({ pid }) => windowList.some((window) => window.processId === pid))
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
    if (!wql || !nodeWindowManager) return Promise.resolve(false);
    const windowManager = nodeWindowManager.windowManager;

    return new Promise((resolve) => {
      let injectCount = 0;

      const tryToInject = () => {
        if (!this.overlay || !nodeWindowManager) return;
        const isInit = this.overlay.getTopWindows(true).some((window) => window.processId === pid);

        injectCount += 1;
        if (injectCount > 20) {
          resolve(false);
          console.warn('[Alspotron] Failed to inject process.');
          return;
        }

        if (!isInit) {
          setTimeout(tryToInject, 1000);
          return;
        }

        console.log('[Alspotron] try to inject process:', pid);
        let isFirstRun = false;
        if (this.registeredProcesses.length === 0) {
          const window = windowManager.getWindows().find((window) => window.processId === pid);
          if (window) this.scaleFactor = window.getMonitor().getScaleFactor();

          this.provider = new OverlayWindowProvider(nodeWindowManager);
          this.applyCorsHeader?.(this.provider.window.webContents);
          this.overlay.start();
          isFirstRun = true;
        }

        for (const window of this.overlay.getTopWindows(true)) {
          if (window.processId === pid && !this.registeredProcesses.some((it) => it.pid === pid)) {
            this.overlay.injectProcess(window);

            this.registeredProcesses.push({
              pid,
              path,
            });
            this.emit('register-process', pid);
            this.provider?.setAttachedProcess(this.registeredProcesses[0].pid);
            this.setGamePath(path);
          }
        }

        if (this.provider && isFirstRun) {
          this.addOverlayWindow('StatusBar', this.provider.window, 0, 0, true);
        }

        resolve(true);
      };

      tryToInject();
    });
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
    const viewName = Object.keys(list).find((key) => list[key].some((it) => it.path === path));
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
        listener.on('creation', ([name, pid, filePath]) => this.onProcessCreation(Number(pid), name, filePath));
        listener.on('deletion', ([name, pid]) => this.onProcessDeletion(Number(pid), name));
      });

    const electronOverlayWithArch = `electron-overlay${process.arch === 'ia32' ? 'ia32' : ''}.node`;
    const module = { exports: {} };

    process.dlopen(
      module,
      app.isPackaged
        ? path.join(process.resourcesPath, `./assets/${electronOverlayWithArch}`)
        : path.join(__dirname, '..', `../assets/${electronOverlayWithArch}`),
    );

    this.overlay = module.exports as IOverlay;

    this.injectOverlay();
  }

  private onProcessCreation(pid: number, _?: string, filePath?: string) {
    if (!wql || !nodeWindowManager) return;

    const gamePathList = Object.values(gameList.get() ?? {}).flat();

    if (typeof filePath === 'string' && gamePathList.some((it) => it.path === filePath)) {
      this.createProcess(pid, filePath);
    }
  }

  private onProcessDeletion(pid: number, _?: string) {
    this.deleteProcess(pid);
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

    window.webContents.on('paint', (_, __, image: Electron.NativeImage) => {
      if (this.markQuit || !this.overlay) return;

      this.overlay.sendFrameBuffer(window.id, image.getBitmap(), image.getSize().width, image.getSize().height);
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
