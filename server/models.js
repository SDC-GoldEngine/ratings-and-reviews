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
      r.review_id,
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
    ON r.review_id=p.review_id
    WHERE r.product_id=${product_id} AND r.reported=false
    GROUP BY r.review_id
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
    (async () => {
        let reviewId = await pool.query(`
          INSERT INTO review (
            product_id,
            review_date,
            rating,
            summary,
            body,
            recommend,
            reviewer_name,
            reviewer_email
          ) VALUES (
            ${args.product_id},
            NOW(),
            ${args.rating},
            ${args.summary},
            ${args.body},
            ${args.recommend},
            ${args.name},
            ${args.email}
          )
          RETURNING review_id;
        `);

        let photoInsert = pool.query(`
          INSERT INTO review_photos (
            review_id, review_url
          ) SELECT review_id, review_url
          FROM UNNEST (${Array(args.photos.length).fill(reviewId)}::int[], ${args.photos}::text[])
          AS t (review_id, review_url);
        `);

        let charInsert = pool.query(`
          INSERT INTO characteristics_reviews (review_id, characteristics_id, char_value)
          SELECT review_id, characteristics_id, char_value
          FROM UNNEST (
            ${Array(Object.keys(args.characteristics).length).fill(reviewId)}::int[],
            ${Object.keys(characteristics)}::int[],
            ${Objects.values(characteristics)}::int[]
          ) AS t (review_id, characteristics_id, char_value);
        `);

        Promise.all([photoInsert, charInsert])
        .then((result) => result);
      })()
    .then((res) => console.log('result', res))
    .catch((err) => console.log('err', err));
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


// ITH ins1 AS (
//   INSERT INTO review (
//     product_id,
//     review_date,
//     rating,
//     summary,
//     body,
//     recommend,
//     reviewer_name,
//     reviewer_email
//   ) VALUES (
//     ${args.product_id},
//     NOW(),
//     ${args.rating},
//     ${args.summary},
//     ${args.body},
//     ${args.recommend},
//     ${args.name},
//     ${args.email}
//   )
//   RETURNING review_id
// )
// , ins2 AS (
//   INSERT INTO review_photos (
//     review_id,
//     review_url
//   ) VALUES (
//     review_id,
//     SELECT UNNEST(${args.photos})
//   )
// )