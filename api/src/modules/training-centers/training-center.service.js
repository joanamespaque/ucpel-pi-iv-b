import { HttpError } from '../../lib/http-error.js';
import { toNumber } from '../../lib/serializers.js';
import { trainingCenterRepository } from './training-center.repository.js';

/**
 * Formata um CT para a resposta da API.
 * @param {object} center registro retornado pelo repositório
 */
function present(center) {
  const { _count, createdAt, updatedAt, ...rest } = center;
  const output = { ...rest, areaHa: toNumber(center.areaHa) };
  if (_count) {
    output.facilitiesCount = _count.facilities;
    output.teamsCount = _count.teams;
  }
  return output;
}

/**
 * Normaliza os campos opcionais: no PUT, um campo omitido passa a ser nulo.
 * @param {object} data
 */
const toData = (data) => ({ ...data, areaHa: data.areaHa ?? null, openedYear: data.openedYear ?? null });

/**
 * Regras de negócio dos centros de treinamento.
 */
export const trainingCenterService = {
  async list() {
    const centers = await trainingCenterRepository.findAll();
    return centers.map(present);
  },

  /** @param {number} id */
  async get(id) {
    const center = await trainingCenterRepository.findById(id);
    if (!center) throw HttpError.notFound(`O CT ${id} não existe.`);
    return present(center);
  },

  /** @param {object} data */
  async create(data) {
    return present(await trainingCenterRepository.create(toData(data)));
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  async update(id, data) {
    await this.get(id);
    return present(await trainingCenterRepository.update(id, toData(data)));
  },

  /**
   * Remove um CT. CTs que sediam times não podem ser removidos.
   * @param {number} id
   */
  async remove(id) {
    await this.get(id);
    const teams = await trainingCenterRepository.countTeams(id);
    if (teams > 0) throw HttpError.conflict(`O CT ${id} sedia ${teams} time(s). Transfira os times antes de removê-lo.`);
    const sessions = await trainingCenterRepository.countSessions(id);
    if (sessions > 0) {
      throw HttpError.conflict(`Os espaços do CT ${id} possuem ${sessions} treino(s) agendado(s). Remova os treinos antes.`);
    }
    await trainingCenterRepository.delete(id);
  },
};
