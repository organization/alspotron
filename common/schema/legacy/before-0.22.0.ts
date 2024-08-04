export type LEGACY_Config0_22_0 = {
  version: 2,
  views: {
    enabled: boolean;
    theme: string;
    name: string;
    position: {
      anchor: 'bottom-right' | 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom';
      display: number | null;
      top: number;
      left: number;
      bottom: number;
      right: number;
    }
  }[];

  appTheme: 'system' | 'light' | 'dark';
  language: 'ko' | 'en' | 'ja' | 'de';
  developer: boolean;
  streamingMode: boolean;
  hardwareAcceleration: boolean;

  lyricProvider: 'alsong';
  playingProvider: string;

  plugins: {
    list: Record<string, string | undefined>;
    disabled: Record<string, boolean | undefined>;
    config: Record<string, Record<string, unknown>>;
  };
}
