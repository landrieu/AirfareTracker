import { gql } from 'apollo-server-express';

export const user = gql`
    type User {
        id: ID!
        email: String!
        lastConnectionAt: Date
        trackers: [Tracker]
    }

    extend type Query {
        users: [User!]!
        userByEmail(email: String): User
    }

    extend type Mutation {
        createUser(email: String!): User!
        updateLastConnection(userId: String!): Boolean
    }
`;