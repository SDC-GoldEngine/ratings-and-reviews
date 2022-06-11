const pool = require('../db');

module.exports = {
  getAllReviews: (query) => {
    const page = query.page || 1;
    const count = query.count || 5;
    let sort = query.sort || 'relevant';
    const productId = query.product_id;

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
    WHERE r.product_id=${productId} AND r.reported=false
    GROUP BY r.review_id
    ORDER BY ${sort} DESC
    LIMIT ${count}
    OFFSET ${count * (page - 1)}
    ;`)
      .then((res) => ({
        product: productId,
        page,
        count,
        results: res.rows,
      }))
      .catch((err) => console.log('err', err));
  },

  getMeta: (productId) => (pool.query(`
      SELECT $1 AS product_id, * FROM
      (
        SELECT json_object_agg(r2.rating,
          (
          SELECT COUNT(r1.rating)
          FROM review r1
          WHERE r1.product_id = $1 AND r1.rating = r2.rating
          GROUP BY r2.rating
          )
        ) AS ratings
      FROM review r2
      WHERE r2.product_id = $1) AS ratings,

      (
        SELECT json_object_agg(r4.recommend,
          (
          SELECT count(r3.recommend)
          FROM review r3
          WHERE r3.product_id = $1 AND r3.recommend = r4.recommend
          GROUP BY r4.recommend
          )
        ) AS recommended
      FROM review r4
      WHERE r4.product_id = $1) AS recommended,

      (
        SELECT json_object_agg (
          char.name,
          char.charArray
        ) AS characteristics
        FROM (
          SELECT
            name,
            json_build_object (
              'id', c.id,
              'value', AVG(cr.char_value)
            ) AS charArray
          FROM characteristics c
          INNER JOIN characteristic_reviews cr
          ON c.id = cr.characteristic_id
          WHERE c.product_id = $1
          GROUP BY c.id
        ) AS char
      ) AS characteristics;
    `, [productId])
    .then((res) => res.rows[0])
    .catch((err) => console.log('err', err))
  ),

  addReview: async (args) => {
    const date = new Date().toISOString();
    try {
      const reviewId = await pool.query(`
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
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8
        )
        RETURNING review_id;
      `, [
        args.product_id,
        date,
        args.rating,
        args.summary,
        args.body,
        args.recommend,
        args.name,
        args.email,
      ]);

      let photoInsert;
      let charInsert;
      if (args.photos.length) {
        photoInsert = pool.query(`
          INSERT INTO review_photos (
            review_id, review_url
          ) SELECT review_id, review_url
          FROM UNNEST ($1::int[], $2::text[])
          AS t (review_id, review_url);
        `, [
          Array(args.photos.length).fill(reviewId.rows[0].review_id),
          args.photos,
        ]);
      }

      if (Object.keys(args.characteristics).length) {
        charInsert = pool.query(`
          INSERT INTO characteristic_reviews (review_id, characteristic_id, char_value)
          SELECT review_id, characteristic_id, char_value
          FROM UNNEST (
            $1::int[],
            $2::int[],
            $3::int[]
          ) AS t (review_id, characteristic_id, char_value);
        `, [
          Array(Object.keys(args.characteristics).length).fill(reviewId.rows[0].review_id),
          Object.keys(args.characteristics),
          Object.values(args.characteristics),
        ]);
      }

      const result = await Promise.all([photoInsert, charInsert]);
      console.log('result', result);
    } catch (err) {
      console.log('error here', err);
    }
  },

  markHelpful: (reviewId) => (
    pool.query(`
    UPDATE review
      SET helpfulness = helpfulness+1
      WHERE review_id=${reviewId};
    `)
      .then((res) => res.rows)
      .catch((err) => console.log('err', err))
  ),

  report: (reviewId) => (
    pool.query(`
      UPDATE review
      SET reported = NOT reported
      WHERE review_id=${reviewId};
    `)
      .then((res) => res.rows)
      .catch((err) => console.log('err', err))
  ),
};

// return pool.query(`
//   WITH reviewId AS (
//     INSERT INTO review (
//       product_id,
//       review_date,
//       rating,
//       summary,
//       body,
//       recommend,
//       reviewer_name,
//       reviewer_email
//     ) VALUES (
//       ${args.product_id},
//       NOW(),
//       ${args.rating},
//       ${args.summary},
//       ${args.body},
//       ${args.recommend},
//       ${args.name},
//       ${args.email}
//     )
//     RETURNING review_id
//   )
//   , ins2 AS (
//     INSERT INTO review_photos (
//       review_id, review_url
//     ) SELECT review_id, review_url
//     FROM UNNEST (${Array(args.photos.length).fill(reviewId)}::int[], ${args.photos}::text[])
//     AS t (review_id, review_url);
//   ),
//   INSERT INTO characteristics_reviews (review_id, characteristics_id, char_value)
//     SELECT review_id, characteristics_id, char_value
//     FROM UNNEST (
//       ${Array(Object.keys(args.characteristics).length).fill(reviewId)}::int[],
//       ${Object.keys(characteristics)}::int[],
//       ${Objects.values(characteristics)}::int[]
//     ) AS t (review_id, characteristics_id, char_value);
// `)
// .then((res) => console.log('result', res))
// .catch((err) => console.log('err', err));


// json_build_object(
//   'id', c.id,
//   'value', AVG(cr.char_value)
// )) AS singleChar
// FROM characteristics c
// INNER JOIN characteristic_reviews cr
// ON c.id=cr.characteristic_id
// WHERE c.product_id=$1
// GROUP BY c.id