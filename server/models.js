var pool = require('../db');

module.exports = {
  getAllReviews: function (page, count, sort, product_id) {
    return pool.query(`
    SELECT
      r.id,
      r.rating,
      r.summary,
      r.recommend,
      r.response,
      r.body,
      r.review_date,
      r.reviewer_name,
      r.helpfulness,
      COALESCE (
        json_agg (
          json_build_object (
            'id', p.id,
            'url', p.review_url
          )
        )
      ) AS photos
    FROM review r
    LEFT JOIN review_photos p
    ON r.id=p.review_id
    WHERE r.product_id=${product_id}
    GROUP BY r.id
    ;`)
    .then((res) => res.rows)
    .catch((err) => console.log('err', err));
  }
};