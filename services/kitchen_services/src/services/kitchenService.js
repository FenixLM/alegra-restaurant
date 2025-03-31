const { pool } = require('../db/postgres');
const { sendMessage } = require('../kafka/producer');

const processOrder = async (order) => {
  console.log(`Processing order ${order.id}...`);
  await pool.query('UPDATE orders SET order_status = $1 WHERE id = $2', ['in_progress', order.id]);
  setTimeout(async () => {
    await pool.query('UPDATE orders SET order_status = $1 WHERE id = $2', ['completed', order.id]);
    console.log(`Order ${order.id} completed`);
    await sendMessage('order_status', { id: order.id, status: 'completed' });
  }, 5000);
};

module.exports = { processOrder };