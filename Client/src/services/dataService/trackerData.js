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
        },
        fetchPolicy: 'no-cache'
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
                isAlertActive
                triggerPrice
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
        },
        fetchPolicy: 'no-cache'
      })
        .then(result => result.data)
        .then(data => data.trackers[0])
    },

    getUserTrackers: (userId) => {
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
        },
        fetchPolicy: 'no-cache'
      })
        .then(result => result.data)
        .then(data => data.trackersByUser)
    },

    updateTrackerStatus: async (trackerId, newStatus) => {
      return options.graphClient.mutate({
        mutation: gql`
                mutation($trackerId: String!, $newStatus: Boolean!){
                    updateTrackerStatus(trackerId: $trackerId, newStatus: $newStatus){
                      success
                      error
                    }
                }
                `,
        variables: { trackerId, newStatus },
        fetchPolicy: 'no-cache'
      })
        .then(result => result.data)
        .then(data => data.updateTrackerStatus)
    },

    updateTrackerAlertStatus: async (trackerId, newStatus) => {
      return options.graphClient.mutate({
        mutation: gql`
                mutation($trackerId: String!, $newStatus: Boolean!){
                    updateTrackerAlertStatus(trackerId: $trackerId, newStatus: $newStatus){
                      success
                      error
                    }
                }
                `,
        variables: { trackerId, newStatus },
        fetchPolicy: 'no-cache'
      })
        .then(result => result.data)
        .then(data => data.updateTrackerAlertStatus)
    },

    updateTracker: async (trackerId, trackerStatus, trackerAlertStatus, trackerTriggerPrice) => {
      return options.graphClient.mutate({
        mutation: gql`
                mutation($trackerId: String!, $trackerStatus: Boolean, $trackerAlertStatus: Boolean, $trackerTriggerPrice: Int){
                    updateTracker(trackerId: $trackerId, trackerStatus: $trackerStatus, trackerAlertStatus: $trackerAlertStatus, trackerTriggerPrice: $trackerTriggerPrice){
                      success
                      error
                    }
                }
                `,
        variables: { trackerId, trackerStatus, trackerAlertStatus, trackerTriggerPrice },
        fetchPolicy: 'no-cache'
      })
        .then(result => result.data)
        .then(data => data.updateTracker)
    },


    createTracker: async (formData) => {
      return options.graphClient.mutate({
        mutation: gql`
          mutation ($userEmail: String, $from: String!, $to: String!, $startDates: [GraphQLDate]!, $endDates: [GraphQLDate]!, $triggerPrice: Int){
            createTracker(userEmail: $userEmail, from: $from, to: $to, startDates: $startDates, endDates: $endDates, triggerPrice: $triggerPrice ){
              __typename
                      ... on TrackerCreationSuccess{
                          success
                          tracker{
                              id
                          }       
                      }
                      ... on ErrorResult{
                          type
                          message
                          success
                          errors{target,message}
                      }
            }
          }
          `,
        variables: {
          userEmail: formData.email,
          from: formData.from.iataCode,
          to: formData.to.iataCode,
          startDates: formData.departureDates.map(d => new Date(d)),
          endDates: formData.returnDates.map(d => new Date(d)),
          triggerPrice: formData.triggerPrice
        },
        fetchPolicy: 'no-cache'
      })
        .then(result => result.data)
        .then(data => data.createTracker)
    }
  }
}