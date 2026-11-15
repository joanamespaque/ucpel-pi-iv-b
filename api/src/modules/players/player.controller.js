import { playerService } from './player.service.js';

/**
 * Controladores HTTP dos jogadores.
 */
export const playerController = {
  async list(req, res) {
    res.json(await playerService.list(req.validated.query));
  },

  async get(req, res) {
    res.json(await playerService.get(req.validated.params.id));
  },

  async create(req, res) {
    const player = await playerService.create(req.validated.body);
    res.status(201).location(`${req.baseUrl}/${player.id}`).json(player);
  },

  async update(req, res) {
    res.json(await playerService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await playerService.remove(req.validated.params.id);
    res.status(204).end();
  },
};
