// eslint-disable-next-line import/no-unresolved
import { Titlebar, TitlebarColor } from 'custom-electron-titlebar';
import { contextBridge, ipcRenderer } from 'electron';
import { getFonts } from 'font-list';
import fs from 'fs';

const withPrototype = (obj: Record<string, any>) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const protos = Object.getPrototypeOf(obj);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (typeof value === 'function') {
      obj[key] = function (...args: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-argument
        return value.call(obj, ...args);
      }
    } else {
      obj[key] = value;
    }
  }

  return obj;
};

contextBridge.exposeInMainWorld('fs', fs);
contextBridge.exposeInMainWorld('getFont', getFonts);
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer));
window.addEventListener('DOMContentLoaded', () => {
  // Title bar implementation
  new Titlebar({
    shadow: false,
    tooltips: {},
  }).updateBackground(TitlebarColor.TRANSPARENT);
});
