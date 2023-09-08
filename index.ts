import { app } from 'electron';

import Application from './src/Application';
import { PluginInterface } from './common/plugin';

const application = new Application();

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
(globalThis as any).PluginInterface = PluginInterface;

(async () => {
  await app.whenReady();

  application.initPluginLoader();

  application.initAutoUpdater();
  application.initTray();
  application.initServer();
  application.initHook();

  application.initMainWindow();

  application.mainWindow.show();
  application.injectOverlay();

  console.log('[Alspotron] App is ready');
})();
