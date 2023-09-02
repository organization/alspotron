/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/ch99q/vite-solid-electron/blob/master/packages/preload/index.ts

import fs from 'fs';

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { getFonts } from 'font-list';
import { hmc } from 'hmc-win32';

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
contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.once(channel, listener),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, args),
  removeListener: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.removeListener(channel, listener),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  invoke: async (channel: string, ...args: any[]): Promise<any> => ipcRenderer.invoke(channel, ...args),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  sendSync: (channel: string, ...args: any[]): any => ipcRenderer.sendSync(channel, ...args),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  sendToHost: (channel: string, ...args: any[]) => ipcRenderer.sendToHost(channel, ...args),
});
contextBridge.exposeInMainWorld('isWindows', process.platform === 'win32');
contextBridge.exposeInMainWorld('systemRoot', process.env.SystemRoot);
contextBridge.exposeInMainWorld('hmc', hmc);
