import { z } from 'zod';
import { dateOnly } from '../../lib/schemas.js';

const positions = ['GOLEIRO', 'ZAGUEIRO', 'LATERAL', 'VOLANTE', 'MEIA', 'ATACANTE'];
const statuses = ['DISPONIVEL', 'EM_TRATAMENTO', 'SUSPENSO'];

/** Corpo aceito em POST e PUT de /jogadores. */
export const playerBodySchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter ao menos 3 caracteres.').max(120),
  shirtName: z.string().trim().min(2).max(40),
  number: z.number().int().min(1, 'O número deve estar entre 1 e 99.').max(99, 'O número deve estar entre 1 e 99.'),
  position: z.enum(positions, { message: `Use um destes valores: ${positions.join(', ')}.` }),
  preferredFoot: z.enum(['DIREITO', 'ESQUERDO', 'AMBIDESTRO']),
  birthDate: dateOnly,
  status: z.enum(statuses).default('DISPONIVEL'),
  teamId: z.number().int().positive(),
});

/** Filtros aceitos em GET /jogadores. */
export const playerQuerySchema = z.object({
  timeId: z.coerce.number().int().positive().optional(),
  posicao: z.enum(positions).optional(),
  situacao: z.enum(statuses).optional(),
});
