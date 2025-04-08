import kafka from "./kafkaConfig";
import KitchenService from "../services/kitchenService";
import { EachMessagePayload } from "kafkajs";

const consumer = kafka.consumer({ groupId: "kitchen_group" });

export const consumeOrders = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topics: ["orders", "ingredient_deliveries"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }: EachMessagePayload) => {
      const value = message.value?.toString();

      if (!value) {
        console.warn("Mensaje vacío recibido");
        return;
      }

      const data = JSON.parse(value);
      console.log(`📩 Mensaje recibido en el topic "${topic}":`, data);

      if (topic === "orders") {
        await KitchenService.processOrder(data);
      } else if (topic === "ingredient_deliveries" && data.status === "ready") {
        await KitchenService.startCooking(data.orderId);
      }
    },
  });
};

export const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log("Kafka Consumer disconnected");
  } catch (error) {
    console.error("Error disconnecting Kafka Consumer:", error);
  }
};
