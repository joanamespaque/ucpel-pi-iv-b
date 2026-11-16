import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { toDateOnly, toPage } from '../../lib/serializers.js';
import { sessionRepository } from './session.repository.js';

/** @param {object} session */
function present(session) {
  const { createdAt, updatedAt, ...rest } = session;
  return { ...rest, date: toDateOnly(session.date) };
}

/** @param {object} body */
const toData = (body) => ({ ...body, kitId: body.kitId ?? null, notes: body.notes ?? null, date: new Date(body.date) });

/**
 * Aplica as regras de agendamento:
 * o espaço deve pertencer ao CT do time, o uniforme deve ser do time
 * e o espaço não pode ter outro treino no mesmo horário.
 * @param {object} data dados já convertidos
 * @param {number} [currentId] treino em edição
 */
async function checkRules(data, currentId) {
  const team = await prisma.team.findUnique({ where: { id: data.teamId }, select: { id: true, trainingCenterId: true } });
  if (!team) throw HttpError.unprocessable(`O time ${data.teamId} não existe.`);

  const facility = await prisma.facility.findUnique({ where: { id: data.facilityId }, select: { trainingCenterId: true, name: true } });
  if (!facility) throw HttpError.unprocessable(`O espaço ${data.facilityId} não existe.`);
  if (facility.trainingCenterId !== team.trainingCenterId) {
    throw HttpError.unprocessable(`O espaço ${facility.name} não pertence ao CT do time.`);
  }

  if (data.kitId) {
    const kit = await prisma.kit.findUnique({ where: { id: data.kitId }, select: { teamId: true } });
    if (!kit) throw HttpError.unprocessable(`O uniforme ${data.kitId} não existe.`);
    if (kit.teamId !== data.teamId) throw HttpError.unprocessable('O uniforme informado pertence a outro time.');
  }

  const overlap = await sessionRepository.findOverlap(data, currentId);
  if (overlap) {
    throw HttpError.conflict(
      `O espaço ${facility.name} já está reservado das ${overlap.startTime} às ${overlap.endTime} para ${overlap.team.name}.`,
    );
  }
}

/**
 * Regras de negócio dos treinos.
 */
export const sessionService = {
  /**
   * Lista treinos. Aceita uma data exata ou um intervalo (de/ate), útil para a agenda da semana.
   * @param {{ timeId?: number, espacoId?: number, data?: string, de?: string, ate?: string, pagina?: number, limite?: number }} query
   */
  async list(query = {}) {
    const where = {};
    if (query.timeId) where.teamId = query.timeId;
    if (query.espacoId) where.facilityId = query.espacoId;
    if (query.data) where.date = new Date(query.data);
    else if (query.de || query.ate) {
      where.date = {};
      if (query.de) where.date.gte = new Date(query.de);
      if (query.ate) where.date.lte = new Date(query.ate);
    }
    const { items, total } = await sessionRepository.findMany(where, toPage(query));
    return { items: items.map(present), total };
  },

  /** @param {number} id */
  async get(id) {
    const session = await sessionRepository.findById(id);
    if (!session) throw HttpError.notFound(`O treino ${id} não existe.`);
    return present(session);
  },

  /** @param {object} body */
  async create(body) {
    const data = toData(body);
    await checkRules(data);
    return present(await sessionRepository.create(data));
  },

  /**
   * @param {number} id
   * @param {object} body
   */
  async update(id, body) {
    await this.get(id);
    const data = toData(body);
    await checkRules(data, id);
    return present(await sessionRepository.update(id, data));
  },

  /** @param {number} id */
  async remove(id) {
    await this.get(id);
    await sessionRepository.delete(id);
  },
};
