import { EventEmitter } from 'events';

import { getProcMonitor, ProcMonitor } from './monitor';

import { config, gameList } from '../config';

export type OverlayProcessInfo = {
  pid: number;
  path: string;
};

/**
 * Inject overlay into process and returns created AttachedOverlay
 */
export interface OverlayFactory {
  applyCorsCallback(
    callback: (webContents: Electron.WebContents) => void,
  ): void;

  create(pid: number, viewIndex: number): Promise<AttachedOverlay>;
}

/**
 * Control interface for attached overlay window
 */
export interface AttachedOverlay {
  updateViewIndex(index: number): Promise<void>;

  sendEvent(event: string, ...args: unknown[]): void;

  close(): void;
}

type EventMap = {
  'register-process': [pid: number];
  'unregister-process': [pid: number];
};

/**
 * Manage overlays and monitor registered processes
 */
export class OverlayManager {
  readonly event: EventEmitter<EventMap> = new EventEmitter();

  public readonly registeredProcessList: OverlayProcessInfo[] = [];
  private attachedMap: Map<number, AttachedOverlay> = new Map();

  private enabled: boolean = false;

  constructor(
    private readonly factory: OverlayFactory,
    private readonly monitor: ProcMonitor,
  ) {
    monitor.event.on('creation', (pid, _, path) => {
      this.createRegisteredProcess(pid, path);
    });
    monitor.event.on('deletion', (pid) => {
      this.deleteProcess(pid);
    });
  }

  /**
   * Create overlay from the process
   * @param pid Process to create
   * @param path Process path
   * @param viewIndex Config view index to use
   * @returns true if overlay is attached
   */
  async createProcess(
    pid: number,
    path: string,
    viewIndex: number,
  ): Promise<boolean> {
    if (!this.enabled || this.attachedMap.has(pid)) return false;

    console.log('[Alspotron] try to inject process:', pid);

    // try injection 20 times with 1 seconds interval
    for (let attempts = 1; attempts <= 20; attempts++) {
      try {
        const attached = await this.factory.create(pid, viewIndex);
        this.attachedMap.set(pid, attached);
        this.registeredProcessList.push({ pid, path });

        this.event.emit('register-process', pid);
        return true;
      } catch (e) {
        console.warn(
          `[Alspotron] overlay injection failed. attempts: ${attempts}`,
          e,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.warn('[Alspotron] Failed to inject process.');
    return false;
  }

  async createRegisteredProcess(pid: number, path: string): Promise<boolean> {
    const views = config.get().views;
    const entries = gameList.get();
    const keys = Object.keys(entries);

    const viewName = keys.find((key) =>
      entries[key].some((it) => it.path === path),
    );
    if (!viewName) return false;

    const viewIndex = views.findIndex((it) => it.name === viewName);
    console.log('[Alspotron] set game path:', path, viewIndex);
    return await this.createProcess(pid, path, viewIndex);
  }

  setCorsCallback(callback: (webContents: Electron.WebContents) => void) {
    this.factory.applyCorsCallback(callback);
  }

  /**
   * Delete overlay from the process
   * @param pid Process to delete
   * @returns true if overlay is deleted
   */
  deleteProcess(pid: number): boolean {
    if (!this.enabled) return false;

    const index = this.registeredProcessList.findIndex((it) => it.pid === pid);
    if (index < 0) return false;

    this.registeredProcessList.splice(index, 1);
    this.event.emit('unregister-process', pid);

    const overlay = this.attachedMap.get(pid);
    if (overlay) {
      this.attachedMap.delete(pid);
      overlay.close();
    }
    return true;
  }

  /**
   * Attach to games that are not attached yet
   */
  async updateGameView() {
    const entries = gameList.get();
    const list = Object.values(entries).flat();

    const tasks = this.monitor
      .getProcessList()
      .filter(({ path, pid }) =>
        list.some(
          ({ path: gamePath }) =>
            gamePath === path && !this.attachedMap.has(pid),
        ),
      )
      .map(({ pid, path }) => {
        return this.createRegisteredProcess(pid, path);
      });
    await Promise.all(tasks);
  }

  /**
   * If not started, set started and inject overlays to detected game.
   */
  async startOverlay() {
    if (this.enabled) {
      return;
    }
    this.enabled = true;
    await this.updateGameView();
  }

  /**
   * If started, close all overlays and stop
   */
  stopOverlay() {
    if (!this.enabled) {
      return;
    }
    this.enabled = false;

    if (this.attachedMap.size == 0) {
      return;
    }

    this.attachedMap.entries().forEach(([pid, overlay]) => {
      try {
        overlay.close();
      } catch (e) {
        console.error(`[Alspotron] failed detach overlay of pid: ${pid}`, e);
      }
    });

    this.attachedMap.clear();
  }

  /**
   * Broadcast event to underlying overlay windows
   */
  broadcast(event: string, ...args: unknown[]) {
    for (const overlay of this.attachedMap.values()) {
      overlay.sendEvent(event, ...args);
    }
  }

  /**
   * Initialize OverlayManager2 using OverlayFactory suitable for target platform
   * @returns OverlayManager2
   */
  static async initialize(): Promise<OverlayManager> {
    let factory: OverlayFactory;
    switch (process.platform) {
      case 'win32': {
        const win32Module = await import('./win32');
        factory = new win32Module.Win32OverlayFactory();
        break;
      }

      // Create a dummy factory returning dummy AttachedOverlay
      default: {
        factory = {
          applyCorsCallback() {},
          create(_) {
            return Promise.resolve({
              async updateViewIndex() {},
              sendEvent() {},
              close() {},
            });
          },
        };
        break;
      }
    }

    return new OverlayManager(factory, await getProcMonitor());
  }
}
