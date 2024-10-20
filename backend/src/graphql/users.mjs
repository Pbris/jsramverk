import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';


const UsersType = new GraphQLObjectType({
    name: 'Users',
    description: 'This represents a user',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        hashedPassword: { type: new GraphQLNonNull(GraphQLString) },
    })
})

export default UsersType;