import { prisma } from '../../lib/prisma.js';

const include = {
  team: { select: { id: true, name: true } },
  facility: { select: { id: true, name: true, type: true, trainingCenterId: true } },
  kit: { select: { id: true, type: true, colors: true } },
};

/**
 * Acesso a dados dos treinos.
 */
export const sessionRepository = {
  /**
   * @param {object} where
   * @param {{ skip: number, take: number }} page
   */
  async findMany(where, page) {
    const [items, total] = await prisma.$transaction([
      prisma.trainingSession.findMany({ where, include, orderBy: [{ date: 'asc' }, { startTime: 'asc' }], ...page }),
      prisma.trainingSession.count({ where }),
    ]);
    return { items, total };
  },

  /** @param {number} id */
  findById(id) {
    return prisma.trainingSession.findUnique({ where: { id }, include });
  },

  /**
   * Treinos do mesmo espaço e data que se sobrepõem ao intervalo informado.
   * Dois intervalos se sobrepõem quando cada um começa antes do fim do outro.
   * @param {{ facilityId: number, date: Date, startTime: string, endTime: string }} slot
   * @param {number} [excludeId]
   */
  findOverlap({ facilityId, date, startTime, endTime }, excludeId) {
    return prisma.trainingSession.findFirst({
      where: {
        facilityId,
        date,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      include: { team: { select: { name: true } } },
    });
  },

  /** @param {object} data */
  create(data) {
    return prisma.trainingSession.create({ data, include });
  },

  /**
   * @param {number} id
   * @param {object} data
   */
  update(id, data) {
    return prisma.trainingSession.update({ where: { id }, data, include });
  },

  /** @param {number} id */
  delete(id) {
    return prisma.trainingSession.delete({ where: { id } });
  },
};
