import express from 'express';
const userRouter = express.Router();
import { handleUserLogin, handleUserSignUp, getAllUsers, LogoutUser,HandleForgotPassword ,handleUpdatePassword} from '../controllers/userController.js'

userRouter.post('/login', handleUserLogin);
userRouter.post('/signup', handleUserSignUp);
userRouter.get('/get-all-users', getAllUsers);
userRouter.post('/logout', LogoutUser);
userRouter.post('/Forgot-Password',HandleForgotPassword)
userRouter.post('/reset-password/:token',handleUpdatePassword)

export default userRouter;