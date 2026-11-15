import { Router } from 'express';
import { requireApiKey } from './middlewares/require-api-key.js';
import { playerRoutes } from './modules/players/player.routes.js';
import { teamRoutes } from './modules/teams/team.routes.js';
import { trainingCenterRoutes } from './modules/training-centers/training-center.routes.js';

/**
 * Rotas da versão 1 da API, montadas em /api/v1.
 */
export const apiRoutes = Router();

// POST, PUT e DELETE exigem a chave de API; GET permanece público.
apiRoutes.use(requireApiKey);

apiRoutes.use('/cts', trainingCenterRoutes);
apiRoutes.use('/times', teamRoutes);
apiRoutes.use('/jogadores', playerRoutes);
