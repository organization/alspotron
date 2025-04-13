import os from 'node:os';

import { Platform as BasePlatform } from '../src/Platform';

export const Platform = new BasePlatform({
  selector: {
    win: () => os.platform() === 'win32',
    mac: () => os.platform() === 'darwin',
    linux: () => os.platform() !== 'win32' && os.platform() !== 'darwin',
    'win11': () => os.platform() === 'win32' && os.release().startsWith('11'),
    'win10': () => os.platform() === 'win32' && os.release().startsWith('10'),
    'win-other': () => os.platform() === 'win32' && !os.release().startsWith('10') && !os.release().startsWith('11'),
    xfce: () => os.platform() !== 'win32' && os.platform() !== 'darwin' && process.env.DESKTOP_SESSION === 'xfce',
    'linux-other': () => os.platform() !== 'win32' && os.platform() !== 'darwin' && process.env.DESKTOP_SESSION !== 'xfce',
  },
});
