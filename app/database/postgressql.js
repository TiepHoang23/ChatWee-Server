const { Client, Pool } = require('pg');
const connectionString =
  'postgres://fnrhtuyd:TISaq_ItOuf9dV0QONsaViAn3JSnaA6k@tiny.db.elephantsql.com/fnrhtuyd';
const pg_client = new Client({
  connectionString,
});

pg_client.connect(function (err) {
  if (err) throw err;
  console.log('Connected to PostgressSQL!');
});

module.exports = pg_client;
