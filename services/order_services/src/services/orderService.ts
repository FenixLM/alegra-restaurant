import { pool } from "../db/postgres";
import { sendMessage } from "../kafka/producer";
import { connectMongo } from "../db/mongo";
import { Order, Recipe } from "../interfaces/order.interface";

class OrderService {
  async createOrder(): Promise<Order> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        "INSERT INTO orders (order_status) VALUES ('pending') RETURNING *"
      );

      const order: Order = result.rows[0];

      await client.query("COMMIT");
      await sendMessage("orders", order);

      return order;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getOrders(): Promise<Order[]> {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    const orders: Order[] = result.rows;

    const db = await connectMongo();
    const collection = db.collection<
      Recipe & { _id: { toHexString: () => string } }
    >("recipes");
    const recipes = await collection.find({}).toArray();

    const ordersWithRecipes: Order[] = orders.map((order) => {
      if (order.recipe_id) {
        const orderRecipeId = order.recipe_id.replace(/^"|"$/g, "").trim();

        const recipe = recipes.find((recipe) => {
          const recipeId = recipe._id.toHexString().trim();
          return recipeId === orderRecipeId;
        });

        order.recipe = recipe || undefined;
      }
      return order;
    });

    return ordersWithRecipes;
  }
}

export default new OrderService();
