const request = require('supertest');
const app = require('../server');

describe('GET reviews endpoint', () => {
  test('should have product_id in result when getting all reviews', async (done) => {
    const res = await request(app)
      .get('/reviews')
      .query({ product_id: 1 });
    expect(res.body.product_id).toBeDefined();
    done();
  });

  test('should respond with 200 status code after sucessful get', async (done) => {
    const res = await request(app)
      .get('/reviews')
      .query({ product_id: 1 });
    expect(res.statusCode).toBe(200);
    done();
  });

  test('should specify json in content type header', async (done) => {
    const res = await request(app)
      .get('/reviews')
      .query({ product_id: 1 });
    expect(res.headers['content-type'], /json/);
    done();
  });
});