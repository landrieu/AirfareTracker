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

    type IPRes{
        success: Boolean
        data: IP
    }

    type IPAirportResult{
        success: Boolean
        airport: Airport
    }

    type IPTrackersResult{
        success: Boolean
        trackers: [TrackerShort]
    }

    extend type Mutation {
        findIPData: IPDataResult
        findIP: IPRes
        findIPAirport: IPAirportResult
        findIPTrackers: IPTrackersResult
    }
`;