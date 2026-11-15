import { z } from 'zod';

/**
 * Mensagens padrão do Zod em português, usadas quando o esquema
 * não define uma mensagem própria.
 */
z.setErrorMap((issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === 'undefined') return { message: 'Campo obrigatório.' };
    return { message: `Tipo inválido: esperado ${issue.expected}, recebido ${issue.received}.` };
  }
  if (issue.code === z.ZodIssueCode.too_small && issue.type === 'string') {
    return { message: `Deve ter ao menos ${issue.minimum} caractere(s).` };
  }
  if (issue.code === z.ZodIssueCode.too_big && issue.type === 'string') {
    return { message: `Deve ter no máximo ${issue.maximum} caractere(s).` };
  }
  if (issue.code === z.ZodIssueCode.invalid_enum_value) {
    return { message: `Valor inválido. Use um destes: ${issue.options.join(', ')}.` };
  }
  return { message: ctx.defaultError };
});
