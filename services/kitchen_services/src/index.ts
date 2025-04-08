import dotenv from "dotenv";
import http, { IncomingMessage, ServerResponse } from "http";
import { connectDB } from "./db/postgres";
import { consumeOrders } from "./kafka/consumer";
import { connectProducer } from "./kafka/producer";
import { connectMongo } from "./db/mongo";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const requestHandler = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
): Promise<void> => {
  if (req.method === "GET" && req.url === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "Kitchen Service is running" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
};

const server = http.createServer(requestHandler);

server.listen(PORT, async () => {
  try {
    await connectDB();
    await connectMongo();
    await connectProducer();
    await consumeOrders();
    console.log(`🚀 Kitchen Service running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Error starting Kitchen Service:", error);
    process.exit(1);
  }
});
