import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
} from 'graphql';

import DocumentsType from "./documents.mjs";
import docs from "../../docs.mjs";

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
        }
    })
});

export default RootQueryType;