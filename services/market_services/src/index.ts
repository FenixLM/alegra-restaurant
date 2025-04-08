require("dotenv").config();
const { consumeMarketOrders } = require("./kafka/consumer");
const { connectProducer } = require("./kafka/producer");

const startMarketService = async () => {
  console.log("🚀 Iniciando Inventory Service...");
  await consumeMarketOrders();

  await connectProducer();

};

startMarketService();