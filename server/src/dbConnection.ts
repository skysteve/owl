import { MongoClient, Db } from 'mongodb';

// TODO fix URI to have user, password and host from env vars
const url = `mongodb://localhost:27017`;

// Database Name
const DB_NAME = 'owl_assessment';

// Create a new MongoClient
let client = new MongoClient(url, { useUnifiedTopology: true });

export async function initMongoDB(): Promise<Db> {
  client = await client.connect();
  const db = client.db(DB_NAME);

  console.info('Connected to mongoDB');

  return db;
}


