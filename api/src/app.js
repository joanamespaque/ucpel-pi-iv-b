import { readFileSync } from 'node:fs';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import './lib/zod-locale.js';
import { docsRoutes } from './docs.js';
import { prisma } from './lib/prisma.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { apiRoutes } from './routes.js';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

/**
 * Cria a aplicação Express com middlewares, rotas e tratamento de erros.
 * Separada de server.js para permitir os testes sem abrir porta de rede.
 */
export function createApp() {
  const app = express();

  // O Swagger UI usa scripts e estilos inline; a CSP padrão do Helmet os bloquearia.
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.corsOrigins.length ? env.corsOrigins : '*' }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/', (_req, res) => res.redirect('/docs'));

  app.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', database: 'ok', version });
    } catch {
      res.status(503).json({ status: 'degraded', database: 'indisponível' });
    }
  });

  app.use('/docs', docsRoutes);
  app.use('/api/v1', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
