const { pg_client } = require('../database');

async function getUser(req, res) {
  try {
    const id = req.userId;
    const user_data = await pg_client.query(
      `select * from "public.User" where id = '${id}'`
    );
    if (user_data.rows[0]) {
      res.json({ isSuccess: true, data: user_data.rows[0] });
    } else {
      res.json({ isSuccess: false, data: null });
    }
  } catch (error) {
    res.json({ isSuccess: false, error: error });
  }
}
async function getMyChatRoom(req, res) {
  const id = req.userId;

  const user_data = await pg_client.query(
    `select * from "public.Room_user" where userId = '${id}'`
  );
}

async function getMyFriends(req, res) {
  console.log(12312321312);
  try {
    const id = req.userId;
    const str_query = `select user1.*
    from "public.Friend_User" f1, "public.Friend_User" f2, "public.User" user1
    where f1."connectionId"=f2."connectionId" and f1."userId"=1 and f2."userId"!=1  and user1."id"=f2."userId"`;

    const user_data = await pg_client.query(str_query);

    res.json({ isSuccess: true, data: user_data.rows });
  } catch (error) {
    res.json({ isSuccess: false, error: error });
  }
}

let userController = { getUser, getMyChatRoom, getMyFriends };
module.exports = userController;
