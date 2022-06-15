require('dotenv').config();

const { Pool } = require('pg');
const pool = new Pool ({
  user: process.env.DB_USER,
  database: process.env.DB_DB,
  host: process.env.DB_HOST,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
})

// pool.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err)
//   process.exit(-1)
// })

module.exports = pool;
