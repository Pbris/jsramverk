import { ObjectId } from 'mongodb';
import { database } from './db/database.mjs';

const docs = {
    getAll: async function getAll() {
        const { collection, client } = await database.getDb('jsramverk');

        try {
            return await collection.find({}).toArray();
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    getOne: async function getOne(id) {
        const { collection, client } = await database.getDb('jsramverk');
        try {
            return await collection.findOne({ _id: new ObjectId(id) });
        } catch (e) {
            console.error(e);
            return {};
        }
    },

    addOne: async function addOne(body, ownerId) {
        const { collection, client } = await database.getDb('jsramverk');
        if (!ownerId) {
            throw new Error('OwnerId is required to create a document');
        }

        try {
            return await collection.insertOne({
                title: body.title,
                content: body.content,
                isCode: body.isCode || false,
                owner: ownerId,
            });
        } catch (e) {
            console.error(e);
        }
    },

    updateOne: async function updateOne(id, body) {
        const { collection, client } = await database.getDb('jsramverk');

        try {
            return await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        title: body.title,
                        content: body.content,
                        isCode: body.isCode,
                    }
                }
            );
        } catch (e) {
            console.error(e);
        }
    },

    addEditor: async function addEditor(id, email) {
        const { collection, client } = await database.getDb('jsramverk');
        try {
            return await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $addToSet: { editors: email },
                },
                { upsert: false }
            );
        } catch (e) {
            console.error(e);
        }
    },

    deleteOne: async function deleteOne(id) {
        const { collection, client } = await database.getDb('jsramverk');
        try {
            return await collection.deleteOne({ _id: new ObjectId(id) });
        } catch (e) {
            console.error(e);
            return { deletedCount: 0 };
        }
    }
};

export default docs;