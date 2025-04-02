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
    // usamos mongo para obtener las recetas
    const db = await connectMongo();
    const collection = db.collection('recipes');

    const recipes = await collection.find({}).toArray();
    return recipes;
  }
}

module.exports = new UiService();