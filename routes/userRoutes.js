import express from'express';
const uesrRouter = express.Router();
import { handleUserLogin } from'../controllers/userController.js';
import { handleUserSignUp } from'../controllers/userController.js';


uesrRouter.post('/login', handleUserLogin);
uesrRouter.post('/signup', handleUserSignUp)

export default uesrRouter;