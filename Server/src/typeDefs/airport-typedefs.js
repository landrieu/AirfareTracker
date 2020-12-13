import { gql } from 'apollo-server-express';

export const airportTypeDefs = gql`
    type Airport {
        id: ID!
        identification: String
        name: String
        iataCode: String
        type: String
        city: String
        region: String
        country: String
        continent: String
        latitude: Float
        longitude: Float
        localCode: String
        gpsCode: String
        elevation: Int
        isSingleAirport: Boolean
        coordinates: [String]
    }

    type AirportResult {
        success: Boolean
        errors: [String]
        airports: [Airport]
    }

    extend type Query {
        airportsBySearchTerm(searchTerm: String): AirportResult
    }

`;