import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = {
  vus: 50,
  duration: '60s',
};

export default function () {
  const randomNumber = Math.floor(Math.random() * 90000);

  const getReviews = http.get(
    `http://localhost:3000/reviews/?product_id=${randomNumber}`
  );
  check(getReviews, {
    'status was 200': (r) => r.status === 200,
    'response less than 5000ms': (r) => r.timings.duration < 5000,
  });
  sleep(1);

  const getMeta = http.get(
    `http://localhost:3000/reviews/meta/?product_id=${randomNumber}`
  );
  check(getMeta, {
    'status was 200': (r) => r.status === 200,
    'response less than 5000ms': (r) => r.timings.duration < 5000,
  });
  sleep(1);
}

//   const params = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   const body = JSON.stringify({
//     product_id: 1,
//     rating: 4,
//     summary: 'This is the summary',
//     body: 'This is the bodty',
//     recommend: true,
//     name: 'username',
//     email: 'person@email.com',
//     photos: [],
//     characteristics: {
//       1: 5,
//       2: 3,
//     },
//   });

//   const addReview = http.post('http://localhost:3000/reviews', body, params);
//   check(addReview, {
//     'status was 200': (r) => r.status === 200,
//     'response less than 500ms': (r) => r.timings.duration < 500,
//   });
//   sleep(1);

//   const markHelpful = http.put(
//     `http://localhost:3000/reviews/${randomNumber}/helpful`, params
//   );
//   check(markHelpful, {
//     'status was 200': (r) => r.status === 200,
//     'response less than 500ms': (r) => r.timings.duration < 500,
//   });
//   sleep(1);

//   const markReported = http.put(
//     `http://localhost:3000/qa/reviews/${randomNumber}/report`, params
//   );
//   check(markReported, {
//     'status was 200': (r) => r.status === 200,
//     'response less than 500ms': (r) => r.timings.duration < 500,
//   });
//   sleep(1);
// }
