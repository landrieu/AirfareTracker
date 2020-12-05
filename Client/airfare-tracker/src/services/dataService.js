import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import Axios from 'axios';

const graphClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

const axiosClient = Axios.create({
  baseURL: 'http://localhost:4000'
})

export const DataService = {
  //
  //  Call to the GraphQL API
  //
  getUserWithEmail: (email) => {
    return graphClient.query({
        query: gql`
        query ($email: String){
            userByEmail(email: $email) {
            id,
            email,
            trackers {
                id
            }
          }
        }
        `,
        variables: {
          email: email
        }
      })
        .then(result => result.data)
        .then(data => data.userByEmail)
  },

  getFrequentTrackers: () => {
    return graphClient.query({
      query: gql`
      query ($type: String){
        trackers(type: $type) {
          id
          sources
          to{
            iataCode
            city
          }
          from{
            iataCode
            city
          }  
        }
      }
      `,
      variables: {
        type: 'F'
      }
    })
      .then(result => result.data)
      .then(data => data.trackers)
  },
  getUserInfo: () => {
    return graphClient.mutate({
      mutation: gql`
      mutation {
        createIP{
          success
          closestAirport{
            name
            city
            iataCode
            distance
          }
          mostITrackers{
            from{
              city
            iataCode
            name
            }
            to{
              name 
              city
              iataCode
            }
          }
        }
      }
      `
    })
      .then(result => result.data)
      .then(data => data ? data.createIP : null)
  },

  //
  //  Call to the REST API
  //
  /*getJobs: () => {
     return axiosClient.get('/jobs')
       .then(result => result.data.map(x => Object.assign({}, x, { id: x.id + '', type: 'job' })))
  },*/

  postIP: () => {
    return axiosClient.post('./ips/find')
      .then(result => {
        console.log(result);
      });
  },

  
}