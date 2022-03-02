export const tablesTypeApi = {
    all: require('graphql-tag/loader!./all-tables-type.query.gql'),
    byId: require('graphql-tag/loader!./table-type-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-table-type.mutation.gql'),
    update: require('graphql-tag/loader!./update-table-type.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-table-type.mutation.gql'),
}