import { Router } from 'express';
import productController from '../controllers/product';
import ensureAuthenticated from '../middleawares/auth';

const productsRouter = Router();

productsRouter.use(ensureAuthenticated);

productsRouter.get('/', productController.index);
productsRouter.post('/', productController.create);

export default productsRouter;
