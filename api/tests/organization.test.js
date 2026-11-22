import { describe, expect, it } from 'vitest';
import { api, auth } from './helpers.js';

describe('CTs e espaços', () => {
  it('ciclo completo de um CT: POST, PUT, GET e DELETE', async () => {
    const created = await api.post('/api/v1/cts').set(auth).send({ name: 'CT de Teste', city: 'Pelotas', address: 'Rua de Teste, 100' });
    expect(created.status).toBe(201);
    const id = created.body.id;
    const updated = await api
      .put(`/api/v1/cts/${id}`)
      .set(auth)
      .send({ name: 'CT de Teste', city: 'Pelotas', address: 'Rua de Teste, 200', areaHa: 2.5 });
    expect(updated.status).toBe(200);
    expect(updated.body.areaHa).toBe(2.5);
    expect((await api.delete(`/api/v1/cts/${id}`).set(auth)).status).toBe(204);
  });

  it('DELETE de CT que sedia times responde 409', async () => {
    expect((await api.delete('/api/v1/cts/1').set(auth)).status).toBe(409);
  });

  it('GET /api/v1/cts/:id/espacos filtra por tipo e informa o total', async () => {
    const res = await api.get('/api/v1/cts/1/espacos?tipo=CAMPO');
    expect(res.status).toBe(200);
    expect(res.headers['x-total-count']).toBe('2');
    expect(res.body.every((f) => f.type === 'CAMPO' && f.trainingCenterId === 1)).toBe(true);
  });

  it('ciclo completo de um espaço e bloqueio de exclusão com treinos', async () => {
    const created = await api.post('/api/v1/espacos').set(auth).send({ name: 'Campo 3', type: 'CAMPO', capacity: 30, trainingCenterId: 1 });
    expect(created.status).toBe(201);
    const id = created.body.id;
    expect(
      (await api.put(`/api/v1/espacos/${id}`).set(auth).send({ name: 'Campo 3', type: 'CAMPO', capacity: 35, trainingCenterId: 1 })).body
        .capacity,
    ).toBe(35);
    expect((await api.delete(`/api/v1/espacos/${id}`).set(auth)).status).toBe(204);
    expect((await api.delete('/api/v1/espacos/1').set(auth)).status).toBe(409);
  });

  it('nome de espaço repetido no mesmo CT responde 409', async () => {
    const res = await api.post('/api/v1/espacos').set(auth).send({ name: 'Campo 1', type: 'CAMPO', trainingCenterId: 1 });
    expect(res.status).toBe(409);
  });
});

describe('Técnicos e comissão técnica', () => {
  it('GET /api/v1/tecnicos lista os técnicos com o time vinculado', async () => {
    const res = await api.get('/api/v1/tecnicos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].team.category).toBe('MASCULINO');
    expect(res.body[0].staffCount).toBe(11);
  });

  it('GET /api/v1/tecnicos/:id/comissao filtra por cargo', async () => {
    const res = await api.get('/api/v1/tecnicos/1/comissao?cargo=AUXILIAR_TECNICO');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('não permite dois técnicos no mesmo time (409)', async () => {
    const res = await api
      .post('/api/v1/tecnicos')
      .set(auth)
      .send({ name: 'Técnico Extra', nationality: 'Brasil', contractStart: '2026-11-01', teamId: 1 });
    expect(res.status).toBe(409);
  });

  it('ciclo completo: técnico sem time, comissão, vínculo e remoção em cascata', async () => {
    const coach = await api
      .post('/api/v1/tecnicos')
      .set(auth)
      .send({ name: 'Técnico Interino', nationality: 'Brasil', contractStart: '2026-11-10' });
    expect(coach.status).toBe(201);
    expect(coach.body.teamId).toBeNull();
    const member = await api
      .post('/api/v1/comissao')
      .set(auth)
      .send({ name: 'Auxiliar Interino', role: 'AUXILIAR_TECNICO', coachId: coach.body.id });
    expect(member.status).toBe(201);
    const edited = await api
      .put(`/api/v1/comissao/${member.body.id}`)
      .set(auth)
      .send({ name: 'Auxiliar Interino', role: 'PREPARADOR_FISICO', coachId: coach.body.id });
    expect(edited.body.role).toBe('PREPARADOR_FISICO');
    expect((await api.delete(`/api/v1/tecnicos/${coach.body.id}`).set(auth)).status).toBe(204);
    expect((await api.get(`/api/v1/comissao/${member.body.id}`)).status).toBe(404);
  });

  it('comissão com técnico inexistente responde 422', async () => {
    const res = await api.post('/api/v1/comissao').set(auth).send({ name: 'Pessoa Teste', role: 'MEDICO', coachId: 999 });
    expect(res.status).toBe(422);
  });
});

describe('Uniformes', () => {
  it('GET /api/v1/times/:id/uniformes lista os seis uniformes da temporada', async () => {
    const res = await api.get('/api/v1/times/2/uniformes?temporada=2026');
    expect(res.status).toBe(200);
    expect(res.headers['x-total-count']).toBe('6');
  });

  it('não permite dois uniformes do mesmo tipo na temporada (409)', async () => {
    const res = await api
      .post('/api/v1/uniformes')
      .set(auth)
      .send({ type: 'JOGO_1', season: 2026, colors: 'Vermelho', supplier: 'Adidas', teamId: 1 });
    expect(res.status).toBe(409);
  });

  it('ciclo completo de um uniforme de outra temporada', async () => {
    const created = await api
      .post('/api/v1/uniformes')
      .set(auth)
      .send({ type: 'JOGO_1', season: 2027, colors: 'Vermelho', supplier: 'Adidas', teamId: 1 });
    expect(created.status).toBe(201);
    const id = created.body.id;
    const updated = await api
      .put(`/api/v1/uniformes/${id}`)
      .set(auth)
      .send({ type: 'JOGO_1', season: 2027, colors: 'Vermelho e branco', supplier: 'Adidas', teamId: 1 });
    expect(updated.body.colors).toBe('Vermelho e branco');
    expect((await api.delete(`/api/v1/uniformes/${id}`).set(auth)).status).toBe(204);
  });
});

describe('Treinos', () => {
  const base = { date: '2026-11-23', startTime: '09:00', endTime: '10:30', type: 'TATICO', teamId: 1, facilityId: 1 };

  it('GET /api/v1/treinos aceita intervalo de datas para a agenda da semana', async () => {
    const res = await api.get('/api/v1/treinos?de=2026-11-16&ate=2026-11-20&timeId=2');
    expect(res.status).toBe(200);
    expect(res.headers['x-total-count']).toBe('6');
    expect(res.body[0].date <= res.body.at(-1).date).toBe(true);
  });

  it('GET /api/v1/times/:id/treinos filtra pela data', async () => {
    const res = await api.get('/api/v1/times/1/treinos?data=2026-11-17');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('ciclo completo de um treino: POST, PUT, GET e DELETE', async () => {
    const created = await api.post('/api/v1/treinos').set(auth).send(base);
    expect(created.status).toBe(201);
    const id = created.body.id;
    const updated = await api
      .put(`/api/v1/treinos/${id}`)
      .set(auth)
      .send({ ...base, endTime: '11:00', notes: 'Treino estendido' });
    expect(updated.body).toMatchObject({ endTime: '11:00', notes: 'Treino estendido' });
    expect((await api.get(`/api/v1/treinos/${id}`)).body.facility.name).toBe('Campo 1');
    expect((await api.delete(`/api/v1/treinos/${id}`).set(auth)).status).toBe(204);
  });

  it('horário sobreposto no mesmo espaço responde 409', async () => {
    const res = await api
      .post('/api/v1/treinos')
      .set(auth)
      .send({ ...base, date: '2026-11-17', startTime: '10:00', endTime: '11:00' });
    expect(res.status).toBe(409);
    expect(res.body.detail).toContain('09:30');
  });

  it('horários encostados (fim de um igual ao início do outro) são aceitos', async () => {
    const res = await api
      .post('/api/v1/treinos')
      .set(auth)
      .send({ ...base, date: '2026-11-17', startTime: '11:30', endTime: '12:30' });
    expect(res.status).toBe(201);
    await api.delete(`/api/v1/treinos/${res.body.id}`).set(auth);
  });

  it('espaço de outro CT responde 422', async () => {
    const res = await api
      .post('/api/v1/treinos')
      .set(auth)
      .send({ ...base, teamId: 2 });
    expect(res.status).toBe(422);
    expect(res.body.detail).toContain('não pertence ao CT do time');
  });

  it('uniforme de outro time responde 422', async () => {
    const womenKit = (await api.get('/api/v1/times/2/uniformes?tipo=TREINO')).body[0].id;
    const res = await api
      .post('/api/v1/treinos')
      .set(auth)
      .send({ ...base, kitId: womenKit });
    expect(res.status).toBe(422);
  });

  it('término antes do início e horário inválido respondem 400', async () => {
    expect(
      (
        await api
          .post('/api/v1/treinos')
          .set(auth)
          .send({ ...base, endTime: '08:00' })
      ).status,
    ).toBe(400);
    expect(
      (
        await api
          .post('/api/v1/treinos')
          .set(auth)
          .send({ ...base, startTime: '25:00' })
      ).status,
    ).toBe(400);
  });
});

describe('Paginação', () => {
  it('GET /api/v1/jogadores respeita pagina e limite e informa o total', async () => {
    const page1 = await api.get('/api/v1/jogadores?limite=10&pagina=1');
    const page2 = await api.get('/api/v1/jogadores?limite=10&pagina=2');
    expect(page1.body).toHaveLength(10);
    expect(page1.headers['x-total-count']).toBe('50');
    expect(page1.body[0].id).not.toBe(page2.body[0].id);
  });

  it('limite acima de 100 responde 400', async () => {
    expect((await api.get('/api/v1/jogadores?limite=500')).status).toBe(400);
  });
});

describe('Integridade entre recursos', () => {
  const team1 = async () => (await api.get('/api/v1/times/1')).body;

  it('PUT de time com treinos para outro CT responde 409', async () => {
    const { id, name, category, nickname, competitions } = await team1();
    const res = await api.put(`/api/v1/times/${id}`).set(auth).send({ name, category, nickname, competitions, trainingCenterId: 2 });
    expect(res.status).toBe(409);
  });

  it('PUT de espaço com treinos para outro CT responde 409', async () => {
    const facility = (await api.get('/api/v1/espacos/1')).body;
    const res = await api
      .put('/api/v1/espacos/1')
      .set(auth)
      .send({ name: facility.name, type: facility.type, capacity: facility.capacity, trainingCenterId: 2 });
    expect(res.status).toBe(409);
  });

  it('PUT de uniforme usado em treinos para outro time responde 409', async () => {
    const kit = (await api.get('/api/v1/times/1/uniformes?tipo=TREINO')).body[0];
    const res = await api
      .put(`/api/v1/uniformes/${kit.id}`)
      .set(auth)
      .send({ type: kit.type, season: kit.season, colors: kit.colors, supplier: kit.supplier, teamId: 2 });
    expect(res.status).toBe(409);
  });

  it('PUT sem um campo opcional limpa o valor anterior', async () => {
    const created = await api
      .post('/api/v1/cts')
      .set(auth)
      .send({ name: 'CT Opcional', city: 'Pelotas', address: 'Rua de Teste, 1', areaHa: 3, openedYear: 2020 });
    const id = created.body.id;
    const updated = await api.put(`/api/v1/cts/${id}`).set(auth).send({ name: 'CT Opcional', city: 'Pelotas', address: 'Rua de Teste, 1' });
    expect(updated.body.areaHa).toBeNull();
    expect(updated.body.openedYear).toBeNull();
    await api.delete(`/api/v1/cts/${id}`).set(auth);
  });
});
