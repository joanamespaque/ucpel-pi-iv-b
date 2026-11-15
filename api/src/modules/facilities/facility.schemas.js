import { z } from 'zod';
import { idNumber, MAX_INT, paginationSchema } from '../../lib/schemas.js';

export const facilityTypes = [
  'CAMPO',
  'ACADEMIA',
  'PISCINA',
  'AUDITORIO',
  'SALA_ANALISE',
  'DEPARTAMENTO_MEDICO',
  'REFEITORIO',
  'ALOJAMENTO',
];

/** Corpo aceito em POST e PUT de /espacos. */
export const facilityBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  type: z.enum(facilityTypes),
  capacity: z.number().int().positive().max(10000).nullish(),
  trainingCenterId: idNumber,
});

/** Filtros aceitos em GET /espacos. */
export const facilityQuerySchema = paginationSchema.extend({
  ctId: z.coerce.number().int().positive().max(MAX_INT).optional(),
  tipo: z.enum(facilityTypes).optional(),
});
