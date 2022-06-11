const express = require('express');
const controllers = require('./controllers.js');
const router = express.Router();

router.get('/reviews', controllers.getAllReviews);

router.get('/reviews/meta', controllers.getMeta);

router.post('/reviews', controllers.addReview);

router.put('/reviews/:review_id/helpful', controllers.markHelpful);

router.put('/reviews/:review_id/report', controllers.report);

module.exports = router;