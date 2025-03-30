const express = require('express');
const { Kafka } = require('kafkajs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Configuración de Kafka con validación de brokers
const brokers = process.env.KAFKA_BROKER ? process.env.KAFKA_BROKER.split(',') : [];
if (brokers.length === 0) {
  console.error('No se encontraron brokers de Kafka. Verifica KAFKA_BROKER en .env');
  process.exit(1);
}

const kafka = new Kafka({ clientId: 'order-service', brokers });
const producer = kafka.producer();

async function startKafkaProducer() {
  try {
    await producer.connect();
    console.log('Productor de Kafka conectado');
  } catch (error) {
    console.error('Error al conectar Kafka:', error);
    process.exit(1);
  }
}
startKafkaProducer();

app.post('/order', async (req, res) => {
  try {
    console.log('Creando pedido...', req.body);

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Faltan datos del pedido' });
    }

    const result = await pool.query(
      'INSERT INTO orders (order_status) VALUES ($1) RETURNING *',
      [status]
    );

    await producer.send({
      topic: 'orders',
      messages: [{ value: JSON.stringify(result.rows[0]) }],
    });

    console.log('Pedido enviado a Kafka:', result.rows[0]);
    
    res.status(201).json({ message: 'Pedido enviado', order: result.rows[0] });
  } catch (error) {
    console.error('Error al procesar la orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const server = app.listen(3000, async () => {
  console.log('Order Service corriendo en 3000');
});

process.on('SIGINT', async () => {
  console.log('Cerrando conexiones...');
  await pool.end();
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});

module.exports = { app, server, pool, producer };
