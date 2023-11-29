import { LyricProviderList } from './provider';

export const ConfigLyricMode = {
  NONE: -1,
  PLAYER: -2,
};
export type ConfigLyricMode = typeof ConfigLyricMode[keyof typeof ConfigLyricMode];

export const DEFAULT_STYLE = {
  font: 'KoPubWorldDotum',
  fontWeight: '400',
  animation: 'pretty',
  animationAtOnce: false,
  maxHeight: 400,
  proximityOpacity: 0,
  proximitySensitivity: 2,
  rowGap: 2,

  nowPlaying: {
    color: '#FFFFFF',
    background: 'rgba(29, 29, 29, .50)',
    backgroundProgress: 'rgba(29, 29, 29, .80)',
    fontSize: 13,
    maxWidth: 300,
    visible: true,
    stoppedOpacity: 0.5,
  },

  lyric: {
    color: '#FFFFFF',
    background: 'rgba(29, 29, 29, .70)',
    fontSize: 13,
    maxWidth: 700,
    stoppedOpacity: 0.5,
    containerRowGap: 1,
    multipleContainerRowGap: 1,
    direction: 'column' as const,
    nextLyric: 0,
    previousLyric: 0,
    nextLyricScale: 0.9,
    previousLyricScale: 0.9,
    nextLyricOpacity: 0.5,
    previousLyricOpacity: 0.5,
  },

  userCSS: null,
};

export const DEFAULT_CONFIG = {
  version: 1 as const,

  selectedTheme: 'Default Theme',

  windowPosition: {
    anchor: 'bottom-right' as const,
    display: null,
    top: 32,
    left: 32,
    bottom: 32,
    right: 32,
  },

  syncThrottle: 1000 * 3,

  language: 'ko' as 'ko' | 'en' | 'ja' | 'de',
  developer: false,

  plugins: {
    list: {},
    disabled: {},
    config: {},
  },

  streamingMode: false,
  provider: LyricProviderList[0].provider as 'alsong',
};

export const PRESET_PREFIX = '__preset__';
