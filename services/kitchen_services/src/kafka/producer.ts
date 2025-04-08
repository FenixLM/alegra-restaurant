import kafka from "./kafkaConfig";
import { ProducerRecord } from "kafkajs";

const producer = kafka.producer();

export const connectProducer = async (): Promise<void> => {
  await producer.connect();
  console.log("Kafka Producer conectado");
};

export const sendMessage = async (
  topic: string,
  message: unknown
): Promise<void> => {
  try {
    const record: ProducerRecord = {
      topic,
      messages: [{ value: JSON.stringify(message) }],
    };

    await producer.send(record);
  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
};

export const disconnectProducer = async (): Promise<void> => {
  try {
    await producer.disconnect();
    console.log("Kafka Producer desconectado");
  } catch (error) {
    console.error("Error desconectando el productor de Kafka:", error);
  }
};
