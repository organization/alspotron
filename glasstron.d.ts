declare module 'glasstron' {
  import { BrowserWindow as ElectronBrowserWindow } from 'electron';

  type GlasstronOptions = {
    blur?: boolean,
    blurType?: 'blurbehind' | 'acrylic' | 'none',
    blurGnomeSigma?: number,
    blurCornerRadius?: number,
  }

  interface Glasstron {
    BrowserWindow: {new(options?: Electron.BrowserWindowConstructorOptions & GlasstronOptions): ElectronBrowserWindow};
  }

  const glasstron: Glasstron;

  export default glasstron;
}