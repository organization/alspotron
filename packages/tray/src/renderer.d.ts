import type fs from 'fs';

import type { ipcRenderer as electronIpcRenderer } from 'electron';
import type { getFonts } from 'font-list';
import type hmc from 'hmc-win32';

declare global {
  interface Window {
    ipcRenderer: Omit<typeof electronIpcRenderer, 'invoke' | 'send'> & {
      invoke: <T extends keyof IpcHandleMap>(channel: T, ...args: IpcHandleMap[T][0]) => Promise<IpcHandleMap[T][1]>;
      send: <T extends keyof IpcOnMap>(channel: T, ...args: IpcOnMap[T][0]) => void;
    };
    fs: typeof fs;
    getFont: typeof getFonts;
    isWindows: boolean;
    /**
     * It is always defined because it is only used on Windows.
     */
    systemRoot: string;
    hmc: typeof hmc;
  }
}
