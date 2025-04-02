const  kafka  = require("./kafkaConfig");
const { processIngredientRequest, insertIngredient } = require("../services/inventoryService");

const consumer = kafka.consumer({ groupId: "inventory-group" });

const consumeIngredientRequests = async () => {
  await consumer.connect();
  await consumer.subscribe({ topics: ["ingredient_requests", "ingredient_purchases"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("Recibida solicitud de ingredientes:", data);

      if (topic === "ingredient_requests") {
        await processIngredientRequest(data);
      }else if (topic === "ingredient_purchases") {
        console.log("Recibida entrega de ingredientes:", data);
        await insertIngredient(data);
      }

    },
  });
};

module.exports = { consumeIngredientRequests };
