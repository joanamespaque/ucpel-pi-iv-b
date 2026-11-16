import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { facilityController as controller } from './facility.controller.js';
import { facilityBodySchema, facilityQuerySchema } from './facility.schemas.js';

export const facilityRoutes = Router();

const byId = validate(idParamSchema, 'params');

facilityRoutes.get('/', validate(facilityQuerySchema, 'query'), controller.list);
facilityRoutes.post('/', validate(facilityBodySchema), controller.create);
facilityRoutes.get('/:id', byId, controller.get);
facilityRoutes.put('/:id', byId, validate(facilityBodySchema), controller.update);
facilityRoutes.delete('/:id', byId, controller.remove);
