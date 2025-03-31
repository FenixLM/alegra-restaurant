const { pool } = require('../db/postgres');
const { sendMessage } = require('../kafka/producer');
const { connectMongo } = require('../db/mongo');

const getRandomRecipe = async () => {
  const db = await connectMongo();
  const collection = db.collection('recipes');

  const recipes = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
  return recipes[0];
};

const processOrder = async (order) => {
  console.log(`Processing order ${order.id}...`);

  const recipe = await getRandomRecipe();
  if (!recipe) {
    console.error('No recipes found!');
    return;
  }

  console.log(`Selected recipe: ${JSON.stringify(recipe)}`);

  if (!recipe._id) {
    console.error('Order ID not found!');
    return;
  }

  await pool.query('UPDATE orders SET order_status = $1, recipe_id = $2 WHERE id = $3', ['in_progress', recipe._id, order.id]);

  await sendMessage('ingredient_requests', { id: order.id, recipe: recipe });

};

const startCooking = async (orderId) => {

  console.log(`Starting cooking for order ${orderId}...`);


  await pool.query('UPDATE orders SET order_status = $1 WHERE id = $2', ['completed', orderId]);
  console.log(`Order ${orderId} is now completed`);

  await sendMessage('order_status', { id: orderId, status: 'completed' });

}


module.exports = { processOrder,startCooking };
