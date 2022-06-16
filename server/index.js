// require('dotenv').config();
const express = require('express');

const app = express();

const router = require('./router.js')

app.use(express.json());

app.use('/', router);

app.get('/loaderio-e8a0aa9217419e1f0fef07144244506d.txt', (req, res) => {
  res.status(200).send('loaderio-e8a0aa9217419e1f0fef07144244506d  ');
});

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

module.exports = server;
