export const countriesApi = {
    all: require('graphql-tag/loader!./all-countries.query.gql'),
    byId: require('graphql-tag/loader!./country-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-country.mutation.gql'),
    update: require('graphql-tag/loader!./update-country.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-country.mutation.gql'),
}