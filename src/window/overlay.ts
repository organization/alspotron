import { screen } from 'electron';

import { LyricWindowProvider } from './lyric';

export class OverlayWindowProvider extends LyricWindowProvider {
  private readonly nodeWindowManager: typeof import('node-window-manager');

  private pid = 0;

  constructor(nodeWindowManager: typeof import('node-window-manager')) {
    super(0, {
      webPreferences: {
        offscreen: true,
      },
    });

    this.nodeWindowManager = nodeWindowManager;

    this.updateWindowConfig();
  }

  setAttachedProcess(pid: number) {
    this.pid = pid;
  }

  override updateWindowConfig() {
    super.updateWindowConfig();
  }

  override getDisplayBounds() {
    if (this.nodeWindowManager) {
      const bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
      const windowManager = this.nodeWindowManager.windowManager;
      const window = windowManager.getWindows().find((window) => window.processId === this.pid);
      const windowBounds = window?.getBounds();

      if (typeof windowBounds?.x === 'number') bounds.x = 0; //windowBounds.x;
      if (typeof windowBounds?.y === 'number') bounds.y = 0; // windowBounds.y;
      if (typeof windowBounds?.width === 'number') bounds.width = windowBounds.width - 16; // MAGIC VALUE
      if (typeof windowBounds?.height === 'number') bounds.height = windowBounds.height - 39; // MAGIC VALUE

      const isFullscreen = (windowBounds?.width ?? 0) <= 10 || (windowBounds?.height ?? 0) <= 10 || (
        windowBounds?.width === screen.getPrimaryDisplay().bounds.width
        && windowBounds?.height === screen.getPrimaryDisplay().bounds.height
      );

      if (!windowBounds || isFullscreen || bounds.width <= 0 || bounds.height <= 0) {
        const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
        bounds.x = display.bounds.x;
        bounds.y = display.bounds.y;
        bounds.width = display.bounds.width;
        bounds.height = display.bounds.height;
      }

      return bounds;
    }
    
    return super.getDisplayBounds();
  }
}
