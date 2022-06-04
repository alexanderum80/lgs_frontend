export const tablesGameApi = {
  all: require('graphql-tag/loader!./all-tables-game.query.gql'),
  byId: require('graphql-tag/loader!./table-game-by-id.query.gql'),
  create: require('graphql-tag/loader!./create-table-game.mutation.gql'),
  update: require('graphql-tag/loader!./update-table-game.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-table-game.mutation.gql'),
};
