import { database } from './db/database.mjs';
import bcrypt from 'bcryptjs';

const users = {
    
    getAll: async function getAll() {
        const { collection, client } = await database.getDb("users");
        try {
            return await collection.find({}).toArray();
        } catch (e) {
            console.error(e);
            return [];
        } 
    },

    getOneByUsername: async function getOneByUsername(email) {
        const { collection, client } = await database.getDb("users");
        try {
            return await collection.findOne({ email: email });
        } catch (e) {
            console.error(e);
            return {};
        }
    },

    addUser: async function addUser(body) {
        console.log("addUser", body);
        const { collection, client } = await database.getDb("users");
        try {
            const emailAlreadyExists = await this.getOneByUsername(body.email) !== null ? true : false;
            if (emailAlreadyExists) {
                return { error: "Cannot register user" };
            }
            const hashedPassword = await bcrypt.hash(body.password, 10);
            return await collection.insertOne({
                email: body.email,
                hashedPassword: hashedPassword,
            });
        } catch (e) {
            console.error(e);
        }
    },

    verifyUser: async function verifyUser(email, password) {
        const { collection, client } = await database.getDb("users");
        try {
            const user = await collection.getOneByUsername(email);
            if (await bcrypt.compare(password, user.hashedPassword)) {
                return user;
            } else {
                return {};
            }
        } catch (e) {
            console.error(e);
            return {};
        }
    }
};

export default users;