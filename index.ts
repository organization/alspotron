import path from 'node:path';

import { app, BrowserWindow } from 'electron';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://localhost:5173`;

    win.loadURL(url);
    win.webContents.openDevTools();

    console.log('load from url', url);
  }
};


(async () => {
  await app.whenReady();

  createWindow();
})();
