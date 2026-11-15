import { z } from 'zod';
import './zod-locale.js';

/**
 * Esquemas reutilizados por vários recursos.
 */

/** Parâmetro de rota `:id` como inteiro positivo. */
export const idParamSchema = z.object({
  id: z.coerce.number({ invalid_type_error: 'O id deve ser numérico.' }).int().positive('O id deve ser positivo.'),
});

/** Data no formato AAAA-MM-DD. */
export const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Data inválida.');
