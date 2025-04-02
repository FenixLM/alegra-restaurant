require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

let db;

const connectMongo = async () => {
  if (db) return db; 

  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('MongoDB connected');
  
  db = client.db(MONGO_DB_NAME);
  return db;
};

module.exports = { connectMongo };
