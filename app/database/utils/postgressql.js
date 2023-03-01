const pg_client = require('../postgressql');
async function checkUserInRoom({ userId, roomId }) {
  const roomInstance = await pg_client.query(
    `select * from "public.Room_User" where "roomId"= ${roomId} and "userId"=${userId}`
  );
  if (roomInstance.rows[0]) return true;
  return false;
}

async function getUserById(id) {
  const user_data = await pg_client.query(
    `SELECT * from "public.User" WHERE id = '${id}'`
  );
  if (user_data.rows[0]) {
    return user_data.rows[0];
  }
  return null;
}
async function pushMessageToRoom({ roomId, userId, message }) {
  try {
    await pg_client.query(
      `INSERT INTO "public.Messages" ("content","roomChatId","from_user")
      VALUES('${message}', ${roomId}, ${userId})`
    );
  } catch (error) {}
}

module.exports = { checkUserInRoom, getUserById, pushMessageToRoom };
