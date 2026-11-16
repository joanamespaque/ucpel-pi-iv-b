import { z } from 'zod';
import { idNumber, MAX_INT, paginationSchema } from '../../lib/schemas.js';

export const staffRoles = [
  'AUXILIAR_TECNICO',
  'PREPARADOR_FISICO',
  'PREPARADOR_GOLEIROS',
  'ANALISTA_DESEMPENHO',
  'FISIOLOGISTA',
  'MEDICO',
  'FISIOTERAPEUTA',
  'NUTRICIONISTA',
  'PSICOLOGO',
  'ROUPEIRO',
];

/** Corpo aceito em POST e PUT de /comissao. */
export const staffBodySchema = z.object({
  name: z.string().trim().min(3).max(120),
  role: z.enum(staffRoles),
  coachId: idNumber,
});

/** Filtros aceitos em GET /comissao. */
export const staffQuerySchema = paginationSchema.extend({
  tecnicoId: z.coerce.number().int().positive().max(MAX_INT).optional(),
  cargo: z.enum(staffRoles).optional(),
});
