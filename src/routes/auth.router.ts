import { Router } from 'express';
import userController from '../controllers/user';

const authRouter = Router();

// List
authRouter.get('/', userController.index);

// Login
authRouter.post('/', userController.login);

// Insert
authRouter.post('/user', userController.create);

// Refresh password
authRouter.post('/refresh', userController.refreshPassword);

export default authRouter;
