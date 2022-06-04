export const casinoApi = {
  get: require('graphql-tag/loader!./casino-info.query.gql'),
  state: require('graphql-tag/loader!./casino-state.query.gql'),
  save: require('graphql-tag/loader!./save-casino-info.mutation.gql'),
};
