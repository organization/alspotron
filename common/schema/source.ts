import { z } from 'zod';

export type PlayerLyricFormat = z.infer<typeof PlayerLyricFormatSchema>;
export const PlayerLyricFormatSchema = z.record(z.string(), z.string().array());

export type IdleData = z.infer<typeof IdleDataSchema>;
export const IdleDataSchema = z.object({
  type: z.literal('idle'),
});

const BaseDataSchema = z.object({
  title: z.string(),
  artists: z.string().array(),
  progress: z.number(),
  duration: z.number(),
  coverUrl: z.string(),
  playerLyrics: PlayerLyricFormatSchema.optional().nullable(),

  metadata: z.unknown().optional().nullable(),
});

export type PlayingData = z.infer<typeof PlayingDataSchema>;
export const PlayingDataSchema = BaseDataSchema.extend({
  type: z.literal('playing'),
});

export type PausedData = z.infer<typeof PausedDataSchema>;
export const PausedDataSchema = BaseDataSchema.extend({
  type: z.literal('paused'),
});

export type UpdateData = z.infer<typeof UpdateDataSchema>;
export const UpdateDataSchema = z.object({
  data: z.union([
    PlayingDataSchema,
    PausedDataSchema,
    IdleDataSchema,
  ]),
  provider: z.string(),
});
