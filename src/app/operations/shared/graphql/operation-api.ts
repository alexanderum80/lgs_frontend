export const operationApi = {
    today: require('graphql-tag/loader!./today-operation.query.gql'),
    byId: require('graphql-tag/loader!./operation-by-id.query.gql'),
    detail: require('graphql-tag/loader!./operation-details-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-operation.mutation.gql'),
    update: require('graphql-tag/loader!./update-operation.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-operation.mutation.gql'),
    finishInit: require('graphql-tag/loader!./finish-initialization.mutation.gql'),
}