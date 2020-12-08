import gql from 'graphql-tag';

export function IPDataService(options) {
    return {
        getUserInfo: () => {
            return options.graphClient.mutate({
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

        postIP: () => {
            return options.axiosClient.post('./ips/find')
              .then(result => {
                console.log(result);
              });
        }
    }
}