import gql from 'graphql-tag';

export function AirfareDataService(options) {
    return {
        airfaresByTrackerId: (trackerId) => {
            return options.graphClient.query({
                query: gql`
              query ($trackerId: String){
                airfaresByTrackerId(trackerId: $trackerId){
                  stats{text, value}
                  airfaresPerTerm{
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
              }
              `,
                variables: {
                    trackerId
                }
            })
                .then(result => result.data)
                .then(data => (
                    {
                        trackerId,
                        tracker: { airfares: data.airfaresByTrackerId.airfaresPerTerm, stats: data.airfaresByTrackerId.stats }
                    }
                ));
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
              fetchPolicy: 'no-cache'
            })
                .then(result => result.data)
                .then(data => data ? data.airfaresNumber : null)
        }
    }
}