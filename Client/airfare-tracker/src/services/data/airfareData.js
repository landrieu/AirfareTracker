import gql from 'graphql-tag';

export function AirfareDataService(options) {
    return {
        // actual module
        airfaresByTrackerId: (trackerId) => {
            return options.graphClient.query({
              query: gql`
              query ($trackerId: String){
                airfaresByTrackerId(trackerId: $trackerId){
                  term
                  data{
                    minPrice
                    maxPrice
                    nbResults
                    nbAirfares
                    createdAt
                  }
                }
              }
              `,
              variables: {
                trackerId
              }
            })
              .then(result => result.data)
              .then(data => ({trackerId, airfares: data.airfaresByTrackerId}));
        },

        getAirfareNumber: () => {
            return options.graphClient.query({
                query: gql`
              query{
                airfaresNumber{
                    n
                }
              }
              `,
            })
            .then(result => result.data)
            .then(data => data ? data.airfaresNumber : null)
        }
    }
}