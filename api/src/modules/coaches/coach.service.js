import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { toDateOnly } from '../../lib/serializers.js';
import { coachRepository } from './coach.repository.js';

/** @param {object} coach */
function present(coach) {
  const { createdAt, updatedAt, _count, ...rest } = coach;
  return { ...rest, contractStart: toDateOnly(coach.contractStart), staffCount: _count?.staff ?? 0 };
}

/**
 * Garante que o time existe e não possui outro técnico.
 * @param {number | null | undefined} teamId
 * @param {number} [currentId] técnico em edição
 */
async function checkTeam(teamId, currentId) {
  if (!teamId) return;
  const team = await prisma.team.findUnique({ where: { id: teamId }, select: { id: true, name: true } });
  if (!team) throw HttpError.unprocessable(`O time ${teamId} não existe.`);
  const holder = await coachRepository.findByTeam(teamId);
  if (holder && holder.id !== currentId) {
    throw HttpError.conflict(`O time ${team.name} já é dirigido por ${holder.name}. Desvincule o técnico atual antes.`);
  }
}

/** @param {object} body */
const toData = (body) => ({
  ...body,
  license: body.license ?? null,
  teamId: body.teamId ?? null,
  contractStart: new Date(body.contractStart),
});

/**
 * Regras de negócio dos técnicos.
 */
export const coachService = {
  async list() {
    return (await coachRepository.findAll()).map(present);
  },

  /** @param {number} id */
  async get(id) {
    const coach = await coachRepository.findById(id);
    if (!coach) throw HttpError.notFound(`O técnico ${id} não existe.`);
    return present(coach);
  },

  /** @param {object} body */
  async create(body) {
    await checkTeam(body.teamId);
    return present(await coachRepository.create(toData(body)));
  },

  /**
   * @param {number} id
   * @param {object} body
   */
  async update(id, body) {
    await this.get(id);
    await checkTeam(body.teamId, id);
    return present(await coachRepository.update(id, toData(body)));
  },

  /**
   * Remove o técnico e, em cascata, a sua comissão técnica.
   * @param {number} id
   */
  async remove(id) {
    await this.get(id);
    await coachRepository.delete(id);
  },
};
