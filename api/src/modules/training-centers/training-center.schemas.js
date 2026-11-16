import { z } from 'zod';

/** Corpo aceito em POST e PUT de /cts. */
export const trainingCenterBodySchema = z.object({
  name: z.string().trim().min(3).max(120),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(3).max(200),
  areaHa: z.number().positive().max(1000).nullish(),
  openedYear: z.number().int().min(1900).max(2100).nullish(),
});
