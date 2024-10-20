import { ObjectId } from 'mongodb';
import { database } from './db/database.mjs';

const docs = {
    getAll: async function getAll() {
        const { collection, client } = await database.getDb();

        try {
            return await collection.find({}).toArray();
        } catch (e) {
            console.error(e);
            return [];
        } finally {
            await client.close();
        }
    },

    getOne: async function getOne(id) {
        const { collection, client } = await database.getDb();
        try {
            return await collection.findOne({ _id: new ObjectId(id) });
        } catch (e) {
            console.error(e);
            return {};
        } finally {
            await client.close();
        }
    },

    addOne: async function addOne(body) {
        const { collection, client } = await database.getDb();
        try {
            return await collection.insertOne({
                title: body.title,
                content: body.content,
                isCode: body.isCode || false,
            });
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    },

    updateOne: async function updateOne(id, body) {
        const { collection, client } = await database.getDb();
        try {
            return await collection.updateOne(
                { _id: new ObjectId(id) },
                { 
                    $set: {
                        title: body.title,
                        content: body.content,
                        isCode: body.isCode
                    } 
                }
            );
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
};

export default docs;