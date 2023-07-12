import fs from 'fs';

import { ipcRenderer as electronIpcRenderer } from 'electron';
import { getFonts } from 'font-list';
import hmc from 'hmc-win32';

declare global {
  interface Window {
    ipcRenderer: typeof electronIpcRenderer;
    fs: typeof fs;
    getFont: typeof getFonts;
    isWindows: boolean;
    /**
     * It is always defined because it is only used on Windows.
     */
    systemRoot: string;
    hmc: typeof hmc;
  }

  export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  } : T;
}
