import { pool } from "../db/postgres";
import { sendMessage } from "../kafka/producer";
import { connectMongo } from "../db/mongo";
import { Order, Recipe } from "../interfaces/kitchen.interface";

class kitchenService {
  async getRandomRecipe(): Promise<Recipe | null> {
    const db = await connectMongo();
    const collection = db.collection<Recipe>("recipes");

    const recipes = await collection
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();
    return (recipes[0] as Recipe) || null;
  }

  async processOrder(order: Order): Promise<void> {
    console.log(`Processing order ${order.id}...`);

    const recipe = await this.getRandomRecipe();
    if (!recipe) {
      console.error("No recipes found!");
      return;
    }

    console.log(`Selected recipe: ${JSON.stringify(recipe)}`);

    if (!recipe._id) {
      console.error("Recipe ID not found!");
      return;
    }

    await pool.query(
      "UPDATE orders SET order_status = $1, recipe_id = $2 WHERE id = $3",
      ["in_progress", recipe._id, order.id]
    );

    await sendMessage("ingredient_requests", {
      id: order.id,
      recipe,
    });
  }

  async startCooking(orderId: number): Promise<void> {
    console.log(`Starting cooking for order ${orderId}...`);

    await pool.query("UPDATE orders SET order_status = $1 WHERE id = $2", [
      "completed",
      orderId,
    ]);
    console.log(`Order ${orderId} is now completed`);

    await sendMessage("order_status", {
      id: orderId,
      status: "completed",
    });
  }
}

export default new kitchenService();

// const getRandomRecipe = async (): Promise<Recipe | null> => {
//   const db = await connectMongo();
//   const collection = db.collection<Recipe>("recipes");

//   const recipes = await collection
//     .aggregate([{ $sample: { size: 1 } }])
//     .toArray();
//   return (recipes[0] as Recipe) || null;
// };

// export const processOrder = async (order: Order): Promise<void> => {
//   console.log(`Processing order ${order.id}...`);

//   const recipe = await getRandomRecipe();
//   if (!recipe) {
//     console.error("No recipes found!");
//     return;
//   }

//   console.log(`Selected recipe: ${JSON.stringify(recipe)}`);

//   if (!recipe._id) {
//     console.error("Recipe ID not found!");
//     return;
//   }

//   await pool.query(
//     "UPDATE orders SET order_status = $1, recipe_id = $2 WHERE id = $3",
//     ["in_progress", recipe._id, order.id]
//   );

//   await sendMessage("ingredient_requests", {
//     id: order.id,
//     recipe,
//   });
// };

// export const startCooking = async (orderId: number): Promise<void> => {
//   console.log(`Starting cooking for order ${orderId}...`);

//   await pool.query("UPDATE orders SET order_status = $1 WHERE id = $2", [
//     "completed",
//     orderId,
//   ]);
//   console.log(`Order ${orderId} is now completed`);

//   await sendMessage("order_status", {
//     id: orderId,
//     status: "completed",
//   });
// };
