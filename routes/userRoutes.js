import express from 'express';
const userRouter = express.Router();
import { handleUserLogin, handleUserSignUp, getAllUsers } from '../controllers/userController.js'

userRouter.post('/login', handleUserLogin);
userRouter.post('/signup', handleUserSignUp);
userRouter.get('/get-all-users', getAllUsers);

export default userRouter;