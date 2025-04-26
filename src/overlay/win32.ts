import { defaultDllDir, length, Overlay, percent } from 'asdf-overlay-node';
import { PercentLength } from 'asdf-overlay-node/lib/addon';
import { NativeImage, TextureInfo } from 'electron';
import EventEmitter from 'events';
import hmc from 'hmc-win32';

import { AttachedOverlay, OverlayFactory } from '.';
import { LyricWindowProvider } from '../window/lyric';
import { config, themeList } from '../config';
import { ProcMonitor, ProcMonitorEventEmitter } from './monitor';
import { DEFAULT_CONFIG, DEFAULT_STYLE, PRESET_PREFIX } from '../../common/constants';
import presetThemes from '../../common/presets';

export class Win32OverlayFactory implements OverlayFactory {
  private corsCallback: ((webContents: Electron.WebContents) => void) | undefined;

  applyCorsCallback(callback: (webContents: Electron.WebContents) => void): void {
    this.corsCallback = callback;
  }

  async create(pid: number, viewIndex: number): Promise<AttachedOverlay> {
    const overlay = await Overlay.attach(
      'alspotron-overlay',
      // electron asar path fix
      defaultDllDir().replace('app.asar', 'app.asar.unpacked'),
      pid,
      5000,
    );

    return await Win32AttachedOverlay.initialize(
      viewIndex,
      overlay,
      this.corsCallback,
    );
  }
}

class Win32AttachedOverlay implements AttachedOverlay {
  private readonly provider: LyricWindowProvider;
  private readonly configWatcher: () => void;

  private constructor(
    private viewIndex: number,
    private readonly overlay: Overlay,
    corsCallback?: (webContents: Electron.WebContents) => void,
  ) {
    this.provider = new LyricWindowProvider(viewIndex, {
      webPreferences: {
        offscreen: {
          useSharedTexture: true,
        },
      },
    });
    const webContents = this.provider.window.webContents;
      webContents.on('paint', (e, __, image: Electron.NativeImage) => {
        this.updateSurface(image, e.texture?.textureInfo).finally(() => {
          e.texture?.release();
        });
      });
    webContents.invalidate();
    corsCallback?.(this.provider.window.webContents);

    this.configWatcher = () => {
      this.updatePosition();
      this.provider.updateWindowConfig();
    };

    config.watch(this.configWatcher);
  }

  async updateViewIndex(index: number) {
    this.viewIndex = index;
    this.provider.setIndex(index, true);
    await this.updatePosition();
  }

  private async updatePosition() {
    const view = config.get().views[this.viewIndex] ?? DEFAULT_CONFIG.views[0].position;
    const position = view.position;
    const themes = themeList.get();
    let style;
    if (view.theme.startsWith(PRESET_PREFIX)) {
      const name = view.theme.replace(PRESET_PREFIX, '');
      style = presetThemes[name] ?? DEFAULT_STYLE;
    } else {
      style = themes[view.theme] ?? DEFAULT_STYLE;
    }

    let anchor: [PercentLength, PercentLength];
    switch (position.anchor) {
      case 'left': {
        anchor = [percent(0), percent(0.5)];
        break;
      }

      case 'right': {
        anchor = [percent(1), percent(0.5)];
        break;
      }

      case 'top': {
        anchor = [percent(0.5), percent(0)];
        break;
      }

      case 'top-left': {
        anchor = [percent(0), percent(0)];
        break;
      }

      case 'top-right': {
        anchor = [percent(1), percent(0)];
        break;
      }

      case 'center': {
        anchor = [percent(0.5), percent(0.5)];
        break;
      }

      case 'bottom': {
        anchor = [percent(0.5), percent(1)];
        break;
      }

      case 'bottom-left': {
        anchor = [percent(0), percent(1)];
        break;
      }

      case 'bottom-right':
      default: {
        anchor = [percent(1), percent(1)];
        break;
      }
    }

    try {
      await this.overlay.setPosition(anchor[0], anchor[1]);
      await this.overlay.setAnchor(anchor[0], anchor[1]);
      await this.overlay.setMargin(
        length(position.top + style.position.top),
        length(position.right + style.position.right),
        length(position.bottom + style.position.bottom),
        length(position.left + style.position.left),
      );
    } catch (e) {
      console.error('[Alspotron] error while updating overlay position', e);
    }
  }
  
  sendEvent(event: string, ...args: unknown[]) {
    this.provider.window.webContents.send(event, ...args);
  }

  private async updateSurface(
    bitmap: NativeImage,
    sharedTexture?: TextureInfo,
  ) {
    try {
      if (sharedTexture) {
        await this.overlay.updateShtex(sharedTexture.sharedTextureHandle);
        return true;
      }
    } catch (e) {
      console.warn('[Alspotron] failed update overlay using shared surface', e);
    }

    try {
      await this.overlay.updateBitmap(
        bitmap.getSize().width,
        bitmap.getBitmap(),
      );
    } catch (e) {
      console.error('[Alspotron] error while updating overlay', e);
      throw e;
    }
  }

  close(): void {
    config.unwatch(this.configWatcher);
    this.overlay.destroy();
    this.provider.close();
  }

  static async initialize(
    viewIndex: number,
    overlay: Overlay,
    corsCallback?: (webContents: Electron.WebContents) => void,
  ): Promise<Win32AttachedOverlay> {
    const instance = new Win32AttachedOverlay(viewIndex, overlay, corsCallback);

    try {
      await instance.updatePosition();
    } catch (e) {
      instance.close();
      throw e;
    }

    return instance;
  }
}

export async function getWin32Monitor(): Promise<ProcMonitor> {
  const wql = await import('@jellybrick/wql-process-monitor');
  const event: ProcMonitorEventEmitter = new EventEmitter();
  const listener = await wql.promises
    .subscribe({
      creation: true,
      deletion: true,
      filterWindowsNoise: true,
    });

  listener.on('creation', ([name, pid, filePath]) => {
    if (!filePath) return;

    event.emit('creation', Number(pid), name, filePath);
  });
  listener.on('deletion', ([name, pid]) => {
    event.emit('deletion', Number(pid), name);
  });

  return {
    event,
    getProcessList() {
      return hmc.getDetailsProcessList();
    },
    async close() {},
  };
}
