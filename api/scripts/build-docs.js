/**
 * Copia a especificação OpenAPI para a pasta docs/ do repositório,
 * publicada pelo GitHub Pages junto com a página do Swagger UI.
 */
import { copyFileSync } from 'node:fs';

const source = new URL('../openapi/openapi.yaml', import.meta.url);
const target = new URL('../../docs/openapi.yaml', import.meta.url);

copyFileSync(source, target);
console.log('docs/openapi.yaml atualizado.');
