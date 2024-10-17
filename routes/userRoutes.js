import express from 'express';
const userRouter = express.Router();
import { handleUserLogin, handleUserSignUp, getAllUsers, LogoutUser } from '../controllers/userController.js'

userRouter.post('/login', handleUserLogin);
userRouter.post('/signup', handleUserSignUp);
userRouter.get('/get-all-users', getAllUsers);
userRouter.post('/logout', LogoutUser);

export default userRouter;