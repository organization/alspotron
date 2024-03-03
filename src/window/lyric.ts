import path from 'node:path';

import { EventEmitter } from 'events';

import { app, BrowserWindow, Menu, screen } from 'electron';

import { WindowProvider } from './types';

import { config, themeList } from '../config';
import { deepmerge } from '../../utils/merge';
import { DEFAULT_STYLE, PRESET_PREFIX } from '../../common/constants';
import { getFile } from '../../utils/resource';
import presetThemes from '../../common/presets';

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

export class LyricWindowProvider extends EventEmitter implements WindowProvider {
  protected onUpdateWindowConfig = () => this.updateWindowConfig();
  protected index: number;

  public window: BrowserWindow;

  constructor(index: number, options: Electron.BrowserWindowConstructorOptions = {}) {
    super();

    this.index = index;
    this.window = new BrowserWindow(deepmerge(LYRIC_WINDOW_OPTIONS, options, {
      focusable: config.get().streamingMode,
      skipTaskbar: !config.get().streamingMode,
    }));
    this.window.webContents.executeJavaScript(`window.index = ${index};`);

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

    screen.addListener('display-metrics-changed', this.onUpdateWindowConfig);
    screen.addListener('display-added', this.onUpdateWindowConfig);
    screen.addListener('display-removed', this.onUpdateWindowConfig);

    this.updateWindowConfig();

    config.watch(this.onUpdateWindowConfig);
  }

  close() {
    screen.removeListener('display-metrics-changed', this.onUpdateWindowConfig);
    screen.removeListener('display-added', this.onUpdateWindowConfig);
    screen.removeListener('display-removed', this.onUpdateWindowConfig);

    config.unwatch(this.onUpdateWindowConfig);

    this.window.close();
  }

  public updateWindowConfig() {
    const { views, streamingMode } = config.get();
    const selectedTheme = views[this.index]?.theme;
    const windowPosition = views[this.index]?.position;

    const style = (() => {
      const list = themeList.get();

      let result = list[selectedTheme ?? ''] ?? DEFAULT_STYLE;
      if (selectedTheme.startsWith(PRESET_PREFIX)) {
        const name = selectedTheme.replace(PRESET_PREFIX, '');
        result = presetThemes[name] ?? DEFAULT_STYLE;
      }

      return result;
    })();

    if (streamingMode) {
      this.window.setSkipTaskbar(false);
      this.window.setFocusable(true);
    } else {
      this.window.setSkipTaskbar(true);
      this.window.setFocusable(false);
    }

    const bounds = this.getDisplayBounds();
    const windowWidth = Math.min(Math.max(style.nowPlaying.maxWidth, style.lyric.maxWidth), bounds.width);
    const windowHeight = style.maxHeight;

    const anchorX = (() => {
      if (windowPosition.anchor.includes('left')) {
        return bounds.x + (windowPosition?.left ?? 0) + style.position.left;
      }

      if (windowPosition.anchor.includes('right')) {
        return bounds.x
          + (bounds.width - windowWidth)
          - (windowPosition?.right ?? 0) - style.position.right;
      }

      return bounds.x
        + ((bounds.width - windowWidth) / 2);
    })();

    const anchorY = (() => {
      if (windowPosition.anchor.includes('top')) {
        return bounds.y + (windowPosition?.top ?? 0) + style.position.top;
      }

      if (windowPosition.anchor.includes('bottom')) {
        return bounds.y
          + bounds.height - windowHeight
          - (windowPosition?.bottom ?? 0) - style.position.bottom;
      }

      return bounds.y
        + ((bounds.height - windowHeight) / 2);
    })();

    // electron issue: https://github.com/electron/electron/issues/16711#issuecomment-1311824063
    const resizable = this.window.isResizable();
    this.window.unmaximize();
    this.window.setResizable(true);
    this.window.setSize(windowWidth, windowHeight);
    this.window.setResizable(resizable);
    this.window.setPosition(Math.round(anchorX), Math.round(anchorY));
  }

  protected getDisplayBounds() {
    const { views } = config.get();
    const windowPosition = views[this.index]?.position;
    const display = screen.getAllDisplays().find((display) => display.id === windowPosition.display) ?? screen.getPrimaryDisplay();

    return display.bounds;
  }
}
