const { getBlockedToken } = require('../database/utils/redisUtils');

async function verifyToken(token) {
  if (!token) return { status: false, message: 'invalidToken' };

  // Check token rejected
  const inBlackList = await getBlockedToken(token);

  if (inBlackList) {
    return { status: false, message: 'invalidToken' };
  }
  try {
    const { userId } = jwt.verify(token, secretKey);
    return { status: true, signature: { userId } };
  } catch (error) {
    return { status: false, message: 'invalidToken' };
  }
}

async function authenticateMiddleware(socket, next) {
  // const chatIO = this;
  try {
    const { token } = socket.handshake.auth;
    const verifyResult = await verifyToken(token);
    if (!verifyResult.isSuccess) {
      next(new Error(verifyResult.message));
      socket.disconnect(true);
      return;
    }
    socket.data.signature = verifyResult.signature;
    socket.data.token = token;

    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { verifyToken, authenticateMiddleware };
