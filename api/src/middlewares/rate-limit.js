import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { HttpError } from '../lib/http-error.js';

const WINDOW_MS = 15 * 60 * 1000;
const READ_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/** Encaminha o excesso de requisições ao middleware de erros (429 em Problem Details). */
function handler(_req, _res, next, options) {
  next(
    new HttpError(
      429,
      'Muitas requisições',
      `Limite de ${options.limit} requisições a cada 15 minutos atingido. Tente novamente mais tarde.`,
    ),
  );
}

const common = { windowMs: WINDOW_MS, standardHeaders: 'draft-8', legacyHeaders: false, handler };

/** Limite geral por IP para todas as rotas da API. */
export const generalLimiter = rateLimit({ ...common, limit: 300, skip: () => env.nodeEnv === 'test' });

/** Limite mais restrito por IP para operações de escrita. */
export const writeLimiter = rateLimit({
  ...common,
  limit: 30,
  skip: (req) => env.nodeEnv === 'test' || READ_METHODS.includes(req.method),
});
