import path from 'node:path';

import { EventEmitter } from 'events';

import { app, screen } from 'electron';
import { hmc } from 'hmc-win32';

import { gameList } from './config';
import { IOverlay } from './electron-overlay';
import { OverlayWindowProvider } from './window';

type IOverlay = typeof IOverlay;
let wql: typeof import('@jellybrick/wql-process-monitor') | undefined;
let nodeWindowManager: typeof import('node-window-manager') | undefined;

export class OverlayManager extends EventEmitter {
  private overlay: IOverlay | null = null;
  private provider: OverlayWindowProvider | null = null;
  private registeredPidList: number[] = [];
  private scaleFactor = 1.0;
  private markQuit = false;

  constructor() {
    super();

    if (process.platform === 'win32') {
      console.log('load wql process monitor');
      /* eslint-disable @typescript-eslint/no-var-requires */
      // HACK: import statement is not work because Electron's threading model is different from Windows COM's
      wql = require('@jellybrick/wql-process-monitor') as typeof import('@jellybrick/wql-process-monitor');
      nodeWindowManager = require('node-window-manager') as typeof import('node-window-manager');
      /* eslint-enable @typescript-eslint/no-var-requires */
    }

    this.init();
  }

  public get windowProvider() {
    return this.provider;
  }

  public get registeredProcessList() {
    return this.registeredPidList;
  }

  private init() {
    if (!wql || !nodeWindowManager) return;

    wql.promises.subscribe({
      creation: true,
      deletion: true,
      filterWindowsNoise: true,
    })
      .then((listener) => {
        listener.on('creation', ([name, pid, filePath]) => this.onProcessCreation(pid, name, filePath));
        listener.on('deletion', ([name, pid]) => this.onProcessDeletion(pid, name));
      });


    const electronOverlayWithArch = `electron-overlay${process.arch === 'ia32' ? 'ia32' : ''}.node`;
    const module = { exports: {} };

    process.dlopen(
      module,
      app.isPackaged ?
        path.join(process.resourcesPath, `./assets/${electronOverlayWithArch}`) :
        path.join(__dirname, '..', `./assets/${electronOverlayWithArch}`),
    );

    this.overlay = module.exports as IOverlay;

    const windowList = this.overlay.getTopWindows(true);
    hmc.getDetailsProcessList()
      .filter(({ pid }) => windowList.some((window) => window.processId === pid))
      .forEach(({ pid, name, path }) => {
        this.onProcessCreation(pid, name, path);
      });
  }

  public startOverlay() {
    if (!nodeWindowManager) return false;

    this.provider = new OverlayWindowProvider(nodeWindowManager);
    this.addOverlayWindow(
      'StatusBar',
      this.provider.window,
      0,
      0,
      true,
    );
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

  public async createProcess(pid: number) {
    if (!wql || !nodeWindowManager) return;
    const windowManager = nodeWindowManager.windowManager;

    return new Promise((resolve) => {
      let injectCount = 0;

      const interval = setInterval(() => {
        const isInit = this.overlay?.getTopWindows(true).some((window) => window.processId == pid);
        if (!isInit || !this.overlay || !nodeWindowManager) return;

        injectCount += 1;
        if (injectCount > 20) {
          clearInterval(interval);
          resolve(false);
          console.warn('[Alspotron] Failed to inject process.');
          return;
        }

        let isFirstRun = false;
        if (this.registeredPidList.length === 0) {
          const window = windowManager.getWindows().find((window) => window.processId == pid);
          if (window) this.scaleFactor = window.getMonitor().getScaleFactor();

          this.provider = new OverlayWindowProvider(nodeWindowManager);
          this.overlay.start();
          isFirstRun = true;
        }

        for (const window of this.overlay.getTopWindows(true)) {
          if (window.processId === pid) {
            this.overlay.injectProcess(window);

            this.registeredPidList.push(pid);
            this.emit('register-process', pid);
            this.provider?.setAttachedProcess(this.registeredPidList[0]);
          }
        }

        if (this.provider && isFirstRun) {
          this.addOverlayWindow(
            'StatusBar',
            this.provider.window,
            0,
            0,
            true,
          );
        }

        clearInterval(interval);
        resolve(true);
      }, 1000);
    });
  }

  public deleteProcess(pid: number) {
    const index = this.registeredPidList.findIndex((it) => it === Number(pid));
    if (index >= 0) this.registeredPidList.splice(index, 1);

    this.emit('unregister-process', pid, index >= 0);

    if (this.registeredPidList.length <= 0) this.stopOverlay();
    else this.provider?.setAttachedProcess(this.registeredPidList[0]);
  }

  private onProcessCreation(pid: number, _?: string, filePath?: string) {
    if (!wql || !nodeWindowManager) return;

    const gamePathList = Object.keys(gameList.get() ?? {});

    if (typeof filePath === 'string' && gamePathList.includes(filePath)) {
      this.createProcess(pid);
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
    transparent = false
  ) {
    this.markQuit = false;

    const windowManager = nodeWindowManager?.windowManager;
    if (!windowManager || !this.overlay) return;

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
      if (this.markQuit || !this.overlay) return;

      this.overlay.sendFrameBuffer(
        window.id,
        image.getBitmap(),
        image.getSize().width,
        image.getSize().height
      );
    });

    window.on('resize', () => {
      if (this.markQuit || !this.overlay) return;

      this.overlay.sendWindowBounds(window.id, {
        rect: {
          x: window.getBounds().x,
          y: window.getBounds().y,
          width: Math.floor(window.getBounds().width * this.scaleFactor),
          height: Math.floor(window.getBounds().height * this.scaleFactor),
        },
      });
    });

    window.on('closed', () => {
      this.overlay?.closeWindow(window.id);
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