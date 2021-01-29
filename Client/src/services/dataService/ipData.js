import gql from 'graphql-tag';

export function IPDataService(options) {
  return {
    getClosestAirport: () => {
      return options.graphClient.mutate({
        mutation: gql`
        mutation {
          findIPAirport{
            success
            airport{
              name, city, iataCode,distance
            }
          }
        }
            `
      })
        .then(result => result.data)
        .then(data => data.findIPAirport)
        .then(res => res.success ? res.airport : null)
    },

    getClosestTrackers: () => {
      return options.graphClient.mutate({
        mutation: gql`
        mutation {
          findIPTrackers{
            success
            trackers{
              id
              from{name, city, iataCode}
              to{name, city, iataCode}
            }
          }
        }
          `
      })
        .then(result => result.data)
        .then(data => data.findIPTrackers)
        .then(res => res.success ? res.trackers : null)
    },

    postIP: () => {
      return options.axiosClient.post('./ips/find')
        .then(result => {
          console.log(result);
        });
    },

    getLastIPs: () => {
      return options.graphClient.query({
        query: gql`
                  query{
                    getLastIPs{
                      success
                      data {
                        address
                        country
                        countryCode
                        region
                        regionName
                        city
                        zip
                        latitude
                        longitude
                        as
                        createdAt
                      }
                      message
                    }
                  }
                  `,
        fetchPolicy: 'no-cache'
      })
        .then(result => result.data)
        .then(data => data.getLastIPs)
    }
  }
}