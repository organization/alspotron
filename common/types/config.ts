import { z } from 'zod';

export const StyleConfigSchema = z.object({
  font: z.string(),
  fontWeight: z.string(),
  animation: z.string(),
  animationAtOnce: z.boolean(),
  maxHeight: z.number(),
  proximityOpacity: z.number(),
  proximitySensitivity: z.number(),
  rowGap: z.number(),

  nowPlaying: z.object({
    color: z.string(),
    background: z.string(),
    backgroundProgress: z.string(),
    fontSize: z.number(),
    maxWidth: z.number(),
    visible: z.boolean(),
    stoppedOpacity: z.number(),
  }),

  lyric: z.object({
    color: z.string(),
    background: z.string(),
    fontSize: z.number(),
    maxWidth: z.number(),
    stoppedOpacity: z.number(),
    containerRowGap: z.number(),
    multipleContainerRowGap: z.number(),
    direction: z.union([z.literal('column'), z.literal('column-reverse')]),
    nextLyric: z.number(),
    previousLyric: z.number(),
    nextLyricScale: z.number(),
    previousLyricScale: z.number(),
    nextLyricOpacity: z.number(),
    previousLyricOpacity: z.number(),
  }),

  userCSS: z.string().nullable(),
});

export const ConfigSchema = z.object({
  version: z.literal(1),
  selectedTheme: z.string(),

  windowPosition: z.object({
    anchor: z.union([
      z.literal('top-left'),
      z.literal('top'),
      z.literal('top-right'),
      z.literal('left'),
      z.literal('center'),
      z.literal('right'),
      z.literal('bottom-left'),
      z.literal('bottom'),
      z.literal('bottom-right'),
    ]),
    display: z.number().nullable(),
    top: z.number().nullable(),
    left: z.number().nullable(),
    bottom: z.number().nullable(),
    right: z.number().nullable(),
  }),

  syncThrottle: z.number(),

  language: z.union([
    z.literal('ko'),
    z.literal('en'),
    z.literal('ja'),
    z.literal('de'),
  ]),
  developer: z.boolean(),

  plugins: z.object({
    list: z.record(z.string().optional()),
    disabled: z.record(z.boolean().optional()),
    config: z.record(z.record(z.unknown())),
  }),
});
export const LyricMapperSchema = z.record(z.number().optional());
export const GameListSchema = z.record(z.string().optional());

export type StyleConfig = z.infer<typeof StyleConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>;

export type LyricMapper = z.infer<typeof LyricMapperSchema>;
export type GameList = z.infer<typeof GameListSchema>;
export type ThemeList = Record<string, StyleConfig>;
