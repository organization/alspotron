import { app } from 'electron';

import Application from './src/Application';
import { waitConfigInit } from './src/config';

import { OverlayManager } from './src/overlay';

// set config resolver before configuration is done
const waitInit = waitConfigInit();

(async () => {
  const overlayManager = await OverlayManager.initialize();
  const application = new Application(overlayManager);
  await app.whenReady();
  await waitInit;

  application.initPluginLoader();

  application.initAutoUpdater();
  application.initTray();
  application.initSourceProvider();
  application.initHook();

  application.initMainWindow();
  application.initTrayWindow();
  application.initOverlay();

  console.log('[Alspotron] App is ready');
})();

// Auto type inference for IPC
type IpcParameters<T extends (...args: never) => unknown> =
  Parameters<T> extends [unknown, ...args: infer P] ? P : [];
declare global {
  export type IpcHandleMap = {
    [Event in keyof Application['handleMap']]: [
      IpcParameters<Application['handleMap'][Event]>,
      ReturnType<Application['handleMap'][Event]>,
    ];
  };
  export type IpcOnMap = {
    [Event in keyof Application['onMap']]: [
      IpcParameters<Application['onMap'][Event]>,
      ReturnType<Application['onMap'][Event]>,
    ];
  };
}
