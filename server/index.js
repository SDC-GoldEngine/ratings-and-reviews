var express = require('express');

var app = express();
module.exports.app = app;
var {getAllReviews, getMeta, addReview, markHelpful, report} = require('./models.js');

app.use(express.json())


// routes
app.get('/reviews', (req, res) => {
  getAllReviews(req.query)
  .then((result) => {
    res.status(201).send(result)
  })
  .catch((err) => res.status(500).send('error getting reviews'));
});

app.get('/reviews/meta', (req, res) => {
  getMeta(req.query.product_id)
  .then((result) => {
    res.status(201).send(result)
  })
  .catch((err) => res.status(500).send('error getting reviews'));
});

app.post('/reviews', (req, res) => {
  // let product_id = req.body.product_id;
  // let rating = req.body.rating;
  // let summary = req.body.summary;
  // let bodyArg = req.body.body;
  // let recommend = req.body.recommend;
  // let name = req.body.name;
  // let email = req.body.email;
  // let photos = req.body.photos;
  // let characteristics = req.body.characteristics;
  addReview(req.body)
  .then((result) => res.status(200).send(result))
  .catch((err) => res.status(500).send('error adding review'));
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  markHelpful(req.params.review_id)
  .then((result) => res.sendStatus(200))
  .catch((err) => res.status(500).send('error marking helpful'));
});

app.put('/reviews/:review_id/report', (req, res) => {
  report(req.params.review_id)
  .then((result) => res.sendStatus(200))
  .catch((err) => res.status(500).send('error reporting review'));
});


app.set('port', 3000);

app.listen(app.get('port'));
console.log('Listening on', app.get('port'));