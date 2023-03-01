let authRouter = require('./auth');
let userRouter = require('./user');
let chatRoomRouter = require('./chatRoom');
const auth = require('../middleware/auth');
function attachRouter(app) {
  // Router
  app.use(auth.parserToken);
  app.use('/api/auth', authRouter);
  app.use('/api/user', auth.checkAuth, userRouter);
  app.use('/api/room', auth.checkAuth, chatRoomRouter);
}

module.exports = { attachRouter };
