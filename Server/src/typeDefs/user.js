import { gql } from 'apollo-server-express';

export const user = gql`
    type User {
        id: ID!
        email: String!
        role: String
        lastConnectionAt: Date
        trackers: [Tracker]
        createdAt: Date
    }

    enum Role {
        ADMIN
        USER
    }

    type Authentication {
        id: ID!
        token: String!
        user: User!
    }
    
    type OperationResult {
        success: Boolean!
        error: String
    }
    
    extend type Query {
        users: [User!]!
        userByEmail(email: String): User
    }

    extend type Mutation {
        createUser(email: String!, password: String!): User!
        loginUser(email: String!, password: String!): Authentication!
        updateLastConnection(userId: String!): OperationResult!
        deleteUser(userId: String!): OperationResult!
    }
`;