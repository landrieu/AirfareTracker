import { gql } from 'apollo-server-express';

export const trackerTypeDefs = gql`
    scalar Date
    scalar GraphQLDate

    type Tracker {
        id: ID!
        from: Airport
        to: Airport
        startDates: [GraphQLDate]
        endDates: [GraphQLDate]
        isActive: Boolean,
        type: String,
        userEmail: String,
        userId: String,
        isAlertActive: Boolean,
        triggerPrice: Int,
        sources: [String]
        alertEmail: String
        createdAt: GraphQLDate!
        occurrences:  [FrequentT]
        airfares: [AirfarePerDate]
    }

    type TrackerShort{
        id: ID!
        from: Airport
        to: Airport
    }

    type TrackerPayLoad {
        success: Boolean
        error: String
    }

    type Number {
        n: Int
    }

    type FrequentT {
        length: String
        interval: String
    }

    input TripOccurrence {
        length: String
        interval: String
    }

    type TrackerCreationSuccess{
        success: Boolean
        tracker: Tracker
    }

    union TrackerCreationResult = TrackerCreationSuccess | ErrorResult

    extend type Query {
        trackers(type: String, id: String): [Tracker]
        trackersByUser(userId: String): [Tracker]
        trackersNumber(userId: String): Number
        trackersActiveNumber(userId: String): Number
        trackersRandom: [Tracker]
    }

    extend type Mutation {
        createTracker(from: String!, to: String!, userEmail: String, userId: String, startDates: [GraphQLDate], endDates: [GraphQLDate], triggerPrice: Int): TrackerCreationResult
        createFrequentTracker(from: String!, to: String!, occurences: [TripOccurrence], sources: [String]): Tracker
        deleteTracker(trackerId: String!, userId: String): TrackerPayLoad
        updateTracker(trackerId: String!, trackerStatus: Boolean, trackerAlertStatus: Boolean, trackerTriggerPrice: Int): OperationResult!
    }
`;