import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`InterCT API em http://localhost:${env.port} (documentação em /docs)`);
});

/** Encerra o servidor e a conexão com o banco de forma ordenada. */
async function shutdown() {
  server.close();
  await prisma.$disconnect();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
