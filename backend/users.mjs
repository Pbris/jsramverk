import { database } from './db/database.mjs';
import docs from './docs.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET || "NOT YET A SECRET";

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
            const data = await this.getOneByUsername(body.email);
            console.log(data);
            if (data !== null) {
                console.log("Cannot register user - email already exists");
                throw new Error("User already exists");
            }
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const result = await collection.insertOne({
                email: body.email,
                hashedPassword: hashedPassword,
                role: body.role || "user"
            });
            return {
                _id: result.insertedId,
                email: body.email,
                role: body.role
            }
        } catch (e) {
            console.error("Error adding user:", e);
            throw new Error("Failed to register user");
        }
    },

    verifyUser: async function verifyUser(email, password) {
        const user = await this.getOneByUsername(email);
        if (!user) {
            return {};
        }
        if (await bcrypt.compare(password, user.hashedPassword)) {
            console.log("User is verified");
            console.log({ _id: user._id, email: email, role: user?.role ? user.role : "user" });
            // Create a token
            const token = jwt.sign({ _id: user._id, email: email, role: user.role ? user.role : "user" }, secret, {
                expiresIn: "1h"
            });
            console.log(token);
            return {
                token: token,
                _id: user._id,
                email: email,
                role: user.role ? user.role : "user"
            };
        } else {
            return {};
        }
    },

    sendInvite: async function sendInvite(senderId, receipientEmail, documentId) {

        await docs.addEditor(documentId, receipientEmail);
        this.sendEmail(receipientEmail, "hoja");
        return "Editor added successfully!";

    },

    sendEmail: async function sendEmail(to, link) {
        console.log(`Not really sending email to ${to} with link: ${link}`);
    }

};

export default users;