import { prisma } from '../../lib/prisma.js';

const include = { trainingCenter: { select: { id: true, name: true } } };

/**
 * Acesso a dados dos espaços dos CTs.
 */
export const facilityRepository = {
  /**
   * @param {object} where filtros do Prisma
   * @param {{ skip: number, take: number }} page
   */
  async findMany(where, page) {
    const [items, total] = await prisma.$transaction([
      prisma.facility.findMany({ where, include, orderBy: [{ trainingCenterId: 'asc' }, { id: 'asc' }], ...page }),
      prisma.facility.count({ where }),
    ]);
    return { items, total };
  },

  /** @param {number} id */
  findById(id) {
    return prisma.facility.findUnique({ where: { id }, include });
  },

  /** @param {object} data */
  create(data) {
    return prisma.facility.create({ data, include });
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  update(id, data) {
    return prisma.facility.update({ where: { id }, data, include });
  },

  /** @param {number} id */
  delete(id) {
    return prisma.facility.delete({ where: { id } });
  },

  /** @param {number} id */
  countSessions(id) {
    return prisma.trainingSession.count({ where: { facilityId: id } });
  },
};
