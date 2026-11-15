import { sendPage } from '../../lib/serializers.js';
import { kitService } from './kit.service.js';

/**
 * Controladores HTTP dos uniformes.
 */
export const kitController = {
  async list(req, res) {
    sendPage(res, await kitService.list(req.validated.query));
  },

  async get(req, res) {
    res.json(await kitService.get(req.validated.params.id));
  },

  async create(req, res) {
    const kit = await kitService.create(req.validated.body);
    res.status(201).location(`${req.baseUrl}/${kit.id}`).json(kit);
  },

  async update(req, res) {
    res.json(await kitService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await kitService.remove(req.validated.params.id);
    res.status(204).end();
  },
};
