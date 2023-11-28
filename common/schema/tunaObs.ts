import { z } from 'zod';

export const updateDataSchema = z.object({
  status: z.string(),
  title: z.string().optional(),
  artists: z.array(z.string()).optional(),
  progress: z.number().optional(),
  duration: z.number().optional(),
  cover_url: z.string().optional(),
  lyrics: z.record(z.string(), z.array(z.string())).optional(),
});

export const bodySchema = z.object({
  data: updateDataSchema,
});

export type UpdateData = z.infer<typeof updateDataSchema>;
export type UpdateRequestBody = z.infer<typeof bodySchema>;
