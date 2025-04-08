import dotenv from "dotenv";
import { MongoClient, Db } from "mongodb";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "";

let db: Db | null = null;

export const connectMongo = async (): Promise<Db> => {
  if (db) return db;

  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);

  await client.connect();
  console.log("MongoDB conectado");

  db = client.db(MONGO_DB_NAME);
  return db;
};
