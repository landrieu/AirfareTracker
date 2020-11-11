import { gql } from 'apollo-server-express';

export const tracker = gql`

    scalar Date

    type Tracker {
        id: ID!
        from: String
        to: String
        startDates: [Date]
        endDates: [Date]
        isActive: Boolean,
        userId: String,
        isAlertEnabled: Boolean,
        triggerPrice: Int,
        alertEmail: String
    }

    type TrackerPayLoad {
        success: Boolean
        error: String
    }

    extend type Query {
        trackers: [Tracker]
        trackersByUser(userId: String): [Tracker]
    }

    extend type Mutation {
        createTracker(from: String!, to: String!, userId: String): Tracker
        deleteTracker(trackerId: String!, userId: String): TrackerPayLoad
        updateTrackerStatus(trackerId: String!, newStatus: Boolean!): Tracker
    }
`;