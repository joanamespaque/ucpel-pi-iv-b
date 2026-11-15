import { z } from 'zod';
import './zod-locale.js';

/**
 * Esquemas reutilizados por vários recursos.
 */

/** Maior valor aceito pelas colunas inteiras do PostgreSQL (int4). */
export const MAX_INT = 2147483647;

/** Identificador inteiro positivo dentro do limite do banco. */
export const idNumber = z.number().int().positive().max(MAX_INT, 'Identificador fora do intervalo permitido.');

/** Parâmetro de rota `:id` como inteiro positivo. */
export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: 'O id deve ser numérico.' })
    .int('O id deve ser inteiro.')
    .positive('O id deve ser positivo.')
    .max(MAX_INT, 'Identificador fora do intervalo permitido.'),
});

/**
 * Verifica se a data AAAA-MM-DD existe no calendário (rejeita, por exemplo, 2024-02-31).
 * @param {string} value
 */
function isRealDate(value) {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Data no formato AAAA-MM-DD. */
export const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.')
  .refine(isRealDate, 'Data inexistente no calendário.');
