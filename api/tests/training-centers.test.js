import { describe, expect, it } from 'vitest';
import { api } from './helpers.js';

describe('CTs', () => {
  it('GET /api/v1/cts lista os dois centros de treinamento', async () => {
    const res = await api.get('/api/v1/cts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ name: 'CT Parque Gigante', areaHa: 7, facilitiesCount: 9 });
  });

  it('GET /api/v1/cts/:id detalha espaços e times', async () => {
    const res = await api.get('/api/v1/cts/2');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('CT Morada dos Quero-Queros');
    expect(res.body.facilities.length).toBeGreaterThan(0);
    expect(res.body.teams[0].nickname).toBe('Gurias Coloradas');
  });

  it('GET /api/v1/cts/:id inexistente responde 404', async () => {
    const res = await api.get('/api/v1/cts/999');
    expect(res.status).toBe(404);
  });

  it('GET /api/v1/cts/:id com id não numérico responde 400', async () => {
    const res = await api.get('/api/v1/cts/abc');
    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('id');
  });
});
