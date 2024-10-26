import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean
} from 'graphql';


const DocumentsType = new GraphQLObjectType({
    name: 'Documents',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        isCode: { type: GraphQLBoolean },
        owner: { type: new GraphQLNonNull(GraphQLString) },
        editors: { type: GraphQLString }
    })
})

export default DocumentsType;