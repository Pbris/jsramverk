import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
} from 'graphql';

import DocumentsType from "./documents.mjs";
import docs from "../../docs.mjs";

import UsersType from "./users.mjs";
import users from "../../users.mjs";

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        document: {
            type: DocumentsType,
            description: 'A single document',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async function(parent, args, context) {
                const doc = await docs.getOne(args.id);

                // if (context.user && doc.owner === context.user.email) {
                //     return docs.getOne(args.id);
                // }


                // return { error: "Invalid credentials" };

                return docs.getOne(args.id);
            }
        },
        documents: {
            type: new GraphQLList(DocumentsType),
            description: 'All documents',
            resolve: async function(parent, args, context) {
                console.log("Happy happy? Yes?");
                const user = context.user; // Retrieved from the JWT
                console.log("Happy happy?: \n" + JSON.stringify(user, null, 2));
                console.log(user.email);
                return docs.getAll();
            }
        },
        user: {
            type: UsersType,
            description: 'A single user',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                return users.getOneByUsername(args.email);
            }
        },
        users: {
            type: new GraphQLList(UsersType),
            description: 'All users',
            resolve: async function() {
                return users.getAll();
            }
        }
    })
});

export default RootQueryType;