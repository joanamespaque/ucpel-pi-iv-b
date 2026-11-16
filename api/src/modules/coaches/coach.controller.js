import { sendPage } from '../../lib/serializers.js';
import { staffService } from '../staff/staff.service.js';
import { coachService } from './coach.service.js';

/**
 * Controladores HTTP dos técnicos.
 */
export const coachController = {
  async list(_req, res) {
    res.json(await coachService.list());
  },

  async get(req, res) {
    res.json(await coachService.get(req.validated.params.id));
  },

  async create(req, res) {
    const coach = await coachService.create(req.validated.body);
    res.status(201).location(`${req.baseUrl}/${coach.id}`).json(coach);
  },

  async update(req, res) {
    res.json(await coachService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await coachService.remove(req.validated.params.id);
    res.status(204).end();
  },

  /** Comissão técnica liderada pelo técnico. */
  async listStaff(req, res) {
    const { id } = req.validated.params;
    await coachService.get(id);
    sendPage(res, await staffService.list({ ...req.validated.query, tecnicoId: id }));
  },
};
