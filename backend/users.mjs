import { database } from './db/database.mjs';
import docs from './docs.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

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
        this.sendEmail(receipientEmail, documentId);
        return "Editor added successfully!";

    },

    sendEmail: async function sendEmail(to, link) {
        const msg = {
            to: to,
            from: 'karl@wackerberg.se', // Use the email address or domain you verified above
            subject: 'Sending with Twilio SendGrid is Fun : Welcome to edit a document',
            text: 'You have been invited to edit a document. You must register to edit the document.',
            html: `Karl: <a href="https://www.student.bth.se/~KAAA19/editor/documents/${link}">Edit document</a><br>Owais: <a href="https://www.student.bth.se/~owsu23/editor/documents/${link}">Edit document</a><br>Peter:<a href="https://www.student.bth.se/~pela23/editor/documents/${link}">Edit document</a>`,
        };
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        (async () => {
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            }
        })();

    }

};

export default users;