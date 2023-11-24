import { screen } from 'electron';

import { LyricWindow } from './lyric';

import { getLyricProvider } from '../../common/provider';
import { config } from '../config';

export class OverlayWindow extends LyricWindow {
  private nodeWindowManager: typeof import('node-window-manager');

  private pid = 0;

  constructor(nodeWindowManager: typeof import('node-window-manager')) {
    super({
      webPreferences: {
        offscreen: true,
      },
    });

    this.nodeWindowManager = nodeWindowManager;

    this.webContents.session.webRequest.onBeforeSendHeaders(
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
    this.webContents.session.webRequest.onHeadersReceived((details, callback) => {
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

  setAttachedProcess(pid: number) {
    this.pid = pid;
  }

  override getActiveDisplay() {
    if (this.nodeWindowManager) {
      const windowManager = this.nodeWindowManager.windowManager;

      return screen.getDisplayNearestPoint(
        windowManager.getWindows().find((window) => window.processId == this.pid)?.getBounds() as Electron.Point ??
        screen.getCursorScreenPoint()
      );
    }
    
    return super.getActiveDisplay();
  }
}
