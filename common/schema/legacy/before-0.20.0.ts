export type LEGACY_StyleConfig0_20_0 = {
  font: string;
  fontWeight: string;
  animation: string;
  animationAtOnce: boolean;
  maxHeight: number;
  proximityOpacity: number;
  proximitySensitivity: number;
  rowGap: number;

  nowPlaying: {
    color: string;
    background: string;
    backgroundProgress: string;
    fontSize: number;
    maxWidth: number;
    visible: boolean;
    stoppedOpacity: number;
  };

  lyric: {
    color: string;
    background: string;
    fontSize: number;
    maxWidth: number;
    stoppedOpacity: number;
    containerRowGap: number;
    multipleContainerRowGap: number;
    direction: 'column' | 'column-reverse';
    nextLyric: number;
    previousLyric: number;
    nextLyricScale: number;
    previousLyricScale: number;
    nextLyricOpacity: number;
    previousLyricOpacity: number;
  };

  userCSS: string | null;
};

export type LEGACY_Config0_20_0 = {
  version: 1;
  selectedTheme: string;
  appTheme: 'system' | 'light' | 'dark';

  windowPosition: {
    anchor: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
    display: number | null;
    top: number;
    left: number;
    bottom: number;
    right: number;
  },

  syncThrottle: number;

  language: 'ko' | 'en' | 'ja' | 'de';
  developer: boolean;

  plugins:{
    list: Record<string, string | undefined>;
    disabled: Record<string, boolean | undefined>;
    config: Record<string, Record<string, unknown>>;
  };

  streamingMode: boolean;
  hardwareAcceleration: boolean;
  provider: 'alsong';
};