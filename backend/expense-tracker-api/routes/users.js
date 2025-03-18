import { Router } from 'express';
import { 
  addUser,
  changeUserPassword,
  getUserById,
  getUsers 
} from '../controllers/users.js';
import { authenticateToken } from '../middlewares/authentication.js';

const userRouter = Router();

userRouter.get('/users', authenticateToken, getUsers);
userRouter.get('/users/:id', authenticateToken, getUserById);
userRouter.post('/users/signup', addUser);
userRouter.patch('/users/change-password',authenticateToken,changeUserPassword);

export default userRouter;