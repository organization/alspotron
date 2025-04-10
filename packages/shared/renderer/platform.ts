import { Platform as BasePlatform } from '../src/Platform';

const winRegex = /(Windows NT 10|Windows NT 11|Windows 10|Windows 11|Win64|WOW64|Win32)/;
const macRegex = /(Mac OS X|Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/;
const linuxRegex = /(Linux|X11)/;

export const Platform = new BasePlatform({
  selector: {
    win: () => winRegex.test(navigator.userAgent),
    mac: () => macRegex.test(navigator.userAgent),
    linux: () => linuxRegex.test(navigator.userAgent),
    'win11': () => winRegex.test(navigator.userAgent) && /Windows NT 10.0/.test(navigator.userAgent),
    'win10': () => winRegex.test(navigator.userAgent) && /Windows NT 11.0/.test(navigator.userAgent),
    'win-other': () => winRegex.test(navigator.userAgent) && !/Windows NT 10.0/.test(navigator.userAgent) && !/Windows NT 11.0/.test(navigator.userAgent),
    xfce: () => {
      console.warn('xfce is not supported in Renderer');
      return false;
    },
    'linux-other': () => linuxRegex.test(navigator.userAgent),
  },
});
