import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost';

import Axios from 'axios';

import { AirportDataService } from './airportData';
import { AirfareDataService } from './airfareData';
import { UserDataService } from './userData';
import { TrackerDataService } from './trackerData';
import { IPDataService } from './ipData';
import { authService } from '../authService';

import { API_PATH } from '../settings';

const httpLink = new HttpLink({ uri: `${API_PATH}graphql` });

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
  baseURL: API_PATH
});

export const DataService = {
  ...IPDataService({graphClient, axiosClient}),
  ...UserDataService({graphClient}),
  ...TrackerDataService({graphClient}),
  ...AirfareDataService({graphClient}),
  ...AirportDataService({graphClient})
}