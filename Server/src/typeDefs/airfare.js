import { gql } from 'apollo-server-express';

export const airfare = gql`

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
        occurrence: [FrequentT]
    }

    extend type Query {
        airfares: [Airfare]
        airfaresByTrackerId(trackerId: String): [Airfare]
        airfaresNumber(trackerId: String): Number
    }
`;