const { pool } = require('../db/postgres');
const { connectMongo } = require('../db/mongo');

class UiService {
  async getInventary() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM ingredients');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo inventario:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getRecipes() {
    const db = await connectMongo();
    const collection = db.collection('recipes');

    const recipes = await collection.find({}).toArray();
    return recipes;
  }

  async getPurchases() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT order_id, 
               JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', id,
                   'name', name,
                   'quantity', quantity,
                   'purchased_at', purchased_at
                 )
               ) AS items
        FROM market_purchases
        GROUP BY order_id;
      `;
      const result = await client.query(query);
      return result.rows;  // Devuelve los datos agrupados
    } catch (error) {
      console.error("Error obteniendo compras:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  
}

module.exports = new UiService();