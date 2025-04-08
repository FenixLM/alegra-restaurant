import { pool } from "../db/postgres";
import {
  Ingredient,
  MarketOrderData,
  OrderRequest,
} from "../interfaces/inventory.interface";
import { sendMessage } from "../kafka/producer";

class InventoryService {
  async processIngredientRequest(orderRequest: OrderRequest): Promise<void> {
    const client = await pool.connect();

    try {
      console.log("🔍 Verificando ingredientes para:", orderRequest.recipe);
      const ingredients = orderRequest.recipe.ingredients;
      let missingIngredients: Ingredient[] = [];

      for (const item of ingredients) {
        const res = await client.query(
          "SELECT quantity FROM ingredients WHERE name = $1",
          [item.name]
        );
        const available = res.rows[0]?.quantity || 0;

        if (available < item.quantity) {
          missingIngredients.push({
            name: item.name,
            quantity: item.quantity - available,
          });
        }
      }

      if (missingIngredients.length > 0) {
        console.log("❌ Ingredientes faltantes:", missingIngredients);
        await sendMessage("market_orders", {
          orderRequest,
          missingIngredients,
        });
        return;
      }

      await client.query("BEGIN");

      for (const item of ingredients) {
        await client.query(
          "UPDATE ingredients SET quantity = quantity - $1 WHERE name = $2",
          [item.quantity, item.name]
        );
      }

      console.log("✅ Ingredientes listos para la cocina");
      await sendMessage("ingredient_deliveries", {
        orderId: orderRequest.id,
        status: "ready",
      });

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Error procesando ingredientes:", error);
    } finally {
      client.release();
    }
  }

  async insertIngredient(data: MarketOrderData): Promise<void> {
    const { ingredients: ingredientsShopping, orderRequest } = data;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const item of ingredientsShopping) {
        await client.query(
          "UPDATE ingredients SET quantity = quantity + $1 WHERE name = $2",
          [item.quantity, item.name]
        );
      }

      console.log(
        "✅ Ingredientes insertados correctamente:",
        ingredientsShopping
      );

      await client.query("COMMIT");

      setTimeout(() => {
        console.log("⏳ Espera antes de enviar a cocina...");
        this.processIngredientRequest(orderRequest);
        this.updateMarketPurchase(data);
      }, 1000);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Error insertando ingredientes:", error);
    } finally {
      client.release();
    }
  }

  private async updateMarketPurchase(data: MarketOrderData): Promise<void> {
    const { ingredients: ingredientsShopping, orderRequest } = data;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const item of ingredientsShopping) {
        await client.query(
          "INSERT INTO market_purchases(name, quantity, order_id) VALUES ($1, $2, $3)",
          [item.name, item.quantity, orderRequest.id]
        );
      }

      await client.query("COMMIT");
      console.log(
        "🛒 Ingredientes registrados en historial de compras:",
        ingredientsShopping
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Error registrando compras:", error);
    } finally {
      client.release();
    }
  }
}

export default new InventoryService();
