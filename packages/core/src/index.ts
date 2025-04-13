import { TrayWindowProvider } from './window/tray.ts';
import { app } from 'electron';

const init = async () => {
  await app.whenReady();
  const tray = new TrayWindowProvider();
  tray.window.show();
  tray.window.webContents.openDevTools({ mode: 'detach' });
};
init().catch((error) => {
  console.error('Error initializing app:', error);
});
