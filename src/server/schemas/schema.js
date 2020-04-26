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
    data: String
    message: String
    success: Boolean!
}

type Query {
    users(pageSize: Int, after: String): UserConnection!
    usersCount: Int!
    user(name: String!, password: String!): User
    data(dataId: ID!): Data
    getUserData(userId: ID!): [Data]
}

type UserConnection {
    cursor: String!
    hasMore: Boolean!
    users: [User]!
}

type Mutation {
    register(name: String!, password: String!): Response
    login(name: String!, password: String!): Response
    addUserData(userId: ID!, number: Int, text: String): Response
    alterData(dataId: ID!, number: Int, text: String): Response
}
`;

export default typeDefs;