import { readFileSync } from 'node:fs';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import './lib/zod-locale.js';
import { docsRoutes } from './docs.js';
import { prisma } from './lib/prisma.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { generalLimiter, writeLimiter } from './middlewares/rate-limit.js';
import { apiRoutes } from './routes.js';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

/**
 * Define as origens autorizadas pelo CORS. Em produção, sem CORS_ORIGINS
 * configurada, nenhuma origem externa é aceita.
 */
function corsOrigin() {
  if (env.corsOrigins.length) return env.corsOrigins;
  return env.nodeEnv === 'production' ? false : '*';
}

/**
 * Cria a aplicação Express com middlewares, rotas e tratamento de erros.
 * Separada de server.js para permitir os testes sem abrir porta de rede.
 */
export function createApp() {
  const app = express();

  // O Render encaminha as requisições por um proxy; o IP real vem no X-Forwarded-For.
  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: corsOrigin(),
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'X-API-Key'],
      maxAge: 600,
    }),
  );

  // O Swagger UI usa scripts e estilos inline, por isso a CSP fica desativada apenas em /docs.
  app.use('/docs', helmet({ contentSecurityPolicy: false }), docsRoutes);
  app.use(helmet());

  app.use(express.json({ limit: '100kb' }));

  app.get('/', (_req, res) => res.redirect('/docs'));

  app.get('/health', generalLimiter, async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', database: 'ok', version });
    } catch {
      res.status(503).json({ status: 'degraded', database: 'indisponível' });
    }
  });

  app.use('/api', generalLimiter, writeLimiter);
  app.use('/api/v1', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
