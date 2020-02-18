import { gql } from 'apollo-server';

const typeDefs = gql`
type User {
    _id: ID!
    name: String!
    password: String!
    dataIds: [ID]
}

type Data {
    _id: ID!
    number: Int
    text: String
}

type Response {
    success: Boolean!
    message: String
}

type Query {
    users(pageSize: Int, after: String): UserConnection!
    user(name: String!, password: String!): User
    data(dataId: ID!): Data
    userData(userId: ID!): [Data]
}

type UserConnection {
    cursor: String!
    hasMore: Boolean!
    users: [User]!
}

type Mutation {
    createUser(name: String!, password: String!): Response
    login(name: String!, password: String!): String
    addDataToUser(userId: ID!, number: Int, text: String): Response
    alterData(dataId: ID!, number: Int, text: String): Response
}
`;

export default typeDefs;