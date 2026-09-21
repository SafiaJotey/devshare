import { MongoClient, Db, ServerApiVersion, Collection, Document } from "mongodb";
import config from "./index";

if (!config.database_url) {
  throw new Error("Missing MongoDB connection string in environment variables (DB or DATABASE_URL).");
}

export const client = new MongoClient(config.database_url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbInstance: Db | null = null;

export const connectToDatabase = async (): Promise<Db> => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    await client.connect();
    // Default to 'devshare' database if not specified in URI
    dbInstance = client.db("devshare");

    // Ping the database to verify connection
    await dbInstance.command({ ping: 1 });
    console.log("Successfully connected to MongoDB Cluster (Database: devshare)");

    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export const getDb = (): Db => {
  if (!dbInstance) {
    // Return db instance from client even if connect was called implicitly
    dbInstance = client.db("devshare");
  }
  return dbInstance;
};

export const getCollection = <T extends Document = Document>(collectionName: string): Collection<T> => {
  return getDb().collection<T>(collectionName);
};
