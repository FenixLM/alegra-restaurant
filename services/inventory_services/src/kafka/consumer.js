const  kafka  = require("./kafkaConfig");
const { processIngredientRequest } = require("../services/inventoryService");

const consumer = kafka.consumer({ groupId: "inventory-group" });

const consumeIngredientRequests = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "ingredient_requests", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const orderRequest = JSON.parse(message.value.toString());
      console.log("Recibida solicitud de ingredientes:", orderRequest);

      await processIngredientRequest(orderRequest);
    },
  });
};

module.exports = { consumeIngredientRequests };
