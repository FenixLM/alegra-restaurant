const { pool } = require("../db/postgres");
const { sendMessage } = require("../kafka/producer");

const processIngredientRequest = async (orderRequest) => {
  const client = await pool.connect();

  try {
    console.log("🔍 Verificando ingredientes para:", orderRequest.recipe);
    const ingredients = orderRequest.recipe.ingredients;
    console.log("🔍 recipe:", JSON.stringify(orderRequest.recipe))
    console.log("🔍 Ingredientes:", JSON.stringify(orderRequest.recipe.ingredients))
    
    

    await client.query("BEGIN");

    let missingIngredients = [];


    for (const item of ingredients) {
      const res = await client.query(
        "SELECT quantity FROM ingredients WHERE name = $1",
        [item.name]
      );

      const available = res.rows[0]?.quantity || 0;

      if (available < item.quantity) {
        missingIngredients.push({ name: item.name, quantity: item.quantity - available });
      } else {
        await client.query(
          "UPDATE ingredients SET quantity = quantity - $1 WHERE name = $2",
          [item.quantity, item.name]
        );
      }
    }

    if (missingIngredients.length > 0) {
      console.log("Ingredientes faltantes:", missingIngredients);
      console.log("Ingredientes faltantes:", JSON.stringify(missingIngredients));

      await sendMessage("market_orders", { orderRequest, missingIngredients });
    } else {
      console.log("Ingredientes listos para la cocina");
      await sendMessage("ingredient_deliveries", { orderId: orderRequest.id, status: "ready" });
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error procesando ingredientes:", error);
  } finally {
    client.release();
  }
};

const insertIngredient = async (data) => {

  const ingredientsShopping = data.ingredients;
  const orderRequest = data.orderRequest;
  console.log("data", data);
  

  const client = await pool.connect();


  try {
    console.log("🔍 Verificando ingredientes para:", orderRequest.recipe);
    console.log("🔍 recipe:", JSON.stringify(orderRequest.recipe))
    console.log("🔍 Ingredientes:", JSON.stringify(orderRequest.recipe.ingredients))

    await client.query("BEGIN");

    for (const item of ingredientsShopping) {
      const res = await client.query(
        "INSERT INTO ingredients (name, quantity) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET quantity = ingredients.quantity + $2",
        [item.name, item.quantity]
      );
      console.log("res", res)
      console.log("item", item)
      console.log("item.name", item.name)
    }

    await client.query("COMMIT");
    console.log("Ingredientes insertados correctamente:", ingredientsShopping);

    await processIngredientRequest(orderRequest);


  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error insertando ingredientes:", error);
  } finally {
    client.release();
  }



 
  
}

module.exports = { processIngredientRequest, insertIngredient };
