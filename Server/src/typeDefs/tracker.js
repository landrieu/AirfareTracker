import { gql } from 'apollo-server-express';

export const tracker = gql`

    scalar Date

    type Tracker {
        id: ID!
        from: Airport
        to: Airport
        startDates: [Date]
        endDates: [Date]
        isActive: Boolean,
        userId: String,
        isAlertEnabled: Boolean,
        triggerPrice: Int,
        alertEmail: String
        createdAt: Date!
    }

    type TrackerPayLoad {
        success: Boolean
        error: String
    }

    type Number {
        number: Int
    }

    extend type Query {
        trackers: [Tracker]
        trackersByUser(userId: String): [Tracker]
        trackersNumber(userId: String): Number
        trackersActiveNumber(userId: String): Number
    }

    extend type Mutation {
        createTracker(from: String!, to: String!, userId: String): Tracker
        deleteTracker(trackerId: String!, userId: String): TrackerPayLoad
        updateTrackerStatus(trackerId: String!, newStatus: Boolean!): TrackerPayLoad
    }
`;