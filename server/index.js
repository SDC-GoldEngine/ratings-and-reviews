// require('dotenv').config();
const express = require('express');

const app = express();

const router = require('./router.js')

app.use(express.json());

app.use('/', router);

app.get('/loaderio-3e76a66e6283dac02535a5de95e788c6.txt', (req, res) => {
  res.status(200).send('loaderio-3e76a66e6283dac02535a5de95e788c6');
});

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

module.exports = server;
