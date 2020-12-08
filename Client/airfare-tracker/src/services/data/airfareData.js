import gql from 'graphql-tag';

export function AirfareDataService(options) {
    return {
        // actual module
        getAirfaresByTracker: (trackerId) => {
            return options.graphClient.query({
              query: gql`
              query ($trackerId: String){
                airfaresByTrackerId(trackerId: $trackerId){
                    id
                    startDate
                    endDate
                    minPrice
                    maxPrice
                    medianPrice
                    averagePrice
                    range
                    trackerId
                }
              }
              `,
              variables: {
                trackerId
              }
            })
              .then(result => result.data)
              .then(data => data ? data.airfaresByTrackerId : null)
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