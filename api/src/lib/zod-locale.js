import { z } from 'zod';

/**
 * Mensagens padrão do Zod em português, usadas quando o esquema
 * não define uma mensagem própria.
 */
z.config({
  customError: (issue) => {
    if (issue.code === 'invalid_type') {
      if (issue.input === undefined) return 'Campo obrigatório.';
      return `Tipo inválido: esperado ${issue.expected}.`;
    }
    if (issue.code === 'too_small' && issue.origin === 'string') return `Deve ter ao menos ${issue.minimum} caractere(s).`;
    if (issue.code === 'too_big' && issue.origin === 'string') return `Deve ter no máximo ${issue.maximum} caractere(s).`;
    if (issue.code === 'too_big' && issue.origin === 'array') return `Deve ter no máximo ${issue.maximum} item(ns).`;
    if (issue.code === 'invalid_value') return `Valor inválido. Use um destes: ${issue.values.join(', ')}.`;
    if (issue.code === 'unrecognized_keys') return `Campo(s) não permitido(s): ${issue.keys.join(', ')}.`;
    return undefined;
  },
});
