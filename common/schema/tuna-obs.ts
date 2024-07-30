import { z } from 'zod';

export type TunaOBSUpdateData = z.infer<typeof TunaOBSUpdateDataSchema>;
export const TunaOBSUpdateDataSchema = z.object({
  status: z.union([
    z.literal('playing'),
    z.literal('paused'),
    z.literal('idle'),
  ]),
  title: z.string().optional(),
  artists: z.array(z.string()).optional(),
  progress: z.number().optional(),
  duration: z.number().optional(),
  cover_url: z.string().optional(),
  lyrics: z.record(z.string(), z.array(z.string())).optional(),
});

export type TunaObsBody = z.infer<typeof TunaObsBodySchema>;
export const TunaObsBodySchema = z.object({
  data: TunaOBSUpdateDataSchema,
});
