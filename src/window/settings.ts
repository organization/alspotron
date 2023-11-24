import path from 'node:path';

import { IS_WINDOWS_11, MicaBrowserWindow } from 'mica-electron';
import { app, shell } from 'electron';

import { BrowserWindow as GlassBrowserWindow, GlasstronOptions } from 'glasstron';

import { config } from '../config';
import { getTranslation } from '../../common/intl';
import { getFile } from '../../utils/resource';

const PlatformBrowserWindow = process.platform === 'win32' && IS_WINDOWS_11 ? MicaBrowserWindow : GlassBrowserWindow;
const glassOptions: Partial<GlasstronOptions> = {
  blur: true,
  blurType: process.platform === 'win32' ? 'acrylic' : 'blurbehind',
  blurGnomeSigma: 100,
  blurCornerRadius: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};
const micaOptions = {
  show: false,
};
const iconPath = getFile('./assets/icon_square.png');

export class SettingWindow extends PlatformBrowserWindow {
  constructor() {
    super({
      ...glassOptions,
      ...micaOptions,
      width: 800,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      title: getTranslation('title.setting', config.get().language),
      titleBarStyle: 'hiddenInset',
      frame: false,
      transparent: true,
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this instanceof MicaBrowserWindow) {
      this.setAutoTheme();
      this.setMicaAcrylicEffect();
    }

    this.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);

      return { action: 'deny' };
    });

    if (app.isPackaged) {
      this.loadFile(path.join(__dirname, './settings.html'));
    } else {
      this.loadURL('http://localhost:5173/settings.html');
    }
  }
}