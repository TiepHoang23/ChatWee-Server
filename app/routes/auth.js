const express = require('express');
const { authController } = require('../controllers');
const authRouter = express.Router();
/* GET users listing. */
// UserRouter.get('/:id', userController.getUser);
authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/logout', authController.logout);

module.exports = authRouter;
