import { sendPage } from '../../lib/serializers.js';
import { kitService } from '../kits/kit.service.js';
import { playerService } from '../players/player.service.js';
import { sessionService } from '../sessions/session.service.js';
import { teamService } from './team.service.js';

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
    sendPage(res, await playerService.list({ ...req.validated.query, timeId: id }));
  },

  /** Uniformes do time, aceitando os filtros de /uniformes. */
  async listKits(req, res) {
    const { id } = req.validated.params;
    await teamService.get(id);
    sendPage(res, await kitService.list({ ...req.validated.query, timeId: id }));
  },

  /** Agenda de treinos do time, aceitando os filtros de /treinos. */
  async listSessions(req, res) {
    const { id } = req.validated.params;
    await teamService.get(id);
    sendPage(res, await sessionService.list({ ...req.validated.query, timeId: id }));
  },
};
