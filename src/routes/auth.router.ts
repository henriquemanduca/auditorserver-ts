import { Router } from 'express';
import userController from '../controllers/user';

const authRouter = Router();

authRouter.get('/', userController.index);
authRouter.post('/', userController.login);
authRouter.post('/user', userController.create);
authRouter.post('/refresh', userController.refreshPassword);

export default authRouter;
