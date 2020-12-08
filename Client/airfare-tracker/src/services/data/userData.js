import gql from 'graphql-tag';

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
        }
    }
}