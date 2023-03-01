const { pg_client } = require('../database');

async function getMyUser(req, res) {
  try {
    const id = req.userId;
    const user_data = await pg_client.query(
      `SELECT * from "public.User" WHERE id = '${id}'`
    );
    if (user_data.rows[0]) {
      res.json({ status: true, data: user_data.rows[0] });
    } else {
      res.json({ status: false, data: null });
    }
  } catch (error) {
    res.json({ status: false, error: error });
  }
}

async function getUser(req, res) {
  try {
    const userId = req.params.id;
    const user_data = await pg_client.query(
      `SELECT * from "public.User" WHERE id = '${userId}'`
    );
    if (user_data.rows[0]) {
      res.json({ status: true, data: user_data.rows[0] });
    } else {
      res.json({ status: false, data: null });
    }
  } catch (error) {
    res.json({ status: false, error: error });
  }
}

// //POST
// async function updateUser(req, res) {
//   try {
//     const id = req.userId;
//     const user_data = await pg_client.query(
//          `UPDATE "public.User"
//           ${ }
//           WHERE course_id = 3;`
//     );
//     if (user_data.rows[0]) {
//       res.json({ status: true, data: user_data.rows[0] });
//     } else {
//       res.json({ status: false, data: null });
//     }
//   } catch (error) {
//     res.json({ status: false, error: error });
//   }
// }

async function joinRoom(req, res) {
  const id = req.userId;

  const user_data = await pg_client.query(
    `SELECT * from "public.Room_user" WHERE userId = '${id}'`
  );
}

async function getMyFriends(req, res) {
  // try {
  const id = req.userId;
  const str_query = `SELECT user1.*
    from "public.Friend_User" f1, "public.Friend_User" f2, "public.User" user1
    WHERE f1."connectionId"=f2."connectionId" and f1."userId"=1 and f2."userId"!=1  and user1."id"=f2."userId"`;

  const user_data = await pg_client.query(str_query);

  res.json({ status: true, data: user_data.rows });
  // } catch (error) {
  //   res.json({ status: false, error: error });
  // }
}

async function addFriend(req, res) {
  try {
    const friend_id = req.body.friend_id;
    if (friend_id == req.userId) {
      res.json({ status: false, message: 'error' });
      return;
    }

    let str_query = `select *
    from "public.Friend_User" fu1, "public.Friend_User" fu2 
    where fu1."userId"=${friend_id} and fu2."userId"=${req.userId} and fu1."connectionId"=fu2."connectionId"`;

    const isconnected = (await pg_client.query(str_query)).rows.length !== 0;

    if (isconnected) {
      res.json({ status: false, message: 'you are connnected' });
      return;
    }

    str_query = `
    INSERT INTO "public.Connections" ("createAt")
    VALUES(current_timestamp)
    Returning "id";
  `;

    const connectionId = (await pg_client.query(str_query)).rows[0]?.id;
    str_query = `
    INSERT INTO "public.Friend_User" ("userId","connectionId")
    VALUES(${friend_id},${connectionId}),(${req.userId},${connectionId})
    returning *;
  `;

    const user_friend = (await pg_client.query(str_query)).rows;

    res.json({ status: true, data: user_friend });
  } catch (error) {
    res.json({ status: false, error: error });
  }
}

let userController = {
  getMyUser,

  getMyFriends,
  addFriend,
  getUser,
};
module.exports = userController;
