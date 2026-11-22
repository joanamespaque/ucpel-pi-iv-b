import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { teamRepository } from './team.repository.js';

/**
 * Formata um time para a resposta da API.
 * @param {object} team
 */
function present(team) {
  const { _count, createdAt, updatedAt, ...rest } = team;
  return { ...rest, playersCount: _count?.players ?? 0 };
}

/**
 * Garante que o CT informado existe.
 * @param {number} trainingCenterId
 */
async function ensureTrainingCenter(trainingCenterId) {
  const exists = await prisma.trainingCenter.count({ where: { id: trainingCenterId } });
  if (!exists) throw HttpError.unprocessable(`O CT ${trainingCenterId} não existe.`);
}

/**
 * Regras de negócio dos times.
 */
export const teamService = {
  async list() {
    return (await teamRepository.findAll()).map(present);
  },

  /** @param {number} id */
  async get(id) {
    const team = await teamRepository.findById(id);
    if (!team) throw HttpError.notFound(`O time ${id} não existe.`);
    return present(team);
  },

  /** @param {object} data */
  async create(data) {
    await ensureTrainingCenter(data.trainingCenterId);
    return present(await teamRepository.create({ ...data, nickname: data.nickname ?? null }));
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  async update(id, data) {
    const current = await this.get(id);
    await ensureTrainingCenter(data.trainingCenterId);
    if (data.trainingCenterId !== current.trainingCenterId) {
      const sessions = await prisma.trainingSession.count({ where: { teamId: id } });
      if (sessions > 0) {
        throw HttpError.conflict(
          `O time ${id} possui ${sessions} treino(s) em espaços do CT atual. Remova os treinos antes de transferir o time.`,
        );
      }
    }
    return present(await teamRepository.update(id, { ...data, nickname: data.nickname ?? null }));
  },

  /**
   * Remove um time. Times com elenco cadastrado não podem ser removidos,
   * para evitar a exclusão em cascata de jogadores.
   * @param {number} id
   */
  async remove(id) {
    const team = await this.get(id);
    if (team.playersCount > 0) {
      throw HttpError.conflict(`O time ${id} possui ${team.playersCount} jogador(es) cadastrado(s). Remova ou transfira o elenco antes.`);
    }
    await teamRepository.delete(id);
  },
};
