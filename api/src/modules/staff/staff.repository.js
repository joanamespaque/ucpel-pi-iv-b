import { prisma } from '../../lib/prisma.js';

const include = { coach: { select: { id: true, name: true, teamId: true } } };

/**
 * Acesso a dados da comissão técnica.
 */
export const staffRepository = {
  /**
   * @param {object} where
   * @param {{ skip: number, take: number }} page
   */
  async findMany(where, page) {
    const [items, total] = await prisma.$transaction([
      prisma.staffMember.findMany({ where, include, orderBy: [{ coachId: 'asc' }, { role: 'asc' }, { id: 'asc' }], ...page }),
      prisma.staffMember.count({ where }),
    ]);
    return { items, total };
  },

  /** @param {number} id */
  findById(id) {
    return prisma.staffMember.findUnique({ where: { id }, include });
  },

  /** @param {object} data */
  create(data) {
    return prisma.staffMember.create({ data, include });
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  update(id, data) {
    return prisma.staffMember.update({ where: { id }, data, include });
  },

  /** @param {number} id */
  delete(id) {
    return prisma.staffMember.delete({ where: { id } });
  },
};
