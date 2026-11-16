import { prisma } from '../../lib/prisma.js';

/**
 * Acesso a dados dos centros de treinamento.
 */
export const trainingCenterRepository = {
  /** Lista todos os CTs com a contagem de espaços e times. */
  findAll() {
    return prisma.trainingCenter.findMany({
      orderBy: { id: 'asc' },
      include: { _count: { select: { facilities: true, teams: true } } },
    });
  },

  /**
   * Busca um CT com seus espaços e times.
   * @param {number} id
   */
  findById(id) {
    return prisma.trainingCenter.findUnique({
      where: { id },
      include: {
        facilities: { orderBy: { id: 'asc' } },
        teams: { orderBy: { id: 'asc' }, select: { id: true, name: true, category: true, nickname: true } },
      },
    });
  },

  /** @param {object} data */
  create(data) {
    return prisma.trainingCenter.create({ data });
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  update(id, data) {
    return prisma.trainingCenter.update({ where: { id }, data });
  },

  /** @param {number} id */
  delete(id) {
    return prisma.trainingCenter.delete({ where: { id } });
  },

  /** @param {number} id */
  countTeams(id) {
    return prisma.team.count({ where: { trainingCenterId: id } });
  },
};
