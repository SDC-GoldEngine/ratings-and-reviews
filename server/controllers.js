const {
  getAllReviews,
  getMeta,
  addReview,
  markHelpful,
  report,
} = require('./models');

module.exports = {
  getAllReviews: (req, res) => {
    getAllReviews(req.query)
      .then((result) => res.status(201).send(result))
      .catch((err) => res.status(500).send('error getting reviews', err));
  },

  getMeta: (req, res) => {
    getMeta(req.query.product_id)
      .then((result) => res.status(201).send(result))
      .catch((err) => res.status(500).send('error getting reviews', err));
  },

  addReview: (req, res) => {
    addReview(req.body)
      .then(() => res.status(200).send('successfully added review'))
      .catch((err) => res.status(500).send('error adding review', err));
  },

  markHelpful: (req, res) => {
    markHelpful(req.params.review_id)
      .then(() => res.sendStatus(200))
      .catch((err) => res.status(500).send('error marking helpful', err));
  },

  report: (req, res) => {
    report(req.params.review_id)
      .then(() => res.sendStatus(200))
      .catch((err) => res.status(500).send('error reporting review', err));
  },
};
