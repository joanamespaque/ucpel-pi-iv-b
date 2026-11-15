import { describe, expect, it } from 'vitest';
import { api, auth, validPlayer } from './helpers.js';

describe('Jogadores: ciclo completo GET, POST, PUT e DELETE', () => {
  let createdId;

  it('POST /api/v1/jogadores cria um jogador (201 + Location)', async () => {
    const res = await api.post('/api/v1/jogadores').set(auth).send(validPlayer());
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe(`/api/v1/jogadores/${res.body.id}`);
    expect(res.body).toMatchObject({ number: 88, status: 'DISPONIVEL', birthDate: '2003-05-10' });
    createdId = res.body.id;
  });

  it('GET /api/v1/jogadores/:id retorna o jogador criado', async () => {
    const res = await api.get(`/api/v1/jogadores/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.team.name).toBe('Internacional (feminino)');
  });

  it('PUT /api/v1/jogadores/:id atualiza situação e número', async () => {
    const res = await api
      .put(`/api/v1/jogadores/${createdId}`)
      .set(auth)
      .send(validPlayer({ number: 89, status: 'EM_TRATAMENTO' }));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ number: 89, status: 'EM_TRATAMENTO' });
  });

  it('DELETE /api/v1/jogadores/:id remove o jogador (204)', async () => {
    const res = await api.delete(`/api/v1/jogadores/${createdId}`).set(auth);
    expect(res.status).toBe(204);
    expect((await api.get(`/api/v1/jogadores/${createdId}`)).status).toBe(404);
  });
});

describe('Jogadores: filtros e regras de negócio', () => {
  it('GET /api/v1/jogadores filtra por situação', async () => {
    const res = await api.get('/api/v1/jogadores?situacao=SUSPENSO');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((p) => p.status === 'SUSPENSO')).toBe(true);
  });

  it('GET /api/v1/jogadores rejeita filtro inválido (400)', async () => {
    const res = await api.get('/api/v1/jogadores?posicao=PONTA');
    expect(res.status).toBe(400);
  });

  it('POST rejeita número de camisa repetido no mesmo time (409)', async () => {
    const res = await api
      .post('/api/v1/jogadores')
      .set(auth)
      .send(validPlayer({ number: 10 }));
    expect(res.status).toBe(409);
    expect(res.body.detail).toContain('Carol Vieira');
  });

  it('POST aceita o mesmo número em outro time', async () => {
    const res = await api
      .post('/api/v1/jogadores')
      .set(auth)
      .send(validPlayer({ number: 88, teamId: 1 }));
    expect(res.status).toBe(201);
    await api.delete(`/api/v1/jogadores/${res.body.id}`).set(auth);
  });

  it('POST com time inexistente responde 422', async () => {
    const res = await api
      .post('/api/v1/jogadores')
      .set(auth)
      .send(validPlayer({ teamId: 999 }));
    expect(res.status).toBe(422);
  });

  it('POST com dados inválidos lista os erros por campo (400)', async () => {
    const res = await api.post('/api/v1/jogadores').set(auth).send({ name: 'Ab', number: 0, birthDate: '10/05/2003' });
    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e) => e.field);
    expect(fields).toEqual(expect.arrayContaining(['name', 'number', 'birthDate', 'shirtName', 'position', 'teamId']));
    expect(res.body.errors.find((e) => e.field === 'shirtName').message).toBe('Campo obrigatório.');
  });

  it('PUT de jogador inexistente responde 404', async () => {
    const res = await api.put('/api/v1/jogadores/9999').set(auth).send(validPlayer());
    expect(res.status).toBe(404);
  });
});
