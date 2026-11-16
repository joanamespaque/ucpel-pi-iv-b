import { sendPage } from '../../lib/serializers.js';
import { facilityService } from '../facilities/facility.service.js';
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

  async create(req, res) {
    const center = await trainingCenterService.create(req.validated.body);
    res.status(201).location(`${req.baseUrl}/${center.id}`).json(center);
  },

  async update(req, res) {
    res.json(await trainingCenterService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await trainingCenterService.remove(req.validated.params.id);
    res.status(204).end();
  },

  /** Espaços do CT, com os mesmos filtros de /espacos. */
  async listFacilities(req, res) {
    const { id } = req.validated.params;
    await trainingCenterService.get(id);
    sendPage(res, await facilityService.list({ ...req.validated.query, ctId: id }));
  },
};
