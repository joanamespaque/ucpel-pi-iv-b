import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { playerQuerySchema } from '../players/player.schemas.js';
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
