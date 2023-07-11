// https://github.com/ch99q/vite-solid-electron/blob/master/packages/preload/index.ts

import { contextBridge, ipcRenderer } from 'electron';
import { getFonts } from 'font-list';
import { hmc } from 'hmc-win32';
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
contextBridge.exposeInMainWorld('isWindows', process.platform === 'win32');
contextBridge.exposeInMainWorld('systemRoot', process.env.SystemRoot);
contextBridge.exposeInMainWorld('hmc', withPrototype(hmc));
