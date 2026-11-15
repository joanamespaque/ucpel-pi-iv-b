import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { facilityQuerySchema } from '../facilities/facility.schemas.js';
import { trainingCenterController as controller } from './training-center.controller.js';
import { trainingCenterBodySchema } from './training-center.schemas.js';

export const trainingCenterRoutes = Router();

const byId = validate(idParamSchema, 'params');

trainingCenterRoutes.get('/', controller.list);
trainingCenterRoutes.post('/', validate(trainingCenterBodySchema), controller.create);
trainingCenterRoutes.get('/:id', byId, controller.get);
trainingCenterRoutes.put('/:id', byId, validate(trainingCenterBodySchema), controller.update);
trainingCenterRoutes.delete('/:id', byId, controller.remove);
trainingCenterRoutes.get('/:id/espacos', byId, validate(facilityQuerySchema.omit({ ctId: true }), 'query'), controller.listFacilities);
