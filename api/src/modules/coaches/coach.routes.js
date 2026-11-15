import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { staffQuerySchema } from '../staff/staff.schemas.js';
import { coachController as controller } from './coach.controller.js';
import { coachBodySchema } from './coach.schemas.js';

export const coachRoutes = Router();

const byId = validate(idParamSchema, 'params');

coachRoutes.get('/', controller.list);
coachRoutes.post('/', validate(coachBodySchema), controller.create);
coachRoutes.get('/:id', byId, controller.get);
coachRoutes.put('/:id', byId, validate(coachBodySchema), controller.update);
coachRoutes.delete('/:id', byId, controller.remove);
coachRoutes.get('/:id/comissao', byId, validate(staffQuerySchema.omit({ tecnicoId: true }), 'query'), controller.listStaff);
