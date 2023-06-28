import { app } from 'electron';

import Application from './src/Application';

const application = new Application();

(async () => {
  await app.whenReady();

  application.initTray();
  application.initServer();
  application.initHook();

  application.initMainWindow();

  application.mainWindow.show();

  console.log('[Alspotron] App is ready');
})();
