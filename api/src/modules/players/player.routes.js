import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { playerController as controller } from './player.controller.js';
import { playerBodySchema, playerQuerySchema } from './player.schemas.js';

export const playerRoutes = Router();

const byId = validate(idParamSchema, 'params');

playerRoutes.get('/', validate(playerQuerySchema, 'query'), controller.list);
playerRoutes.post('/', validate(playerBodySchema), controller.create);
playerRoutes.get('/:id', byId, controller.get);
playerRoutes.put('/:id', byId, validate(playerBodySchema), controller.update);
playerRoutes.delete('/:id', byId, controller.remove);
