import { gql } from 'apollo-server';

const typeDefs = gql`
type User {
    _id: ID!
    name: String!
    password: String!
    dataIds: [ID]
}

type UserData {
    _id: ID!
    ownerUserId: String!
    dataField: UserDataField
}

type UserDataField {
    number: Int
    text: String
}

type Message {
    text: String
    success: Boolean!
}

type LoginResponse {
    message: Message
    auth: String
}

type Query {
    users(after: String): UserConnection!
    usersCount: Int!
    user(name: String!, password: String!): User
    data(dataId: ID!): UserData
    getUserData: [UserDataField]
}

type UserConnection {
    cursor: String!
    hasMore: Boolean!
    users: [User]!
}

type Mutation {
    register(name: String!, password: String!): Message
    login(name: String!, password: String!): LoginResponse
    addUserData(number: Int, text: String): Message
    alterData(dataId: ID!, number: Int, text: String): Message
}
`;

export default typeDefs;