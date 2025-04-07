import path from 'node:path';

import { EventEmitter } from 'events';

import { app, BrowserWindow, Menu, screen } from 'electron';

import type { WindowProvider } from './types';

import { config, themeList } from '../config';
import { deepmerge } from '../../utils/merge';
import { DEFAULT_CONFIG, DEFAULT_STYLE, PRESET_PREFIX } from '../../common/constants';
import { getFile } from '../../utils/resource';
import presetThemes from '../../common/presets';
import { isMacOS, isWin32 } from '../../utils/is';

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
    preload: path.join(__dirname, '../preload/preload.js'),
    nodeIntegration: true,
  },
  show: false,
  icon: iconPath,
};

export class LyricWindowProvider extends EventEmitter implements WindowProvider {
  private alwaysOnTopFix: NodeJS.Timeout | null = null;
  private invisibleFix: NodeJS.Timeout | null = null;
  private invisibleCount = 5;

  protected onUpdateWindowConfig = () => this.updateWindowConfig();
  protected index: number;

  public window: BrowserWindow;

  constructor(index: number, options: Electron.BrowserWindowConstructorOptions = {}) {
    super();

    this.index = index;
    this.window = new BrowserWindow(
      deepmerge(LYRIC_WINDOW_OPTIONS, options, {
        focusable: config.get().streamingMode,
        skipTaskbar: !config.get().streamingMode,
      }),
    );
    this.window.webContents.executeJavaScript(`window.index = ${index};window.setIndex?.(${index});`);

    Menu.setApplicationMenu(null);

    this.window.setTitle(`Alspotron: ${config.get().views[index].name}`);
    if (isWin32()) this.window.setThumbnailClip(this.getWindowRect());
    this.window.setAlwaysOnTop(true, isMacOS() ? 'screen-saver' : 'main-menu', 1);
    this.window.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
    });
    this.window.setIgnoreMouseEvents(true, { forward: true });

    if (app.isPackaged && !process.env.FARM_DEV_SERVER_URL) {
      this.window.loadFile(path.join(__dirname, '../main.html'));
    } else {
      this.window.loadURL(`${process.env.FARM_DEV_SERVER_URL}/main.html`);
    }

    screen.addListener('display-metrics-changed', this.onUpdateWindowConfig);
    screen.addListener('display-added', this.onUpdateWindowConfig);
    screen.addListener('display-removed', this.onUpdateWindowConfig);

    // 특정 게임에서 크로미움 렌더러를 강제로 휴지시키는것으로 보임.
    // isAlwaysOnTop으로 감지하여 최대 5번까지 복구 시도
    // setAlwaysOnTop을 main-menu 위로 올리거나, interval안에서 설정할시 창에 포커스되니 주의
    this.invisibleFix = setInterval(() => {
      if (!this.window.isAlwaysOnTop()) {
        if (this.invisibleCount > 0) {
          this.window.show();
          this.invisibleCount -= 1;
        }
      } else {
        this.invisibleCount = 5;
      }
    }, 1000);

    // 바로 설정하면 몇가지 옵션이 설정되지 않음
    let count = 2;
    const initTimer = setInterval(() => {
      count -= 1;
      if (count > 0) this.updateWindowConfig();
      else clearInterval(initTimer);
    }, 500);

    config.watch(this.onUpdateWindowConfig);
  }

  setIndex(index: number, force = false) {
    this.index = index;
    this.window.webContents.executeJavaScript(
      `window.index = ${index};window.setIndex?.(${index});${force ? 'window.enabled = true' : ''}`,
    );
    this.updateWindowConfig();
  }

  close() {
    screen.removeListener('display-metrics-changed', this.onUpdateWindowConfig);
    screen.removeListener('display-added', this.onUpdateWindowConfig);
    screen.removeListener('display-removed', this.onUpdateWindowConfig);

    config.unwatch(this.onUpdateWindowConfig);

    if (this.alwaysOnTopFix !== null) {
      clearInterval(this.alwaysOnTopFix);
      this.alwaysOnTopFix = null;
    }
    if (this.invisibleFix !== null) {
      clearInterval(this.invisibleFix);
      this.invisibleFix = null;
      this.invisibleCount = 5;
    }

    this.window.close();
  }

  public updateWindowConfig() {
    const { views, streamingMode, experimental } = config.get();
    const view = views[this.index];

    this.window.setTitle(`Alspotron: ${view.name}`);

    if (streamingMode) {
      this.window.setSkipTaskbar(false);
      this.window.setFocusable(true);
    } else {
      this.window.setSkipTaskbar(true);
      this.window.setFocusable(false);
    }

    if (experimental.alwaysOnTopFix) {
      if (this.alwaysOnTopFix !== null) clearInterval(this.alwaysOnTopFix);
      this.alwaysOnTopFix = setInterval(() => {
        this.window.setAlwaysOnTop(true);
      }, 10000);
    }

    const windowRect = this.getWindowRect();

    // electron issue: https://github.com/electron/electron/issues/16711#issuecomment-1311824063
    const resizable = this.window.isResizable();
    this.window.unmaximize();
    this.window.setResizable(true);
    this.window.setSize(windowRect.width, windowRect.height);
    this.window.setResizable(resizable);
    this.window.setPosition(windowRect.x, windowRect.y);
    if (isWin32()) this.window.setThumbnailClip(windowRect);
  }

  private getStyle() {
    const { views } = config.get();
    const selectedTheme = views[this.index]?.theme;
    const list = themeList.get();

    let result = list[selectedTheme ?? ''] ?? DEFAULT_STYLE;
    if (selectedTheme?.startsWith(PRESET_PREFIX)) {
      const name = selectedTheme.replace(PRESET_PREFIX, '');
      result = presetThemes[name] ?? DEFAULT_STYLE;
    }

    return result;
  }

  private getWindowRect() {
    const { views } = config.get();

    const style = this.getStyle();
    const bounds = this.getDisplayBounds();
    const windowPosition = views[this.index]?.position ?? DEFAULT_CONFIG.views[0].position;

    const windowWidth = Math.min(Math.max(style.nowPlaying.maxWidth, style.lyric.maxWidth), bounds.width);
    const windowHeight = style.maxHeight;

    const anchorX = (() => {
      if (windowPosition.anchor.includes('left')) {
        return bounds.x + (windowPosition?.left ?? 0) + style.position.left;
      }

      if (windowPosition.anchor.includes('right')) {
        return bounds.x + (bounds.width - windowWidth) - (windowPosition?.right ?? 0) - style.position.right;
      }

      return bounds.x + (bounds.width - windowWidth) / 2;
    })();

    const anchorY = (() => {
      if (windowPosition.anchor.includes('top')) {
        return bounds.y + (windowPosition?.top ?? 0) + style.position.top;
      }

      if (windowPosition.anchor.includes('bottom')) {
        return bounds.y + bounds.height - windowHeight - (windowPosition?.bottom ?? 0) - style.position.bottom;
      }

      return bounds.y + (bounds.height - windowHeight) / 2;
    })();

    return {
      x: Math.round(anchorX),
      y: Math.round(anchorY),
      width: windowWidth,
      height: windowHeight,
    };
  }

  protected getDisplayBounds() {
    const { views } = config.get();
    const windowPosition = views[this.index]?.position;
    const display =
      screen.getAllDisplays().find((display) => display.id === windowPosition?.display) ?? screen.getPrimaryDisplay();

    return display.bounds;
  }
}
