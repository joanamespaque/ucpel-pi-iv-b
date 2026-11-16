import { createHash, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { HttpError } from '../lib/http-error.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Gera um resumo de tamanho fixo para a comparação em tempo constante.
 * @param {string} value
 */
const digest = (value) => createHash('sha256').update(value).digest();

/**
 * Indica se a requisição traz a chave de API correta.
 * @param {import('express').Request} req
 */
export function hasValidApiKey(req) {
  const provided = req.get('x-api-key');
  return Boolean(env.apiKey && provided && timingSafeEqual(digest(provided), digest(env.apiKey)));
}

/**
 * Exige o cabeçalho X-API-Key nas requisições que alteram dados.
 * A leitura continua pública. Sem API_KEY configurada, a escrita fica bloqueada.
 */
export function requireApiKey(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  if (!hasValidApiKey(req)) {
    res.set('WWW-Authenticate', 'ApiKey header="X-API-Key"');
    return next(new HttpError(401, 'Não autenticado', 'Informe uma chave de API válida no cabeçalho X-API-Key.'));
  }
  return next();
}
