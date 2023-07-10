import { ipcRenderer as electronIpcRenderer } from 'electron';
import { getFonts } from 'font-list';
import fs from 'fs';
import hmc from 'hmc-win32';

declare global {
  interface Window {
    ipcRenderer: typeof electronIpcRenderer;
    fs: typeof fs;
    getFont: typeof getFonts;
    hmc: typeof hmc;
  }

  export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  } : T;
}
