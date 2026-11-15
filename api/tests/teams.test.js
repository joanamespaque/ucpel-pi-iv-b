import { describe, expect, it } from 'vitest';
import { api, auth } from './helpers.js';

describe('Times', () => {
  it('GET /api/v1/times lista os times masculino e feminino', async () => {
    const res = await api.get('/api/v1/times');
    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.category)).toEqual(['MASCULINO', 'FEMININO']);
    expect(res.body[0].coach).not.toBeNull();
    expect(res.body[0].playersCount).toBe(25);
  });

  it('GET /api/v1/times/:id/jogadores lista o elenco com filtro de posição', async () => {
    const res = await api.get('/api/v1/times/1/jogadores?posicao=GOLEIRO');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body.every((p) => p.position === 'GOLEIRO' && p.teamId === 1)).toBe(true);
  });

  it('POST /api/v1/times rejeita categoria já cadastrada (409)', async () => {
    const res = await api.post('/api/v1/times').set(auth).send({ name: 'Time Duplicado', category: 'FEMININO', trainingCenterId: 2 });
    expect(res.status).toBe(409);
  });

  it('POST /api/v1/times rejeita corpo inválido (400)', async () => {
    const res = await api.post('/api/v1/times').set(auth).send({ name: 'X', category: 'MISTO' });
    expect(res.status).toBe(400);
    expect(res.body.errors.map((e) => e.field)).toEqual(expect.arrayContaining(['name', 'category', 'trainingCenterId']));
  });

  it('PUT /api/v1/times/:id atualiza o time', async () => {
    const current = (await api.get('/api/v1/times/2')).body;
    const res = await api
      .put('/api/v1/times/2')
      .set(auth)
      .send({
        name: current.name,
        category: current.category,
        nickname: current.nickname,
        competitions: [...current.competitions, 'Supercopa do Brasil Feminina'],
        trainingCenterId: current.trainingCenterId,
      });
    expect(res.status).toBe(200);
    expect(res.body.competitions).toContain('Supercopa do Brasil Feminina');
  });

  it('PUT /api/v1/times/:id com CT inexistente responde 422', async () => {
    const res = await api
      .put('/api/v1/times/2')
      .set(auth)
      .send({ name: 'Internacional (feminino)', category: 'FEMININO', trainingCenterId: 999 });
    expect(res.status).toBe(422);
  });

  it('DELETE /api/v1/times/:id com elenco cadastrado responde 409', async () => {
    const res = await api.delete('/api/v1/times/1').set(auth);
    expect(res.status).toBe(409);
  });

  it('DELETE /api/v1/times/:id inexistente responde 404', async () => {
    const res = await api.delete('/api/v1/times/999').set(auth);
    expect(res.status).toBe(404);
  });
});
