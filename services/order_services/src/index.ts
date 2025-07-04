import http, { IncomingMessage, ServerResponse } from "http";
import dotenv from "dotenv";
import { connectDB } from "./db/postgres";
import { connectProducer } from "./kafka/producer";
import { connectMongo } from "./db/mongo";
import orderService from "./services/orderService";

const PORT = process.env.PORT || 3000;

const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.method === "POST" && req.url === "/order") {
      const order = await orderService.createOrder();
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(order));
    } else if (req.method === "GET" && req.url === "/orders") {
      const orders = await orderService.getOrders();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(orders));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (error) {
    console.error("Error procesando la solicitud:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const server = http.createServer(requestHandler);

const startServer = async () => {
  try {
    console.log("Conectando a la base de datos...");
    await connectDB();
    console.log("Base de datos conectada.");

    console.log("Iniciando Kafka Producer...");
    await connectProducer();
    console.log("Kafka Producer listo.");

    await connectMongo();
    console.log("MongoDB conectado.");

    server.listen(PORT, () => {
      console.log(`Order Service corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando la aplicación:", error);
    process.exit(1);
  }
};

startServer();
