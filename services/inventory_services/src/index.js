require("dotenv").config();
const { consumeIngredientRequests } = require("./kafka/consumer");
const { connectProducer } = require("./kafka/producer");

const startInventoryService = async () => {
  console.log("🚀 Iniciando Inventory Service...");
  await consumeIngredientRequests();

  await connectProducer();

};

startInventoryService();