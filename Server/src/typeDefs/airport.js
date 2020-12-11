import { gql } from 'apollo-server-express';

export const airport = gql`

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
`;