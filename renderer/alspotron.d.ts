import { ipcRenderer as electronIpcRenderer } from 'electron';
import { getFonts } from 'font-list';
import fs from 'fs';

declare global {
  interface Window {
    ipcRenderer: typeof electronIpcRenderer;
    fs: typeof fs;
    getFont: typeof getFonts;
  }

  export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  } : T;
}
