import { Router } from 'express';
import { userLogin } from '../controllers/login.js';

const loginRouter = Router();

// Mock login endpoint
loginRouter.post('/login', userLogin);

export default loginRouter;