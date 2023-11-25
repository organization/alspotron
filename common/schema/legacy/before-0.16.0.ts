export type LEGACY_Config0_16_0 = {
  style: {
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
      nextLyricScale: number;
      previousLyricScale: number;
      nextLyricOpacity: number;
      previousLyricOpacity: number;
    };

    userCSS: string | null;
  };

  lyric: {
    nextLyric: number;
    previousLyric: number;
  };

  windowPosition: {
    anchor: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
    display: number | null;
    top: number | null;
    left: number | null;
    bottom: number | null;
    right: number | null;
    direction: 'column' | 'column-reverse';
  };

  syncThrottle: number;

  language: 'ko' | 'en' | 'ja' | 'de';
  developer: boolean;

  plugins: {
    list: Record<string, string | undefined>; // id: path
    disabled: Record<string, boolean | undefined>; // id: enabled
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>; // id: config
  }
}

