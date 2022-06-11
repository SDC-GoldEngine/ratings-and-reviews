require("dotenv").config();

const { Pool } = require('pg');
const pool = new Pool ({
  user: process.env.USER,
  database: process.env.DB,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.PORT
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = pool;
