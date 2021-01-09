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


    type ErrorResult{
        success: Boolean
        type: String
        message: String
        errors: [Error]
    }

    type Error{
        target: String
        message: String
    }

    type RegisterSuccess{
        success: Boolean,
        user: User
    }

    type LoginSuccess {
        success: Boolean
        id: ID!
        token: String!
        user: User!
    }

    union LoginResult = LoginSuccess | ErrorResult
    union RegisterResult = RegisterSuccess | ErrorResult

    extend type Mutation {
        createUser(email: String!, password: String!): RegisterResult!
        loginUser(email: String!, password: String!): LoginResult!
        updateLastConnection(userId: String!): OperationResult!
        deleteUser(userId: String!): OperationResult!
    }
`;