import gql from 'graphql-tag';

import { authService } from '../authService';

export function UserDataService(options) {
    return {

        getUserWithEmail: (email) => {
            return options.graphClient.query({
                query: gql`
                query ($email: String){
                    userByEmail(email: $email) {
                    id,
                    email,
                    trackers {
                        id
                    }
                  }
                }
                `,
                variables: {
                    email: email
                }
            })
                .then(result => result.data)
                .then(data => data.userByEmail)
        },

        loginUser: ({ email, password }) => {
            return options.graphClient.mutate({
                mutation: gql`
            mutation ($email: String!, $password: String!){
                loginUser(email: $email, password: $password){
                    __typename
                    ... on LoginSuccess{
                        success
                        token
                        id
                        user{
                            lastConnectionAt
                            createdAt
                            email
                            trackers{
                            id
                            isActive
                            createdAt
                            }
                        }
                    }
                    ... on ErrorResult{
                        message
                        success
                        errors{target,message}
                    }
                }
            }
            `,
                variables: { email, password },
                fetchPolicy: 'no-cache'
            })
                .then(result => result.data)
                .then(data => data ? data.loginUser : null)
                .then(userData => {
                    if (userData.success) {
                        authService.storeUserData(userData);
                    }

                    return userData;
                })
        },

        logoutUser: () => {
            return options.graphClient.resetStore();
        },

        registerUser: ({ email, password }) => {
            return options.graphClient.mutate({
                mutation: gql`
              mutation ($email: String!, $password: String!){
                createUser(email: $email, password: $password){
                      __typename
                      ... on RegisterSuccess{
                          success
                          user{
                              createdAt
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
                variables: { email, password },
                fetchPolicy: 'no-cache'
            })
                .then(result => result.data)
                .then(data => data ? data.createUser : null)
        },

        updateLastConnection: () => {
            return options.graphClient.mutate({
                mutation: gql`
              mutation{
                updateLastConnection{
                    success
                    error
                }
              }
              `,
                fetchPolicy: 'no-cache'
            })
                .then(result => result.data)
                .then(data => data ? data.updateLastConnection : null)
        },

        activateAccount: (userId) => {
            return options.graphClient.mutate({
                mutation: gql`
              mutation($userId: String!){
                activeAccount(userId: $userId){
                    success
                    error
                }
              }
              `,
                variables: { userId },
                fetchPolicy: 'no-cache'
            })
                .then(result => result.data)
                .then(data => data ? data.activeAccount : null)
        },

        canCreateNewTracker: (email) => {
            return options.graphClient.query({
                query: gql`
              query($email: String){
                numberTrackersCreatable(email: $email){
                  success
                  error
                  nbTrackersCreated
                  canCreateNewTracker
                }
              }
              `,
                variables: { email },
                fetchPolicy: 'no-cache'
            })
                .then(result => result.data)
                .then(data => data ? data.numberTrackersCreatable : null)
        },

        getGlobalStats: () => {
            return options.graphClient.query({
              query: gql`
                        query{
                            getGlobalStats{
                            success
                            data {
                                nbVisitors, nbUsers, nbTrackers, nbTrackersN, nbTrackersF
                            }
                            message
                          }
                        }
                        `,
              fetchPolicy: 'no-cache'
            })
              .then(result => result.data)
              .then(data => data.getGlobalStats)
          }
    }
}


/*function setHeaders(h){
    let headers = {};
    for(let k in h){
        headers[k] = h[k];
    }
    return {
        context: { headers }
    }
}*/