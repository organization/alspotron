import { z } from 'zod';

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
    prevNextLyricThreshold: z.number(),
  }),

  position: z.object({
    availableAnchor: z.array(AnchorSchema),
    top: z.number(),
    left: z.number(),
    bottom: z.number(),
    right: z.number(),
    index: z.number(),
  }),

  userCSS: z.string().nullable(),
});

export const InternalConfigSchema = z.object({
  version: z.string().optional(),
});
export const ConfigSchema = z.object({
  version: z.literal(4),
  views: z
    .object({
      enabled: z.boolean(),
      theme: z.string(),
      name: z.string(),
      position: z.object({
        anchor: AnchorSchema,
        display: z.number().nullable(),
        top: z.number(),
        left: z.number(),
        bottom: z.number(),
        right: z.number(),
      }),
    })
    .array(),

  appTheme: z.enum(['system', 'light', 'dark']),
  language: z
    .union([z.literal('ko'), z.literal('en'), z.literal('ja'), z.literal('de')])
  ,
  developer: z.boolean(),
  streamingMode: z.boolean(),
  hardwareAcceleration: z.boolean(),

  experimental: z.record(z.unknown()),

  lyricProvider: z.string(),
  sourceProvider: z.string(),

  providers: z.object({
    source: z.object({
      config: z.record(z.record(z.unknown())),
    }),
    lyric: z.object({
      config: z.record(z.record(z.unknown())),
    }),
  }),

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
export const LyricMapperSchema = z.record(
  z
    .object({
      mode: LyricMapperModeSchema.optional().nullable(),
      delay: z.number().optional(),
    })
    .optional(),
);

export const ThemeListSchema = z.record(StyleConfigSchema.optional());
export const GameListSchema = z.record(
  z
    .object({
      name: z.string(),
      path: z.string(),
    })
    .array(),
);

export type StyleConfig = z.infer<typeof StyleConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>;

export type LyricMapperMode = z.infer<typeof LyricMapperModeSchema>;
export type LyricMapper = z.infer<typeof LyricMapperSchema>;
export type GameList = z.infer<typeof GameListSchema>;
export type ThemeList = z.infer<typeof ThemeListSchema>;
