export const casinoApi = {
    get: require('graphql-tag/loader!./casino-info.query.gql'),
    save: require('graphql-tag/loader!./save-casino-info.mutation.gql'),
}