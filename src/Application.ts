import path from 'node:path';

import { app, BrowserWindow, Tray, Menu } from 'electron';

class Application {
  private tray: Tray;

  private mainWindow: BrowserWindow;
  private settingsWindow: BrowserWindow;
  private lyricsWindow: BrowserWindow;

  initTray() {
    this.tray = new Tray('assets/IconMusic.png');
    const contextMenu = Menu.buildFromTemplate([
      {
        type: 'normal',
        label: 'Lyrics',
      },
      {
        type: 'normal',
        label: 'Settings',
      },
      {
        type: 'separator',
      },
      {
        type: 'normal',
        label: 'quit',
        click() {
          app.quit();
        }
      },
    ]);

    this.tray.setToolTip('Alspotron 0.0.1');
    this.tray.setContextMenu(contextMenu);
  }

  initMainWindow() {
    this.mainWindow = new BrowserWindow({
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
      fullscreen: true,
      skipTaskbar: true,
      hasShadow: false,
      hiddenInMissionControl: true,
      roundedCorners: false,
    });
    this.mainWindow.setIgnoreMouseEvents(true, { forward: true });
  
    if (app.isPackaged) {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    } else {
      const url = `http://localhost:5173`;
  
      this.mainWindow.loadURL(url);
      this.mainWindow.webContents.openDevTools();
  
      console.log('load from url', url);
    }
  }
};

export default Application;
