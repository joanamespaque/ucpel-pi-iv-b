import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { sessionController as controller } from './session.controller.js';
import { sessionBodySchema, sessionQuerySchema } from './session.schemas.js';

export const sessionRoutes = Router();

const byId = validate(idParamSchema, 'params');

sessionRoutes.get('/', validate(sessionQuerySchema, 'query'), controller.list);
sessionRoutes.post('/', validate(sessionBodySchema), controller.create);
sessionRoutes.get('/:id', byId, controller.get);
sessionRoutes.put('/:id', byId, validate(sessionBodySchema), controller.update);
sessionRoutes.delete('/:id', byId, controller.remove);
