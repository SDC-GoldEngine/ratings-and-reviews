var pool = require('../db');

module.exports = {
  getAllReviews: function (query) {
    let page = query.page || 1;
    let count = query.count || 5;
    let sort = query.sort || 'relevant';
    let product_id = query.product_id;

    if (sort === 'relevant') sort = 'r.review_date'; // need to come back and change
    else if (sort === 'newest') sort = 'r.review_date';
    else if (sort === 'helpful') sort = 'r.helpfulness';

    return pool.query(`
    SELECT
      r.id,
      r.rating,
      r.summary,
      r.recommend,
      r.response,
      r.body,
      r.review_date AS date,
      r.reviewer_name,
      r.helpfulness,
      COALESCE (
        json_agg (
          json_build_object (
            'id', p.id,
            'url', p.review_url
          )
        )
      , '[]') AS photos
    FROM review r
    LEFT JOIN review_photos p
    ON r.id=p.review_id
    WHERE r.product_id=${product_id}
    GROUP BY r.id
    ORDER BY ${sort} DESC
    LIMIT ${count}
    OFFSET ${count * (page-1)}
    ;`)
    .then((res) => ({
      'product': product_id,
      'page': page,
      'count': count,
      'results': res.rows
    }))
    .catch((err) => console.log('err', err));
  },

  getMeta: function(product_id) {
    console.log('delet later')
  },

  addReview: function(args) {
    console.log('args', args)
  },

  markHelpful: function(review_id) {
    return pool.query(`
      UPDATE review
      SET helpfulness = helpfulness+1
      WHERE review_id=${review_id};
    `)
    .then((res) => res.rows)
    .catch((err) =>  console.log('err', err));
  },

  report: function(review_id) {
    return pool.query(`
      UPDATE review
      SET reported = NOT reported
      WHERE review_id=${review_id};
    `)
    .then((res) => res.rows)
    .catch((err) =>  console.log('err', err));
  }
};