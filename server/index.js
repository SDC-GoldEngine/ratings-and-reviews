var express = require('express');

var app = express();
module.exports.app = app;
var {getAllReviews} = require('./models.js');

// routes
app.get(`/reviews`, (req, res) => {
  page = req.query.page || 1;
  count = req.query.count || 5;
  sort = req.query.sort || 'relevant';
  product_id = req.query.product_id;
  getAllReviews(page, count, sort, product_id)
  .then((result) => {
    res.status(201).send(result)
  })
  .catch((err) => res.status(500).send('error getting reviews'));
});

// app.get(`/reviews/meta`, (req, res) => {
//   let product_id = req.query.product_id;
//   getAllReviews(product_id)
//   .then((result) => res.status(201).send(result))
//   .catch((err) => res.status(500).send('error getting reviews'));
// });

app.set('port', 3000);

app.listen(app.get('port'));
console.log('Listening on', app.get('port'));