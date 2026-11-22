import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { toPage } from '../../lib/serializers.js';
import { kitRepository } from './kit.repository.js';

/** @param {object} kit */
function present(kit) {
  const { createdAt, updatedAt, ...rest } = kit;
  return rest;
}

/**
 * Valida o time e a unicidade do tipo de uniforme na temporada.
 * @param {object} body
 * @param {number} [currentId]
 */
async function checkRules(body, currentId) {
  const teamExists = await prisma.team.count({ where: { id: body.teamId } });
  if (!teamExists) throw HttpError.unprocessable(`O time ${body.teamId} não existe.`);
  const existing = await kitRepository.findByKey(body.teamId, body.type, body.season);
  if (existing && existing.id !== currentId) {
    throw HttpError.conflict(`O time já possui um uniforme ${body.type} na temporada ${body.season}.`);
  }
}

/**
 * Regras de negócio dos uniformes.
 */
export const kitService = {
  /** @param {{ timeId?: number, tipo?: string, temporada?: number, pagina?: number, limite?: number }} query */
  async list(query = {}) {
    const where = {};
    if (query.timeId) where.teamId = query.timeId;
    if (query.tipo) where.type = query.tipo;
    if (query.temporada) where.season = query.temporada;
    const { items, total } = await kitRepository.findMany(where, toPage(query));
    return { items: items.map(present), total };
  },

  /** @param {number} id */
  async get(id) {
    const kit = await kitRepository.findById(id);
    if (!kit) throw HttpError.notFound(`O uniforme ${id} não existe.`);
    return present(kit);
  },

  /** @param {object} body */
  async create(body) {
    await checkRules(body);
    return present(await kitRepository.create(body));
  },

  /**
   * @param {number} id
   * @param {object} body
   */
  async update(id, body) {
    const current = await this.get(id);
    await checkRules(body, id);
    if (body.teamId !== current.teamId) {
      const sessions = await prisma.trainingSession.count({ where: { kitId: id } });
      if (sessions > 0) {
        throw HttpError.conflict(`O uniforme ${id} é usado em ${sessions} treino(s) e não pode mudar de time.`);
      }
    }
    return present(await kitRepository.update(id, body));
  },

  /**
   * Remove o uniforme. Treinos que o usavam ficam sem uniforme definido.
   * @param {number} id
   */
  async remove(id) {
    await this.get(id);
    await kitRepository.delete(id);
  },
};
