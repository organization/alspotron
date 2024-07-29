import { IS_WINDOWS_11, MicaBrowserWindow } from 'mica-electron';
import { BrowserWindow } from 'electron';

import { BrowserWindow as GlassBrowserWindow } from 'glasstron';

import { isWin32, isXfce } from '../../utils/is';

export const PlatformBrowserWindow = isWin32() && IS_WINDOWS_11 ? MicaBrowserWindow : isXfce() ? BrowserWindow : GlassBrowserWindow;