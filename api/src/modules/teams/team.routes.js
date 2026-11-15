import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { kitQuerySchema } from '../kits/kit.schemas.js';
import { playerQuerySchema } from '../players/player.schemas.js';
import { sessionQueryBase, validDateRange } from '../sessions/session.schemas.js';
import { teamController as controller } from './team.controller.js';
import { teamBodySchema } from './team.schemas.js';

export const teamRoutes = Router();

const byId = validate(idParamSchema, 'params');

teamRoutes.get('/', controller.list);
teamRoutes.post('/', validate(teamBodySchema), controller.create);
teamRoutes.get('/:id', byId, controller.get);
teamRoutes.put('/:id', byId, validate(teamBodySchema), controller.update);
teamRoutes.delete('/:id', byId, controller.remove);
teamRoutes.get('/:id/jogadores', byId, validate(playerQuerySchema.omit({ timeId: true }), 'query'), controller.listPlayers);
teamRoutes.get('/:id/uniformes', byId, validate(kitQuerySchema.omit({ timeId: true }), 'query'), controller.listKits);
teamRoutes.get(
  '/:id/treinos',
  byId,
  validate(sessionQueryBase.omit({ timeId: true }).refine(...validDateRange), 'query'),
  controller.listSessions,
);
