const express = require('express');
const uesrRouter = express.Router();
const { handleUserLogin } = require('../controllers/userController')
const { handleUserSignUp } = require('../controllers/userController')


uesrRouter.post('/login', handleUserLogin);
uesrRouter.post('/signup', handleUserSignUp)

module.exports = uesrRouter 