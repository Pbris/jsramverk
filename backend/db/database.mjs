import dotenv from 'dotenv';
dotenv.config();

// import { MongoClient } from "mongodb";
// // const config = require("./config.json");
// const collectionName = "jsramverk";

// const database = {
//     getDb: async function getDb () {
//         let dsn = `mongodb://localhost:27017/documents`;

//         if (process.env.NODE_ENV === 'test') {
//             dsn = "mongodb://localhost:27017/test";
//         }

//         const client  = await MongoClient.connect(dsn, {
//         });
//         const db = await client.db();
//         const collection = await db.collection(collectionName);

//         return {
//             collection: collection,
//             client: client,
//         };
//     }
// };

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


// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    throw error;
  }
}

const database = {
    getDb: async function getDb (collectionName) {
      // await client.connect();
      const db = client.db();
      const collection = db.collection(collectionName);
        return {
            collection: collection,
            client: client,
        };
    }
};

export { database, connectToDatabase };

