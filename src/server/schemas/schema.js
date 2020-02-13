import { gql } from 'apollo-server';

const typeDefs = gql`
type User {
    id: ID!
    name: String!
    password: String!
    dataIds: [ID]
}

type Data {
    id: ID!
    number: Int
    text: String
}

type Response {
    success: Boolean!
    message: String
}

type Query {
    users: [User]
    user(name: String!, password: String!): User
    data(dataId: ID!): Data
    userData(userId: ID!): [Data]
}

type Mutation {
    createUser(name: String!, password: String!): Response
    login(name: String!, password: String!): String
    addDataToUser(userId: ID!, number: Int, text: String): Response
    alterData(dataId: ID!, number: Int, text: String): Response
}
`;

export default typeDefs;