// https://github.com/ch99q/vite-solid-electron/blob/master/packages/preload/index.ts

import fs from 'fs';
import { contextBridge, ipcRenderer } from 'electron';
import { getFonts } from 'font-list';

const withPrototype = (obj: Record<string, any>) => {
  const protos = Object.getPrototypeOf(obj);

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (typeof value === 'function') {
      obj[key] = function (...args: any) {
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
