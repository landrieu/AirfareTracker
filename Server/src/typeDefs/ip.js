import { gql } from 'apollo-server-express';

export const ip = gql`

    type IP{
        address: String
        country: String
        countryCode: String
        region: String
        regionName: String
        city: String
        zip: String
        latitude: String
        longitude: String
        as: String
    }

    extend type Airport {
        distance: Float
    }  

    type IPResult{
        success: Boolean
        closestAirport: Airport
        mostITrackers: [Tracker]
    }

    extend type Mutation {
        createIP: IPResult
    }
`;