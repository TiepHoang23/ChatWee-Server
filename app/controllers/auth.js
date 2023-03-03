const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { pg_client, setBlockedToken } = require('../database');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const data_query = await pg_client.query(
      `select  "id", "email", "password" from "public.User" where "email" = '${email}'`
    );

    const user_data = data_query.rows[0];
    if (data_query.rows.length == 0) {
      res.json({ status: false, message: 'invalid user infomation' });
      return;
    }

    if (password != user_data.password) {
      res.json({ status: false, message: 'invalid user infomation' });
      return;
    }

    const token = jwt.sign({ userId: user_data.id }, jwtConfig.secretKey, {
      expiresIn: jwtConfig.expireTime,
    });

    res.json({ status: true, data: { token, userId: user_data.id, email } });
  } catch (error) {
    res.json({ status: false, message: error });
  }
}

async function register(req, res) {
  try {
    const { email, password, firstname, lastname } = req.body;
    const text = `INSERT INTO "public.User" (email, password,firstName,lastName)
    VALUES($1,$2,$3,$4) RETURNING *`;

    const values = [email, password, firstname, lastname];
    const data_register = await pg_client.query({
      text,
      values,
      rowMode: 'array',
    });
    res.json({ status: true, data: data_register.rows[0] });
  } catch (error) {
    res.json({ status: false, error: error });
    console.log(error);
  }
}

async function logout(req, res) {
  try {
    if (req.isAuthenticated === true) {
      const token = req.headers.authorization.replace('Bearer ', '');
      await setBlockedToken(token, jwtConfig.expireTime);
      res.json({ status: true, message: 'logged out' });
    } else res.json({ status: false, message: 'invalid token' });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: 'faile' });
  }
}

let authController = { login, register, logout };
module.exports = authController;
