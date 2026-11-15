import request from 'supertest';
import { createApp } from '../src/app.js';

/** Cliente HTTP de teste ligado à aplicação, sem abrir porta de rede. */
export const api = request(createApp());

/** Cabeçalho de autenticação exigido nas operações de escrita. */
export const auth = { 'X-API-Key': process.env.API_KEY };

/** Jogador válido usado como base nos testes. */
export function validPlayer(overrides = {}) {
  return {
    name: 'Atleta de Teste',
    shirtName: 'Teste',
    number: 88,
    position: 'MEIA',
    preferredFoot: 'DIREITO',
    birthDate: '2003-05-10',
    teamId: 2,
    ...overrides,
  };
}
