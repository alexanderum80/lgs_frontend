export const operationApi = {
  today: require('graphql-tag/loader!./today-operation.query.gql'),
  byId: require('graphql-tag/loader!./operation-by-id.query.gql'),
  detail: require('graphql-tag/loader!./operation-details-by-id.query.gql'),
  create: require('graphql-tag/loader!./create-operation.mutation.gql'),
  update: require('graphql-tag/loader!./update-operation.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-operation.mutation.gql'),
  finish: require('graphql-tag/loader!./finish-operation.mutation.gql'),
  cancel: require('graphql-tag/loader!./cancel-operation.mutation.gql'),
  finishInit: require('graphql-tag/loader!./finish-initialization.mutation.gql'),
  finishClose: require('graphql-tag/loader!./finish-closing.mutation.gql'),
};
