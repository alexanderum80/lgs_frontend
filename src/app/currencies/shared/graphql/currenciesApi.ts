export const currenciesApi = {
  all: require('graphql-tag/loader!./all-currencies.query.gql'),
  byId: require('graphql-tag/loader!./currency-by-id.query.gql'),
  create: require('graphql-tag/loader!./create-currency.mutation.gql'),
  update: require('graphql-tag/loader!./update-currency.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-currency.mutation.gql'),
};
