/**
 * Funções auxiliares para padronizar a saída JSON.
 */

/**
 * Converte uma data para o formato AAAA-MM-DD.
 * @param {Date | null | undefined} value
 * @returns {string | null}
 */
export function toDateOnly(value) {
  return value ? value.toISOString().slice(0, 10) : null;
}

/**
 * Converte um Decimal do Prisma em número.
 * @param {import('@prisma/client').Prisma.Decimal | null | undefined} value
 * @returns {number | null}
 */
export function toNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}
