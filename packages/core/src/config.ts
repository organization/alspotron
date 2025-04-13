import { BrowserWindow, ipcMain } from 'electron/main';
import { Config } from '@electron-persist/core';
import { Config as AlspotronConfig, DefaultConfig } from '@alspotron/shared';

import { FilePersister } from './persister';

export const config = new Config<AlspotronConfig>({
  persister: new FilePersister({
    path: 'config.json',
  }),
  defaultValue: DefaultConfig,
});

export const registerConfig = <K extends string, T>(win: BrowserWindow, name: K, config: Config<T>) => {
  const windows: BrowserWindow[] = [win];

  ipcMain.handle(`get:${name}`, async (_, key) => config.get(key));
  ipcMain.handle(`set:${name}`, async (_, key, value) => config.set(key, value));

  config.watchAll((value) => {
    windows.forEach((win) => win.webContents.send(`set:${name}`, value));
  });

  return {
    addWindow: (win: BrowserWindow) => {
      windows.push(win);
    },
    removeWindow: (win: BrowserWindow) => {
      const index = windows.indexOf(win);
      if (index !== -1) {
        windows.splice(index, 1);
      }
    },
  };
};