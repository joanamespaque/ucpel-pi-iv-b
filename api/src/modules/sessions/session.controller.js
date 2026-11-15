import { sendPage } from '../../lib/serializers.js';
import { sessionService } from './session.service.js';

/**
 * Controladores HTTP dos treinos.
 */
export const sessionController = {
  async list(req, res) {
    sendPage(res, await sessionService.list(req.validated.query));
  },

  async get(req, res) {
    res.json(await sessionService.get(req.validated.params.id));
  },

  async create(req, res) {
    const session = await sessionService.create(req.validated.body);
    res.status(201).location(`${req.baseUrl}/${session.id}`).json(session);
  },

  async update(req, res) {
    res.json(await sessionService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await sessionService.remove(req.validated.params.id);
    res.status(204).end();
  },
};
