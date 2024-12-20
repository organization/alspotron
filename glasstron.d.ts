declare module 'glasstron' {
  import { BrowserWindow as ElectronBrowserWindow } from 'electron';

  export type GlasstronOnlyOptions = {
    blur?: boolean;
    blurType?: 'blurbehind' | 'acrylic' | 'transparent' | 'none';
    blurGnomeSigma?: number;
    blurCornerRadius?: number;
  };
  export type GlasstronOptions = Electron.BrowserWindowConstructorOptions &
    GlasstronOnlyOptions;

  type GlassBrowserWindow = {
    new (options?: GlasstronOptions): ElectronBrowserWindow;
  };

  interface Glasstron {
    BrowserWindow: GlassBrowserWindow;
  }

  const glasstron: Glasstron;
  export const BrowserWindow: GlassBrowserWindow;

  export default glasstron;
}
