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
            resolve: async function (parent, args, context) {
                if (!context.user) {
                    console.log('Unauthorized 1');
                    throw new Error('Unauthorized');
                }
                const doc = await docs.getOne(args.id);
                if (
                    doc.owner !== context.user._id && 
                    !(Array.isArray(doc.editors) && doc.editors.includes(context.user.email))
                ) {
                    console.log('Unauthorized 2');
                    throw new Error('Unauthorized');
                }
                return docs.getOne(args.id);
            }
        },
        documents: {
            type: new GraphQLList(DocumentsType),
            description: 'All documents',
            resolve: async function (parent, args, context) {
                if (!context.user) {
                    throw new Error('Unauthorized');
                }
                const documents = await docs.getAll();
                const filtered = documents.filter(
                    doc => doc.owner === context.user._id ||
                    (Array.isArray(doc.editors) && doc.editors.includes(context.user.email))
                );
                return filtered;
            }
        },
        user: {
            type: UsersType,
            description: 'A single user',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                return users.getOneByUsername(args.email);
            }
        },
        users: {
            type: new GraphQLList(UsersType),
            description: 'All users',
            resolve: async function () {
                return users.getAll();
            }
        }
    })
});

export default RootQueryType;