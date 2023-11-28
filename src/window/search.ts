import path from 'node:path';

import { app } from 'electron';
import { IS_WINDOWS_11, MicaBrowserWindow } from 'mica-electron';

import { BrowserWindow as GlassBrowserWindow, GlasstronOptions } from 'glasstron';

import { WindowProvider } from './types';

import { getTranslation } from '../../common/intl';
import { config } from '../config';
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

export class LyricSearchWindowProvider implements WindowProvider {
  public window: Electron.BrowserWindow;

  constructor() {
    this.window = new PlatformBrowserWindow({
      ...glassOptions,
      ...micaOptions,
      width: 1000,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: true,
      },
      title: getTranslation('title.lyrics', config.get().language),
      titleBarStyle: 'hiddenInset',
      frame: false,
      transparent: true,
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this.window instanceof MicaBrowserWindow) {
      this.window.setAutoTheme();
      this.window.setMicaAcrylicEffect();
    }

    if (app.isPackaged) {
      this.window.loadFile(path.join(__dirname, './lyrics.html'));
    } else {
      this.window.loadURL('http://localhost:5173/lyrics.html');
    }
  }
}