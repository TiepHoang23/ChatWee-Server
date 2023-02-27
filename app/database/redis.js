const { createClient } = require('redis');

const redis_client = createClient({
  password: '5MxU1xRHrTfN8sP0E2JC0ezci3yO8k2U',
  socket: {
    host: 'redis-13980.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 13980,
  },
});

redis_client.connect();
redis_client.on('ready', () => {
  console.log('connected to redis');
});

redis_client.on('error', (error) => {
  console.log('redis error', error);
  process.exit(1);
});

module.exports = redis_client;
