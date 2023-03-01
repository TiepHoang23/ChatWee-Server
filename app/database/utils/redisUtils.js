const crypto = require('crypto');
const redis_client = require('../redis');
function hashToken(token) {
  return crypto.createHmac('sha256', 'secretKey').update(token).digest('hex');
}

async function getBlockedToken(token) {
  const hashedToken = `bl:${hashToken(token)}`;
  const result = await redis_client.get(hashedToken);
  return result;
}

async function setBlockedToken(token, expiresIn) {
  const hashedToken = `bl:${hashToken(token)}`;
  await redis_client.setEx(hashedToken, expiresIn, '1');
}

module.exports = {
  getBlockedToken,
  setBlockedToken,
};
