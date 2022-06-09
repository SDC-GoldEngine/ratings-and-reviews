var pool = require('../db');

module.exports = {
  getAllReviews: function (page, count, sort, product_id) {
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
  }
};