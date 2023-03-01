const express = require('express');
const { authController } = require('../controllers');
const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/logout', authController.logout);

module.exports = authRouter;
