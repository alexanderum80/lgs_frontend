export const citiesApi = {
    all: require('graphql-tag/loader!./all-cities.query.gql'),
    byId: require('graphql-tag/loader!./city-by-id.query.gql'),
    byCountry: require('graphql-tag/loader!./city-by-country.query.gql'),
    create: require('graphql-tag/loader!./create-city.mutation.gql'),
    update: require('graphql-tag/loader!./update-city.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-city.mutation.gql'),
}