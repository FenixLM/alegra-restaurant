import kafka from "./kafkaConfig";
import { sendMessage } from "./producer";
import marketService from "../services/marketService";
import { KafkaMessage, EachMessagePayload } from "kafkajs";

const consumer = kafka.consumer({ groupId: "market_group" });

export const consumeMarketOrders = async (): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: "market_orders", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }: EachMessagePayload) => {
      try {
        console.log("Conectado al topic:", topic);
        const rawValue = message.value?.toString();

        if (!rawValue) {
          console.warn("Mensaje vacío recibido");
          return;
        }

        const data = JSON.parse(rawValue);
        console.log(`📩 Mensaje recibido en el topic "${topic}":`, data);

        const shoppingResult = await Promise.all(
          data.missingIngredients.map(async (ingredient: { name: string }) => {
            const result = await marketService.buyIngredient(ingredient.name);
            return result;
          })
        );

        console.log("🛒 Resultados de la compra:", shoppingResult);

        await sendMessage("ingredient_purchases", {
          orderRequest: data.orderRequest,
          ingredients: shoppingResult,
        });
      } catch (error) {
        console.error("Error procesando mensaje:", error);
      }
    },
  });
};

export const disconnectConsumer = async (): Promise<void> => {
  try {
    await consumer.disconnect();
    console.log("Kafka Consumer disconnected");
  } catch (error) {
    console.error("Error disconnecting Kafka Consumer:", error);
  }
};
