import { z } from 'zod';
import { idNumber } from '../../lib/schemas.js';

/** Corpo aceito em POST e PUT de /times. */
export const teamBodySchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter ao menos 3 caracteres.').max(120),
  category: z.enum(['MASCULINO', 'FEMININO'], { error: 'Use MASCULINO ou FEMININO.' }),
  nickname: z.string().trim().max(80).nullish(),
  competitions: z.array(z.string().trim().min(2).max(120)).max(10).default([]),
  trainingCenterId: idNumber,
});
