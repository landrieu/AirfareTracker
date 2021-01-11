import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost';

import Axios from 'axios';

import { AirportDataService } from './dataService/airportData';
import { AirfareDataService } from './dataService/airfareData';
import { UserDataService } from './dataService/userData';
import { TrackerDataService } from './dataService/trackerData';
import { IPDataService } from './dataService/ipData';
import { authService } from './authService';

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = authService.loadToken()

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? token : ''
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const graphClient = new ApolloClient({
  link: authLink.concat(httpLink), // Chain it with the HttpLink
  cache: new InMemoryCache()
});

const axiosClient = Axios.create({
  baseURL: 'http://localhost:4000'
});

export const DataService = {
  ...IPDataService({graphClient, axiosClient}),
  ...UserDataService({graphClient}),
  ...TrackerDataService({graphClient}),
  ...AirfareDataService({graphClient}),
  ...AirportDataService({graphClient})
}