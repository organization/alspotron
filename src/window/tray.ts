import path from 'node:path';

import { MicaBrowserWindow } from 'mica-electron';

import { app, shell, type Rectangle, screen } from 'electron';

import type { GlasstronOptions } from 'glasstron';

import type { WindowProvider } from './types';
import { PlatformBrowserWindow } from './platform-browser-window';

import { getFile } from '../../utils/resource';
import { getTranslation } from '../../common/intl';
import { config } from '../config';
import { isWin32, isXfce } from '../../utils/is';

const glassOptions: Partial<GlasstronOptions> = {
  blur: true,
  blurType: isWin32() ? 'acrylic' : 'blurbehind',
  blurGnomeSigma: 100,
  blurCornerRadius: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};
const micaOptions = {
  show: false,
};
const iconPath = getFile('./assets/icon_square.png');

export class TrayWindowProvider implements WindowProvider {
  public window: Electron.BrowserWindow;

  private WIDTH = 250;
  private HEIGHT = 400;

  private _isShowing = false;

  constructor() {
    this.window = new PlatformBrowserWindow({
      ...(isXfce() ? {} : glassOptions),
      ...micaOptions,
      width: this.WIDTH,
      height: this.HEIGHT,
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js'),
        nodeIntegration: true,
      },
      movable: false,
      resizable: true,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      title: getTranslation('title.tray', config.get().language),
      frame: false,
      skipTaskbar: true,
      transparent: !isXfce(),
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });
    this.window.setSize(this.WIDTH, this.HEIGHT);

    if (this.window instanceof MicaBrowserWindow) {
      this.window.setAutoTheme();
      this.window.setMicaAcrylicEffect();
    }

    this.window.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);

      return { action: 'deny' };
    });

    if (app.isPackaged && !process.env.FARM_TRAY_DEV_SERVER_URL) {
      this.window.loadFile(path.join(__dirname, '../tray.html'));
    } else {
      this.window.loadURL(`${process.env.FARM_TRAY_DEV_SERVER_URL}/index.html`);
    }
  }

  public show(rectangle: Rectangle) {
    this._isShowing = true;

    const screenBounds = screen.getPrimaryDisplay().bounds;
    const width = this.WIDTH;
    const height = this.HEIGHT;
    const x = rectangle.x + width > screenBounds.width ? rectangle.x + rectangle.width - width : rectangle.x;
    const y = rectangle.y + height > screenBounds.height ? rectangle.y - height : rectangle.y + rectangle.height;

    this.window.show();
    this.window.setBounds({ x, y, width, height }, false);

    setTimeout(() => {
      this.window.setBounds({ x, y, width, height }, false);
      this._isShowing = false;
    }, 16 * 5);
  }

  public get isShowing() {
    return this._isShowing;
  }
}
