import { prisma } from '../../lib/prisma.js';

const include = {
  team: { select: { id: true, name: true, category: true } },
  _count: { select: { staff: true } },
};

/**
 * Acesso a dados dos técnicos.
 */
export const coachRepository = {
  findAll() {
    return prisma.coach.findMany({ include, orderBy: { id: 'asc' } });
  },

  /** @param {number} id */
  findById(id) {
    return prisma.coach.findUnique({ where: { id }, include });
  },

  /** @param {number} teamId */
  findByTeam(teamId) {
    return prisma.coach.findUnique({ where: { teamId } });
  },

  /** @param {object} data */
  create(data) {
    return prisma.coach.create({ data, include });
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  update(id, data) {
    return prisma.coach.update({ where: { id }, data, include });
  },

  /** @param {number} id */
  delete(id) {
    return prisma.coach.delete({ where: { id } });
  },
};
