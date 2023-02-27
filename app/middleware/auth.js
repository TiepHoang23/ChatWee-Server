const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  req.userId = 1;
  if (!token) {
    req.isAuthenticated = false;
  } else {
    const secretKey = 'Token';
    const { userId } = jwt.verify(token, secretKey);
    req.isAuthenticated = true;
    req.userId = userId;
  }

  next();
};
