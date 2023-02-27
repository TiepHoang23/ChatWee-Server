const express = require('express');
const { userController } = require('../controllers');
const UserRouter = express.Router();
/* GET users listing. */
UserRouter.get('/', userController.getUser);
UserRouter.get('/friend', userController.getMyFriends);
UserRouter.get('/chatroom', userController.getMyChatRoom);

module.exports = UserRouter;
