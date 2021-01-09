import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
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

    type TrackerCreationCheckResult {
        success: Boolean
        error: String
        canCreateNewTracker: Boolean
        nbTrackersCreated: Int
    }
    
    extend type Query {
        users: [User!]!
        userByEmail(email: String): User
        validAuthentication: Boolean
        numberTrackersCreatable: TrackerCreationCheckResult
    }

    type AuthenticationError{
        success: Boolean
        message: String
        errors: [Error]
    }

    type UserInputError{
        success: Boolean
        type: String
        message: String
        errors: [Error]
    }

    type Error{
        target: String
        message: String
    }

    type RegisterCreation{
        success: Boolean,
        user: User
    }

    union LoginResult = Authentication | AuthenticationError | UserInputError
    union RegisterResult = RegisterCreation | UserInputError

    extend type Mutation {
        createUser(email: String!, password: String!): RegisterResult!
        loginUser(email: String!, password: String!): LoginResult!
        updateLastConnection(userId: String!): OperationResult!
        deleteUser(userId: String!): OperationResult!
    }
`;