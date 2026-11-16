import { z } from 'zod';
import { idNumber, MAX_INT, paginationSchema } from '../../lib/schemas.js';

export const kitTypes = ['JOGO_1', 'JOGO_2', 'JOGO_3', 'GOLEIRO', 'TREINO', 'VIAGEM'];

/** Corpo aceito em POST e PUT de /uniformes. */
export const kitBodySchema = z.object({
  type: z.enum(kitTypes),
  season: z.number().int().min(1909).max(2100),
  colors: z.string().trim().min(3).max(120),
  supplier: z.string().trim().min(2).max(60),
  teamId: idNumber,
});

/** Filtros aceitos em GET /uniformes. */
export const kitQuerySchema = paginationSchema.extend({
  timeId: z.coerce.number().int().positive().max(MAX_INT).optional(),
  tipo: z.enum(kitTypes).optional(),
  temporada: z.coerce.number().int().min(1909).max(2100).optional(),
});
