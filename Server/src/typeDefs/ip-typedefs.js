import { gql } from 'apollo-server-express';

export const ipTypeDefs = gql`
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

    type IPDataResult{
        success: Boolean
        closestAirport: Airport
        closestTrackers: [Tracker]
    }

    extend type Mutation {
        findIPData: IPDataResult
    }
`;