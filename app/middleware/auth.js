const jwt = require('jsonwebtoken');
const { getBlockedToken } = require('../database/utils/redisUtils');
const jwt_config = require('../config/jwt');
const secretKey = 'jwt-secret';

async function parserToken(req, res, next) {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    // console.log(token);
    if (!token) {
      req.isAuthenticated = false;
    } else {
      // Check token rejected
      const inBlackList = await getBlockedToken(token);

      if (inBlackList) {
        req.isAuthenticated = false;
      } else {
        const { userId } = jwt.verify(token, jwt_config.secretKey);
        req.isAuthenticated = true;
        req.userId = userId;
      }
    }
  } catch (error) {
    req.isAuthenticated = false;
  }

  next();
}

async function checkAuth(req, res, next) {
  if (req.isAuthenticated) {
    next();
  } else {
    res.json({ status: false, message: 'invalid token' });
  }
}
module.exports = { parserToken, checkAuth };
