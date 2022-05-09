export const coinsApi = {
    all: require('graphql-tag/loader!./all-coins.query.gql'),
    byId: require('graphql-tag/loader!./coin-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-coin.mutation.gql'),
    update: require('graphql-tag/loader!./update-coin.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-coin.mutation.gql'),
}