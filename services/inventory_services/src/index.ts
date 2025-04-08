import dotenv from "dotenv";
dotenv.config();

import { consumeIngredientRequests } from "./kafka/consumer";
import { connectProducer } from "./kafka/producer";

const startInventoryService = async (): Promise<void> => {
  console.log("🚀 Iniciando Inventory Service...");

  try {
    await connectProducer();
    await consumeIngredientRequests();
  } catch (error) {
    console.error("❌ Error al iniciar el servicio de inventario:", error);
    process.exit(1);
  }
};

startInventoryService();
