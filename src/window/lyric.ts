import path from 'node:path';

import { app, BrowserWindow, Menu, screen } from 'electron';

import { deepmerge } from 'deepmerge-ts';

import { WindowProvider } from './types';

import { config, themeList } from '../config';
import { DEFAULT_STYLE } from '../../common/constants';
import { getFile } from '../../utils/resource';

const iconPath = getFile('./assets/icon_square.png');
const LYRIC_WINDOW_OPTIONS = {
  width: 800,
  height: 600,
  movable: false,
  resizable: false,
  minimizable: false,
  maximizable: false,
  transparent: true,
  frame: false,
  alwaysOnTop: true,
  hasShadow: false,
  hiddenInMissionControl: true,
  roundedCorners: false,
  webPreferences: {
    preload: path.join(__dirname, './preload.js'),
    nodeIntegration: true,
  },
  show: false,
  icon: iconPath,
};

export class LyricWindowProvider implements WindowProvider {
  public window: BrowserWindow;

  constructor(options: Electron.BrowserWindowConstructorOptions = {}) {
    this.window = new BrowserWindow(deepmerge(LYRIC_WINDOW_OPTIONS, options, {
      focusable: config.get().streamingMode,
      skipTaskbar: !config.get().streamingMode,
    }));

    Menu.setApplicationMenu(null);

    this.window.setAlwaysOnTop(true, 'screen-saver', 1);
    this.window.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
    });
    this.window.setIgnoreMouseEvents(true, { forward: true });

    if (app.isPackaged) {
      this.window.loadFile(path.join(__dirname, './index.html'));
    } else {
      this.window.loadURL('http://localhost:5173');
    }

    screen.on('display-metrics-changed', this.updateWindowConfig.bind(this));
    screen.on('display-added', this.updateWindowConfig.bind(this));
    screen.on('display-removed', this.updateWindowConfig.bind(this));

    this.updateWindowConfig();

    config.watch(this.updateWindowConfig.bind(this));
  }

  close() {
    this.window.close();

    screen.removeListener('display-metrics-changed', this.updateWindowConfig.bind(this));
    screen.removeListener('display-added', this.updateWindowConfig.bind(this));
    screen.removeListener('display-removed', this.updateWindowConfig.bind(this));
  }

  public updateWindowConfig() {
    const {
      windowPosition,
      selectedTheme,
      streamingMode
    } = config.get();
    const style = themeList.get()[selectedTheme] ?? DEFAULT_STYLE;

    if (streamingMode) {
      this.window.setSkipTaskbar(false);
      this.window.setFocusable(true);
    } else {
      this.window.setSkipTaskbar(true);
      this.window.setFocusable(false);
    }

    const activeDisplay = this.getActiveDisplay();
    const windowWidth = Math.min(Math.max(style.nowPlaying.maxWidth, style.lyric.maxWidth), activeDisplay.bounds.width);
    const windowHeight = style.maxHeight;

    const anchorX = (() => {
      if (windowPosition.anchor.includes('left')) {
        return activeDisplay.bounds.x + (windowPosition?.left ?? 0);
      }

      if (windowPosition.anchor.includes('right')) {
        return activeDisplay.bounds.x
          + (activeDisplay.bounds.width - windowWidth)
          - (windowPosition?.right ?? 0);
      }

      return activeDisplay.bounds.x
        + ((activeDisplay.bounds.width - windowWidth) / 2);
    })();

    const anchorY = (() => {
      if (windowPosition.anchor.includes('top')) {
        return activeDisplay.bounds.y + (windowPosition?.top ?? 0);
      }

      if (windowPosition.anchor.includes('bottom')) {
        return activeDisplay.bounds.y
          + activeDisplay.bounds.height - windowHeight
          - (windowPosition?.bottom ?? 0);
      }

      return activeDisplay.bounds.y
        + ((activeDisplay.bounds.height - windowHeight) / 2);
    })();

    // electron issue: https://github.com/electron/electron/issues/16711#issuecomment-1311824063
    const resizable = this.window.isResizable();
    this.window.unmaximize();
    this.window.setResizable(true);
    this.window.setSize(windowWidth, windowHeight);
    this.window.setResizable(resizable);
    this.window.setPosition(Math.round(anchorX), Math.round(anchorY));
  }

  protected getActiveDisplay() {
    const { windowPosition } = config.get();

    return screen.getAllDisplays().find((display) => display.id === windowPosition.display) ?? screen.getPrimaryDisplay();
  }
}
