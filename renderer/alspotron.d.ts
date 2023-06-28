import { ipcRenderer as electronIpcRenderer } from 'electron';
import fs from 'fs';

declare global {
  interface Window {
    ipcRenderer: typeof electronIpcRenderer;
    fs: typeof fs;
  }
}
