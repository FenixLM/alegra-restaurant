
jest.setTimeout(10000);
require('dotenv').config();
const { pool } = require('../src/db/postgres');
const orderService = require('../src/services/orderService');
const { connectProducer, disconnectProducer } = require('../src/kafka/producer');

beforeAll(async () => {
  await pool.query('DELETE FROM orders');
  await connectProducer();
});

afterAll(async () => {
  await pool.end();
  await disconnectProducer();
});

describe('Order Service', () => {
  test('Debe crear una orden con estado "pending"', async () => {
    const order = await orderService.createOrder();
    expect(order).toHaveProperty('id');
    expect(order.order_status).toBe('pending');
  });

  test('Debe obtener todas las órdenes', async () => {
    const orders = await orderService.getOrders();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
  });
});
