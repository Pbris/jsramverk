/**
 * Connect to the database and search using a criteria.
 */
"use strict";

import apiRoutes from '../routes/api.mjs'; 

// // MongoDB
// const database = require("../db/database.mjs");

import documents from "./../docs.mjs";
import express from 'express';
import cors from 'cors';

// const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/documents";

// Express server
const port = process.env.DBWEBB_PORT || 1337;
const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

// Just for testing the sever
app.get("/", (req, res) => {
    res.send("Hello World");
});



// Return a JSON object with list of all documents within the collection.
app.get("/list", async (rreq, res) => {
    const result = await documents.getAll();
    return res.json(result);
});

// Mount API routes under /api
app.use('/api', apiRoutes);

// Export the app for testing purposes
export { app };

// Startup server and liten on port
if(process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
        console.log(`DSN is: ${dsn}`);
    });
}

// /**
//  * Find documents in an collection by matching search criteria.
//  *
//  * @async
//  *
//  * @param {string} dsn        DSN to connect to database.
//  * @param {string} colName    Name of collection.
//  * @param {object} criteria   Search criteria.
//  * @param {object} projection What to project in results.
//  * @param {number} limit      Limit the number of documents to retrieve.
//  *
//  * @throws Error when database operation fails.
//  *
//  * @return {Promise<array>} The resultset as an array.
//  */
// async function findInCollection(dsn, colName, criteria, projection, limit) {
//     const client  = await mongo.connect(dsn);
//     const db = await client.db();
//     const col = await db.collection(colName);
//     const res = await col.find(criteria, projection).limit(limit).toArray();

//     await client.close();

//     return res;
// }

/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function findInCollection(criteria, projection, limit) {
    const db = await database.getDb();
    const col = await db.collection;
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await db.client.close();

    return res;
}