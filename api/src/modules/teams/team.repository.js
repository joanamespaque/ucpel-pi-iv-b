import { prisma } from '../../lib/prisma.js';

const summaryInclude = {
  trainingCenter: { select: { id: true, name: true } },
  coach: { select: { id: true, name: true } },
  _count: { select: { players: true } },
};

/**
 * Acesso a dados dos times.
 */
export const teamRepository = {
  findAll() {
    return prisma.team.findMany({ orderBy: { id: 'asc' }, include: summaryInclude });
  },

  /** @param {number} id */
  findById(id) {
    return prisma.team.findUnique({ where: { id }, include: summaryInclude });
  },

  /** @param {object} data */
  create(data) {
    return prisma.team.create({ data, include: summaryInclude });
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  update(id, data) {
    return prisma.team.update({ where: { id }, data, include: summaryInclude });
  },

  /** @param {number} id */
  delete(id) {
    return prisma.team.delete({ where: { id } });
  },
};
