import gql from 'graphql-tag';
import { useState } from 'react';

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

        loginUser: ({email, password}) => {
          return options.graphClient.mutate({
            mutation: gql`
            mutation ($email: String!, $password: String!){
                loginUser(email: $email, password: $password){
                    __typename
                    ... on Authentication{
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
                    ... on AuthenticationError{
                        message
                        success
                        errors{target,message}
                    }
                }
            }
            `,
            variables: { email,password },
            options: {
                context: {
                    headers:{

                    }
                }
            }
          })
            .then(result => result.data)
            .then(data => data ? data.loginUser : null)
            .then(userData => {
                if(userData.success){
                    authService.storeUserData(userData);
                }
                
                return userData;
            })
        },

        canCreateNewTracker: () => {
            console.log(authService.loadToken());
            return options.graphClient.query({
              query: gql`
              query{
                numberTrackersCreatable{
                  success
                  error
                  nbTrackersCreated
                  canCreateNewTracker
                }
              }
              `,
              options: {
                  context: {
                      headers:{
                        "Authorization": authService.loadToken()
                      }
                  }
              }
            })
              .then(result => result.data)
              .then(data => data ? data.numberTrackersCreatable : null)
          }
    }
}

function setHeaders(h){
    let headers = {};
    for(let k in h){
        headers[k] = h[k];
    }
    return {
        context: { headers }
    }
}