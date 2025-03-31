require('dotenv').config();
const http = require('http');
const { connectDB } = require('./db/postgres');
const { consumeOrders } = require('./kafka/consumer');
const { connectProducer } = require('./kafka/producer');
const kitchenService = require('./services/kitchenService');
const { connectMongo } = require('./db/mongo');

const PORT = process.env.PORT || 3001;

const requestHandler = async (req, res) => {
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'Kitchen Service is running' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
};

const server = http.createServer(requestHandler);

server.listen(PORT, async () => {
  await connectDB();
  await connectMongo();
  await connectProducer();
  await consumeOrders();
  console.log(`🚀 Kitchen Service running on http://localhost:${PORT}`);
});
