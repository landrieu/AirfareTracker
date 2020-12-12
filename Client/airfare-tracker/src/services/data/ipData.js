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

        postIP: () => {
            return options.axiosClient.post('./ips/find')
              .then(result => {
                console.log(result);
              });
        }
    }
}