import { prisma } from '../../lib/prisma.js';

const include = { team: { select: { id: true, name: true } } };

/**
 * Acesso a dados dos jogadores.
 */
export const playerRepository = {
  /**
   * @param {{ teamId?: number, position?: string, status?: string }} filters
   */
  findMany(filters) {
    return prisma.player.findMany({
      where: filters,
      orderBy: [{ teamId: 'asc' }, { number: 'asc' }],
      include,
    });
  },

  /** @param {number} id */
  findById(id) {
    return prisma.player.findUnique({ where: { id }, include });
  },

  /**
   * Busca o jogador que usa um número no time.
   * @param {number} teamId
   * @param {number} number
   */
  findByNumber(teamId, number) {
    return prisma.player.findUnique({ where: { teamId_number: { teamId, number } } });
  },

  /** @param {object} data */
  create(data) {
    return prisma.player.create({ data, include });
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  update(id, data) {
    return prisma.player.update({ where: { id }, data, include });
  },

  /** @param {number} id */
  delete(id) {
    return prisma.player.delete({ where: { id } });
  },
};
