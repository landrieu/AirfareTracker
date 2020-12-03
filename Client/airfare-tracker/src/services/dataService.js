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
  /*getJobsWithSearchTerm: (searchTerm) => {
    return graphClient.query({
      query: gql`
      query ($searchTerm: String){
        jobs(name: $searchTerm) {
          id,
          name,
          start,
          end,
          contact {
            id
            name
          }
        }
      }
      `,
      variables: {
        searchTerm: searchTerm
      }
    })
      .then(result => result.data)
      .then(data => data.jobs)
  },

  getAllActivitiesAllocations: () => {
    return graphClient.query({
      query: gql`
      query {
        activityAllocations{
          resource {
            id
            name
          },
          activity{
            name,
            start,
            end
          }
        }
      }
      `
    })
      .then(result => result.data)
      .then(data => data.activityAllocations.map(x => Object.assign({}, x, { type: 'activity' })))
  },

  getAllJobsAllocations: () => {
    return graphClient.query({
      query: gql`
      query {
        jobAllocations {
          resource {
            id
            name
          },
          job{
            id,
            name,
            start,
            end,
            contact {
              id
              name
            }
          }
        }
      }
      `
    })
      .then(result => result.data)
      .then(data => data.jobAllocations.map(x => Object.assign({}, x, { type: 'job' })))
  },*/

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