const { pool } = require("../db/postgres");
const { sendMessage } = require("../kafka/producer");

const processIngredientRequest = async (orderRequest) => {
  const client = await pool.connect();

  try {
    console.log("🔍 Verificando ingredientes para:", orderRequest.recipe);
    const ingredients = orderRequest.recipe.ingredients;
    console.log("🔍 recipe:", JSON.stringify(orderRequest.recipe));
    console.log("🔍 Ingredientes:", JSON.stringify(orderRequest.recipe.ingredients));

    let missingIngredients = [];

    // Revisamos primero si hay ingredientes faltantes antes de abrir una transacción
    for (const item of ingredients) {
      const res = await client.query(
        "SELECT quantity FROM ingredients WHERE name = $1",
        [item.name]
      );

      const available = res.rows[0]?.quantity || 0;

      if (available <= item.quantity) {
        missingIngredients.push({ name: item.name, quantity: item.quantity - available });
      }
    }

    if (missingIngredients.length > 0) {
      console.log("Ingredientes faltantes:", missingIngredients);
      await sendMessage("market_orders", { orderRequest, missingIngredients });
      return; // Sale de la función si hay ingredientes faltantes, sin realizar más operaciones
    }

    // Si no faltan ingredientes, entonces comenzamos la transacción
    await client.query("BEGIN");

    // Ahora actualizamos los ingredientes solo si todos están disponibles
    for (const item of ingredients) {
      const res = await client.query(
        "SELECT quantity FROM ingredients WHERE name = $1",
        [item.name]
      );

      const available = res.rows[0]?.quantity || 0;

      if (available >= item.quantity) {
        await client.query(
          "UPDATE ingredients SET quantity = quantity - $1 WHERE name = $2",
          [item.quantity, item.name]
        );
      }
    }

    // Si no faltan ingredientes, se notifica que todo está listo
    console.log("Ingredientes listos para la cocina");
    await sendMessage("ingredient_deliveries", { orderId: orderRequest.id, status: "ready" });

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
    console.log("INGREDIENTES SHOPPING", ingredientsShopping);
    
    console.log("🔍 Verificando ingredientes para:", orderRequest.recipe);
    console.log("🔍 recipe:", JSON.stringify(orderRequest.recipe))
    console.log("🔍 Ingredientes:", JSON.stringify(orderRequest.recipe.ingredients))

    await client.query("BEGIN");

    for (const item of ingredientsShopping) {
      const res = await client.query(
        // "INSERT INTO ingredients (name, quantity) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET quantity = ingredients.quantity + $2",
        // [item.name, item.quantity]
        "UPDATE ingredients SET quantity = quantity + $1 WHERE name = $2",
        [item.quantity, item.name]
      );
      console.log("res", res)
      console.log("item", item)
      console.log("item.name", item.name)
    }

    console.log("Ingredientes insertados correctamente:", ingredientsShopping);



    await client.query("COMMIT");
    setTimeout(() => {
      console.log("Ingredientes espera para la cocina");
     processIngredientRequest(orderRequest);
     updateMarketPurchase(data);
    }, 1000); 
    console.log("Ingredientes listos para la cocina");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error insertando ingredientes:", error);
  } finally {
    client.release();
  }
}



 
  const updateMarketPurchase = async (data) => {

    const ingredientsShopping = data.ingredients;
    const orderRequest = data.orderRequest;
    console.log("data", data);
    
  
    const client = await pool.connect();
  
  
    try {
      console.log("🔍 Verificando ingredientes para:", orderRequest);
  
      await client.query("BEGIN");
  
      for (const item of ingredientsShopping) {
        const res = await client.query(
          "INSERT INTO market_purchases(name, quantity, order_id) VALUES ($1, $2, $3) ",
          [item.name, item.quantity, orderRequest.id]  
        );
        console.log("res", res)
        console.log("item", item)
        console.log("item.name", item.name)
      }
  
      await client.query("COMMIT");
      console.log("Ingredientes agregados en historial de compras correctamente:", ingredientsShopping);
  

  
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error insertando ingredientes:", error);
    } finally {
      client.release();
    }
}

module.exports = { processIngredientRequest, insertIngredient };
