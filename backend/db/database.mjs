import { MongoClient } from "mongodb";
// const config = require("./config.json");
const collectionName = "jsramverk";

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb://localhost:27017/documents`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client  = await MongoClient.connect(dsn, {
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

export default database;
