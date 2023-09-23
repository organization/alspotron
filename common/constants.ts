import { Config, StyleConfig } from './config';

export const ConfigLyricMode = {
  NONE: -1,
  PLAYER: -2,
};
export type ConfigLyricMode = typeof ConfigLyricMode[keyof typeof ConfigLyricMode];

export const DEFAULT_STYLE: StyleConfig = {
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
    fontSize: 15,
    maxWidth: 700,
    stoppedOpacity: 0.5,
    containerRowGap: 1,
    multipleContainerRowGap: 1,
    direction: 'column',
    nextLyric: 0,
    previousLyric: 0,
    nextLyricScale: 0.9,
    previousLyricScale: 0.9,
    nextLyricOpacity: 0.5,
    previousLyricOpacity: 0.5,
  },

  userCSS: null,
};

export const DEFAULT_CONFIG: Config = {
  version: 1,

  themes: {
    'Default Theme': DEFAULT_STYLE,
  },
  selectedTheme: 'Default Theme',

  windowPosition: {
    anchor: 'bottom-right',
    display: null,
    top: 32,
    left: 32,
    bottom: 32,
    right: 32,
  },

  syncThrottle: 1000 * 3,

  language: 'ko',
  developer: false,

  plugins: {
    list: {},
    disabled: {},
    config: {},
  },
} satisfies Config;
