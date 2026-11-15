import { readFileSync } from 'node:fs';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

const specPath = new URL('../openapi/openapi.yaml', import.meta.url);

/** Especificação OpenAPI carregada a partir do arquivo YAML do repositório. */
export const openapiSpec = YAML.parse(readFileSync(specPath, 'utf8'));

/**
 * Rotas da documentação: Swagger UI em /docs e o arquivo da especificação
 * em /docs/openapi.json.
 */
export const docsRoutes = Router();

docsRoutes.get('/openapi.json', (_req, res) => res.json(openapiSpec));
docsRoutes.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpec, { customSiteTitle: 'InterCT API' }));
