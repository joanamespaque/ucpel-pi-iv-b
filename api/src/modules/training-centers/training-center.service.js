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
};
