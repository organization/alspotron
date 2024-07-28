import { app } from 'electron';

import Application from './src/Application';
import { waitConfigInit } from './src/config';

import { OverlayManager } from './src/overlay';

const overlayManager = new OverlayManager();
// overlayManager.init();
const application = new Application(overlayManager);

(async () => {
  await app.whenReady();
  await waitConfigInit();

  application.initPluginLoader();

  application.initOverlay();
  application.initAutoUpdater();
  application.initTray();
  application.initServer();
  application.initHook();

  application.initMainWindow();
  application.initTrayWindow();
  overlayManager.injectOverlay();

  console.log('[Alspotron] App is ready');
})();

// Auto type inference for IPC
type IpcParameters<T extends (...args: never) => unknown> = Parameters<T> extends [unknown, ...args: infer P] ? P : [];
declare global {
  export type IpcHandleMap = {
    [Event in keyof typeof application.handleMap]: [IpcParameters<typeof application.handleMap[Event]>,ReturnType<typeof application.handleMap[Event]>];
  }
  export type IpcOnMap = {
    [Event in keyof typeof application.onMap]: [IpcParameters<typeof application.onMap[Event]>,ReturnType<typeof application.onMap[Event]>];
  }
}
