import dotenv from 'dotenv';
dotenv.config();

// export default database;
import { MongoClient, ServerApiVersion } from 'mongodb';

let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.9wov7.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`;

if (1 || process.env.NODE_ENV === 'test') {
  // Consider switching to a cloud hosted database for testing
  //uri = "mongodb://localhost:27017/test";
  uri=`mongodb+srv://${process.env.ATLAS_TEST_USERNAME}:${process.env.ATLAS_TEST_PASSWORD}@jsramverk-test.ywmci.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk-test`;
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
  } catch (error) {
    throw error;
  }
}

const database = {
    getDb: async function getDb (collectionName) {
      const db = client.db();
      const collection = db.collection(collectionName);
        return {
            collection: collection,
            client: client,
        };
    }
};

export { database, connectToDatabase };

