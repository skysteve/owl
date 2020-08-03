import { MongoClient, Db } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'owl_assessment';
const MONGO_URL = `mongodb://${DB_HOST}:${DB_PORT}`;

// Create a new MongoClient
let client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });

export async function initMongoDB(): Promise<Db> {
  client = await client.connect();
  const db = client.db(DB_NAME);

  console.info('Connected to mongoDB');

  return db;
}


