require("dotenv").config();

const { Pool } = require('pg');
const pool = new Pool ({
  user: process.env.USER,
  database: process.env.DB,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.PORT
})

pool.connect();

module.exports = pool;
