import path from 'node:path';

import { app, BrowserWindow, Menu, screen } from 'electron';

import { deepmerge } from 'deepmerge-ts';

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
  focusable: false,
  alwaysOnTop: true,
  skipTaskbar: true,
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

export class LyricWindow extends BrowserWindow {
  constructor(options: Electron.BrowserWindowConstructorOptions = {}) {
    super(deepmerge(LYRIC_WINDOW_OPTIONS, options));

    Menu.setApplicationMenu(null);

    this.setAlwaysOnTop(true, 'screen-saver', 1);
    this.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
    });
    this.setIgnoreMouseEvents(true, { forward: true });

    if (app.isPackaged) {
      this.loadFile(path.join(__dirname, './index.html'));
    } else {
      this.loadURL('http://localhost:5173');
    }

    screen.on('display-metrics-changed', this.updateWindowConfig.bind(this));
    screen.on('display-added', this.updateWindowConfig.bind(this));
    screen.on('display-removed', this.updateWindowConfig.bind(this));

    this.updateWindowConfig();

    config.watch(this.updateWindowConfig.bind(this));
  }

  override close() {
    super.close();

    screen.removeListener('display-metrics-changed', this.updateWindowConfig.bind(this));
    screen.removeListener('display-added', this.updateWindowConfig.bind(this));
    screen.removeListener('display-removed', this.updateWindowConfig.bind(this));
  }

  public updateWindowConfig() {
    const {
      windowPosition,
      selectedTheme,
    } = config.get();
    const style = themeList.get()[selectedTheme] ?? DEFAULT_STYLE;

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
    const resizable = this.isResizable();
    this.unmaximize();
    this.setResizable(true);
    this.setSize(windowWidth, windowHeight);
    this.setResizable(resizable);
    this.setPosition(Math.round(anchorX), Math.round(anchorY));
  }

  protected getActiveDisplay() {
    const { windowPosition } = config.get();

    return screen.getAllDisplays().find((display) => display.id === windowPosition.display) ?? screen.getPrimaryDisplay();
  }
}
