// require('dotenv').config();
const express = require('express');

const app = express();

const router = require('./router.js')

app.use(express.json());

app.use('/', router);

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

module.exports = server;
