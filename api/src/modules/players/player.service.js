import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { toDateOnly, toPage } from '../../lib/serializers.js';
import { playerRepository } from './player.repository.js';

/**
 * Formata um jogador para a resposta da API.
 * @param {object} player
 */
function present(player) {
  const { createdAt, updatedAt, ...rest } = player;
  return { ...rest, birthDate: toDateOnly(player.birthDate) };
}

/**
 * Converte o corpo validado no formato do banco.
 * @param {object} body
 */
function toData(body) {
  return { ...body, birthDate: new Date(body.birthDate) };
}

/**
 * Valida o time e a exclusividade do número da camisa.
 * @param {object} body dados do jogador
 * @param {number} [currentId] id do jogador em edição
 */
async function checkRules(body, currentId) {
  const teamExists = await prisma.team.count({ where: { id: body.teamId } });
  if (!teamExists) throw HttpError.unprocessable(`O time ${body.teamId} não existe.`);

  const holder = await playerRepository.findByNumber(body.teamId, body.number);
  if (holder && holder.id !== currentId) {
    throw HttpError.conflict(`O número ${body.number} já é usado por ${holder.shirtName} neste time.`);
  }
}

/**
 * Regras de negócio dos jogadores.
 */
export const playerService = {
  /**
   * Lista jogadores com filtros opcionais e paginação.
   * @param {{ timeId?: number, posicao?: string, situacao?: string, pagina?: number, limite?: number }} query
   */
  async list(query = {}) {
    const filters = {};
    if (query.timeId) filters.teamId = query.timeId;
    if (query.posicao) filters.position = query.posicao;
    if (query.situacao) filters.status = query.situacao;
    const { items, total } = await playerRepository.findMany(filters, toPage(query));
    return { items: items.map(present), total };
  },

  /** @param {number} id */
  async get(id) {
    const player = await playerRepository.findById(id);
    if (!player) throw HttpError.notFound(`O jogador ${id} não existe.`);
    return present(player);
  },

  /** @param {object} body */
  async create(body) {
    await checkRules(body);
    return present(await playerRepository.create(toData(body)));
  },

  /**
   * @param {number} id
   * @param {object} body
   */
  async update(id, body) {
    await this.get(id);
    await checkRules(body, id);
    return present(await playerRepository.update(id, toData(body)));
  },

  /** @param {number} id */
  async remove(id) {
    await this.get(id);
    await playerRepository.delete(id);
  },
};
