import { z } from 'zod';

import { DEFAULT_CONFIG, DEFAULT_STYLE } from '../constants';
import { LyricProviderList } from '../provider';

const AnchorSchema = z.union([
  z.literal('top-left'),
  z.literal('top'),
  z.literal('top-right'),
  z.literal('left'),
  z.literal('center'),
  z.literal('right'),
  z.literal('bottom-left'),
  z.literal('bottom'),
  z.literal('bottom-right'),
]);

export const StyleConfigSchema = z.object({
  font: z.string().catch(DEFAULT_STYLE.font),
  fontWeight: z.string().catch(DEFAULT_STYLE.fontWeight),
  animation: z.string().catch(DEFAULT_STYLE.animation),
  animationAtOnce: z.boolean().catch(DEFAULT_STYLE.animationAtOnce),
  maxHeight: z.number().catch(DEFAULT_STYLE.maxHeight),
  proximityOpacity: z.number().catch(DEFAULT_STYLE.proximityOpacity),
  proximitySensitivity: z.number().catch(DEFAULT_STYLE.proximitySensitivity),
  rowGap: z.number().catch(DEFAULT_STYLE.rowGap),

  nowPlaying: z.object({
    color: z.string().catch(DEFAULT_STYLE.nowPlaying.color),
    background: z.string().catch(DEFAULT_STYLE.nowPlaying.background),
    backgroundProgress: z.string().catch(DEFAULT_STYLE.nowPlaying.backgroundProgress),
    fontSize: z.number().catch(DEFAULT_STYLE.nowPlaying.fontSize),
    maxWidth: z.number().catch(DEFAULT_STYLE.nowPlaying.maxWidth),
    visible: z.boolean().catch(DEFAULT_STYLE.nowPlaying.visible),
    stoppedOpacity: z.number().catch(DEFAULT_STYLE.nowPlaying.stoppedOpacity),
  }),

  lyric: z.object({
    color: z.string().catch(DEFAULT_STYLE.lyric.color),
    background: z.string().catch(DEFAULT_STYLE.lyric.background),
    fontSize: z.number().catch(DEFAULT_STYLE.lyric.fontSize),
    maxWidth: z.number().catch(DEFAULT_STYLE.lyric.maxWidth),
    stoppedOpacity: z.number().catch(DEFAULT_STYLE.lyric.stoppedOpacity),
    containerRowGap: z.number().catch(DEFAULT_STYLE.lyric.containerRowGap),
    multipleContainerRowGap: z.number().catch(DEFAULT_STYLE.lyric.multipleContainerRowGap),
    direction: z.union([
      z.literal('column'),
      z.literal('column-reverse'),
    ]).catch(DEFAULT_STYLE.lyric.direction),
    nextLyric: z.number().catch(DEFAULT_STYLE.lyric.nextLyric),
    previousLyric: z.number().catch(DEFAULT_STYLE.lyric.previousLyric),
    nextLyricScale: z.number().catch(DEFAULT_STYLE.lyric.nextLyricScale),
    previousLyricScale: z.number().catch(DEFAULT_STYLE.lyric.previousLyricScale),
    nextLyricOpacity: z.number().catch(DEFAULT_STYLE.lyric.nextLyricOpacity),
    previousLyricOpacity: z.number().catch(DEFAULT_STYLE.lyric.previousLyricOpacity),
  }),

  position: z.object({
    availableAnchor: z.array(AnchorSchema).catch(DEFAULT_STYLE.position.availableAnchor),
    top: z.number().catch(DEFAULT_STYLE.position.top),
    left: z.number().catch(DEFAULT_STYLE.position.left),
    bottom: z.number().catch(DEFAULT_STYLE.position.bottom),
    right: z.number().catch(DEFAULT_STYLE.position.right),
    index: z.number().catch(DEFAULT_STYLE.position.index),
  }),

  userCSS: z.string().nullable(),
});

export const InternalConfigSchema = z.object({
  version: z.string().optional(),
});
export const ConfigSchema = z.object({
  version: z.literal(2),
  views: z.object({
    enabled: z.boolean().catch(DEFAULT_CONFIG.views[0].enabled),
    theme: z.string().catch(DEFAULT_CONFIG.views[0].theme),
    name: z.string().catch(DEFAULT_CONFIG.views[0].name),
    position: z.object({
      anchor: AnchorSchema.catch(DEFAULT_CONFIG.views[0].position.anchor),
      display: z.number().nullable().catch(DEFAULT_CONFIG.views[0].position.display),
      top: z.number().catch(DEFAULT_CONFIG.views[0].position.top),
      left: z.number().catch(DEFAULT_CONFIG.views[0].position.left),
      bottom: z.number().catch(DEFAULT_CONFIG.views[0].position.bottom),
      right: z.number().catch(DEFAULT_CONFIG.views[0].position.right),
    })
  }).array(),

  appTheme: z.enum(['system', 'light', 'dark']).catch(DEFAULT_CONFIG.appTheme),
  language: z.union([
    z.literal('ko'),
    z.literal('en'),
    z.literal('ja'),
    z.literal('de'),
  ]).catch(DEFAULT_CONFIG.language),
  developer: z.boolean().catch(DEFAULT_CONFIG.developer),
  streamingMode: z.boolean().catch(DEFAULT_CONFIG.streamingMode),
  hardwareAcceleration: z.boolean().catch(DEFAULT_CONFIG.hardwareAcceleration),

  lyricProvider: z.literal(LyricProviderList[0].provider).catch(DEFAULT_CONFIG.lyricProvider),
  playingProvider: z.string().catch(DEFAULT_CONFIG.playingProvider),

  plugins: z.object({
    list: z.record(z.string().optional()),
    disabled: z.record(z.boolean().optional()),
    config: z.record(z.record(z.unknown())),
  }),

  __internal__: InternalConfigSchema.optional(),
});
export const LyricMapperModeNoneSchema = z.object({
  type: z.literal('none'),
});
export const LyricMapperModePlayerSchema = z.object({
  type: z.literal('player'),
});
export const LyricMapperModeProviderSchema = z.object({
  type: z.literal('provider'),
  id: z.string().optional(),
  provider: z.string().optional(),
});
export const LyricMapperModeSchema = z.union([
  LyricMapperModeNoneSchema,
  LyricMapperModePlayerSchema,
  LyricMapperModeProviderSchema,
]);
export const LyricMapperSchema = z.record(z.object({
  mode: LyricMapperModeSchema.optional(),
  delay: z.number().optional(),
}).optional());

export const ThemeListSchema = z.record(StyleConfigSchema.optional());
export const GameListSchema = z.record(z.object({
  name: z.string(),
  path: z.string(),
}).array());

export type StyleConfig = z.infer<typeof StyleConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>;

export type LyricMapperMode = z.infer<typeof LyricMapperModeSchema>;
export type LyricMapper = z.infer<typeof LyricMapperSchema>;
export type GameList = z.infer<typeof GameListSchema>;
export type ThemeList = z.infer<typeof ThemeListSchema>;
