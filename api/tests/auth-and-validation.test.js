import { hasValidApiKey } from '../src/middlewares/require-api-key.js';
import { describe, expect, it } from 'vitest';
import { api, auth, validPlayer } from './helpers.js';

describe('Autenticação das operações de escrita', () => {
  it('POST sem X-API-Key responde 401 em Problem Details', async () => {
    const res = await api.post('/api/v1/jogadores').send(validPlayer());
    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.headers['www-authenticate']).toContain('X-API-Key');
  });

  it('DELETE com chave incorreta responde 401 e não remove o registro', async () => {
    const res = await api.delete('/api/v1/jogadores/1').set('X-API-Key', 'chave-incorreta');
    expect(res.status).toBe(401);
    expect((await api.get('/api/v1/jogadores/1')).status).toBe(200);
  });

  it('PUT sem chave responde 401', async () => {
    const res = await api.put('/api/v1/times/1').send({ name: 'Teste', category: 'MASCULINO', trainingCenterId: 1 });
    expect(res.status).toBe(401);
  });

  it('GET continua público, sem chave', async () => {
    const res = await api.get('/api/v1/jogadores');
    expect(res.status).toBe(200);
  });
});

describe('Validação de limites de entrada', () => {
  it('id acima do limite de inteiro do banco responde 400, e não 500', async () => {
    const res = await api.get('/api/v1/jogadores/99999999999');
    expect(res.status).toBe(400);
  });

  it('data inexistente no calendário é rejeitada', async () => {
    const res = await api
      .post('/api/v1/jogadores')
      .set(auth)
      .send(validPlayer({ birthDate: '2004-02-31' }));
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toMatchObject({ field: 'birthDate', message: 'Data inexistente no calendário.' });
  });

  it('data de nascimento no futuro é rejeitada', async () => {
    const res = await api
      .post('/api/v1/jogadores')
      .set(auth)
      .send(validPlayer({ birthDate: '2099-01-01' }));
    expect(res.status).toBe(400);
  });

  it('respostas incluem cabeçalhos de segurança', async () => {
    const res = await api.get('/api/v1/cts');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

describe('Isenção do limite de requisições', () => {
  const request = (key) => ({ get: (name) => (name.toLowerCase() === 'x-api-key' ? key : undefined) });

  it('reconhece apenas a chave de API correta', () => {
    expect(hasValidApiKey(request(process.env.API_KEY))).toBe(true);
    expect(hasValidApiKey(request('chave-errada'))).toBe(false);
    expect(hasValidApiKey(request(undefined))).toBe(false);
  });
});

describe('Corpo e cabeçalhos', () => {
  it('corpo acima de 100 kB responde 413 em Problem Details', async () => {
    const res = await api
      .post('/api/v1/treinos')
      .set(auth)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ notes: 'x'.repeat(150 * 1024) }));
    expect(res.status).toBe(413);
    expect(res.headers['content-type']).toContain('application/problem+json');
  });

  it('expõe o total da paginação a clientes de outras origens', async () => {
    const res = await api.get('/api/v1/jogadores?limite=5').set('Origin', 'https://exemplo.test');
    expect(res.headers['access-control-expose-headers']).toContain('X-Total-Count');
  });
});
