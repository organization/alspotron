import { ipcRenderer as electronIpcRenderer } from 'electron';

declare global {
  interface Window {
    ipcRenderer: typeof electronIpcRenderer;
  }
}
