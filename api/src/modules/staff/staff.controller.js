import { sendPage } from '../../lib/serializers.js';
import { staffService } from './staff.service.js';

/**
 * Controladores HTTP da comissão técnica.
 */
export const staffController = {
  async list(req, res) {
    sendPage(res, await staffService.list(req.validated.query));
  },

  async get(req, res) {
    res.json(await staffService.get(req.validated.params.id));
  },

  async create(req, res) {
    const member = await staffService.create(req.validated.body);
    res.status(201).location(`${req.baseUrl}/${member.id}`).json(member);
  },

  async update(req, res) {
    res.json(await staffService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await staffService.remove(req.validated.params.id);
    res.status(204).end();
  },
};
