import { Router } from 'express';
import {
  registerUser,
  loginUser,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter
  .post('/register', registerUser)
  .post('/login', loginUser);

export default authRouter;
