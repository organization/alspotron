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
