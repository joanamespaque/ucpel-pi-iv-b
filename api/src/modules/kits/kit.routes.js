import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { kitController as controller } from './kit.controller.js';
import { kitBodySchema, kitQuerySchema } from './kit.schemas.js';

export const kitRoutes = Router();

const byId = validate(idParamSchema, 'params');

kitRoutes.get('/', validate(kitQuerySchema, 'query'), controller.list);
kitRoutes.post('/', validate(kitBodySchema), controller.create);
kitRoutes.get('/:id', byId, controller.get);
kitRoutes.put('/:id', byId, validate(kitBodySchema), controller.update);
kitRoutes.delete('/:id', byId, controller.remove);
