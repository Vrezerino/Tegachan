import { MongoClient, Db } from 'mongodb';
import { MONGO_URI, MONGODB_NAME } from './env';

// Options for MongoClient connection
const options = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  maxIdleTimeMS: 20000
};

// Declare MongoClient as global variable
let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

// Establish connection to db, assign client promise to globalWithMongo and return that
const getMongoClient = async () => {
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentially
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666
   */
  if (!globalWithMongo._mongoClientPromise) {
    try {
      const client: MongoClient = new MongoClient(MONGO_URI, options);

      // client.connect() returns an instance of MongoClient when resolved
      globalWithMongo._mongoClientPromise = client.connect();

      // Print info to console on successful connection
      console.log(`Connected to ${MONGODB_NAME} MongoDB Atlas database!`)
    } catch (e) {
      console.error(`Failed to connect to ${MONGODB_NAME} MongoDB database!`);
    }
  }
  return globalWithMongo._mongoClientPromise;
}

// Export database to be used in all CRUD methods
export const getMongoDb = async () => {
  const mongoClient = await getMongoClient();
  const db = mongoClient?.db(MONGODB_NAME);
  return db as Db;
}