import { describe, expect, it } from 'vitest';
import { api } from './helpers.js';

describe('Infraestrutura', () => {
  it('GET /health informa API e banco disponíveis', async () => {
    const res = await api.get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', database: 'ok' });
  });

  it('GET /docs/openapi.json entrega a especificação OpenAPI 3.1', async () => {
    const res = await api.get('/docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.1.0');
  });

  it('rota inexistente responde 404 em Problem Details', async () => {
    const res = await api.get('/api/v1/inexistente');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body).toMatchObject({ status: 404, title: 'Recurso não encontrado' });
  });

  it('JSON malformado responde 400', async () => {
    const res = await api.post('/api/v1/times').set('Content-Type', 'application/json').send('{"name":');
    expect(res.status).toBe(400);
    expect(res.body.title).toBe('JSON malformado');
  });
});
