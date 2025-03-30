const request = require('supertest');
const { app, pool } = require('../src/app'); 

describe('Ordenes API', () => {
  test('Debe crear una nueva orden', async () => {
    const res = await request(app)
      .post('/order')
      .send({ status: 'pending' });

    expect(res.statusCode).toBe(201);
  });

  test('Debe obtener todas las órdenes', async () => {
    const res = await request(app).get('/orders');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(async () => {
    await pool.end();
  });
});
