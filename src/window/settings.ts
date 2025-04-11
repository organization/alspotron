import path from 'node:path';

import { MicaBrowserWindow } from 'mica-electron';
import { app, shell } from 'electron';

import type { GlasstronOptions } from 'glasstron';

import type { WindowProvider } from './types';
import { PlatformBrowserWindow } from './platform-browser-window';

import { config } from '../config';
import { getTranslation } from '../../common/intl';
import { getFile } from '../../utils/resource';
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

export class SettingWindowProvider implements WindowProvider {
  public window: Electron.BrowserWindow;

  constructor() {
    this.window = new PlatformBrowserWindow({
      ...(isXfce() ? {} : glassOptions),
      ...micaOptions,
      width: 1000,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js'),
        nodeIntegration: true,
      },
      title: getTranslation('title.setting', config.get().language),
      titleBarStyle: 'hiddenInset',
      frame: false,
      transparent: !isXfce(),
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this.window instanceof MicaBrowserWindow) {
      this.window.setAutoTheme();
      this.window.setMicaTabbedEffect();
    }

    this.window.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);

      return { action: 'deny' };
    });

    if (app.isPackaged && !process.env.FARM_SETTING_DEV_SERVER_URL) {
      this.window.loadFile(path.join(__dirname, '../settings.html'));
    } else {
      this.window.loadURL(`${process.env.FARM_SETTING_DEV_SERVER_URL}/index.html`);
    }
  }
}
