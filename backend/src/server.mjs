/**
 * Connect to the database and search using a criteria.
 */
import dotenv from 'dotenv';
import http from 'http';
import { connectToDatabase } from '../db/database.mjs';
import { Server } from 'socket.io';
dotenv.config();
"use strict";

const visual = true;
import { graphqlHTTP } from 'express-graphql';
// const {
//   GraphQLSchema
// } = require("graphql");

import { GraphQLSchema } from "graphql";

import RootQueryType from "./graphql/root.mjs";
import RootMutationType from "./graphql/mutations/rootMutation.mjs";


import apiRoutes from '../routes/api.mjs'; 

import documents from "../docs.mjs";
import express from 'express';
import cors from 'cors';

let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.9wov7.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`;

// Express server
const port = process.env.PORT || 1337;

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
    origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://www.student.bth.se",
            "http://localhost:1337"
          ],
    methods: ["GET", "POST"]
}
});

let timeout;

// Server
io.sockets.on('connection', function(socket) {
    console.log(socket.id);
    
    socket.on('create', (room) => {
        console.log(`Socket ${socket.id} joining room ${room}`);
        
        socket.join(room);
    });
    
    socket.on('doc', async (data) => {
        console.log(`Received update for document ${data._id}:`, data);

        io.to(data._id).emit('doc', data);

        //Save data
        clearTimeout(timeout);
        timeout = setTimeout(async function () {
            console.log(`Saving document ${data._id} to the API...`);
            await documents.updateOne(data._id, {
                title: data.title,
                content: data.content
            });
        }, 2000); 

    });
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

connectToDatabase();

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual,
}));

// Just for testing the sever
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Mount API routes under /api
app.use('/api', apiRoutes);

// Export the app for testing purposes
export { app };

// Startup server and liten on port
if(process.env.NODE_ENV !== 'test') {
    httpServer.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    });
} else {
    console.log("Server is not running, it is started in test mode");
}


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