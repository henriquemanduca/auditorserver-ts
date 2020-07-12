import express from 'express';

import authRouter from './auth.router';
import entitiesRouter from './entities.router';
import sintegraRouter from './sintegra.router';
import companiesRouter from './companies.router';

const routes = express.Router();

routes.use('/v1/auth', authRouter);
routes.use('/v1/entities', entitiesRouter);
routes.use('/v1/sintegra', sintegraRouter);
routes.use('/v1/companies', companiesRouter);

export default routes;
