import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { toPage } from '../../lib/serializers.js';
import { staffRepository } from './staff.repository.js';

/** @param {object} member */
function present(member) {
  const { createdAt, updatedAt, ...rest } = member;
  return rest;
}

/** @param {number} coachId */
async function ensureCoach(coachId) {
  const exists = await prisma.coach.count({ where: { id: coachId } });
  if (!exists) throw HttpError.unprocessable(`O técnico ${coachId} não existe.`);
}

/**
 * Regras de negócio da comissão técnica.
 */
export const staffService = {
  /** @param {{ tecnicoId?: number, cargo?: string, pagina?: number, limite?: number }} query */
  async list(query = {}) {
    const where = {};
    if (query.tecnicoId) where.coachId = query.tecnicoId;
    if (query.cargo) where.role = query.cargo;
    const { items, total } = await staffRepository.findMany(where, toPage(query));
    return { items: items.map(present), total };
  },

  /** @param {number} id */
  async get(id) {
    const member = await staffRepository.findById(id);
    if (!member) throw HttpError.notFound(`O integrante ${id} da comissão não existe.`);
    return present(member);
  },

  /** @param {object} data */
  async create(data) {
    await ensureCoach(data.coachId);
    return present(await staffRepository.create(data));
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  async update(id, data) {
    await this.get(id);
    await ensureCoach(data.coachId);
    return present(await staffRepository.update(id, data));
  },

  /** @param {number} id */
  async remove(id) {
    await this.get(id);
    await staffRepository.delete(id);
  },
};
