const { pg_client } = require('../database');

async function getMyChatRooms(req, res) {
  try {
    const id = req.userId;
    const room_data = await pg_client.query(
      ` SELECT rc.*
        from "public.Room_User" ru, "public.Room_Chat" rc
        WHERE ru."userId" = '${id}' and rc."id" =ru."roomId"
        `
    );
    res.json({ status: true, data: room_data.rows });
  } catch (error) {
    res.json({ status: false, message: error });
  }
}

async function getMessageFromRoom(req, res) {
  try {
    const { roomId } = req.params;
    const id = req.userId;
    let str_query = `SELECT * from "public.Room_User" WHERE "userId"=${id} and "roomId"=${roomId}`;
    const user_data = await pg_client.query(str_query);
    if (user_data.rows.length < 1) {
      res.json({ status: false, message: "can't find this room" });
      return;
    }

    str_query = `
      SELECT ms."content", us."id" as "userId" ,us."firstname",us."lastname", ms."createAt" 
      from "public.Messages" ms, "public.User" us 
      WHERE ms."roomChatId"=${roomId} and us."id"= ms."from_user"
      ORDER BY ms."createAt" ASC
      `;
    const mess_data = await pg_client.query(str_query);

    res.json({ status: true, data: mess_data.rows });
  } catch (error) {
    res.json({ status: false, error: error });
  }
}

let chatRoomController = {
  getMyChatRooms,
  getMessageFromRoom,
};
module.exports = chatRoomController;
