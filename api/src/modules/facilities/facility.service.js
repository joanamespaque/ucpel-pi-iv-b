import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { toPage } from '../../lib/serializers.js';
import { facilityRepository } from './facility.repository.js';

/** @param {object} facility */
function present(facility) {
  const { createdAt, updatedAt, ...rest } = facility;
  return rest;
}

/** @param {number} trainingCenterId */
async function ensureTrainingCenter(trainingCenterId) {
  const exists = await prisma.trainingCenter.count({ where: { id: trainingCenterId } });
  if (!exists) throw HttpError.unprocessable(`O CT ${trainingCenterId} não existe.`);
}

/**
 * Regras de negócio dos espaços.
 */
export const facilityService = {
  /** @param {{ ctId?: number, tipo?: string, pagina?: number, limite?: number }} query */
  async list(query = {}) {
    const where = {};
    if (query.ctId) where.trainingCenterId = query.ctId;
    if (query.tipo) where.type = query.tipo;
    const { items, total } = await facilityRepository.findMany(where, toPage(query));
    return { items: items.map(present), total };
  },

  /** @param {number} id */
  async get(id) {
    const facility = await facilityRepository.findById(id);
    if (!facility) throw HttpError.notFound(`O espaço ${id} não existe.`);
    return present(facility);
  },

  /** @param {object} data */
  async create(data) {
    await ensureTrainingCenter(data.trainingCenterId);
    return present(await facilityRepository.create(data));
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  async update(id, data) {
    await this.get(id);
    await ensureTrainingCenter(data.trainingCenterId);
    return present(await facilityRepository.update(id, data));
  },

  /**
   * Remove um espaço sem treinos agendados.
   * @param {number} id
   */
  async remove(id) {
    await this.get(id);
    const sessions = await facilityRepository.countSessions(id);
    if (sessions > 0) throw HttpError.conflict(`O espaço ${id} possui ${sessions} treino(s) agendado(s).`);
    await facilityRepository.delete(id);
  },
};
