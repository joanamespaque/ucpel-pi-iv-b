import { HttpError } from '../lib/http-error.js';

/**
 * Cria um middleware que valida uma parte da requisição com um esquema Zod.
 * O resultado validado substitui o valor original em `req.validated`.
 *
 * @param {import('zod').ZodTypeAny} schema esquema de validação
 * @param {'body' | 'query' | 'params'} source parte da requisição validada
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      return next(new HttpError(400, 'Dados inválidos', `A requisição possui ${errors.length} erro(s) de validação.`, errors));
    }
    req.validated = { ...req.validated, [source]: result.data };
    return next();
  };
}
