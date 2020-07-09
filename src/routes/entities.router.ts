import { Router } from 'express';
import entityController from '../controllers/entity';
import ensureAuthenticated from '../middleawares/auth';

const entitiesRouter = Router();

entitiesRouter.use(ensureAuthenticated);

// List
entitiesRouter.get('/', entityController.index);

entitiesRouter.post('/', entityController.create);

entitiesRouter.get('/:entityId', entityController.findById);

entitiesRouter.put('/:entityId', entityController.update);

entitiesRouter.delete('/:entityId', entityController.delete);

export default entitiesRouter;
