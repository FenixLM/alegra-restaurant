import dotenv from "dotenv";
import { consumeMarketOrders } from "./kafka/consumer";
import { connectProducer } from "./kafka/producer";

dotenv.config();

const startMarketService = async (): Promise<void> => {
  console.log("🚀 Iniciando Inventory Service...");
  await consumeMarketOrders();

  await connectProducer();
};

startMarketService();
