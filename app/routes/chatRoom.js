const express = require('express');
const { chatRoomController } = require('../controllers');
const chatRoomRouter = express.Router();
/* GET users listing. */

// chatRoomRouter.post('/joinRoom', chatRoomController.getMyChatRooms);
chatRoomRouter.get('/myRoom', chatRoomController.getMyChatRooms);
chatRoomRouter.get('/getRoom/:userId', chatRoomController.getRoomWithUser);
chatRoomRouter.get('/message/:roomId', chatRoomController.getMessageFromRoom);

module.exports = chatRoomRouter;
