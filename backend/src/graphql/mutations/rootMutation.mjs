import {
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import UsersType from "../users.mjs";
import users from "../../../users.mjs";
import documents from "../../../docs.mjs";

const LoginResponseType = new GraphQLObjectType({
    name: 'LoginResponse',
    description: 'Response for user login',
    fields: {
        token: { type: GraphQLString }, // Return the token here
        _id: { type: GraphQLString },   // Optional: Return user _id
        email: { type: GraphQLString },  // Optional: Return user email
        role: { type: GraphQLString }   // Optional: Return user role
    }
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addUser: {
            type: UsersType,
            description: 'Add a user',
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                role: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                try {
                    const newUser = await users.addUser(args);
                    if (!newUser) {
                        throw new Error("User registration failed.");
                    }
                    return newUser;
                } catch (error) {
                    console.error("Error in addUser mutation:", error.message);
                    throw new Error("Cannot register user: " + error.message);
                }
            }
        },
        verifyUser: {
            type: LoginResponseType,
            description: 'Verify a user',
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                const user = await users.verifyUser(args.email, args.password);

                if (!user.token) {
                    throw new Error("Unauthorized");
                }
                return user;
            }
        },
        sendInvite: {
            type: GraphQLString,
            description: 'Send an invite to edit a document',
            args: {
                email: { type: GraphQLString },
                documentId: { type: GraphQLString }
            },
            resolve: async function (parent, args, context) {
                const document = await documents.getOne(args.documentId);
                console.log(context.user._id);
                if (document.owner !== context.user._id) {
                    console.log("Will throw error");
                    throw new Error("Unauthorized: Only the owner can invite editors");
                }

                return users.sendInvite(context.user._id, args.email, args.documentId);
            }
        }
    })
});

export default RootMutationType;