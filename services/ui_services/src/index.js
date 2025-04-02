require('dotenv').config();
const http = require('http');
const uiService = require('./services/uiServices');
const { connectDB } = require('./db/postgres');
const { connectMongo } = require('./db/mongo');
// const { connectConsumer } = require('./kafka/consumer');

const PORT = process.env.PORT || 3004;
const ORDER_SERVICE_URL = "http://order-service:3000";
const INVENTORY_SERVICE_URL = "http://inventory_service:3002";
const MARKET_SERVICE_URL = "http://market_service:3003";

const fetchData = (url, callback) => {
  const protocol = url.startsWith("https") ? https : http;

  protocol.get(url, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const jsonData = JSON.parse(data);
        callback(null, jsonData);
      } catch (error) {
        callback(error, null);
      }
    });
  }).on("error", (error) => {
    callback(error, null);
  });
};

const requestHandler = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    if (req.url === "/orders") {
      fetchData(`${ORDER_SERVICE_URL}/orders`, (err, data) => {
        res.writeHead(err ? 500 : 200);
        res.end(JSON.stringify(err ? { error: "Error obteniendo órdenes" } : data));
      });

    } else if (req.url === "/inventory") {
      const inventary = await uiService.getInventary();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(inventary));
    }else if (req.url === "/recipes") {
      const recipes = await uiService.getRecipes();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(recipes));

    


    // } else if (req.url === "/market/history") {
    //   fetchData(`${MARKET_SERVICE_URL}/history`, (err, data) => {
    //     res.writeHead(err ? 500 : 200);
    //     res.end(JSON.stringify(err ? { error: "Error obteniendo historial de compras" } : data));
    //   });

    // } else if (req.url === "/kitchen/history") {
    //   fetchData(`${KITCHEN_SERVICE_URL}/history`, (err, data) => {
    //     res.writeHead(err ? 500 : 200);
    //     res.end(JSON.stringify(err ? { error: "Error obteniendo historial de pedidos" } : data));
    //   });

    // } else if (req.url === "/recipes") {
    //   fetchData(`${INVENTORY_SERVICE_URL}/recipes`, (err, data) => {
    //     res.writeHead(err ? 500 : 200);
    //     res.end(JSON.stringify(err ? { error: "Error obteniendo recetas" } : data));
    //   });

    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Endpoint no encontrado" }));
    }

  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "Método no permitido" }));
  }
};

const server = http.createServer(requestHandler);

const startServer = async () => {
  try {
    console.log('Conectando a la base de datos...');
    await connectDB();
    console.log('Base de datos conectada.');

    await connectMongo();
    console.log('MongoDB conectado.');
    // console.log('Iniciando Kafka Producer...');
    // await connectConsumer();
    // console.log('Kafka Producer listo.');

    server.listen(PORT, () => {
      console.log(`Order Service corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando la aplicación:', error);
    process.exit(1); 
  }
};

startServer();
