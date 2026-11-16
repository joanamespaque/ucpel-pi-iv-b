import { prisma } from '../../lib/prisma.js';

const include = { team: { select: { id: true, name: true } } };

/**
 * Acesso a dados dos uniformes.
 */
export const kitRepository = {
  /**
   * @param {object} where
   * @param {{ skip: number, take: number }} page
   */
  async findMany(where, page) {
    const [items, total] = await prisma.$transaction([
      prisma.kit.findMany({ where, include, orderBy: [{ teamId: 'asc' }, { season: 'desc' }, { type: 'asc' }], ...page }),
      prisma.kit.count({ where }),
    ]);
    return { items, total };
  },

  /** @param {number} id */
  findById(id) {
    return prisma.kit.findUnique({ where: { id }, include });
  },

  /**
   * @param {number} teamId
   * @param {string} type
   * @param {number} season
   */
  findByKey(teamId, type, season) {
    return prisma.kit.findUnique({ where: { teamId_type_season: { teamId, type, season } } });
  },

  /** @param {object} data */
  create(data) {
    return prisma.kit.create({ data, include });
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  update(id, data) {
    return prisma.kit.update({ where: { id }, data, include });
  },

  /** @param {number} id */
  delete(id) {
    return prisma.kit.delete({ where: { id } });
  },
};
