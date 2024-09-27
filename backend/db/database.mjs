// import { MongoClient } from "mongodb";
// // const config = require("./config.json");
<<<<<<< Updated upstream
// const collectionName = "jsramverk";
=======
const collectionName = "jsramverk";
>>>>>>> Stashed changes

// const database = {
//     getDb: async function getDb () {
//         let dsn = `mongodb://localhost:27017/documents`;
<<<<<<< Updated upstream

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
const uri = "mongodb+srv://admin:XOUdyhU6xIJ3cFsu@jsramverk.9wov7.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
=======

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
const uri = "mongodb+srv://admin:XOUdyhU6xIJ3cFsu@jsramverk.9wov7.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const database = {
    getDb: async function getDb () {
      await client.connect();
      const db = await client.db();
      const collection = await db.collection(collectionName);
        return {
            collection: collection,
            client: client,
        };
    }
};

export { database }

>>>>>>> Stashed changes
