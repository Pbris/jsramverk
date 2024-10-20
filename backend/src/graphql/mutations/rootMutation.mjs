import {
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import UsersType from "../users.mjs";
import users from "../../../users.mjs";

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
            type: UsersType,
            description: 'Verify a user',
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                console.log(args);
                return users.verifyUser(args.email, args.password);
            }
        }
    })
});

export default RootMutationType;