import gql from 'graphql-tag';

export function IPDataService(options) {
  return {
    getUserInfo: () => {
      return options.graphClient.mutate({
        mutation: gql`
              mutation {
                findIPData{
                  success
                  closestAirport{
                    name
                    city
                    iataCode
                    distance
                  }
                  closestTrackers{
                    id
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
        .then(data => data ? data.findIPData : null)
    },

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
    }
  }
}