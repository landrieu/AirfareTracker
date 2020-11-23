import { gql } from 'apollo-server-express';

import {
    graphql,
    GraphQLObjectType,
    GraphQLSchema,
  } from 'graphql';
import {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
  } from 'graphql-iso-date';

export const tracker = gql`

    scalar Date
    scalar GraphQLDate

    type Tracker {
        id: ID!
        from: Airport
        to: Airport
        startDates: [GraphQLDate]
        endDates: [GraphQLDate]
        isActive: Boolean,
        userId: String,
        isAlertEnabled: Boolean,
        triggerPrice: Int,
        alertEmail: String
        createdAt: GraphQLDate!
        occurrences:  [FrequentT]
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

    extend type Query {
        trackers: [Tracker]
        trackersByUser(userId: String): [Tracker]
        trackersNumber(userId: String): Number
        trackersActiveNumber(userId: String): Number
    }

    extend type Mutation {
        createTracker(from: String!, to: String!, userEmail: String, userId: String, startDates: [GraphQLDate], endDates: [GraphQLDate], type: String!): Tracker
        createFrequentTracker(from: String!, to: String!, occurences: [TripOccurrence]): Tracker
        deleteTracker(trackerId: String!, userId: String): TrackerPayLoad
        updateTrackerStatus(trackerId: String!, newStatus: Boolean!): TrackerPayLoad
    }
`;