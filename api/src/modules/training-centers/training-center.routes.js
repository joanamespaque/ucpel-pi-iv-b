import { Router } from 'express';
import { idParamSchema } from '../../lib/schemas.js';
import { validate } from '../../middlewares/validate.js';
import { trainingCenterController as controller } from './training-center.controller.js';

export const trainingCenterRoutes = Router();

trainingCenterRoutes.get('/', controller.list);
trainingCenterRoutes.get('/:id', validate(idParamSchema, 'params'), controller.get);
