import {
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import UsersType from "../users.mjs";
import users from "../../../users.mjs";

const LoginResponseType = new GraphQLObjectType({
    name: 'LoginResponse',
    description: 'Response for user login',
    fields: {
        token: { type: GraphQLString }, // Return the token here
        _id: { type: GraphQLString },   // Optional: Return user _id
        email: { type: GraphQLString }  // Optional: Return user email
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
                password: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                return users.addUser(args);
            }
        },
        verifyUser: {
            type: LoginResponseType,
            description: 'Verify a user',
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                console.log(args);
                return await users.verifyUser(args.email, args.password);
            }
        }
    })
});

export default RootMutationType;