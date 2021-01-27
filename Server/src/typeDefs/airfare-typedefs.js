import { gql } from 'apollo-server-express';

export const airfareTypeDefs = gql`
    type Airfare {
        id: ID!
        from: Airport,
        to: Airport,
        startDate: GraphQLDate,
        endDate: GraphQLDate,
        minPrice: Float,
        maxPrice: Float,
        medianPrice: Float,
        averagePrice: Float,
        range: Float,
        nbResults: Int,
        source: String,
        trackerId: ID,
        occurrence: FrequentT,
        createdAt: GraphQLDate
    }

    type AirfarePerDate{
        startDate: GraphQLDate,
        endDate: GraphQLDate,
        airfares: [Airfare]
    }

    type AirfareFormatted{
        from: Airport,
        to: Airport,
        minPrice: Float,
        maxPrice: Float,
        medianPrice: Float,
        averagePrice: Float,
        nbResults: Int,
        nbAirfares: Int,
        trackerId: ID,
        createdAt: GraphQLDate
    }

    type AirfareStat{
        text: String
        value: String
    }

    type AirfaresPerTerm{
        term: String,
        data: [AirfareFormatted]
    }

    type AirfaresResult{
        airfaresPerTerm: [AirfaresPerTerm]
        stats: [AirfareStat]
    }

    extend type Query {
        airfares: [Airfare]
        airfaresByTrackerId(trackerId: String, computeStats: String): AirfaresResult
        airfaresNumber(trackerId: String): Number
    }

    extend type Mutation {
        deleteAirfares(trackerId: String): Boolean
    }
`;