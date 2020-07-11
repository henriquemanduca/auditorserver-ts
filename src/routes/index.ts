import express from 'express';

import authRouter from './auth.router';
import entitiesRouter from './entities.router';
import sintegraRouter from './sintegra.router';

const routes = express.Router();

routes.use('/v1/auth', authRouter);
routes.use('/v1/entities', entitiesRouter);
routes.use('/v1/sintegra', sintegraRouter);

export default routes;
