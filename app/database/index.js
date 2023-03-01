const pg_client = require('./postgressql');
const redis_utils = require('./utils/redisUtils');

module.exports = { pg_client, ...redis_utils };
