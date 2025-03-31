require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Conectado a PostgreSQL');
    client.release();
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
