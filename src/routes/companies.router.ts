import { Router } from 'express';
import companyController from '../controllers/company';
import ensureAuthenticated from '../middleawares/auth';

const companiesRouter = Router();

companiesRouter.use(ensureAuthenticated);

companiesRouter.get('/', companyController.index);
companiesRouter.post('/', companyController.create);
companiesRouter.get('/:entityId', companyController.findById);
companiesRouter.put('/:entityId', companyController.update);
companiesRouter.delete('/:entityId', companyController.delete);

export default companiesRouter;
