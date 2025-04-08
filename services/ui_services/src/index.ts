import http, { IncomingMessage, ServerResponse } from "http";
import { connectMongo } from "./db/mongo";
import uiServices from "./services/uiServices";

import { connectDB } from "./db/postgres";

const ORDER_SERVICE_URL = "http://order-service:3000";

const fetchData = (
  url: string,
  callback: (error: Error | null, data: any) => void
): void => {
  const protocol = url.startsWith("https") ? require("https") : http;

  protocol
    .get(url, (res: IncomingMessage) => {
      let data = "";

      res.on("data", (chunk: string) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          callback(null, jsonData);
        } catch (error) {
          callback(error as Error, null);
        }
      });
    })
    .on("error", (error: Error) => {
      callback(error as Error, null);
    });
};

const postData = (
  url: string,
  data: any,
  callback: (error: Error | null, data: any) => void
): void => {
  const protocol = url.startsWith("https") ? require("https") : http;
  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(jsonData),
    },
  };

  const req = protocol.request(url, options, (res: IncomingMessage) => {
    let responseData = "";

    res.on("data", (chunk: string) => {
      responseData += chunk;
    });

    res.on("end", () => {
      try {
        callback(null, JSON.parse(responseData));
      } catch (error) {
        callback(error as Error, null);
      }
    });
  });

  req.on("error", (error: Error) => {
    callback(error, null);
  });

  req.write(jsonData);
  req.end();
};

const handleCORS = (req: IncomingMessage, res: ServerResponse): boolean => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return false;
  }
  return true;
};

const requestHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  if (!handleCORS(req, res)) return;
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    if (req.url === "/orders") {
      fetchData(`${ORDER_SERVICE_URL}/orders`, (err, data) => {
        res.writeHead(err ? 500 : 200);
        res.end(
          JSON.stringify(
            err ? { error: `Error obteniendo órdenes, ${err}` } : data
          )
        );
      });
    } else if (req.url === "/inventory") {
      const inventary = await uiServices.getInventary();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(inventary));
    } else if (req.url === "/recipes") {
      const recipes = await uiServices.getRecipes();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(recipes));
    } else if (req.url === "/purchases") {
      const purchases = await uiServices.getPurchases();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(purchases));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Endpoint no encontrado" }));
    }
  } else if (req.method === "POST" && req.url === "/order") {
    let body = "";

    req.on("data", (chunk: string) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const order: any = body ? JSON.parse(body) : null;
        postData(`${ORDER_SERVICE_URL}/order`, order, (err, data) => {
          res.writeHead(err ? 500 : 201);
          res.end(
            JSON.stringify(err ? { error: "Error creando orden" } : data)
          );
        });
      } catch (error) {
        console.log(error);

        res.writeHead(400);
        res.end(JSON.stringify({ error: "Datos inválidos" }));
      }
    });
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "Método no permitido" }));
  }
};

const server = http.createServer(requestHandler);

const startServer = async (): Promise<void> => {
  try {
    console.log("Conectando a la base de datos...");
    await connectDB();
    console.log("Base de datos conectada.");

    await connectMongo();
    console.log("MongoDB conectado.");

    server.listen(Number(process.env.PORT) || 3004, () => {
      console.log(
        `Order Service corriendo en http://localhost:${
          process.env.PORT || 3004
        }`
      );
    });
  } catch (error) {
    console.error("Error iniciando la aplicación:", error);
    process.exit(1); // Salir con error
  }
};

startServer();
