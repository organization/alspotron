import packageJson from '../package.json';

export const VERSION = packageJson.version;
export const DEFAULT_STYLE = {
  font: 'Pretendard JP Variable',
  fontWeight: '400',
  animation: 'show-up',
  animationAtOnce: false,
  maxHeight: 800,
  proximityOpacity: 0,
  proximitySensitivity: 2,
  rowGap: 2,

  nowPlaying: {
    color: 'rgb(255, 255, 255)',
    background: 'rgba(0, 0, 0, 0.5)',
    backgroundProgress: 'rgba(0, 0, 0, 0.49074074074074076)',
    fontSize: 14,
    maxWidth: 300,
    visible: true,
    stoppedOpacity: 0.5,
  },

  lyric: {
    color: 'rgb(255, 255, 255)',
    background: 'rgba(0, 0, 0, 0.64)',
    fontSize: 14,
    maxWidth: 700,
    stoppedOpacity: 0.5,
    containerRowGap: 0.25,
    multipleContainerRowGap: 1,
    direction: 'column' as 'column' | 'column-reverse',
    nextLyric: 1,
    previousLyric: 1,
    nextLyricScale: 0.8,
    previousLyricScale: 0.8,
    nextLyricOpacity: 0.5,
    previousLyricOpacity: 0.5,
    prevNextLyricThreshold: -1,
  },

  position: {
    availableAnchor: [
      'top-left',
      'top',
      'top-right',
      'left',
      'right',
      'bottom-left',
      'bottom',
      'bottom-right',
    ] as (
      | 'top-left'
      | 'top'
      | 'top-right'
      | 'left'
      | 'right'
      | 'bottom-left'
      | 'bottom'
      | 'bottom-right'
    )[],
    top: -32,
    left: -32,
    bottom: -32,
    right: -32,
    index: 0,
  },
  userCSS:
    'lyrs-wrapper {\n  min-height: 400px;\n\n  flex-flow: row !important;\n  justify-content: center;\n  align-items: center;\n  gap: 32px;\n\n  --angle: 315deg;\n  background: linear-gradient(\n    var(--angle, 315deg),\n    rgba(0, 0, 0, 0.5) 0%,\n    rgba(0, 0, 0, 0) 25%\n  );\n\n  padding: 32px;\n}\nlyrs-wrapper[data-anchor$="right"] {\n  --angle: 315deg;\n  flex-direction: row !important;\n}\nlyrs-wrapper[data-anchor$="left"] {\n  --angle: 45deg;\n  flex-direction: row-reverse !important;\n}\nlyrs-wrapper[data-anchor^="top"] {\n  align-items: flex-start;\n}\nlyrs-wrapper[data-anchor^="bottom"] {\n  align-items: flex-end;\n}\n\nlyrs-wrapper[data-anchor="top-right"] {\n  --angle: 225deg;\n}\nlyrs-wrapper[data-anchor="right"] {\n  background: radial-gradient(\n    circle at 100% 50%,\n    rgba(0, 0, 0, 0.5) 0%,\n    rgba(0, 0, 0, 0) 25%\n  );\n}\nlyrs-wrapper[data-anchor="bottom-right"] {\n  --angle: 315deg;\n}\nlyrs-wrapper[data-anchor="top-left"] {\n  --angle: 135deg;\n}\nlyrs-wrapper[data-anchor="left"] {\n  background: radial-gradient(\n    circle at 0% 50%,\n    rgba(0, 0, 0, 0.5) 0%,\n    rgba(0, 0, 0, 0) 25%\n  );\n}\nlyrs-wrapper[data-anchor="bottom-left"] {\n  --angle: 45deg;\n}\nlyrs-wrapper[data-anchor="top"] {\n  flex-direction: column-reverse !important;\n  align-items: center !important;\n  background: radial-gradient(\n    circle at 50% 0%,\n    rgba(0, 0, 0, 0.5) 0%,\n    rgba(0, 0, 0, 0) 25%\n  );\n}\nlyrs-wrapper[data-anchor="bottom"] {\n  flex-direction: column !important;\n  align-items: center !important;\n  background: radial-gradient(\n    circle at 50% 100%,\n    rgba(0, 0, 0, 0.5) 0%,\n    rgba(0, 0, 0, 0) 25%\n  );\n}\n\nlyrs-lyrics-item {\n  border-radius: 8px;\n  padding: 4px 8px;\n}\n\nlyrs-nowplaying {\n  width: 200px;\n  height: 50px;\n  max-width: 150px;\n\n  border-radius: 12px;\n  flex-shrink: 0;\n\n  position: relative;\n  display: inline-flex;\n  flex-flow: column;\n  justify-content: flex-end;\n  align-items: flex-start;\n\n  padding: 0;\n}\nlyrs-nowplaying::after {\n  content: \'\';\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n\n  z-index: 20;\n}\n\nlyrs-nowplaying-progress-bar {\n  z-index: 21;\n\n  transition: all 0.225s;\n}\nlyrs-nowplaying-progress-bar::before {\n  content: \'\';\n  position: absolute;\n  inset: 0;\n\n  width: 100%;\n  height: 100%;\n\n  background: var(--cover-url);\n  background-size: 200px 200px;\n  background-position: 0 50%;\n\n  opacity: 0.5;\n  filter: blur(4px);\n}\n\nlyrs-wrapper--stopped lyrs-nowplaying-progress-bar {\n  backdrop-filter: blur(2px);\n}\n\nlyrs-nowplaying-progress {\n  --color: 0, 0, 0;\n\n  opacity: 1;\n}\n\nlyrs-nowplaying-cover {\n  position: absolute;\n  width: 50px !important;\n  height: 50px !important;\n  top: 0;\n  left: 0;\n  z-index: 50;\n\n  object-fit: cover;\n  border-radius: 12px;\n  padding: 4px;\n\n}\n\nlyrs-wrapper--stopped lyrs-nowplaying-cover {\n  transform: scale(0.9);\n}\n\nlyrs-nowplaying-playing-text {\n  position: relative;\n  margin-top: auto;\n  padding: 4px 4px;\n  overflow: visible !important;\n\n  text-shadow: 0 0 2px black, 0 3px 6px black;\n  transform: translateZ(100px);\n}\n\nlyrs-nowplaying-marquee {\n  z-index: 100 !important;\n}\n\nlyrs-nowplaying-container {\n  width: 100%;\n  height: 100%;\n  padding-left: 50px;\n  justify-content: flex-start;\n  align-items: center;\n}\n',
};

export const DEFAULT_CONFIG = {
  version: 4 as const,

  views: [
    {
      enabled: true,
      theme: 'Default Theme',
      name: 'Default View',
      position: {
        anchor: 'bottom-right' as const,
        display: null as number | null,
        top: 32,
        left: 32,
        bottom: 32,
        right: 32,
      },
    },
  ],
  appTheme: 'system' as const,
  language: 'ko' as 'ko' | 'en' | 'ja' | 'de',
  developer: false,
  hardwareAcceleration: true,
  streamingMode: false,

  lyricProvider: 'lrclib' as const,
  sourceProvider: 'tuna-obs' as const,

  experimental: {},

  providers: {
    source: {
      config: {
        'tuna-obs': {
          port: 1608,
        },
      },
    },
    lyric: {
      config: {},
    },
  },

  plugins: {
    list: {},
    disabled: {},
    config: {},
  },

  __internal__: {
    version: VERSION,
  },
};

export const PRESET_PREFIX = '__preset__';
