export type LEGACY_Config0_23_1 = {
  version: 3;
  views: {
    enabled: boolean;
    theme: string;
    name: string;
    position: {
      anchor:
        | 'bottom-right'
        | 'top-left'
        | 'top'
        | 'top-right'
        | 'left'
        | 'center'
        | 'right'
        | 'bottom-left'
        | 'bottom';
      display: number | null;
      top: number;
      left: number;
      bottom: number;
      right: number;
    };
  }[];

  appTheme: 'system' | 'light' | 'dark';
  language: 'ko' | 'en' | 'ja' | 'de';
  developer: boolean;
  streamingMode: boolean;
  hardwareAcceleration: boolean;

  lyricProvider: string;
  sourceProvider: string;

  providers: {
    source: {
      config: Record<string, Record<string, unknown>>;
    };
    lyric: {
      config: Record<string, Record<string, unknown>>;
    };
  };

  plugins: {
    list: Record<string, string | undefined>;
    disabled: Record<string, boolean | undefined>;
    config: Record<string, Record<string, unknown>>;
  };
};
