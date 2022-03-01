export const lendersApi = {
    all: require('graphql-tag/loader!./all-lenders.query.gql'),
    byId: require('graphql-tag/loader!./lender-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-lender.mutation.gql'),
    update: require('graphql-tag/loader!./update-lender.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-lender.mutation.gql'),
}