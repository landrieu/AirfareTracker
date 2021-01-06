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
    },
    trackerById: (trackerId) => {
      return options.graphClient.query({
        query: gql`
            query ($id: String){
              trackers(id: $id) {
                id
                startDates
                endDates
                createdAt
                isActive
                isAlertEnabled
                to{
                  iataCode
                  city
                }
                from{
                  iataCode
                  city
                }
                airfares{
                  startDate, 
                  endDate, 
                  airfares{
                    maxPrice, 
                    createdAt, 
                    minPrice,
                    averagePrice,
                    medianPrice
                  }
                }
              }
            }
            `,
        variables: {
          id: trackerId
        }
      })
        .then(result => result.data)
        .then(data => data.trackers[0])
    },

    getUserTrackers: (userId) => {
      console.log('GET USER TRACKERS')
      return options.graphClient.query({
        query: gql`
              query ($userId: String){
                trackersByUser(userId: $userId) {
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
          userId
        }
      })
        .then(result => result.data)
        .then(data => data.trackersByUser)
    },

    createTracker: async (formData) => {
      return options.graphClient.mutate({
        mutation: gql`
          mutation ($userEmail: String, $from: String!, $to: String!, $startDates: [GraphQLDate]!, $endDates: [GraphQLDate]!){
            createTracker(userEmail: $userEmail, from: $from, to: $to, startDates: $startDates, endDates: $endDates ){
              id      
            }
          }
          `,
        variables: { 
          userEmail: formData.email, 
          from: formData.from.iataCode,
          to: formData.to.iataCode,
          startDates: formData.departureDates.map(d => new Date(d)),
          endDates: formData.returnDates.map(d => new Date(d))
        },
      })
        .then(result => result.data)
        .then(data => data.createTracker)
    }
  }
}