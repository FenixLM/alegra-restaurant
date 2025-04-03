const { pool } = require('../db/postgres');
const { sendMessage } = require('../kafka/producer');
const { connectMongo } = require('../db/mongo');

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
    // return result.rows;
    const orders = result.rows;
    console.log('orders', orders);
    
    const db = await connectMongo();
    const collection = db.collection('recipes');
    const recipes = await collection.find({}).toArray();
    console.log('recipes', recipes);
    
    const ordersWithRecipes = orders.map((order) => {
      console.log('order', order);
      console.log('order.recipe_id', order.recipe_id);
      
      if (order.recipe_id) {
        const orderRecipeId = order.recipe_id.replace(/^"|"$/g, "").trim(); 
      
        const recipe = recipes.find((recipe) => {
          const recipeId = recipe._id.toHexString().trim();
      
          console.log(`Comparando: "${recipeId}" === "${orderRecipeId}"`);
      
          return recipeId === orderRecipeId;
        });
      
        console.log("Receta encontrada:", recipe);
        order.recipe = recipe || null;
      }
      return order;
    });
    return ordersWithRecipes;
  }
}

module.exports = new OrderService();
