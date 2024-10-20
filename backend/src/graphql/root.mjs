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
            resolve: async function(parent, args) {
                return docs.getOne(args.id);
            }
        },
        documents: {
            type: new GraphQLList(DocumentsType),
            description: 'All documents',
            resolve: async function() {
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