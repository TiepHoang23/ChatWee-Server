const express = require('express');
const { userController } = require('../controllers');
const UserRouter = express.Router();
/* GET users listing. */

UserRouter.get('/', userController.getMyUser);
UserRouter.get('/myfriend', userController.getMyFriends);
UserRouter.post('/addfriend', userController.addFriend);
UserRouter.get('/:id', userController.getUser);

module.exports = UserRouter;
