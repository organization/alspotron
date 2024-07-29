import path from 'node:path';

import { MicaBrowserWindow } from 'mica-electron';

import { app, shell, Rectangle, screen } from 'electron';

import { GlasstronOptions } from 'glasstron';

import { WindowProvider } from './types';
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

  constructor() {
    this.window = new PlatformBrowserWindow({
      ...(isXfce() ? {} : glassOptions),
      ...micaOptions,
      width: this.WIDTH,
      height: this.HEIGHT,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      movable: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      title: getTranslation('title.tray', config.get().language),
      titleBarStyle: 'hiddenInset',
      frame: false,
      skipTaskbar: true,
      transparent: !isXfce(),
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this.window instanceof MicaBrowserWindow) {
      this.window.setAutoTheme();
      this.window.setMicaAcrylicEffect();
    }

    this.window.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);

      return { action: 'deny' };
    });

    if (app.isPackaged) {
      this.window.loadFile(path.join(__dirname, './tray.html'));
    } else {
      this.window.loadURL('http://localhost:5173/tray.html');
    }
  }

  public show(rectangle: Rectangle) {
    const screenBounds = screen.getPrimaryDisplay().bounds;
    const x = rectangle.x + this.WIDTH > screenBounds.width ? rectangle.x + rectangle.width - this.WIDTH : rectangle.x;
    const y = rectangle.y + this.HEIGHT > screenBounds.height ? rectangle.y - this.HEIGHT : rectangle.y + rectangle.height;

    this.window.show();
    this.window.setResizable(true);
    this.window.setSize(this.WIDTH, this.HEIGHT);
    this.window.setResizable(false);
    this.window.setPosition(x, y);
    setTimeout(() => {
      this.window.setPosition(x, y);
    }, 16 * 5);
  }
}