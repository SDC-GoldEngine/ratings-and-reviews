const express = require('express');
const controllers = require('./controllers.js');
const router = express.Router();

router.get('/reviews', controllers.getAllReviews);

router.get('/reviews/meta', controllers.getMeta);

router.post('/reviews', controllers.addReview);

router.put('/reviews/:review_id/helpful', controllers.markHelpful);

router.put('/reviews/:review_id/report', controllers.report);

router.get('/loaderio-3e76a66e6283dac02535a5de95e788c6.txt', (req, res) => {
  res.status(200).send('loaderio-3e76a66e6283dac02535a5de95e788c6');
});

module.exports = router;
