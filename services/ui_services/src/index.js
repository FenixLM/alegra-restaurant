require('dotenv').config();
const http = require('http');
const uiService = require('./services/uiServices');
const { connectDB } = require('./db/postgres');
const { connectMongo } = require('./db/mongo');
// const { connectConsumer } = require('./kafka/consumer');

const PORT = process.env.PORT || 3004;
const ORDER_SERVICE_URL = "http://order-service:3000";

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
const postData = (url, data, callback) => {
  const protocol = url.startsWith("https") ? https : http;
  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(jsonData),
    },
  };

  const req = protocol.request(url, options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      try {
        callback(null, JSON.parse(responseData));
      } catch (error) {
        callback(error, null);
      }
    });
  });

  req.on("error", (error) => {
    callback(error, null);
  });

  req.write(jsonData);
  req.end();
};

const handleCORS = (req, res) => {
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

const requestHandler = async (req, res) => {
  if (!handleCORS(req, res)) return;
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    if (req.url === "/orders") {
      fetchData(`${ORDER_SERVICE_URL}/orders`, (err, data) => {
        res.writeHead(err ? 500 : 200);
        res.end(JSON.stringify(err ? { error: `Error obteniendo órdenes, ${err}` } : data));
      });

    } else if (req.url === "/inventory") {
      const inventary = await uiService.getInventary();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(inventary));
    }else if (req.url === "/recipes") {
      const recipes = await uiService.getRecipes();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(recipes));

    } else if (req.url === "/purchases") {
      const purchases = await uiService.getPurchases();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(purchases));

    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Endpoint no encontrado" }));
    }

  }else if (req.method === "POST" && req.url === "/order") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const order = body ? JSON.parse(body) : null;
        postData(`${ORDER_SERVICE_URL}/order`, order, (err, data) => {
          res.writeHead(err ? 500 : 201);
          res.end(JSON.stringify(err ? { error: "Error creando orden" } : data));
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
