import dotenv from "dotenv";
import { Kafka } from "kafkajs";

dotenv.config();

const brokers: string[] = process.env.KAFKA_BROKER
  ? process.env.KAFKA_BROKER.split(",")
  : [];

if (brokers.length === 0) {
  console.error(
    "No se encontraron brokers de Kafka. Verifica KAFKA_BROKER en .env"
  );
  process.exit(1);
}

const kafka = new Kafka({
  clientId: "inventory_service",
  brokers,
});

export default kafka;
