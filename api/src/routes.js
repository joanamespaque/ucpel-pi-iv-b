import { Router } from 'express';
import { requireApiKey } from './middlewares/require-api-key.js';
import { coachRoutes } from './modules/coaches/coach.routes.js';
import { facilityRoutes } from './modules/facilities/facility.routes.js';
import { kitRoutes } from './modules/kits/kit.routes.js';
import { playerRoutes } from './modules/players/player.routes.js';
import { sessionRoutes } from './modules/sessions/session.routes.js';
import { staffRoutes } from './modules/staff/staff.routes.js';
import { teamRoutes } from './modules/teams/team.routes.js';
import { trainingCenterRoutes } from './modules/training-centers/training-center.routes.js';

/**
 * Rotas da versão 1 da API, montadas em /api/v1.
 */
export const apiRoutes = Router();

// POST, PUT e DELETE exigem a chave de API; GET permanece público.
apiRoutes.use(requireApiKey);

apiRoutes.use('/cts', trainingCenterRoutes);
apiRoutes.use('/espacos', facilityRoutes);
apiRoutes.use('/times', teamRoutes);
apiRoutes.use('/tecnicos', coachRoutes);
apiRoutes.use('/comissao', staffRoutes);
apiRoutes.use('/jogadores', playerRoutes);
apiRoutes.use('/uniformes', kitRoutes);
apiRoutes.use('/treinos', sessionRoutes);
