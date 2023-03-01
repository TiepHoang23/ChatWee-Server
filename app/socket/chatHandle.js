const { pg_client } = require('../database');

async function chatHandle(chatIO, socket) {
  // Check expireTime token

  const { userId } = socket.data.signature;
  console.log(`${userId} connected`);
  const user = await User.findById(userId).lean();
  const fullname = `${user.lastName} ${user.firstName}`;

  //= =====EVENT======//
  // join room from clients
  socket.on('join-room', async (roomId) => {
    try {
      const queryRoom = { _id: roomId, users: userId };

      const roomInstance = await Room.findOne(queryRoom, { trip: 1 })
        .populate({ path: 'trip', select: 'status' })
        .lean();

      if (!roomInstance || roomInstance.trip.status !== 'Driving') {
        socket.emit('error', 'room dose not exist');
        return;
      }

      socket.join(roomId);
      chatIO
        .to(roomId)
        .emit('join-room', { nameID: fullname, msg: 'joined room' });
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
        socket.emit('chat-message', { nameID: fullname, msg });
        return;
      }
      chatIO.to(roomId).emit('chat-message', { nameID: fullname, msg });
      const subMsg = { message: msg, user: userId };
      Room.updateOne({ _id: roomId }, { $push: { messages: subMsg } }).exec();
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
      nameID: `${user.lastName} ${user.firstName}`,
      msg: 'out of room',
    });
  });
}

module.exports = chatHandle;
