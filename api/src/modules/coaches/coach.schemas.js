import { z } from 'zod';
import { dateOnly, idNumber } from '../../lib/schemas.js';

/** Corpo aceito em POST e PUT de /tecnicos. */
export const coachBodySchema = z.object({
  name: z.string().trim().min(3).max(120),
  nationality: z.string().trim().min(2).max(60),
  license: z.string().trim().max(40).nullish(),
  contractStart: dateOnly,
  teamId: idNumber.nullish(),
});
