import gql from 'graphql-tag';

export function TrackerDataService(options) {
    return {
        getFrequentTrackers: () => {
            return options.graphClient.query({
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
        }
    }
}