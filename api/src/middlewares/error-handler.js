import { Prisma } from '@prisma/client';
import { HttpError } from '../lib/http-error.js';

/**
 * Traduz erros conhecidos do Prisma em erros HTTP.
 * @param {Prisma.PrismaClientKnownRequestError} error
 * @returns {HttpError}
 */
function fromPrisma(error) {
  switch (error.code) {
    case 'P2002':
      return HttpError.conflict(`Já existe um registro com o mesmo valor em: ${[].concat(error.meta?.target ?? []).join(', ')}.`);
    case 'P2003':
      return HttpError.unprocessable('Um dos identificadores informados não corresponde a um registro existente.');
    case 'P2025':
      return HttpError.notFound('O registro solicitado não existe.');
    default:
      return new HttpError(500, 'Erro interno', 'Falha ao acessar o banco de dados.');
  }
}

/**
 * Responde rotas inexistentes com 404.
 */
export function notFoundHandler(req, _res, next) {
  next(HttpError.notFound(`A rota ${req.method} ${req.originalUrl} não existe.`));
}

/**
 * Middleware final de erros. Gera respostas no formato
 * application/problem+json (RFC 9457).
 */
export function errorHandler(error, req, res, _next) {
  let httpError = error;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    httpError = fromPrisma(error);
  } else if (error?.type === 'entity.parse.failed') {
    httpError = new HttpError(400, 'JSON malformado', 'O corpo da requisição não é um JSON válido.');
  } else if (!(error instanceof HttpError)) {
    console.error(error);
    httpError = new HttpError(500, 'Erro interno', 'Ocorreu um erro inesperado no servidor.');
  }

  const body = {
    type: 'about:blank',
    title: httpError.title,
    status: httpError.status,
    detail: httpError.detail,
    instance: req.originalUrl,
  };
  if (httpError.errors) body.errors = httpError.errors;

  res.status(httpError.status).type('application/problem+json').json(body);
}
