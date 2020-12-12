import gql from 'graphql-tag';

export function AirportDataService(options) {
    return {
        // actual module
        airportsBySearchTerm: (searchTerm) => {
            return options.graphClient.query({
              query: gql`
              query ($searchTerm: String){
                airportsBySearchTerm(searchTerm: $searchTerm){
                    success
                    airports{
                        id
                        city
                        name
                        iataCode
                        region
                        country
                        isSingleAirport
                    }
                }
              }
              `,
              variables: {
                searchTerm
              }
            })
              .then(result => result.data)
              .then(data => data.airportsBySearchTerm)
              .then(res => res.success ? res.airports : []);
        }
    }
}