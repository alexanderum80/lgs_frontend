export const playersApi = {
    all: require('graphql-tag/loader!./all-players.query.gql'),
    byId: require('graphql-tag/loader!./player-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-player.mutation.gql'),
    update: require('graphql-tag/loader!./update-player.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-player.mutation.gql'),
}