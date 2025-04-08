import kafka from "./kafkaConfig";
import InventoryService from "../services/inventoryService";
import { KafkaMessage, EachMessagePayload } from "kafkajs";

const consumer = kafka.consumer({ groupId: "inventory-group" });

export const consumeIngredientRequests = async (): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({
    topics: ["ingredient_requests", "ingredient_purchases"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({
      topic,
      message,
    }: EachMessagePayload): Promise<void> => {
      const value = message.value?.toString();
      if (!value) return;

      const data = JSON.parse(value);
      console.log("📩 Mensaje recibido en el topic:", topic, data);

      if (topic === "ingredient_requests") {
        await InventoryService.processIngredientRequest(data);
      } else if (topic === "ingredient_purchases") {
        console.log("📦 Recibida entrega de ingredientes:", data);
        await InventoryService.insertIngredient(data);
      }
    },
  });
};
