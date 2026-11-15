import { sendPage } from '../../lib/serializers.js';
import { facilityService } from './facility.service.js';

/**
 * Controladores HTTP dos espaços.
 */
export const facilityController = {
  async list(req, res) {
    sendPage(res, await facilityService.list(req.validated.query));
  },

  async get(req, res) {
    res.json(await facilityService.get(req.validated.params.id));
  },

  async create(req, res) {
    const facility = await facilityService.create(req.validated.body);
    res.status(201).location(`${req.baseUrl}/${facility.id}`).json(facility);
  },

  async update(req, res) {
    res.json(await facilityService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await facilityService.remove(req.validated.params.id);
    res.status(204).end();
  },
};
