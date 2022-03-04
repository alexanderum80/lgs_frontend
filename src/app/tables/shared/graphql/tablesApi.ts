export const tablesApi = {
    all: require('graphql-tag/loader!./all-tables.query.gql'),
    byId: require('graphql-tag/loader!./table-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-table.mutation.gql'),
    update: require('graphql-tag/loader!./update-table.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-table.mutation.gql'),
}