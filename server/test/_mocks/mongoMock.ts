import { Db } from 'mongodb';
import * as mockMongo from 'mongo-mock';

// this class is a really trimmed down mock version of mongoDB

export function getMockMongoDb(): Promise<Db> {
  return new Promise((resolve) => {
    const MongoClient = mockMongo.MongoClient;
    MongoClient.connect('mongodb://localhost:27017/test', {}, (_err, client) => {
      const db = client.db();
      resolve(db);
    });
  });
};

export function insertMockData(db: Db, colName: string, data: any[]): Promise<void> {
  const collection = db.collection(colName);
  // Insert some documents

  return new Promise((resolve) => {
    collection.insertMany(data, (err, result) => {
      resolve();
    });
  });
}