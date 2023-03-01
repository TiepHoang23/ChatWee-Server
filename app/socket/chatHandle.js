const {
  checkUserInRoom,
  getUserById,
  pushMessageToRoom,
} = require('../database');

async function chatHandle(chatIO, socket) {
  // Check expireTime token

  const { userId } = socket.data.signature;
  console.log(`${userId} connected`);
  const user = await getUserById(userId);

  //= =====EVENT======//
  // join room from clients
  socket.on('join-room', async (roomId) => {
    console.log(roomId);

    try {
      const value = await checkUserInRoom({ userId, roomId });
      console.log(value);
      if (!value) {
        socket.emit('error', 'room dose not exist');
        return;
      }

      socket.join(roomId);
      chatIO
        .to(roomId)
        .emit('join-room', { nameID: user.email, msg: 'joined room' });
      socket.data.roomId = roomId;
    } catch (e) {
      socket.emit('error', e.message);
      socket.disconnect(true);
    }
  });
  // get data from room and send it back to rooms
  socket.on('chat-message', async ({ msg }) => {
    try {
      // Check disable user or user is logout

      const { roomId } = socket.data;
      if (!roomId) {
        socket.emit('chat-message', { nameID: user.email, msg });
        return;
      }
      chatIO.to(roomId).emit('chat-message', { nameID: user.email, msg });
      await pushMessageToRoom({ roomId, userId, message: msg });
    } catch (e) {
      socket.emit('error', e.message);
      socket.disconnect(true);
    }
  });

  socket.on('disconnect', async () => {
    // clearInterval(timer);
    console.log(`${userId} disconnected`);
    const { roomId } = socket.data;

    if (!roomId) {
      return;
    }
    chatIO.to(roomId).emit('chat-message', {
      nameID: user.email,
      msg: 'out of room',
    });
  });
}

module.exports = chatHandle;
