const { pool } = require('../db/postgres');
const { sendMessage } = require('../kafka/producer');

class OrderService {
  async createOrder() {

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        "INSERT INTO orders (order_status) VALUES ('pending') RETURNING *"
      );

      const order = result.rows[0];

      await client.query('COMMIT');
      sendMessage('orders', order);

      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getOrders() {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return result.rows;
  }
}

module.exports = new OrderService();
