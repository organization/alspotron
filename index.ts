import { app } from 'electron';

import Application from './src/Application';

const application = new Application();

(async () => {
  await app.whenReady();

  application.initAutoUpdater();
  application.initTray();
  application.initServer();
  application.initHook();

  application.initMainWindow();

  application.mainWindow.show();
  application.injectOverlay();

  console.log('[Alspotron] App is ready');
})();
