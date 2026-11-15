import { PrismaClient } from '@prisma/client';

/**
 * Instância única do Prisma Client compartilhada pelos repositórios.
 */
export const prisma = new PrismaClient();
