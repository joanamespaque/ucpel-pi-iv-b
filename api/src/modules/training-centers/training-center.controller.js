import { trainingCenterService } from './training-center.service.js';

/**
 * Controladores HTTP dos centros de treinamento.
 */
export const trainingCenterController = {
  async list(_req, res) {
    res.json(await trainingCenterService.list());
  },

  async get(req, res) {
    res.json(await trainingCenterService.get(req.validated.params.id));
  },
};
