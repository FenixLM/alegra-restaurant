import { pool } from "../src/db/postgres";
import orderService from "../src/services/orderService";
import { connectProducer, disconnectProducer } from "../src/kafka/producer";

jest.setTimeout(10000);

beforeAll(async () => {
  await pool.query("DELETE FROM orders");
  await connectProducer();
});

afterAll(async () => {
  await pool.end();
  await disconnectProducer();
});

describe("Order Service", () => {
  test('Debe crear una orden con estado "pending"', async () => {
    const order = await orderService.createOrder();
    expect(order).toHaveProperty("id");
    expect(order.order_status).toBe("pending");
  });

  test("Debe obtener todas las órdenes", async () => {
    const orders = await orderService.getOrders();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
  });
});
