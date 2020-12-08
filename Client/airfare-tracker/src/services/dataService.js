import ApolloClient from 'apollo-boost';
import Axios from 'axios';

import { AirfareDataService } from './data/airfareData';
import { UserDataService } from './data/userData';
import { TrackerDataService } from './data/trackerData';
import { IPDataService } from './data/ipData';

const graphClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

const axiosClient = Axios.create({
  baseURL: 'http://localhost:4000'
})

export const DataService = {
  ...IPDataService({graphClient, axiosClient}),
  ...UserDataService({graphClient}),
  ...TrackerDataService({graphClient}),
  ...AirfareDataService({graphClient})
}