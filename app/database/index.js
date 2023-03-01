const pg_client = require('./postgressql');
const redis_utils = require('./utils/redisUtils');
const pg_utils = require('./utils/postgressql');

module.exports = { pg_client, ...redis_utils, ...pg_utils };
