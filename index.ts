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

  application.initAutoUpdater();
  application.initTray();
  application.initServer();
  application.initHook();

  application.initMainWindow();

  console.log('[Alspotron] App is ready');
})();
