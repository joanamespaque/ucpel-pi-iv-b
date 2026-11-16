import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { staffController as controller } from './staff.controller.js';
import { staffBodySchema, staffQuerySchema } from './staff.schemas.js';

export const staffRoutes = Router();

const byId = validate(idParamSchema, 'params');

staffRoutes.get('/', validate(staffQuerySchema, 'query'), controller.list);
staffRoutes.post('/', validate(staffBodySchema), controller.create);
staffRoutes.get('/:id', byId, controller.get);
staffRoutes.put('/:id', byId, validate(staffBodySchema), controller.update);
staffRoutes.delete('/:id', byId, controller.remove);
