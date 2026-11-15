import { z } from 'zod';
import { dateOnly, idNumber, MAX_INT, paginationSchema, timeOfDay } from '../../lib/schemas.js';

export const sessionTypes = ['TATICO', 'TECNICO', 'FISICO', 'REGENERATIVO', 'BOLA_PARADA'];

/** Corpo aceito em POST e PUT de /treinos. */
export const sessionBodySchema = z
  .object({
    date: dateOnly,
    startTime: timeOfDay,
    endTime: timeOfDay,
    type: z.enum(sessionTypes),
    notes: z.string().trim().max(500).nullish(),
    teamId: idNumber,
    facilityId: idNumber,
    kitId: idNumber.nullish(),
  })
  .refine((body) => body.endTime > body.startTime, {
    path: ['endTime'],
    message: 'O horário de término deve ser posterior ao de início.',
  });

/** Filtros de treinos, sem as validações entre campos. */
export const sessionQueryBase = paginationSchema.extend({
  timeId: z.coerce.number().int().positive().max(MAX_INT).optional(),
  espacoId: z.coerce.number().int().positive().max(MAX_INT).optional(),
  data: dateOnly.optional(),
  de: dateOnly.optional(),
  ate: dateOnly.optional(),
});

/** Regra entre campos: o intervalo de datas deve ser crescente. */
export const validDateRange = [
  (q) => !(q.de && q.ate) || q.de <= q.ate,
  { path: ['ate'], message: 'A data final deve ser igual ou posterior à inicial.' },
];

/** Filtros aceitos em GET /treinos. */
export const sessionQuerySchema = sessionQueryBase.refine(...validDateRange);
