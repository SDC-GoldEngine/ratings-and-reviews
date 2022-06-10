const {getAllReviews, getMeta, addReview, markHelpful, report} = require('./models.js');

module.exports = {
  getAllReviews: (req, res) => {
    getAllReviews(req.query)
    .then((result) => {
      res.status(201).send(result)
    })
    .catch((err) => res.status(500).send('error getting reviews'));
  },

  getMeta:(req, res) => {
    getMeta(req.query.product_id)
    .then((result) => {
      res.status(201).send(result)
    })
    .catch((err) => res.status(500).send('error getting reviews'));
  },

  addReview: (req, res) => {
    addReview(req.body)
    .then((result) => res.status(200).send('successfully added review'))
    .catch((err) => res.status(500).send('error adding review'));
  },

  markHelpful: (req, res) => {
    markHelpful(req.params.review_id)
    .then((result) => res.sendStatus(200))
    .catch((err) => res.status(500).send('error marking helpful'));
  },

  report: (req, res) => {
    report(req.params.review_id)
    .then((result) => res.sendStatus(200))
    .catch((err) => res.status(500).send('error reporting review'));
  }
}