import { gql } from 'apollo-server-express';

export const rootTypeDefs = gql`
  type Query {
      root: String
  }

  type Mutation {
      root: String
  }
`;