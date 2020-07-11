import { Router } from 'express';

import sintegreWs from '../services/sintegraWS';
import ensureAuthenticated from '../middleawares/auth';

const sintegraRouter = Router();

sintegraRouter.use(ensureAuthenticated);

// Saldo
sintegraRouter.get('/rq', sintegreWs.getWsRemainingQueries);
// sintegraRouter.get('/sn', sintegreWs.getEntitySN);
// sintegraRouter.get('/rf', sintegreWs.getEntityRF);

export default sintegraRouter;
