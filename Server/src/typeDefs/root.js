import { gql } from 'apollo-server-express';

export const root = gql`
  type Query {
      root: String
  }

  type Mutation {
      root: String
  }
`;