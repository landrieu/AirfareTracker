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
        success: Boolean
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

    type AuthenticationError{
        success: Boolean
        message: String
        errors: [Error]
    }

    type UserInputError{
        success: Boolean
        message: String
        errors: [Error]
    }

    type Error{
        target: String
        message: String
    }

    union LoginResult = Authentication | AuthenticationError | UserInputError

    extend type Mutation {
        createUser(email: String!, password: String!): User!
        loginUser(email: String!, password: String!): LoginResult!
        updateLastConnection(userId: String!): OperationResult!
        deleteUser(userId: String!): OperationResult!
    }
`;