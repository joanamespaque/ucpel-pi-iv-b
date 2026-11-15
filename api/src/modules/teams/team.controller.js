import { teamService } from './team.service.js';
import { playerService } from '../players/player.service.js';

/**
 * Controladores HTTP dos times.
 */
export const teamController = {
  async list(_req, res) {
    res.json(await teamService.list());
  },

  async get(req, res) {
    res.json(await teamService.get(req.validated.params.id));
  },

  async create(req, res) {
    const team = await teamService.create(req.validated.body);
    res.status(201).location(`${req.baseUrl}/${team.id}`).json(team);
  },

  async update(req, res) {
    res.json(await teamService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await teamService.remove(req.validated.params.id);
    res.status(204).end();
  },

  /** Elenco do time, aceitando os mesmos filtros de /jogadores. */
  async listPlayers(req, res) {
    const { id } = req.validated.params;
    await teamService.get(id);
    res.json(await playerService.list({ ...req.validated.query, timeId: id }));
  },
};
