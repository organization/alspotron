import { BrowserWindow } from 'electron';
import { MicaBrowserWindow } from 'mica-electron';
import { BrowserWindow as GlassBrowserWindow } from 'glasstron';

import { Platform } from '@alspotron/shared/main'

export const PlatformBrowserWindow = Platform.is({
  win11: MicaBrowserWindow,
  xfce: BrowserWindow,
}) ?? GlassBrowserWindow;

export interface WindowProvider {
  window: Electron.BrowserWindow;
}
