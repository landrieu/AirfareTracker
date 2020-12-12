import gql from 'graphql-tag';

export function AirfareDataService(options) {
    return {
        // actual module
        airfaresByTrackerId: (trackerId) => {
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
                    occurrence{length, interval}
                    trackerId
                    createdAt
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